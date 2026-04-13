from django.urls import path

from . import views

app_name = "catalog"

urlpatterns = [
    path("", views.index, name="index"),
    path("partials/catalog/", views.catalog_partial, name="catalog_partial"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("categories/", views.categories_list, name="categories"),
    path("tutorials/", views.tutorials_list, name="tutorials"),
    path("api/search/suggest/", views.search_suggest, name="search_suggest"),
    path("tool/<slug:slug>/", views.tool_detail, name="tool_detail"),
    path("tool/<slug:slug>/preview/", views.tool_preview, name="tool_preview"),
    path("favorite/<int:pk>/toggle/", views.toggle_favorite, name="toggle_favorite"),
    path("favorite/sync/", views.sync_favorites, name="sync_favorites"),
    path("set-theme/", views.set_theme, name="set_theme"),
]
