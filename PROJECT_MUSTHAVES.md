
Description
This project is a web-based prototype intended to support the USJR–OIT joint research collaboration by providing a shared platform to log, track, and visualize research activities, updates, and discussions. The system focuses on clarity, scanability, and ease of understanding for supervisors and collaborators involved in interdisciplinary research on Wireless Power Transfer, Rectenna Modeling, and MPPT-related topics. The platform is designed as an internal academic coordination tool rather than a production system.

MUST-HAVES
Actors
- USJR Researchers / Supervisor
- OIT Researcher / Supervisor

Architecture
Frontend
- Web-based interface for viewing research updates and activity logs
- Timeline-style feed emphasizing recent changes and progress
- Clean, academic-style UI focused on readability and scanability

Backend
- None for this phase (mock data only)

Research Log Entries - Rob
- Each entry must include:
  - Date of update
  - Title or short description
  - Research category (Rectenna, MPPT, AI, Meeting)
  - Affiliation / author (USJR or OIT)
  - Content text (short notes or expandable details)
- Entries should resemble lab notebook updates rather than finalized reports

Timeline / Activity Feed - KC
- Display research entries in chronological order
- Default view shows most recent updates first
- Optional toggle to sort newest-to-oldest or oldest-to-newest
- Layout should allow a supervisor to understand recent activity quickly

Scanability & Readability - KC
- Clear visual separation between log entries
- Minimal use of color and UI elements
- Typography and spacing like academic reports or technical documents

Basic Interaction - Rob
- Optional expand / collapse control for each entry
- No complex filtering or navigation in the MVP

Mock Data Usage
- All research entries stored as local mock data
- Data structure should be easy to replace with a backend in future phases

AI-Assisted Japanese Translation (Placeholder)
- UI placeholder indicating future AI-assisted Japanese translation
- No real translation or AI integration required for this phase

Explicit Non-Goals (Out of Scope)
- User authentication or access control
- Real-time collaboration features
- Hardware, sensor, or simulation data integration
- Full internationalization system
- Production deployment or optimization

Success Criteria
- Research progress can be understood at a glance
- Recent updates and changes are clearly visible
- Both USJR and OIT contributions are distinguishable
- System structure appears extendable without implementing extensions