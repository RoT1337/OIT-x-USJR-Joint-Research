from django.urls import path

from .viewsets import ResearchLogViewSet
from .views import attachment_delete, attachment_download, attachment_upload, csrf, logout_view, me

researchlog_list = ResearchLogViewSet.as_view(
	{
		"get": "list",
		"post": "create",
	}
)

researchlog_detail = ResearchLogViewSet.as_view(
	{
		"get": "retrieve",
		"put": "update",
		"patch": "partial_update",
		"delete": "destroy",
	}
)

urlpatterns = [
	# Session helpers for SPA
	path("api/csrf/", csrf, name="csrf"),
	path("api/me/", me, name="me"),
	path("api/logout/", logout_view, name="logout"),

	# Primary endpoints
	path("api/researchlogs/", researchlog_list, name="researchlog-list"),
	path("api/researchlogs/<int:pk>/", researchlog_detail, name="researchlog-detail"),

	# Attachments
	path("api/researchlogs/<int:pk>/attachments/", attachment_upload, name="researchattachment-upload"),
	path("api/researchlog/<int:pk>/attachments/", attachment_upload, name="researchattachment-upload-alias"),
	path("api/attachments/<int:pk>/download/", attachment_download, name="researchattachment-download"),
	path("api/attachments/<int:pk>/", attachment_delete, name="researchattachment-delete"),

	# Alias endpoints (for simpler singular naming)
	path("api/researchlog/", researchlog_list, name="researchlog-list-alias"),
	path("api/researchlog/<int:pk>/", researchlog_detail, name="researchlog-detail-alias"),
]
