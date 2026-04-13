# AI Tools Digital Library

A small web catalog for AI tools and related tutorials. Users browse entries, filter and search the collection, bookmark tools for their current session, and open a dashboard with simple charts. Content is managed through Django admin; demo data can be loaded from a JSON seed.

## Tech stack

- Python, **Django 5**
- **SQLite**
- **Bootstrap 5**, custom CSS, **Chart.js** (CDN)
- Server-rendered HTML templates

## Key features

- **Catalog** — List and detail pages for each tool (description, extended text, external link, optional image/preview, difficulty, format metadata).
- **Taxonomy** — Organize tools by **category**, **AI type** (e.g. use case), and **tags**; filter from the catalog sidebar.
- **Search** — Query across names, descriptions, keywords, tags, categories, and types; multi-word queries match each token.
- **Tutorials** — Attach tutorial links and short descriptions to a tool on its detail page.
- **Bookmarks** — Star tools; favorites are stored **per session** (server-side, keyed to the session cookie) and listed on the dashboard.
- **Dashboard** — Charts such as tool counts by category or type.
- **Admin & seed** — CRUD for catalog models; `seed_ai_library` imports sample content from `catalog/data/ai_tools_seed.json`.

## Highlights

- **Service layer** (`catalog/services/`) holds filter/search logic and favorites helpers so views stay small.
- **`SearchIndex` model** — Denormalized keywords and full text per tool; **signals** refresh the index when a tool or its tags change.
- **Query tuning** — Tool querysets use `select_related` / `prefetch_related` where it matters for list views.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_ai_library
python manage.py runserver
```

- App: http://127.0.0.1:8000/  
- Dashboard: http://127.0.0.1:8000/dashboard/

Create an admin user with `python manage.py createsuperuser`, then open `/admin/` to manage categories, types, tags, tools, and search index rows.
