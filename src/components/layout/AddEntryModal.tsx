import { useEffect, useMemo, useState } from "react";
import type { ResearchLog, ResearchLogAffiliation, ResearchLogCategory } from "../../types/ResearchLog";
import type { Language } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

interface Props {
  isOpen: boolean;
  language: Language;
  affiliation: ResearchLogAffiliation;
  onClose: () => void;
  onCreated: (created: ResearchLog) => void;
}

const categories: ResearchLogCategory[] = ["Rectenna", "MPPT", "AI", "Meeting", "Other"];

export function AddEntryModal({ isOpen, language, affiliation, onClose, onCreated }: Props) {
  const t = translations[language];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ResearchLogCategory>("Rectenna");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const apiUrl = useMemo(() => "http://127.0.0.1:8000/api/researchlog/", []);

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

  useEffect(() => {
    if (!isOpen) return;
    setSubmitError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label={t.close}
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl rounded-md border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t.addEntry}</h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">Adds a new entry via the local Django API.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {t.cancel}
          </button>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const cleanTitle = title.trim();
            const cleanContent = content.trim();
            if (!cleanTitle || !cleanContent) return;

            try {
              setIsSubmitting(true);
              setSubmitError(null);

              const res = await fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: cleanTitle,
                  content: cleanContent,
                  category,
                  affiliation,
                }),
              });

              if (!res.ok) {
                const text = await res.text().catch(() => "");
                throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
              }

              const created = (await res.json()) as ResearchLog;
              onCreated(created);

              setTitle("");
              setContent("");
              setCategory("Rectenna");
              onClose();
            } catch (err) {
              console.error("Failed to create research log:", err);
              setSubmitError("Could not create entry. Check the backend server and console.");
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.category}</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ResearchLogCategory)}
                className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {t.categories[c]}
                  </option>
                ))}
              </select>
            </label>

            <div className="space-y-1">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.affiliation}</span>
              <div className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                {affiliation}
              </div>
            </div>
          </div>

          <label className="space-y-1">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.title}</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
              placeholder="Short description"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.content}</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
              placeholder="Lab-notebook style note"
            />
          </label>

          {submitError ? <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p> : null}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
            >
              {isSubmitting ? "Saving…" : t.addEntry}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
