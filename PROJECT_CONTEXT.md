# USJR × OIT Research Log System – Project Context (Production)

## Purpose
The **USJR × OIT Research Log System** is a production-oriented web application for the USJR–OIT joint research collaboration.
Its purpose is to provide a **shared, chronological lab-notebook style record** of research progress and decisions related to:

- Wireless Power Transfer (WPT)
- Rectenna modeling
- MPPT studies

The system prioritizes **clarity**, **scanability**, and **persistence** so supervisors can review progress quickly.

## Users
- USJR student researchers (Computer Science background)
- OIT professors and research staff
- Mixed technical background (CS + Electrical Engineering)
- English-first, with Japanese accessibility planned

## Current Product Capabilities
### Research Log
- Create/view/update research log entries (CRUD)
- Categories and affiliation metadata
- Chronological timeline view (primary interface)
- Author attribution (entries record the creating user when authenticated)
- Content is optional (title remains required)

### Authentication & Permissions
- Google OAuth via Django Allauth (allowlisted emails/domains)
- Session-based SPA auth (`/api/me/`, `/api/logout/`, CSRF helpers)
- API policy:
  - Anyone can read
  - Create/update requires login
  - Delete is admin-only
- Affiliation-based edit permissions (configure `OAUTH_AFFILIATION_MAP` for strict enforcement)

### Attachments
- Log entries can have file attachments (e.g., screenshots, PDFs)
- Attachments are downloadable
- Image attachments are previewed in the timeline UI (limited preview count per entry)
- Authenticated users can upload attachments from the frontend when creating an entry

### Administration
- Django Admin is the primary content management interface
- Admin can manage entries and related attachments

## Deployment & Operations
- Hosted on **Render**
- Frontend (React/Vite build) and backend (Django/DRF) are served from the **same origin** in production
- Static frontend assets are served via Django + WhiteNoise
- File attachments are stored on the server filesystem at `MEDIA_ROOT`
  - In production, `MEDIA_ROOT` must point to a **writable** location (preferably a Render Persistent Disk mount)

## Tech Stack
- Frontend: React + TypeScript (Vite)
- Styling: Tailwind CSS (academic, minimal)
- Backend: Django + Django REST Framework
- Static serving: WhiteNoise
- Database: PostgreSQL in production (SQLite acceptable for development)

## Scope Guardrails
### In Scope
- Academic research-log presentation and filtering
- Admin-managed content workflows
- Attachments for supporting research artifacts

### Out of Scope (for now)
- Public uploads without authentication
- Full CMS features (comments, threads, messaging)
- Real-time collaboration

## Near-Term Roadmap
- Weekly sub-filter within a selected month (**implemented**)
- Multiple tags (multi-select fixed list) for category and affiliation (**implemented**)

## Auth-Gated Roadmap
- OAuth login with allowlisted emails (**implemented**)
- Affiliation-based edit permissions (**implemented**; configure `OAUTH_AFFILIATION_MAP`)
- Frontend attachment uploads alongside Add Entry (**implemented**)
