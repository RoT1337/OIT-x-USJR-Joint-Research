from __future__ import annotations

import os

from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404

from .models import ResearchAttachment


def attachment_download(request, pk: int):
    attachment = get_object_or_404(ResearchAttachment, pk=pk)

    if not attachment.file:
        raise Http404("Attachment file not found")

    filename = os.path.basename(attachment.file.name)
    response = FileResponse(attachment.file.open("rb"), as_attachment=True, filename=filename)
    return response
from django.shortcuts import render

# Create your views here.
