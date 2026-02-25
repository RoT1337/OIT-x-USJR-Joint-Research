from __future__ import annotations

from django.conf import settings
from django.http import HttpResponsePermanentRedirect


class Redirect127ToLocalhostMiddleware:
    """Dev-only guardrail: avoid mixing 127.0.0.1 and localhost.

    Microsoft OAuth redirect URIs must match exactly. If Azure is configured for
    `http://localhost:8000/...` but the browser hits Django via
    `http://127.0.0.1:8000/...`, the OAuth flow will fail with AADSTS50011.

    When DEBUG=True, redirect all requests from 127.0.0.1:* to localhost:*.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.DEBUG:
            host = request.get_host()
            if host.startswith("127.0.0.1"):
                return HttpResponsePermanentRedirect(
                    request.build_absolute_uri().replace("//127.0.0.1", "//localhost", 1)
                )

        return self.get_response(request)
