# Digital Library of AI Tools & Tutorials

Django digital-library app: curated **AI tools** with structured metadata, faceted filters, session **favorites**, a **SearchIndex** layer, and a small **dashboard** (Chart.js). UI targets a modern SaaS look (Notion / Vercel / Linear) with light/dark mode.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_ai_library
python manage.py runserver
```

Open http://127.0.0.1:8000/ — dashboard at `/dashboard/`.

## Data

Seed JSON: `catalog/data/ai_tools_seed.json`. Optional preview files: `static/catalog/previews/` (e.g. `figma.png`); cards fall back to initials if missing.

## Admin

```bash
python manage.py createsuperuser
```

http://127.0.0.1:8000/admin/ — manage `Category`, `AIType`, `Tag`, `AITool`, `SearchIndex`.

## Stack

Django 5, SQLite, Bootstrap 5 (grid + collapse), custom `saas.css`, Chart.js (CDN).
