# USJR × OIT Research Log System

Production-oriented research log for the USJR–OIT joint collaboration. It provides a shared, chronological “lab notebook” timeline with categories/affiliations, attachments, and a Django Admin workflow.

## Tech Stack
- Frontend: React + TypeScript (Vite) + Tailwind
- Backend: Django + Django REST Framework
- Auth: Google + Microsoft OAuth (Django Allauth) with allowlisted emails/domains
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
- Visit `http://localhost:5173/`

For OAuth in dev when using the Vite server, ensure the frontend points at Django using `http://localhost:8000` (not `127.0.0.1`), otherwise Azure will reject the redirect URI.
Set `VITE_API_BASE=http://localhost:8000` in `.env.development.local`.

Note: OAuth flows (Google/Microsoft) are handled by Django on `http://localhost:8000/`.

Access note: The timeline (and attachments) require login; anonymous read access is disabled.

## Microsoft OAuth (Azure/Entra) Setup

This project uses `django-allauth`'s Microsoft provider.

### 1) Create an App Registration
In Azure Portal → **Microsoft Entra ID** → **App registrations** → **New registration**.

### 2) Add Redirect URIs
In App Registration → **Authentication** → **Add a platform** → **Web**:

- Local dev: `http://localhost:8000/accounts/microsoft/login/callback/`
- Production: `https://<your-domain>/accounts/microsoft/login/callback/`

### 3) Create a Client Secret
In **Certificates & secrets** → **New client secret**.

### 4) Add Graph Permission
In **API permissions** → **Add a permission** → **Microsoft Graph** → **Delegated permissions**:
- `User.Read`

### 5) Configure Django SocialApp
In Django Admin (`/admin/`) → **Social applications** → **Add**:
- Provider: **Microsoft**
- Client id: **Application (client) ID** from Azure (a GUID like `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`)
- Secret key: **Client secret VALUE** from Azure (shown once when you create it; NOT the “Secret ID”)
- Sites: add your active Site (controlled by `SITE_ID`)

Dev note: In Django Admin → **Sites**, ensure the Site domain matches the hostname you use in the browser (e.g. `localhost:8000`). Mixing `127.0.0.1` and `localhost` commonly causes allauth “Third-Party Login Failure”.

If you see `AADSTS700016` and the “application identifier” looks like `xxxx~xxxx...`, you likely pasted the **client secret** into the **Client id** field, or you’re signing into a different tenant than where the app was registered.

Once configured, the frontend login modal will offer both Google and Microsoft sign-in.

## Key URLs
- Timeline UI (Django-served build): `http://localhost:8000/`
- Admin: `http://localhost:8000/admin/`
- API: `http://localhost:8000/api/researchlog/`

## Docs
- See PROJECT_CONTEXT.md for the production context and deployment notes.
- See PROJECT_MUSTHAVES.md for requirements and scope guardrails.