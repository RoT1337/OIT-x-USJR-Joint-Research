from django.db import migrations, models


def seed_tags(apps, schema_editor):
    CategoryTag = apps.get_model("api", "CategoryTag")
    AffiliationTag = apps.get_model("api", "AffiliationTag")
    ResearchLog = apps.get_model("api", "ResearchLog")

    category_keys = ["Rectenna", "MPPT", "AI", "Meeting", "Other"]
    affiliation_keys = ["USJR", "OIT"]

    for key in category_keys:
        CategoryTag.objects.get_or_create(key=key, defaults={"label": key})

    for key in affiliation_keys:
        AffiliationTag.objects.get_or_create(key=key, defaults={"label": key})

    # Backfill existing rows from legacy single-value fields.
    for log in ResearchLog.objects.all():
        if getattr(log, "category", None):
            tag = CategoryTag.objects.filter(key=log.category).first()
            if tag is not None:
                log.categories.add(tag)

        if getattr(log, "affiliation", None):
            tag = AffiliationTag.objects.filter(key=log.affiliation).first()
            if tag is not None:
                log.affiliations.add(tag)


def unseed_tags(apps, schema_editor):
    CategoryTag = apps.get_model("api", "CategoryTag")
    AffiliationTag = apps.get_model("api", "AffiliationTag")
    ResearchLog = apps.get_model("api", "ResearchLog")

    for log in ResearchLog.objects.all():
        log.categories.clear()
        log.affiliations.clear()

    CategoryTag.objects.all().delete()
    AffiliationTag.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_researchattachment"),
    ]

    operations = [
        migrations.CreateModel(
            name="CategoryTag",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(max_length=32, unique=True)),
                ("label", models.CharField(max_length=64)),
            ],
            options={
                "verbose_name": "Category tag",
                "verbose_name_plural": "Category tags",
            },
        ),
        migrations.CreateModel(
            name="AffiliationTag",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(max_length=16, unique=True)),
                ("label", models.CharField(max_length=64)),
            ],
            options={
                "verbose_name": "Affiliation tag",
                "verbose_name_plural": "Affiliation tags",
            },
        ),
        migrations.AddField(
            model_name="researchlog",
            name="categories",
            field=models.ManyToManyField(blank=True, related_name="research_logs", to="api.categorytag"),
        ),
        migrations.AddField(
            model_name="researchlog",
            name="affiliations",
            field=models.ManyToManyField(blank=True, related_name="research_logs", to="api.affiliationtag"),
        ),
        migrations.RunPython(seed_tags, reverse_code=unseed_tags),
    ]
