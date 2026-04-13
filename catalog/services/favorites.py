from ..models import Bookmark


def ensure_session_key(request):
    if not request.session.session_key:
        request.session.create()
    return request.session.session_key


def migrate_legacy_favorites(request):
    if request.session.get("_fav_migrated"):
        return
    raw = request.session.get("favorites")
    if isinstance(raw, list) and raw:
        sk = ensure_session_key(request)
        for x in raw:
            if str(x).isdigit():
                try:
                    Bookmark.objects.get_or_create(session_key=sk, tool_id=int(x))
                except Exception:
                    pass
        request.session.pop("favorites", None)
    request.session["_fav_migrated"] = True
    request.session.modified = True


def favorite_tool_ids(request):
    migrate_legacy_favorites(request)
    sk = ensure_session_key(request)
    return list(Bookmark.objects.filter(session_key=sk).values_list("tool_id", flat=True))


def favorite_tool_id_set(request):
    return set(favorite_tool_ids(request))
