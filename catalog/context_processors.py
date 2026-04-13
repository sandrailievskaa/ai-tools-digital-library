def theme(request):
    t = request.COOKIES.get("theme", "light")
    if t not in ("light", "dark"):
        t = "light"
    return {
        "bootstrap_theme": t,
        "html_theme_class": "dark" if t == "dark" else "",
    }


def favorite_slugs(request):
    if not getattr(request, "session", None):
        return {"favorite_slugs": []}
    if not request.session.session_key:
        request.session.create()
    sk = request.session.session_key
    from catalog.models import Bookmark

    slugs = list(Bookmark.objects.filter(session_key=sk).values_list("tool__slug", flat=True))
    return {"favorite_slugs": slugs}
