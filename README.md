# USJR × OIT Research Log System

Production-oriented research log for the USJR–OIT joint collaboration. It provides a shared, chronological “lab notebook” timeline with categories/affiliations, attachments, and a Django Admin workflow.

## Tech Stack
- Frontend: React + TypeScript (Vite) + Tailwind
- Backend: Django + Django REST Framework
- Auth: Google OAuth (Django Allauth) with allowlisted emails/domains
- Static: WhiteNoise (Django serves the built frontend in production)

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+ (recommended)

### Backend (Django)
From the repo root:

0. Set required auth env vars (recommended even in dev):
   - `OAUTH_ALLOWED_DOMAINS=oit.ac.jp,usjr.edu.ph`
   - `OAUTH_AFFILIATION_MAP=oit.ac.jp:OIT,usjr.edu.ph:USJR`

   See `backend/.env.example` for a copy/paste template.

1. Install Python dependencies:
   - `python -m pip install -r backend/requirements.txt`

2. Run migrations:
   - `python backend/manage.py migrate`

3. (Optional) Create an admin user:
   - `python backend/manage.py createsuperuser`

4. Start Django:
   - `python backend/manage.py runserver`

### Frontend

There are two common workflows:

**A) Production-like (recommended for auth):** build the frontend so Django serves it.
- `npm install`
- `npm run build`
- Visit `http://127.0.0.1:8000/`

**B) Vite dev server (UI iteration):**
- `npm install`
- `npm run dev`
- Visit `http://127.0.0.1:5173/`

Note: Google OAuth flows are handled by Django on `http://127.0.0.1:8000/`.

## Key URLs
- Timeline UI (Django-served build): `http://127.0.0.1:8000/`
- Admin: `http://127.0.0.1:8000/admin/`
- API: `http://127.0.0.1:8000/api/researchlog/`

## Docs
- See PROJECT_CONTEXT.md for the production context and deployment notes.
- See PROJECT_MUSTHAVES.md for requirements and scope guardrails.