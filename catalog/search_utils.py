"""Build and refresh SearchIndex rows (digital library retrieval layer)."""

from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .models import AITool


def build_full_text(tool: AITool) -> str:
    parts = [
        tool.name,
        tool.description,
        tool.long_description or "",
        tool.keywords or "",
        tool.category.name if tool.category_id else "",
        tool.ai_type.name if tool.ai_type_id else "",
        tool.difficulty,
    ]
    parts.extend(t.name for t in tool.tags.all())
    parts.extend(t.slug for t in tool.tags.all())
    return "\n".join(p for p in parts if p).lower()


def build_keywords(tool: AITool) -> str:
    tag_names = [t.name.lower() for t in tool.tags.all()]
    extra = []
    if tool.category_id:
        extra.append(tool.category.name.lower())
    if tool.ai_type_id:
        extra.append(tool.ai_type.name.lower())
    if tool.keywords:
        extra.extend(k.strip().lower() for k in tool.keywords.split(",") if k.strip())
    return ", ".join(sorted(set(tag_names + extra)))


def refresh_search_index(tool: AITool) -> None:
    from .models import SearchIndex

    full_text = build_full_text(tool)
    keywords = build_keywords(tool)
    SearchIndex.objects.update_or_create(
        tool=tool,
        defaults={"keywords": keywords, "full_text": full_text},
    )
