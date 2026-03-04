from __future__ import annotations

from rest_framework.permissions import BasePermission, SAFE_METHODS

from .affiliation import infer_affiliation_from_user, is_affiliation_mapping_configured


class ResearchLogPermission(BasePermission):
    """Permission policy:

    - Login required to read
    - Create/update requires login AND an inferred affiliation (via email allowlist domain mapping)
    - Updates require the entry's affiliation to match the user's inferred affiliation
    - Delete is admin-only
    """

    message = "You do not have permission to perform this action."

    def has_permission(self, request, view) -> bool:
        action = getattr(view, "action", None)

        user = getattr(request, "user", None)
        if request.method in SAFE_METHODS or action in {"list", "retrieve"}:
            return bool(getattr(user, "is_authenticated", False))

        if not getattr(user, "is_authenticated", False):
            return False

        # Admin-only delete.
        if action == "destroy":
            return bool(getattr(user, "is_staff", False))

        # Writes require an inferred affiliation unless staff.
        if bool(getattr(user, "is_staff", False)):
            return True

        if not is_affiliation_mapping_configured():
            return True

        return bool(infer_affiliation_from_user(user))

    def has_object_permission(self, request, view, obj) -> bool:
        action = getattr(view, "action", None)
        user = getattr(request, "user", None)

        if request.method in SAFE_METHODS or action in {"retrieve", "list"}:
            return bool(getattr(user, "is_authenticated", False))

        if not getattr(user, "is_authenticated", False):
            return False

        if action == "destroy":
            return bool(getattr(user, "is_staff", False))

        if bool(getattr(user, "is_staff", False)):
            return True

        if not is_affiliation_mapping_configured():
            return getattr(obj, "created_by_id", None) == getattr(user, "id", None)

        aff = infer_affiliation_from_user(user)
        return bool(aff) and getattr(obj, "affiliation", None) == aff
