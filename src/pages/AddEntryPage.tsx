import { useMemo, useState } from "react";
import type { Affiliation, LogEntry, ResearchCategory } from "../types/LogEntry";

interface Props {
  affiliation: Affiliation | null;
  onAdd: (entry: Omit<LogEntry, "id">) => void;
  onGoToLogin: () => void;
}

const categories: ResearchCategory[] = ["Rectenna", "MPPT", "AI", "Meeting"];

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddEntryPage({ affiliation, onAdd, onGoToLogin }: Props) {
  const defaultDate = useMemo(() => todayIsoDate(), []);

  const [date, setDate] = useState(defaultDate);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ResearchCategory>("Rectenna");
  const [content, setContent] = useState("");
  const [details, setDetails] = useState("");

  if (!affiliation) {
    return (
      <div className="max-w-xl">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add to Timeline</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Please use the mock login first to select an affiliation.
        </p>
        <button
          type="button"
          onClick={onGoToLogin}
          className="mt-4 inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <header>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add to Timeline</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Adds a new entry to the current session timeline (mock-only; no backend).
        </p>
      </header>

      <form
        className="mt-6 space-y-4 rounded-md border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        onSubmit={(e) => {
          e.preventDefault();

          const cleanTitle = title.trim();
          const cleanContent = content.trim();
          if (!cleanTitle || !cleanContent) return;

          onAdd({
            date,
            title: cleanTitle,
            category,
            affiliation,
            content: cleanContent,
            details: details.trim() ? details.trim() : undefined,
          });

          setTitle("");
          setContent("");
          setDetails("");
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResearchCategory)}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short description of the update"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Content</span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Lab-notebook style notes (what changed / what was observed / what’s next)"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Details (optional)</span>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            placeholder="Optional extra details (expand/collapse)"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 hover:bg-sky-100 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
          >
            Add entry
          </button>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Affiliation: {affiliation}</p>
        </div>
      </form>
    </div>
  );
}
