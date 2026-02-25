from django.conf import settings
from django.db import models


class CategoryTag(models.Model):
	key = models.CharField(max_length=32, unique=True)
	label = models.CharField(max_length=64)

	class Meta:
		verbose_name = "Category tag"
		verbose_name_plural = "Category tags"

	def __str__(self) -> str:
		return self.label


class AffiliationTag(models.Model):
	key = models.CharField(max_length=16, unique=True)
	label = models.CharField(max_length=64)

	class Meta:
		verbose_name = "Affiliation tag"
		verbose_name_plural = "Affiliation tags"

	def __str__(self) -> str:
		return self.label

class ResearchLog(models.Model):
	class Category(models.TextChoices):
		RECTENNA = "Rectenna", "Rectenna"
		MPPT = "MPPT", "MPPT"
		AI = "AI", "AI"
		MEETING = "Meeting", "Meeting"
		OTHER = "Other", "Other"

	class Affiliation(models.TextChoices):
		USJR = "USJR", "USJR"
		OIT = "OIT", "OIT"

	title = models.CharField(max_length=255)
	translated_title = models.CharField(max_length=255, blank=True, null=True)
	content = models.TextField(blank=True)
	translated_content = models.TextField(blank=True, null=True)
	translated_language = models.CharField(max_length=8, blank=True, null=True)
	created_by = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		null=True,
		blank=True,
		on_delete=models.SET_NULL,
		related_name="research_logs",
	)
	category = models.CharField(max_length=32, choices=Category.choices)
	affiliation = models.CharField(max_length=16, choices=Affiliation.choices)
	categories = models.ManyToManyField(
		CategoryTag,
		blank=True,
		related_name="research_logs",
	)
	affiliations = models.ManyToManyField(
		AffiliationTag,
		blank=True,
		related_name="research_logs",
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	def __str__(self) -> str:
		return self.title


class ResearchAttachment(models.Model):
	research_log = models.ForeignKey(
		ResearchLog,
		on_delete=models.CASCADE,
		related_name="attachments",
	)
	file = models.FileField(upload_to="research_attachments/")
	uploaded_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return f"Attachment {self.id} for {self.research_log_id}"
