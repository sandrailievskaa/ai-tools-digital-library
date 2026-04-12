import json

from django.db.models import Count, Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_GET, require_POST

from .models import AIType, AITool, Bookmark, Category, Tag, Tutorial
from .services.catalog import base_tool_queryset, catalog_block_context
from .services.favorites import ensure_session_key, favorite_tool_id_set, migrate_legacy_favorites


def index(request):
    migrate_legacy_favorites(request)
    cat_ctx = catalog_block_context(request)
    has_filters = cat_ctx["has_active_filters"]
    favorites_mode = cat_ctx["favorites_mode"]

    all_tools = list(base_tool_queryset().order_by("-popularity_score"))

    stats = {
        "total": AITool.objects.count(),
        "categories": Category.objects.filter(tools__isnull=False).distinct().count(),
        "types": AIType.objects.filter(tools__isnull=False).distinct().count(),
        "tags": Tag.objects.filter(tools__isnull=False).distinct().count(),
    }

    popular = all_tools[:6]
    popular_ids = {x.pk for x in popular}
    suggested = [t for t in all_tools if t.pk not in popular_ids][:3]

    show_hero = not has_filters and not favorites_mode

    context = {
        **cat_ctx,
        "show_hero": show_hero,
        "stats": stats,
        "popular_tools": popular,
        "suggested_tools": suggested,
    }
    return render(request, "catalog/index.html", context)


@require_GET
def catalog_partial(request):
    migrate_legacy_favorites(request)
    ctx = catalog_block_context(request)
    return render(request, "catalog/partials/catalog_main.html", ctx)


def tool_detail(request, slug):
    migrate_legacy_favorites(request)
    tool = get_object_or_404(
        base_tool_queryset().prefetch_related("tutorials"),
        slug=slug,
    )
    others = list(base_tool_queryset().exclude(pk=tool.pk))

    related = [
        t
        for t in others
        if t.category_id == tool.category_id
        or set(t.tags.values_list("id", flat=True)) & set(tool.tags.values_list("id", flat=True))
    ]
    related = sorted(related, key=lambda t: t.popularity_score, reverse=True)[:4]

    related_ids = {t.pk for t in related}
    you_may_like = sorted(
        [t for t in others if t.pk not in related_ids],
        key=lambda t: t.popularity_score,
        reverse=True,
    )[:4]

    fav_set = favorite_tool_id_set(request)
    tutorials = list(tool.tutorials.all())
    context = {
        "tool": tool,
        "related_tools": related,
        "you_may_like": you_may_like,
        "is_favorite": tool.pk in fav_set,
        "favorite_ids": fav_set,
        "favorite_count": len(fav_set),
        "search_q": "",
        "tutorials": tutorials,
    }
    return render(request, "catalog/tool_detail.html", context)


@require_GET
def tool_preview(request, slug):
    tool = get_object_or_404(base_tool_queryset().prefetch_related("tags"), slug=slug)
    return render(request, "catalog/partials/tool_preview_body.html", {"tool": tool})


@require_POST
def toggle_favorite(request, pk):
    next_url = request.POST.get("next") or "/"
    sk = ensure_session_key(request)
    tool = get_object_or_404(AITool, pk=pk)
    deleted, _ = Bookmark.objects.filter(session_key=sk, tool=tool).delete()
    is_favorite = False
    if not deleted:
        Bookmark.objects.get_or_create(session_key=sk, tool=tool)
        is_favorite = True
    request.session.modified = True
    count = Bookmark.objects.filter(session_key=sk).count()

    wants_json = request.headers.get("X-Requested-With") == "XMLHttpRequest" or request.POST.get("format") == "json"
    if wants_json:
        return JsonResponse({"ok": True, "is_favorite": is_favorite, "favorite_count": count})

    return redirect(next_url)


@require_POST
def sync_favorites(request):
    try:
        body = json.loads(request.body.decode() or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"ok": False, "error": "invalid json"}, status=400)
    slugs = body.get("slugs") or body.get("tool_slugs") or []
    if not isinstance(slugs, list):
        return JsonResponse({"ok": False, "error": "slugs must be a list"}, status=400)
    sk = ensure_session_key(request)
    for slug in slugs:
        if not isinstance(slug, str):
            continue
        slug = slug.strip()
        if not slug:
            continue
        t = AITool.objects.filter(slug=slug).first()
        if t:
            Bookmark.objects.get_or_create(session_key=sk, tool=t)
    n = Bookmark.objects.filter(session_key=sk).count()
    return JsonResponse({"ok": True, "count": n})


