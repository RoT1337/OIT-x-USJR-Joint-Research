from rest_framework import viewsets
from rest_framework.response import Response

from .affiliation import infer_affiliation_from_user, is_affiliation_mapping_configured
from .models import AffiliationTag, ResearchLog
from .permissions import ResearchLogPermission
from .serializers import ResearchLogSerializer
from .services.translation_service import translate_text, TranslationError


class ResearchLogViewSet(viewsets.ModelViewSet):
    queryset = ResearchLog.objects.all().order_by("-created_at")
    serializer_class = ResearchLogSerializer
    permission_classes = [ResearchLogPermission]

    def _sync_affiliations(self, instance: ResearchLog, affiliation_key: str) -> None:
        if not affiliation_key:
            return
        tag, _ = AffiliationTag.objects.get_or_create(
            key=affiliation_key,
            defaults={"label": affiliation_key},
        )
        instance.affiliations.set([tag])

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        lang = request.query_params.get("lang")

        if lang and lang.lower() == "jp":
            for log in queryset:
                if (
                    not log.translated_content
                    or not log.translated_title
                    or log.translated_language != "JA"
                ):
                    try:
                        translated_content = translate_text(log.content, "JA")
                        translated_title = translate_text(log.title, "JA")

                        log.translated_content = translated_content
                        log.translated_title = translated_title
                        log.translated_language = "JA"

                        log.save(update_fields=[
                            "translated_title",
                            "translated_content",
                            "translated_language",
                            "updated_at",
                        ])
                    except TranslationError as exc:
                        print("Translation failed:", exc)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        user = getattr(self.request, "user", None)
        affiliation = infer_affiliation_from_user(user) if user is not None else None

        if getattr(user, "is_authenticated", False):
            if is_affiliation_mapping_configured() and affiliation:
                # Enforce affiliation derived from the user's allowlisted email domain.
                instance = serializer.save(created_by=user, affiliation=affiliation)
                self._sync_affiliations(instance, affiliation)
                return

            instance = serializer.save(created_by=user)
            if instance.affiliation:
                self._sync_affiliations(instance, instance.affiliation)
            return

        instance = serializer.save()
        if instance.affiliation:
            self._sync_affiliations(instance, instance.affiliation)

    def perform_update(self, serializer):
        user = getattr(self.request, "user", None)
        instance: ResearchLog = self.get_object()

        # Staff can edit freely.
        if bool(getattr(user, "is_staff", False)):
            updated = serializer.save()
            if updated.affiliation:
                self._sync_affiliations(updated, updated.affiliation)
            return

        # Non-staff: affiliation is immutable and must match their inferred affiliation.
        updated = serializer.save(affiliation=instance.affiliation)
        if updated.affiliation:
            self._sync_affiliations(updated, updated.affiliation)
