from rest_framework import serializers

from .models import ResearchLog


class ResearchLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResearchLog
        fields = (
            "id",
            "title",
            "content",
            "category",
            "affiliation",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
