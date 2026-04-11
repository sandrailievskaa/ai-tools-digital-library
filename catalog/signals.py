from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from .models import AITool
from .search_utils import refresh_search_index


@receiver(post_save, sender=AITool)
def aitool_post_save(sender, instance: AITool, **kwargs):
    if kwargs.get("raw"):
        return
    refresh_search_index(instance)


@receiver(m2m_changed, sender=AITool.tags.through)
def aitool_tags_changed(sender, instance, action, **kwargs):
    if action in ("post_add", "post_remove", "post_clear") and isinstance(instance, AITool):
        refresh_search_index(instance)
