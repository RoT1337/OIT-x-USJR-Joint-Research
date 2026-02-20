from __future__ import annotations

import os

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.socialaccount.models import SocialApp
from allauth.exceptions import ImmediateHttpResponse
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.core.exceptions import ImproperlyConfigured
from django.http import HttpResponse
from django.conf import settings


def _parse_csv_env(name: str) -> set[str]:
    raw = os.environ.get(name, "")
    if not raw.strip():
        return set()
    return {item.strip().lower() for item in raw.split(",") if item.strip()}


class AllowlistSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Restrict OAuth sign-in to an email allowlist (and/or allowed domains).

    Env vars:
      - OAUTH_ALLOWED_EMAILS: comma-separated full emails (case-insensitive)
      - OAUTH_ALLOWED_DOMAINS: comma-separated domains (e.g. "usjr.edu, oit.ac.jp")

    If neither is set:
      - DEBUG=True: allow all (developer convenience)
      - DEBUG=False: deny all (safer default)
    """

    def pre_social_login(self, request, sociallogin):
        email = (getattr(sociallogin.user, "email", "") or "").strip().lower()
        if not email:
            raise ImmediateHttpResponse(HttpResponse("Email not provided by OAuth provider.", status=403))

        allowed_emails = _parse_csv_env("OAUTH_ALLOWED_EMAILS")
        allowed_domains = _parse_csv_env("OAUTH_ALLOWED_DOMAINS")

        if not allowed_emails and not allowed_domains:
            if settings.DEBUG:
                return
            raise ImmediateHttpResponse(
                HttpResponse(
                    "OAuth allowlist is not configured (set OAUTH_ALLOWED_EMAILS or OAUTH_ALLOWED_DOMAINS).",
                    status=403,
                )
            )

        domain = email.split("@")[-1] if "@" in email else ""
        if email in allowed_emails or (domain and domain in allowed_domains):
            # Allowlisted: continue. We may also auto-connect below.
            pass
        else:
            raise ImmediateHttpResponse(HttpResponse("This account is not allowlisted.", status=403))

        # If a user already exists with the same *verified* email, automatically connect
        # the Google social account to that user. This avoids allauth's
        # /accounts/3rdparty/signup/ interstitial that appears on email collisions.
        #
        # Safety: only auto-connect when the provider marks the email as verified.
        if getattr(sociallogin, "is_existing", False):
            return

        if getattr(request, "user", None) is not None and request.user.is_authenticated:
            return

        verified_email = None
        for e in (getattr(sociallogin, "email_addresses", None) or []):
            candidate = (getattr(e, "email", "") or "").strip().lower()
            if candidate and getattr(e, "verified", False):
                verified_email = candidate
                break

        if not verified_email:
            return

        User = get_user_model()
        try:
            existing_user = User.objects.get(email__iexact=verified_email)
        except User.DoesNotExist:
            return

        sociallogin.connect(request, existing_user)

    def get_app(self, request, provider, client_id=None):
        """Improve diagnostics when SocialApp isn't linked to the current Site.

        Allauth raises SocialApp.DoesNotExist, which otherwise becomes a generic 500.
        """

        try:
            return super().get_app(request, provider, client_id=client_id)
        except SocialApp.DoesNotExist as exc:
            site = None
            try:
                site = get_current_site(request)
            except Exception:
                site = None

            site_hint = (
                f"current site id={getattr(site, 'id', None)} domain={getattr(site, 'domain', None)!r}"
                if site is not None
                else "current site unknown"
            )
            raise ImproperlyConfigured(
                "No SocialApp is configured for this provider + site. "
                f"Provider={provider!r}, {site_hint}. "
                "Fix: in Django admin → Social applications, attach the SocialApp to the same Site as SITE_ID, "
                "or set the SITE_ID env var to match the Site you attached."
            ) from exc
