"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import HttpResponse
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve as static_serve
from django.conf import settings
import logging
from pathlib import Path


logger = logging.getLogger(__name__)


def media_serve(request, path: str):
    media_root = Path(settings.MEDIA_ROOT)
    full_path = media_root / path
    logger.info("MEDIA request path=%s full_path=%s exists=%s", path, full_path, full_path.exists())
    return static_serve(request, path, document_root=str(media_root))


def spa_index(request):
    index_path = settings.FRONTEND_DIST_DIR / "index.html"
    if index_path.exists():
        return TemplateView.as_view(template_name="index.html")(request)

    return HttpResponse(
        "Frontend build not found. Run `npm run build` to generate dist/.",
        status=404,
        content_type="text/plain",
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls')),

    # Media (Render production needs this; download endpoint alone isn't enough for previews)
    re_path(r"^media/(?P<path>.*)$", media_serve),

    # React SPA (served from dist/index.html)
    re_path(
        r"^(?!api/|admin/|media/|static/).*$",
        spa_index,
        name="spa",
    ),
]
