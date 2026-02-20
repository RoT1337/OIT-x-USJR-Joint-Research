from rest_framework import viewsets

from .affiliation import infer_affiliation_from_user, is_affiliation_mapping_configured
from .models import AffiliationTag, ResearchLog
from .permissions import ResearchLogPermission
from .serializers import ResearchLogSerializer


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
