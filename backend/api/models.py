from django.db import models

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
	content = models.TextField()
	category = models.CharField(max_length=32, choices=Category.choices)
	affiliation = models.CharField(max_length=16, choices=Affiliation.choices)
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
