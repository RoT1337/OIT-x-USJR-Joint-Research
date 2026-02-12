# Project MUST-HAVES

## Naming & Phase Terminology

To avoid confusion between earlier mock-only work and the current build:

- **Prototype**: *USJR × OIT Research Log Prototype* (mock data, UI/UX validation, no backend)
- **Project**: *USJR × OIT Research Log System* (persistent backend + deployable web system)

This document describes the **Project** requirements.

## 1) Project Description

The **USJR × OIT Research Log System** is a web-based academic collaboration platform designed to document, track, and visualize the evolution of research activities related to **Wireless Power Transfer (WPT)**, **Rectenna Modeling**, and **MPPT** studies.

This system serves as shared research infrastructure supporting interdisciplinary collaboration between computer science and electrical engineering researchers. It prioritizes **clarity**, **persistence**, and **structured documentation** over task management or workflow tracking.

## 2) System Objectives

The system must:

- Persist research entries in a database
- Provide structured documentation of modeling decisions and experimental findings
- Allow authorized contributors to add and edit research entries
- Present research progression in a clear, chronological format
- Remain academically styled and supervisor-friendly
- Be deployable and accessible over the web

## 3) Core Functional Requirements

### 3.1) Research Log Entry Management (CRUD)

The system must allow:

- Create research entries
- View research entries
- Update research entries
- Delete research entries (**admin-level only**)

Each entry must include:

- Title
- Content (detailed research note)
- Category (Rectenna, MPPT, AI, Meeting, Other)
- Affiliation (USJR or OIT)
- Created timestamp
- Updated timestamp

Entries represent **research documentation**, not tasks.

### 3.2) Timeline / Chronological View

- Entries must be displayed in chronological order
- Default sorting: newest first
- Optional toggle: newest ↔ oldest
- Clear visual separation between entries
- Emphasis on scanability

The timeline is the **primary interface**.

### 3.3) Administrative Interface

- Django Admin must be enabled
- Authorized users must be able to manage entries via admin panel
- Admin is acceptable for early-stage content management
- Custom frontend editing UI is optional in future phases

### 3.4) Backend Infrastructure

- Django backend
- REST API for research entries
- Persistent database (PostgreSQL preferred; SQLite acceptable during development)
- Proper model structure for research logs
- No complex relationships required at this stage

### 3.5) Frontend Integration

- React + TypeScript frontend
- Communicates with Django API
- No mock data in production
- Clean academic UI
- Minimal color palette
- No unnecessary UI frameworks

### 3.6) Deployment

- System must be publicly accessible via stable URL
- Unified deployment preferred (Django serving React build)
- Hosting platform: Render (recommended)
- HTTPS required
- No enterprise infrastructure required

## 4) Access Control (Initial Policy)

Initial stage:

- Editing restricted to authorized researchers
- Viewing may remain public or semi-public depending on research sensitivity
- No complex role hierarchy
- Advanced authentication (e.g., institutional SSO) is out of scope for this phase

## 5) Explicit Non-Goals (Current Phase)

The following are intentionally excluded:

- Task management features
- Kanban boards
- Comment threads
- File uploads
- Version control integration
- Real-time collaboration
- Messaging systems
- Analytics dashboards
- Performance optimization beyond reasonable standards
- Mobile application development

This system is a **structured academic log**, not a project management platform.

## 6) Success Criteria

The project is considered successful if:

- Research entries persist reliably in the database
- Professors can review recent research activity in under one minute
- The interface clearly communicates research progression
- The system is usable without technical explanation
- Deployment is stable and accessible to both USJR and OIT

## 7) Long-Term Extensibility (Future Consideration Only)

Potential future expansions:

- Role-based access control
- Entry tagging system
- File attachment support (e.g., simulation outputs)
- Research summary exports (PDF)
- AI-assisted summary generation
- Visualization of research trends
- Multi-project support

These are not required for current implementation.

## 8) Design Philosophy

The system must embody:

- Academic clarity
- Structural simplicity
- Intentional restraint
- Cross-disciplinary accessibility
- Sustainable architecture

It must feel like a shared **lab notebook**, not a startup dashboard.