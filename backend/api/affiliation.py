from __future__ import annotations

import os

from django.contrib.auth.models import AbstractBaseUser

from .models import ResearchLog


def _parse_affiliation_map() -> dict[str, str]:
    """Parse OAUTH_AFFILIATION_MAP env var.

    Format: comma-separated `key:value` pairs.
      - key can be a domain (e.g. usjr.edu) or a full email (e.g. a@usjr.edu)
      - value must be one of: USJR, OIT

    Example:
      OAUTH_AFFILIATION_MAP="usjr.edu:USJR,oit.ac.jp:OIT"
    """

    raw = os.environ.get("OAUTH_AFFILIATION_MAP", "").strip()
    if not raw:
        return {}

    mapping: dict[str, str] = {}
    for part in raw.split(","):
        part = part.strip()
        if not part or ":" not in part:
            continue
        key, value = part.split(":", 1)
        key = key.strip().lower()
        value = value.strip().upper()
        if not key:
            continue
        if value not in {ResearchLog.Affiliation.USJR, ResearchLog.Affiliation.OIT}:
            continue
        mapping[key] = value
    return mapping


def is_affiliation_mapping_configured() -> bool:
    return bool(os.environ.get("OAUTH_AFFILIATION_MAP", "").strip())


def infer_affiliation_from_email(email: str) -> str | None:
    email = (email or "").strip().lower()
    if not email or "@" not in email:
        return None

    mapping = _parse_affiliation_map()
    if not mapping:
        return None

    if email in mapping:
        return mapping[email]

    domain = email.split("@", 1)[-1]
    return mapping.get(domain)


def infer_affiliation_from_user(user: AbstractBaseUser) -> str | None:
    email = getattr(user, "email", "") or ""
    return infer_affiliation_from_email(email)


def user_can_edit_log(user: AbstractBaseUser, log: ResearchLog) -> bool:
    if not getattr(user, "is_authenticated", False):
        return False
    if bool(getattr(user, "is_staff", False)):
        return True

    # If an affiliation map is configured, enforce cross-user edits within the same affiliation.
    if is_affiliation_mapping_configured():
        aff = infer_affiliation_from_user(user)
        return bool(aff) and getattr(log, "affiliation", None) == aff

    # Otherwise, fall back to owner-only edits (keeps dev usable without extra env config).
    return getattr(log, "created_by_id", None) == getattr(user, "id", None)
