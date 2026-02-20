from django import forms
from django.contrib import admin

from .models import AffiliationTag, CategoryTag, ResearchAttachment, ResearchLog


class ResearchAttachmentInline(admin.TabularInline):
	model = ResearchAttachment
	extra = 0
	fields = ("file", "uploaded_at")
	readonly_fields = ("uploaded_at",)


@admin.register(ResearchLog)
class ResearchLogAdmin(admin.ModelAdmin):
	class ResearchLogAdminForm(forms.ModelForm):
		category = forms.CharField(required=False, widget=forms.HiddenInput())
		affiliation = forms.CharField(required=False, widget=forms.HiddenInput())

		class Meta:
			model = ResearchLog
			fields = ("title", "content", "categories", "affiliations", "category", "affiliation")

		def clean(self):
			cleaned = super().clean()
			categories = cleaned.get("categories")
			affiliations = cleaned.get("affiliations")

			# Keep legacy single-value fields populated for compatibility.
			# These fields are intentionally not shown in admin.
			if categories and len(categories) > 0:
				cleaned["category"] = categories[0].key
			if affiliations and len(affiliations) > 0:
				cleaned["affiliation"] = affiliations[0].key

			return cleaned

	form = ResearchLogAdminForm

	inlines = (ResearchAttachmentInline,)
	list_display = ("id", "title", "categories_display", "affiliations_display", "created_at", "updated_at")
	list_filter = ("categories", "affiliations")
	search_fields = ("title", "content")
	filter_horizontal = ("categories", "affiliations")

	@admin.display(description="Categories")
	def categories_display(self, obj: ResearchLog) -> str:
		return ", ".join(obj.categories.order_by("label").values_list("label", flat=True))

	@admin.display(description="Affiliations")
	def affiliations_display(self, obj: ResearchLog) -> str:
		return ", ".join(obj.affiliations.order_by("label").values_list("label", flat=True))


@admin.register(ResearchAttachment)
class ResearchAttachmentAdmin(admin.ModelAdmin):
	list_display = ("id", "research_log", "file", "uploaded_at")
	list_filter = ("uploaded_at",)
	search_fields = ("research_log__title",)


@admin.register(CategoryTag)
class CategoryTagAdmin(admin.ModelAdmin):
	list_display = ("id", "key", "label")
	search_fields = ("key", "label")


@admin.register(AffiliationTag)
class AffiliationTagAdmin(admin.ModelAdmin):
	list_display = ("id", "key", "label")
	search_fields = ("key", "label")