def dashboard(request):
    migrate_legacy_favorites(request)
    cat_data = list(
        Category.objects.annotate(n=Count("tools"))
        .filter(n__gt=0)
        .order_by("-n")
        .values("name", "n")[:12]
    )
    type_data = list(
        AIType.objects.annotate(n=Count("tools"))
        .filter(n__gt=0)
        .order_by("-n")
        .values("name", "n")[:10]
    )
    diff_data = list(AITool.objects.values("difficulty").annotate(n=Count("id")).order_by("difficulty"))
    popular = list(base_tool_queryset().order_by("-popularity_score")[:8])
    trending = list(base_tool_queryset().order_by("-created_at", "-popularity_score")[:8])
    most_bookmarked = list(
        base_tool_queryset()
        .annotate(bookmark_n=Count("bookmark_entries"))
        .order_by("-bookmark_n", "-popularity_score")[:8]
    )
    total_tools = AITool.objects.count()
    total_tags = Tag.objects.filter(tools__isnull=False).distinct().count()

    fav = favorite_tool_id_set(request)
    context = {
        "cat_labels": [c["name"] for c in cat_data],
        "cat_counts": [c["n"] for c in cat_data],
        "type_labels": [c["name"] for c in type_data],
        "type_counts": [c["n"] for c in type_data],
        "diff_labels": [d["difficulty"] for d in diff_data],
        "diff_counts": [d["n"] for d in diff_data],
        "popular_tools": popular,
        "trending_tools": trending,
        "most_bookmarked_tools": most_bookmarked,
        "total_tools": total_tools,
        "total_tags": total_tags,
        "favorite_count": len(fav),
        "favorite_ids": fav,
    }
    return render(request, "catalog/dashboard.html", context)


def categories_list(request):
    migrate_legacy_favorites(request)
    categories = Category.objects.annotate(n=Count("tools")).filter(n__gt=0).order_by("name")
    fav = favorite_tool_id_set(request)
    return render(
        request,
        "catalog/categories.html",
        {
            "categories": categories,
            "favorite_count": len(fav),
            "favorite_ids": fav,
            "search_q": "",
        },
    )


def tutorials_list(request):
    migrate_legacy_favorites(request)
    tutorials = (
        Tutorial.objects.select_related("tool", "tool__category", "tool__ai_type")
        .order_by("tool__name", "title")
        .all()
    )
    fav = favorite_tool_id_set(request)
    return render(
        request,
        "catalog/tutorials.html",
        {
            "tutorials": tutorials,
            "favorite_count": len(fav),
            "favorite_ids": fav,
            "search_q": "",
        },
    )


@require_GET
def search_suggest(request):
    q = (request.GET.get("q") or "").strip()
    if len(q) < 2:
        return JsonResponse({"results": []})
    qq = q.lower()
    qs = (
        base_tool_queryset()
        .filter(
            Q(name__icontains=qq)
            | Q(description__icontains=qq)
            | Q(slug__icontains=qq)
            | Q(keywords__icontains=qq)
        )
        .distinct()[:12]
    )
    results = [
        {
            "name": t.name,
            "slug": t.slug,
            "url": t.get_absolute_url(),
            "type": t.ai_type.name if t.ai_type else "",
            "snippet": (t.description[:120] + "…") if len(t.description) > 120 else t.description,
        }
        for t in qs
    ]
    return JsonResponse({"results": results})


def set_theme(request):
    theme = request.GET.get("theme", "light")
    if theme not in ("light", "dark"):
        theme = "light"
    next_url = request.GET.get("next") or "/"
    if not next_url.startswith("/"):
        next_url = "/"
    resp = redirect(next_url)
    resp.set_cookie("theme", theme, max_age=365 * 24 * 3600, samesite="Lax")
    return resp


def handler404(request, exception):
    return render(request, "catalog/404.html", status=404)
