"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()


def _ensure_media_root() -> None:
	from django.conf import settings

	if settings.DEBUG:
		return

	media_root = Path(settings.MEDIA_ROOT)
	try:
		media_root.mkdir(parents=True, exist_ok=True)
	except OSError as exc:
		raise ImproperlyConfigured(
			f"MEDIA_ROOT '{media_root}' is not writable/creatable. "
			"On Render, attach a Persistent Disk and set MEDIA_ROOT to its mount path "
			"(commonly mount /var/data and set MEDIA_ROOT to /var/data/media)."
		) from exc


_ensure_media_root()
