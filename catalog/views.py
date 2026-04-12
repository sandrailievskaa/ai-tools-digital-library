import json

from django.db.models import Count, Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_GET, require_POST

from .models import AITool, AIType, Bookmark, Category, Tag, Tutorial


def _session_key(request):
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def _migrate_legacy_favorites(request):
    if request.session.get("_fav_migrated"):
        return
    raw = request.session.get("favorites")
    if isinstance(raw, list) and raw:
        sk = _session_key(request)
        for x in raw:
            if str(x).isdigit():
                try:
                    Bookmark.objects.get_or_create(session_key=sk, tool_id=int(x))
                except Exception:
                    pass
        request.session.pop("favorites", None)
    request.session["_fav_migrated"] = True
    request.session.modified = True


def _favorite_ids(request):
    _migrate_legacy_favorites(request)
    sk = _session_key(request)
    return list(Bookmark.objects.filter(session_key=sk).values_list("tool_id", flat=True))


def _favorite_id_set(request):
    return set(_favorite_ids(request))


def _base_queryset():
    return AITool.objects.select_related("category", "ai_type").prefetch_related("tags")


def _apply_search_and_filters(request, qs):
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


def _has_active_filters(request, favorites_mode):
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


def _top_tags():
    return list(
        Tag.objects.annotate(n=Count("tools")).filter(n__gt=0).order_by("-n", "name")[:16]
    )


def _catalog_block_context(request):
    favorites_mode = request.GET.get("favorites") in ("1", "true", "yes")
    fav_set = _favorite_id_set(request)

    qs = _base_queryset()
    if favorites_mode:
        qs = qs.filter(pk__in=fav_set)
    qs = _apply_search_and_filters(request, qs)

    filtered = list(qs.order_by("name"))
    has_filters = _has_active_filters(request, favorites_mode)

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
        "top_tags": _top_tags(),
        "selected_categories": request.GET.getlist("category"),
        "selected_atypes": request.GET.getlist("atype"),
        "selected_difficulty": request.GET.get("difficulty"),
        "selected_tags": request.GET.getlist("tag"),
        "search_q": request.GET.get("q", ""),
    }


def index(request):
    _migrate_legacy_favorites(request)
    cat_ctx = _catalog_block_context(request)
    has_filters = cat_ctx["has_active_filters"]
    favorites_mode = cat_ctx["favorites_mode"]

    all_tools = list(_base_queryset().order_by("-popularity_score"))

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
    _migrate_legacy_favorites(request)
    ctx = _catalog_block_context(request)
    return render(request, "catalog/partials/catalog_main.html", ctx)


def tool_detail(request, slug):
    _migrate_legacy_favorites(request)
    tool = get_object_or_404(
        _base_queryset().prefetch_related("tutorials"),
        slug=slug,
    )
    others = list(_base_queryset().exclude(pk=tool.pk))

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

    fav_set = _favorite_id_set(request)
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
    tool = get_object_or_404(_base_queryset().prefetch_related("tags"), slug=slug)
    return render(request, "catalog/partials/tool_preview_body.html", {"tool": tool})


@require_POST
def toggle_favorite(request, pk):
    next_url = request.POST.get("next") or "/"
    sk = _session_key(request)
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
    sk = _session_key(request)
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
    _migrate_legacy_favorites(request)
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
    popular = list(_base_queryset().order_by("-popularity_score")[:8])
    trending = list(_base_queryset().order_by("-created_at", "-popularity_score")[:8])
    most_bookmarked = list(
        _base_queryset()
        .annotate(bookmark_n=Count("bookmark_entries"))
        .order_by("-bookmark_n", "-popularity_score")[:8]
    )
    total_tools = AITool.objects.count()
    total_tags = Tag.objects.filter(tools__isnull=False).distinct().count()

    fav = _favorite_id_set(request)
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
    _migrate_legacy_favorites(request)
    categories = Category.objects.annotate(n=Count("tools")).filter(n__gt=0).order_by("name")
    fav = _favorite_id_set(request)
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
    _migrate_legacy_favorites(request)
    tutorials = (
        Tutorial.objects.select_related("tool", "tool__category", "tool__ai_type")
        .order_by("tool__name", "title")
        .all()
    )
    fav = _favorite_id_set(request)
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
        _base_queryset()
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
