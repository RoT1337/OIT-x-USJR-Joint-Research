from __future__ import annotations

import os

from django.http import HttpResponse
from django.contrib.auth import logout
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .affiliation import user_can_edit_log
from .affiliation import infer_affiliation_from_user, is_affiliation_mapping_configured
from .models import ResearchAttachment, ResearchLog
from .serializers import ResearchAttachmentSerializer


def attachment_download(request, pk: int):
    user = getattr(request, "user", None)
    if not getattr(user, "is_authenticated", False):
        return HttpResponse("Authentication required", status=401, content_type="text/plain")

    attachment = get_object_or_404(ResearchAttachment, pk=pk)

    if not attachment.file:
        raise Http404("Attachment file not found")

    filename = os.path.basename(attachment.file.name)
    response = FileResponse(attachment.file.open("rb"), as_attachment=True, filename=filename)
    return response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def attachment_upload(request, pk: int):
    """Upload a file and attach it to a ResearchLog.

    Expects multipart form-data with `file`.
    """

    log = get_object_or_404(ResearchLog, pk=pk)
    if not user_can_edit_log(request.user, log):
        return Response({"detail": "You do not have permission to add attachments to this entry."}, status=403)

    file = request.FILES.get("file")
    if not file:
        return Response({"detail": "Missing file."}, status=400)

    attachment = ResearchAttachment.objects.create(research_log=log, file=file)
    data = ResearchAttachmentSerializer(attachment, context={"request": request}).data
    return Response(data, status=201)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def attachment_delete(request, pk: int):
    attachment = get_object_or_404(ResearchAttachment, pk=pk)

    log = attachment.research_log
    if not user_can_edit_log(request.user, log):
        return Response({"detail": "You do not have permission to remove attachments from this entry."}, status=403)

    # Ensure file is removed from storage as well.
    if attachment.file:
        attachment.file.delete(save=False)
    attachment.delete()
    return Response({"ok": True})


@api_view(["GET"])
@permission_classes([AllowAny])
def csrf(request):
    # Ensures a CSRF cookie is set for SPA POST/PUT/PATCH/DELETE using session auth.
    return Response({"csrfToken": get_token(request)})


@api_view(["GET"])
@permission_classes([AllowAny])
def me(request):
    user = request.user
    if not getattr(user, "is_authenticated", False):
        return Response({"isAuthenticated": False})

    affiliation_enforced = is_affiliation_mapping_configured()
    inferred_affiliation = infer_affiliation_from_user(user) if affiliation_enforced else None

    return Response(
        {
            "isAuthenticated": True,
            "email": getattr(user, "email", "") or "",
            "name": user.get_full_name() or user.get_username() or "",
            "isStaff": bool(getattr(user, "is_staff", False)),
            "affiliationEnforced": bool(affiliation_enforced),
            "affiliation": inferred_affiliation,
        }
    )


@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"ok": True})
