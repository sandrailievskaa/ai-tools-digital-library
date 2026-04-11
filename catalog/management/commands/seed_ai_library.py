import hashlib
import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.utils.text import slugify

from catalog.models import AIType, AITool, Category, Tag, Tutorial
from catalog.search_utils import refresh_search_index


def _popularity(name: str) -> float:
    h = int(hashlib.sha256(name.encode()).hexdigest()[:8], 16)
    return 55.0 + (h % 450) / 10


def _long_desc(short: str, name: str, category: str, tool_type: str) -> str:
    return (
        f"{short}\n\n"
        f"This catalog entry for {name} is classified under {category} "
        f"with resource type {tool_type}. Metadata supports semantic retrieval, "
        f"faceted browsing, and structured digital-library discovery across tags and "
        f"controlled vocabulary."
    )


def _unique_slug(name: str) -> str:
    base = slugify(name.replace("·", ""))[:200] or "tool"
    slug = base
    i = 0
    while True:
        clash = AITool.objects.filter(slug=slug).first()
        if clash is None or clash.name == name:
            return slug
        i += 1
        slug = f"{base}-{i}"


class Command(BaseCommand):
    help = "Load AI tools from catalog/data/ai_tools_seed.json (idempotent)"

    def handle(self, *args, **options):
        path = Path(__file__).resolve().parent.parent.parent / "data" / "ai_tools_seed.json"
        data = json.loads(path.read_text(encoding="utf-8"))

        for row in data:
            cat, _ = Category.objects.get_or_create(
                name=row["category"],
                defaults={"description": f"Curated collection: {row['category']}"},
            )
            aitype, _ = AIType.objects.get_or_create(name=row["type"])
            slug = _unique_slug(row["name"])

            tags_raw = row.get("tags") or []
            keywords_str = ", ".join(str(t).strip() for t in tags_raw if str(t).strip())

            tool, _ = AITool.objects.update_or_create(
                name=row["name"],
                defaults={
                    "slug": slug,
                    "description": row["description"],
                    "long_description": _long_desc(
                        row["description"], row["name"], row["category"], row["type"]
                    ),
                    "link": row.get("link") or "",
                    "preview_file": row.get("image") or "",
                    "image": None,
                    "ai_type": aitype,
                    "category": cat,
                    "difficulty": row["difficulty"],
                    "popularity_score": _popularity(row["name"]),
                    "metadata_json": row,
                    "keywords": keywords_str,
                    "format_type": row.get("format_type") or "web_tool",
                },
            )

            tag_objs = []
            for tname in tags_raw:
                tag, _ = Tag.objects.get_or_create(name=str(tname).lower().strip())
                tag_objs.append(tag)
            tool.tags.set(tag_objs)
            refresh_search_index(tool)

            link = (row.get("link") or "").strip() or "https://example.com"
            Tutorial.objects.get_or_create(
                tool=tool,
                title=f"Getting started with {row['name']}",
                defaults={
                    "link": link,
                    "description": "Curated tutorial entry linked from the digital library seed.",
                },
            )

        self.stdout.write(self.style.SUCCESS(f"Seeded {len(data)} tools (SearchIndex updated)."))
