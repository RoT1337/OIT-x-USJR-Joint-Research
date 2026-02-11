# USJR × OIT Research Log (Prototype)

## Overview
This project is a **prototype web application** developed as part of the **USJR–OIT Joint Research Collaboration**.

The goal of the application is to provide a **shared, visual research activity log** that allows students and professors to:
- track ongoing research progress,
- review recent updates at a glance,
- and maintain alignment across institutions during an exploratory research phase.

This is an **internal academic coordination tool**, not a public-facing product.

---

## What This Prototype Demonstrates
- A **timeline-style research log** showing recent updates
- Clear metadata for each entry:
  - date
  - research category (e.g., Rectenna, MPPT, AI, Meetings)
  - affiliation (USJR / OIT)
- Emphasis on **scanability** and clarity for supervisors
- A placeholder for **AI-assisted Japanese translation** (UI only, no real translation yet)

> Note: All data is currently **mock data** for demonstration purposes.

---

## Project Scope (Current Phase)
### Included
- React + TypeScript frontend
- Timeline feed of research log entries
- Simple sorting (newest ↔ oldest)
- Clean, academic-style UI

### Not Included (By Design)
- Authentication or user accounts
- Backend or database
- Hardware data integration
- Real AI or translation APIs
- Full documentation or CMS features

These may be explored in later phases.

---

## Tech Stack
- **Frontend:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (academic, minimal; neutral palette)
- **Data:** Local mock data (no backend)

---

## Installation & Running Locally

### Prerequisites
- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js)

Check your versions:
```bash
node -v
npm -v

```

---

## Setup Steps

1. Clone the repository:

  ```bash
  git clone <repository-url>
  cd usjr-oit-research-log
  ```

2. Install dependencies:

  ```bash
  npm install
  ```

  If you're on Windows PowerShell and you get an error like “running scripts is disabled”, use:

  ```bash
  npm.cmd install
  ```

3. Start the development server:

  ```bash
  npm run dev
  ```

  Windows PowerShell fallback:

  ```bash
  npm.cmd run dev
  ```

4. Open your browser and go to:

  - http://localhost:5173

---

## Common Commands

- Dev server: `npm run dev` (PowerShell fallback: `npm.cmd run dev`)
- Production build: `npm run build` (PowerShell fallback: `npm.cmd run build`)
- Preview production build: `npm run preview` (PowerShell fallback: `npm.cmd run preview`)

---

## Notes for Teammates

- Tailwind CSS is already configured; you should not need to install anything beyond `npm install`.
- Data is mock-only (no backend). Research log entries live in `src/data/mockLogs.ts` and types in `src/types/LogEntry.ts`.

---

## Intended Audience
- USJR student researchers (Computer Science background)
- OIT professors and research staff
- Mixed CS / Electrical Engineering audience
- English-first, with consideration for Japanese accessibility

---

## Development Notes
- This project prioritizes clarity over complexity
- Features are intentionally limited to avoid scope creep
- Architecture is designed to be extendable later if needed