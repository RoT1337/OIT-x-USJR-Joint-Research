from rest_framework import serializers

from .models import ResearchAttachment, ResearchLog


class ResearchAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = ResearchAttachment
        fields = (
            "id",
            "file_url",
            "download_url",
            "uploaded_at",
        )
        read_only_fields = fields

    def get_file_url(self, obj: ResearchAttachment) -> str | None:
        if not obj.file:
            return None

        request = self.context.get("request")
        url = obj.file.url
        return request.build_absolute_uri(url) if request is not None else url

    def get_download_url(self, obj: ResearchAttachment) -> str:
        request = self.context.get("request")
        url = f"/api/attachments/{obj.id}/download/"
        return request.build_absolute_uri(url) if request is not None else url


class ResearchLogSerializer(serializers.ModelSerializer):
    attachments = ResearchAttachmentSerializer(many=True, read_only=True)

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
            "attachments",
        )
        read_only_fields = ("id", "created_at", "updated_at")
