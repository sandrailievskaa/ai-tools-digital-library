from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Categories"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:120]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class AIType(models.Model):
    """Classifier: UI Design, Video Generation, etc."""

    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "AI type"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:120]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)

    class Meta:
        ordering = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)[:60]
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.name


class AITool(models.Model):
    """Digital library object — curated AI tool with rich metadata."""

    DIFFICULTY_LEVELS = (
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
    )

    slug = models.SlugField(max_length=220, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField()
    long_description = models.TextField(blank=True, help_text="Extended narrative for detail page")

    link = models.URLField(max_length=500, blank=True)
    image = models.URLField(max_length=500, blank=True, null=True)
    preview_file = models.CharField(
        max_length=200,
        blank=True,
        help_text="Static preview filename, e.g. figma.png → static/catalog/previews/",
    )

    ai_type = models.ForeignKey(AIType, on_delete=models.SET_NULL, null=True, related_name="tools")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="tools")
    tags = models.ManyToManyField(Tag, blank=True, related_name="tools")

    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default="Beginner")

    popularity_score = models.FloatField(
        default=50.0,
        help_text="Mock engagement score for dashboard / related ranking",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    metadata_json = models.JSONField(blank=True, null=True)

    keywords = models.CharField(
        max_length=300,
        blank=True,
        help_text="SEO-style keyword string (complements M2M tags)",
    )
    format_type = models.CharField(
        max_length=100,
        default="web_tool",
        help_text="Digital object format e.g. web_tool, api, plugin",
    )

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name

    def get_absolute_url(self) -> str:
        from django.urls import reverse

        return reverse("catalog:tool_detail", kwargs={"slug": self.slug})

    def tag_list(self) -> str:
        return ", ".join(t.name for t in self.tags.all())

    def is_indexed(self) -> bool:
        return SearchIndex.objects.filter(tool_id=self.pk).exists()


class Tutorial(models.Model):
    """Learning resource linked to a tool (digital library related material)."""

    tool = models.ForeignKey(AITool, on_delete=models.CASCADE, related_name="tutorials")
    title = models.CharField(max_length=200)
    link = models.URLField(max_length=500)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class Bookmark(models.Model):
    """Per-session favorites (persists while session cookie exists)."""

    session_key = models.CharField(max_length=40, db_index=True)
    tool = models.ForeignKey(AITool, on_delete=models.CASCADE, related_name="bookmark_entries")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["session_key", "tool"],
                name="catalog_bookmark_session_tool_uc",
            )
        ]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.session_key[:8]}… → {self.tool.name}"


class SearchIndex(models.Model):
    """
    Precomputed keyword / full-text field for retrieval (inverted-index style).
    """

    tool = models.OneToOneField(AITool, on_delete=models.CASCADE, related_name="search_index")
    keywords = models.TextField(help_text="Comma-separated normalized keywords")
    full_text = models.TextField(help_text="Aggregated searchable text")

    def __str__(self) -> str:
        return f"Index for {self.tool.name}"
