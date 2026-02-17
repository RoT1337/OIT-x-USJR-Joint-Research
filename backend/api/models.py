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
