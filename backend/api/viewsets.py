from rest_framework import viewsets

from .models import ResearchLog
from .serializers import ResearchLogSerializer


class ResearchLogViewSet(viewsets.ModelViewSet):
    queryset = ResearchLog.objects.all().order_by("-created_at")
    serializer_class = ResearchLogSerializer
