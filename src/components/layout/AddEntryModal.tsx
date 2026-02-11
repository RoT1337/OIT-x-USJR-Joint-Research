import { useEffect, useMemo, useState } from "react";
import type { Affiliation, LogEntry, ResearchCategory } from "../../types/LogEntry";

interface Props {
  isOpen: boolean;
  affiliation: Affiliation | null;
  onClose: () => void;
  onAdd: (entry: Omit<LogEntry, "id">) => void;
  onRequestLogin: () => void;
}

const categories: ResearchCategory[] = ["Rectenna", "MPPT", "AI", "Meeting"];

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddEntryModal({ isOpen, affiliation, onClose, onAdd, onRequestLogin }: Props) {
  const defaultDate = useMemo(() => todayIsoDate(), []);

  const [date, setDate] = useState(defaultDate);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ResearchCategory>("Rectenna");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Add entry"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Close add entry"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add to Timeline</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              Adds a new entry to the current session timeline (mock-only; no backend).
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
        </div>

        {!affiliation ? (
          <div className="mt-5 rounded-md border border-zinc-200 bg-white p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
            <p>Please use the mock login first to select an affiliation.</p>
            <button
              type="button"
              onClick={onRequestLogin}
              className="mt-3 inline-flex items-center rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Open login
            </button>
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
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
                authorName: authorName.trim() ? authorName.trim() : undefined,
                content: cleanContent,
                details: details.trim() ? details.trim() : undefined,
              });

              setTitle("");
              setAuthorName("");
              setContent("");
              setDetails("");
              onClose();
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
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">Author name (optional)</span>
              <input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g., USJR Research Team"
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

            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Affiliation: {affiliation}</p>
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
              >
                Add entry
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
