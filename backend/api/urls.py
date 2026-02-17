from django.urls import path

from .viewsets import ResearchLogViewSet

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
	# Primary endpoints
	path("api/researchlogs/", researchlog_list, name="researchlog-list"),
	path("api/researchlogs/<int:pk>/", researchlog_detail, name="researchlog-detail"),

	# Alias endpoints (for simpler singular naming)
	path("api/researchlog/", researchlog_list, name="researchlog-list-alias"),
	path("api/researchlog/<int:pk>/", researchlog_detail, name="researchlog-detail-alias"),
]
