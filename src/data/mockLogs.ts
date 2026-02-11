import type { LogEntry } from "../types/LogEntry";

export const mockLogs: LogEntry[] = [
  {
    id: 1,
    date: "2026-02-01",
    title: "Rectenna: baseline model assumptions confirmed",
    category: "Rectenna",
    affiliation: "USJR",
    authorName: "USJR Research Team",
    content:
      "Confirmed initial rectenna equivalent-circuit assumptions and agreed to document parameter sources for reproducibility.",
    details:
      "Notes: focus is on a model that is easy to explain to supervisors first; accuracy improvements can follow once the baseline is validated.",
    images: [
      {
        src: "/mock/rectenna-figure.svg",
        alt: "Rectenna placeholder figure",
        caption: "Placeholder figure (replace with schematic/model screenshot later)."
      }
    ]
  },
  {
    id: 2,
    date: "2026-02-03",
    title: "MPPT: quick review of candidate approaches",
    category: "MPPT",
    affiliation: "OIT",
    authorName: "OIT Supervisor",
    content:
      "Reviewed P&O vs. incremental conductance at a high level; discussed how load variation might affect stability in WPT contexts.",
    details:
      "Action item: define evaluation criteria (convergence speed, ripple, implementation complexity) suitable for early prototype simulations.",
    images: [
      {
        src: "/mock/mppt-plot.svg",
        alt: "MPPT placeholder plot",
        caption: "Placeholder plot (replace with simulation results later)."
      }
    ]
  },
  {
    id: 3,
    date: "2026-02-06",
    title: "Meeting: align on weekly update format",
    category: "Meeting",
    affiliation: "USJR",
    authorName: "Coordinator",
    content:
      "Agreed that updates should read like lab notebook entries (what changed, what was tested, what’s next).",
    details:
      "Template: (1) context, (2) change/experiment, (3) result/observation, (4) next step, (5) blockers/questions."
  },
  {
    id: 4,
    date: "2026-02-08",
    title: "AI: placeholder discussion (no implementation yet)",
    category: "AI",
    affiliation: "OIT",
    authorName: "OIT Researcher",
    content:
      "Captured ideas for future AI-assisted Japanese explanation of logs; no integration planned for the prototype phase.",
    details:
      "Prototype will show a UI placeholder only; translation quality and workflows are out of scope for now."
  }
];