from django.contrib import admin

from .models import ResearchAttachment, ResearchLog


class ResearchAttachmentInline(admin.TabularInline):
	model = ResearchAttachment
	extra = 0
	fields = ("file", "uploaded_at")
	readonly_fields = ("uploaded_at",)


@admin.register(ResearchLog)
class ResearchLogAdmin(admin.ModelAdmin):
	inlines = (ResearchAttachmentInline,)
	list_display = ("id", "title", "category", "affiliation", "created_at", "updated_at")
	list_filter = ("category", "affiliation")
	search_fields = ("title", "content")


@admin.register(ResearchAttachment)
class ResearchAttachmentAdmin(admin.ModelAdmin):
	list_display = ("id", "research_log", "file", "uploaded_at")
	list_filter = ("uploaded_at",)
	search_fields = ("research_log__title",)
