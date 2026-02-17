from django.contrib import admin

from .models import ResearchLog


@admin.register(ResearchLog)
class ResearchLogAdmin(admin.ModelAdmin):
	list_display = ("id", "title", "category", "affiliation", "created_at", "updated_at")
	list_filter = ("category", "affiliation")
	search_fields = ("title", "content")
