import json

from django import template
from django.utils.html import escape
from django.utils.safestring import mark_safe

register = template.Library()


@register.simple_tag(takes_context=True)
def toggle_list_param(context, key, value):
    request = context["request"]
    q = request.GET.copy()
    vals = q.getlist(key)
    s = str(value)
    if s in vals:
        q.setlist(key, [v for v in vals if v != s])
    else:
        q.appendlist(key, s)
    return "?" + q.urlencode()


@register.simple_tag(takes_context=True)
def toggle_difficulty(context, value):
    request = context["request"]
    q = request.GET.copy()
    current = q.get("difficulty")
    if current == str(value):
        q.pop("difficulty", None)
    else:
        q["difficulty"] = str(value)
    return "?" + q.urlencode()


@register.simple_tag(takes_context=True)
def without_keys(context, *keys):
    q = context["request"].GET.copy()
    for k in keys:
        q.pop(k, None)
    return "?" + q.urlencode()


@register.filter
def first_word(value):
    if not value:
        return ""
    parts = str(value).split()
    return parts[0] if parts else str(value)


@register.filter
def json_pp(value):
    if value is None:
        return ""
    return mark_safe(json.dumps(value, indent=2, ensure_ascii=False))


@register.filter
def split_csv(value):
    if not value:
        return []
    return [x.strip() for x in str(value).split(",") if x.strip()]


@register.filter
def highlight(text, q):
    """Wrap first case-insensitive occurrence of query in <mark class='search-hit'>."""
    if text is None:
        return ""
    text = str(text)
    if q is None:
        return escape(text)
    q = str(q).strip()
    if not q:
        return escape(text)
    low = text.lower()
    lq = q.lower()
    pos = low.find(lq)
    if pos == -1:
        return escape(text)
    out = []
    out.append(escape(text[:pos]))
    out.append(f'<mark class="search-hit">{escape(text[pos : pos + len(q)])}</mark>')
    out.append(escape(text[pos + len(q) :]))
    return mark_safe("".join(out))


@register.filter
def preview_url(tool):
    """Resolve preview image: external URL or static previews path."""
    from django.conf import settings
    from django.templatetags.static import static

    if tool.image:
        return tool.image
    if tool.preview_file:
        return static(f"catalog/previews/{tool.preview_file}")
    return ""
