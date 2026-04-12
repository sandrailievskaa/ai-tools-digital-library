# Digital library of AI tools and tutorials

A small catalog site: browse tools, filter by category/type/tags, search, save favorites, and see simple charts on the dashboard.

## Setup

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_ai_library
python manage.py runserver
```

Open http://127.0.0.1:8000/ — charts at http://127.0.0.1:8000/dashboard/

## Project layout

- `config/` — Django settings and root URLs  
- `catalog/` — app: `models.py`, `views.py`, `urls.py`, `admin.py`  
- `catalog/services/` — catalog filters/search context and session favorites (keeps views thin)  
- `catalog/templates/` — pages and partials  
- `static/catalog/` — CSS, JS, optional preview images  
- `catalog/data/ai_tools_seed.json` — seed data for `seed_ai_library`

## Admin

```bash
python manage.py createsuperuser
```
Username: admin
Email address: admin@yahoo.com
Password: admin123

http://127.0.0.1:8000/admin/ — manage `Category`, `AIType`, `Tag`, `AITool`, `SearchIndex`.

## Features

- **Catalog** — list AI tools and tutorials with short descriptions and detail pages.
- **Filters** — narrow by category, AI type, and tags (sidebar).
- **Search** — query the catalog from the header or home.
- **Favorites** — bookmark tools in the session and revisit them from the dashboard.
- **Dashboard** — simple charts (e.g. tools per category / type).   
- **Admin** — add or edit catalog entries and search index rows.
- **Seed data** — `seed_ai_library` loads demo content from `catalog/data/ai_tools_seed.json`.

## Stack

Django 5, SQLite, Bootstrap 5, custom `saas.css`, Chart.js (CDN).
