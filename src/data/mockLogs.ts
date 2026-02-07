import type { LogEntry } from "../types/LogEntry";

export const mockLogs: LogEntry[] = [
  {
    id: 1,
    date: "2026-02-01",
    title: "Initial Rectenna Modeling Discussion",
    category: "Rectenna",
    author: "USJR",
    content: "Discussed system-level rectenna modeling approach."
  },
  {
    id: 2,
    date: "2026-02-03",
    title: "MPPT Algorithm Review",
    category: "MPPT",
    author: "OIT",
    content: "Reviewed P&O and adaptive MPPT strategies."
  }
];