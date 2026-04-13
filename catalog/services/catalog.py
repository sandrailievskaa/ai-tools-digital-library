from django.db.models import Count, Q
from django.http import HttpRequest

from ..models import AITool, AIType, Category, Tag
from .favorites import favorite_tool_id_set


def base_tool_queryset():
    return AITool.objects.select_related("category", "ai_type").prefetch_related("tags")


def apply_search_and_filters(request: HttpRequest, qs):
    q = (request.GET.get("q") or "").strip()
    if q:
        qq = q.lower()
        tokens = [t for t in qq.split() if len(t) > 1]
        if tokens:
            for tok in tokens:
                qs = qs.filter(
                    Q(name__icontains=tok)
                    | Q(description__icontains=tok)
                    | Q(long_description__icontains=tok)
                    | Q(keywords__icontains=tok)
                    | Q(search_index__full_text__icontains=tok)
                    | Q(search_index__keywords__icontains=tok)
                    | Q(tags__name__icontains=tok)
                    | Q(tags__slug__icontains=tok)
                    | Q(category__name__icontains=tok)
                    | Q(category__slug__icontains=tok)
                    | Q(ai_type__name__icontains=tok)
                    | Q(ai_type__slug__icontains=tok)
                ).distinct()
        else:
            qs = qs.filter(
                Q(name__icontains=qq)
                | Q(description__icontains=qq)
                | Q(long_description__icontains=qq)
                | Q(keywords__icontains=qq)
                | Q(search_index__full_text__icontains=qq)
                | Q(search_index__keywords__icontains=qq)
                | Q(tags__name__icontains=qq)
                | Q(tags__slug__icontains=qq)
                | Q(category__name__icontains=qq)
                | Q(category__slug__icontains=qq)
                | Q(ai_type__name__icontains=qq)
                | Q(ai_type__slug__icontains=qq)
            ).distinct()

    for slug in request.GET.getlist("category"):
        if slug:
            qs = qs.filter(category__slug=slug)

    for slug in request.GET.getlist("atype"):
        if slug:
            qs = qs.filter(ai_type__slug=slug)

    diff = request.GET.get("difficulty")
    if diff:
        qs = qs.filter(difficulty=diff)

    for tslug in request.GET.getlist("tag"):
        if tslug:
            qs = qs.filter(tags__slug=tslug).distinct()

    return qs


def has_active_filters(request: HttpRequest, favorites_mode: bool) -> bool:
    if favorites_mode:
        return False
    g = request.GET
    return bool(
        (g.get("q") or "").strip()
        or g.getlist("category")
        or g.getlist("atype")
        or g.get("difficulty")
        or g.getlist("tag")
    )


def top_tags_for_filters():
    return list(
        Tag.objects.annotate(n=Count("tools")).filter(n__gt=0).order_by("-n", "name")[:16]
    )


def catalog_block_context(request: HttpRequest):
    favorites_mode = request.GET.get("favorites") in ("1", "true", "yes")
    fav_set = favorite_tool_id_set(request)

    qs = base_tool_queryset()
    if favorites_mode:
        qs = qs.filter(pk__in=fav_set)
    qs = apply_search_and_filters(request, qs)

    filtered = list(qs.order_by("name"))
    has_filters = has_active_filters(request, favorites_mode)

    if favorites_mode:
        grid_title = "Your favorites"
    elif has_filters:
        grid_title = "Search results"
    else:
        grid_title = "Catalog"

    return {
        "tools": filtered,
        "grid_title": grid_title,
        "favorite_ids": fav_set,
        "favorite_count": len(fav_set),
        "favorites_mode": favorites_mode,
        "has_active_filters": has_filters,
        "categories": Category.objects.annotate(n=Count("tools")).filter(n__gt=0).order_by("name"),
        "ai_types": AIType.objects.annotate(n=Count("tools")).filter(n__gt=0).order_by("name"),
        "difficulties": [c[0] for c in AITool.DIFFICULTY_LEVELS],
        "top_tags": top_tags_for_filters(),
        "selected_categories": request.GET.getlist("category"),
        "selected_atypes": request.GET.getlist("atype"),
        "selected_difficulty": request.GET.get("difficulty"),
        "selected_tags": request.GET.getlist("tag"),
        "search_q": request.GET.get("q", ""),
    }
