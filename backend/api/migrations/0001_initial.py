# Generated manually to match the initial ResearchLog model.

from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="ResearchLog",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("content", models.TextField()),
                (
                    "category",
                    models.CharField(
                        choices=[
                            ("Rectenna", "Rectenna"),
                            ("MPPT", "MPPT"),
                            ("AI", "AI"),
                            ("Meeting", "Meeting"),
                            ("Other", "Other"),
                        ],
                        max_length=32,
                    ),
                ),
                (
                    "affiliation",
                    models.CharField(
                        choices=[("USJR", "USJR"), ("OIT", "OIT")],
                        max_length=16,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
        ),
    ]
