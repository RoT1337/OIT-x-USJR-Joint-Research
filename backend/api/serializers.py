from rest_framework import serializers

from .models import AffiliationTag, CategoryTag, ResearchAttachment, ResearchLog


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

    created_by_name = serializers.SerializerMethodField()
    created_by_email = serializers.SerializerMethodField()

    # Multi-tag fields (new). Keep legacy single fields as well.
    # Use M2M-aware fields (ListField would try to iterate ManyRelatedManager directly).
    categories = serializers.SlugRelatedField(
        many=True,
        slug_field="key",
        queryset=CategoryTag.objects.all(),
        required=False,
    )
    affiliations = serializers.SlugRelatedField(
        many=True,
        slug_field="key",
        queryset=AffiliationTag.objects.all(),
        required=False,
    )

    # Legacy single-tag fields (kept for compatibility). Make optional so clients can
    # create/update using only the multi-tag fields.
    category = serializers.ChoiceField(choices=ResearchLog.Category.choices, required=False)
    affiliation = serializers.ChoiceField(
        choices=ResearchLog.Affiliation.choices,
        required=False,
    )

    class Meta:
        model = ResearchLog
        fields = (
            "id",
            "title",
            "translated_title",
            "content",
            "translated_content",
            "translated_language",
            "category",
            "affiliation",
            "categories",
            "affiliations",
            "created_at",
            "updated_at",
            "created_by_name",
            "created_by_email",
            "attachments",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def get_created_by_name(self, obj: ResearchLog) -> str:
        user = getattr(obj, "created_by", None)
        if not user:
            return ""
        return user.get_full_name() or user.get_username() or ""

    def get_created_by_email(self, obj: ResearchLog) -> str:
        user = getattr(obj, "created_by", None)
        if not user:
            return ""
        return getattr(user, "email", "") or ""

    def to_representation(self, instance: ResearchLog):
        data = super().to_representation(instance)

        categories = list(instance.categories.values_list("key", flat=True))
        affiliations = list(instance.affiliations.values_list("key", flat=True))

        # If the M2M fields are empty (e.g., older rows), fall back to legacy fields.
        data["categories"] = categories if categories else ([instance.category] if instance.category else [])
        data["affiliations"] = (
            affiliations if affiliations else ([instance.affiliation] if instance.affiliation else [])
        )
        return data

    def validate(self, attrs):
        categories = attrs.get("categories")  # list[CategoryTag]
        affiliations = attrs.get("affiliations")  # list[AffiliationTag]

        # Allow create/update with only multi-tag fields.
        if "category" not in attrs:
            if categories and len(categories) > 0:
                attrs["category"] = categories[0].key
            elif self.instance is None:
                raise serializers.ValidationError({"category": "This field is required."})

        if "affiliation" not in attrs:
            if affiliations and len(affiliations) > 0:
                attrs["affiliation"] = affiliations[0].key
            elif self.instance is None:
                raise serializers.ValidationError({"affiliation": "This field is required."})

        return attrs

    def create(self, validated_data):
        instance = super().create(validated_data)

        # If the client didn't send the new fields (or older rows exist), ensure M2M mirrors legacy.
        if instance.category and instance.categories.count() == 0:
            tag, _ = CategoryTag.objects.get_or_create(key=instance.category, defaults={"label": instance.category})
            instance.categories.add(tag)
        if instance.affiliation and instance.affiliations.count() == 0:
            tag, _ = AffiliationTag.objects.get_or_create(
                key=instance.affiliation,
                defaults={"label": instance.affiliation},
            )
            instance.affiliations.add(tag)

        return instance

    def update(self, instance: ResearchLog, validated_data):
        categories = validated_data.get("categories")
        affiliations = validated_data.get("affiliations")

        instance = super().update(instance, validated_data)

        # Keep legacy single-value fields aligned with the first selected tag when provided.
        updates: list[str] = []

        if categories is not None and len(categories) > 0:
            first = categories[0].key
            if instance.category != first:
                instance.category = first
                updates.append("category")

        if affiliations is not None and len(affiliations) > 0:
            first = affiliations[0].key
            if instance.affiliation != first:
                instance.affiliation = first
                updates.append("affiliation")

        if updates:
            instance.save(update_fields=[*updates, "updated_at"])

        # Also backfill M2M if it is still empty.
        if instance.category and instance.categories.count() == 0:
            tag, _ = CategoryTag.objects.get_or_create(key=instance.category, defaults={"label": instance.category})
            instance.categories.add(tag)
        if instance.affiliation and instance.affiliations.count() == 0:
            tag, _ = AffiliationTag.objects.get_or_create(
                key=instance.affiliation,
                defaults={"label": instance.affiliation},
            )
            instance.affiliations.add(tag)

        return instance
