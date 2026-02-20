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

### Attachments
- Log entries can have file attachments (e.g., screenshots, PDFs)
- Attachments are downloadable
- Image attachments are previewed in the timeline UI (limited preview count per entry)

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
- Real authentication and role-based permissions
- Public uploads without authentication
- Full CMS features (comments, threads, messaging)
- Real-time collaboration

## Near-Term Roadmap (Planned)
- Weekly sub-filter within a selected month
- Multiple tags (multi-select fixed list) for category and affiliation (requires backend schema update)

## Auth-Gated Roadmap (Blocked Until Real Auth)
- OAuth login with allowlisted emails
- Affiliation-based edit permissions
- Frontend attachment uploads alongside Add Entry
