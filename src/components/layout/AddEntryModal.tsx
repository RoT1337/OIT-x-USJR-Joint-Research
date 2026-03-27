import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import type { ResearchLog, ResearchLogAffiliation, ResearchLogCategory } from "../../types/ResearchLog";
import type { Language } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";
import { apiFetch, apiUrl } from "../../api";

interface Props {
  isOpen: boolean;
  language: Language;
  defaultAffiliation?: ResearchLogAffiliation;
  onClose: () => void;
  onCreated: (created: ResearchLog) => void;
  onToast?: (tone: "success" | "info" | "error", message: string) => void;
}

const categories: ResearchLogCategory[] = ["Rectenna", "MPPT", "AI", "Meeting", "Other"];

export function AddEntryModal({
  isOpen,
  language,
  defaultAffiliation,
  onClose,
  onCreated,
  onToast,
}: Props) {
  const t = translations[language];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [category, setCategory] = useState<ResearchLogCategory>("Rectenna");
  const affiliation: ResearchLogAffiliation = defaultAffiliation ?? "USJR";
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const endpoint = useMemo(() => apiUrl("/api/researchlog/"), []);

  async function uploadAttachments(logId: number, selected: File[]): Promise<boolean> {
    if (selected.length === 0) return true;

    let ok = true;
    const uploadUrl = apiUrl(`/api/researchlog/${logId}/attachments/`);

    for (const file of selected) {
      const form = new FormData();
      form.append("file", file);
      const response = await apiFetch(uploadUrl, {
        method: "POST",
        body: form,
      });
      if (!response.ok) {
        ok = false;
      }
    }

    return ok;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanContent = content.trim();
    if (!cleanTitle) {
      setTitleError(t.titleRequired);
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setTitleError(null);

      const response = await apiFetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          content: cleanContent,
          category,
          affiliation,
          categories: [category],
          affiliations: [affiliation],
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || `HTTP ${response.status} ${response.statusText}`);
      }

      const created = (await response.json()) as ResearchLog;
      const attachmentsOk = await uploadAttachments(created.id, files);

      // Fetch the final log (includes attachment URLs).
      let finalLog = created;
      try {
        const detail = await apiFetch(apiUrl(`/api/researchlog/${created.id}/`), { method: "GET" });
        if (detail.ok) {
          finalLog = (await detail.json()) as ResearchLog;
        }
      } catch {
        // If detail fetch fails, still proceed with the created entry.
      }

      onCreated(finalLog);
      if (!attachmentsOk && files.length > 0) {
        onToast?.("error", t.toastAttachmentUploadFailed);
      }

      setTitle("");
      setContent("");
      setCategory("Rectenna");
      setFiles([]);
      onClose();
    } catch (err) {
      console.error("Failed to create research log:", err);
      setSubmitError(t.toastEntryCreateFailed);
      onToast?.("error", t.toastEntryCreateFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

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
    setTitleError(null);
    setFiles([]);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    // Affiliation is read-only once logged in.
  }, [isOpen, defaultAffiliation]);

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
          onSubmit={handleSubmit}
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
              <div className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
                {affiliation}
              </div>
            </div>
          </div>

          <label className="space-y-1">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.title}</span>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError(null);
              }}
              className={
                titleError
                  ? "w-full rounded-md border border-red-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-red-900/60 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                  : "w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
              }
              placeholder={t.titlePlaceholder}
            />
            {titleError ? (
              <p className="text-xs text-red-700 dark:text-red-300">{titleError}</p>
            ) : null}
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.content}</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500"
              placeholder={t.contentPlaceholder}
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.attachments}</span>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border file:border-zinc-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-zinc-900 hover:file:bg-zinc-50 dark:text-zinc-200 dark:file:border-zinc-800 dark:file:bg-zinc-900 dark:file:text-zinc-50 dark:hover:file:bg-zinc-800"
            />
          </label>

          {submitError ? <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p> : null}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-60 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100 dark:hover:bg-emerald-950/50"
            >
              <span className="inline-flex items-center gap-2">
                {isSubmitting ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-300 border-t-emerald-900 dark:border-emerald-900/40 dark:border-t-emerald-100"
                    aria-hidden="true"
                  />
                ) : null}
                {isSubmitting ? t.saving : t.addEntry}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
