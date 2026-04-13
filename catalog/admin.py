from django.contrib import admin
from django.utils.text import slugify

from .models import AIType, AITool, Bookmark, Category, SearchIndex, Tag, Tutorial


class SearchIndexInline(admin.StackedInline):
    model = SearchIndex
    extra = 0
    readonly_fields = ("keywords", "full_text")


class TutorialInline(admin.TabularInline):
    model = Tutorial
    extra = 0


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(AIType)
class AITypeAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(AITool)
class AIToolAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "ai_type", "difficulty", "popularity_score", "created_at")
    list_filter = ("difficulty", "category", "ai_type")
    search_fields = ("name", "description", "slug", "keywords")
    filter_horizontal = ("tags",)
    inlines = [TutorialInline, SearchIndexInline]
    readonly_fields = ("created_at",)

    def save_model(self, request, obj, form, change):
        if not obj.slug:
            obj.slug = slugify(obj.name.replace("·", ""))[:220] or "tool"
        super().save_model(request, obj, form, change)


@admin.register(SearchIndex)
class SearchIndexAdmin(admin.ModelAdmin):
    list_display = ("tool", "keywords_short")

    @admin.display(description="Keywords (short)")
    def keywords_short(self, obj: SearchIndex) -> str:
        return (obj.keywords[:80] + "…") if len(obj.keywords) > 80 else obj.keywords


@admin.register(Tutorial)
class TutorialAdmin(admin.ModelAdmin):
    list_display = ("title", "tool", "link")
    list_filter = ("tool__category",)
    search_fields = ("title", "description", "tool__name")


@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ("tool", "session_key", "created_at")
    search_fields = ("session_key", "tool__name")
