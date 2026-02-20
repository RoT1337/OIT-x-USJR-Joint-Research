"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/wsgi/
"""

import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()


def _ensure_media_root() -> None:
	"""Fail fast in production if MEDIA_ROOT isn't writable.

	Render Persistent Disks are mounted for the runtime web process but are
	typically not mounted during build steps. This check belongs at startup.
	"""

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
