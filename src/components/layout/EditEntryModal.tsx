import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Language } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";
import { apiFetch, apiUrl } from "../../api";
import type { LogEntry, ResearchCategory } from "../../types/LogEntry";
import type { ResearchLog } from "../../types/ResearchLog";

interface Props {
  isOpen: boolean;
  language: Language;
  entry: LogEntry | null;
  onClose: () => void;
  onUpdated: (updated: ResearchLog) => void;
  onToast?: (tone: "success" | "info" | "error", message: string) => void;
}

const categories: ResearchCategory[] = ["Rectenna", "MPPT", "AI", "Meeting", "Other"];

export function EditEntryModal({
  isOpen,
  language,
  entry,
  onClose,
  onUpdated,
  onToast,
}: Props) {
  const t = translations[language];

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [category, setCategory] = useState<ResearchCategory>("Rectenna");
  const [filesToAdd, setFilesToAdd] = useState<File[]>([]);
  const [attachmentIdsToRemove, setAttachmentIdsToRemove] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const attachments = entry?.attachments ?? [];

  const getFilename = (url: string) => {
    try {
      const cleaned = url.split("?")[0].split("#")[0];
      const parts = cleaned.split("/").filter(Boolean);
      const last = parts[parts.length - 1] ?? "file";
      return decodeURIComponent(last);
    } catch {
      return "file";
    }
  };

  useEffect(() => {
    if (!isOpen || !entry) return;
    setTitle(entry.title ?? "");
    setContent(entry.content ?? "");
    setCategory(entry.category ?? "Rectenna");
    setTitleError(null);
    setSubmitError(null);
    setFilesToAdd([]);
    setAttachmentIdsToRemove(new Set());
  }, [isOpen, entry]);

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

  if (!isOpen || !entry) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!entry) return;
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

      const endpoint = apiUrl(`/api/researchlog/${entry.id}/`);

      const response = await apiFetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: cleanTitle,
          content: cleanContent,
          category,
          categories: [category],
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          onToast?.("error", t.toastEntryEditForbidden);
          return;
        }
        const text = await response.text().catch(() => "");
        throw new Error(text || `HTTP ${response.status} ${response.statusText}`);
      }

      // Apply attachment removals (if any) and new uploads (if any).
      const removeIds = Array.from(attachmentIdsToRemove);
      let attachmentsOk = true;

      for (const attachmentId of removeIds) {
        const del = await apiFetch(apiUrl(`/api/attachments/${attachmentId}/`), {
          method: "DELETE",
        });
        if (!del.ok) attachmentsOk = false;
      }

      if (filesToAdd.length > 0) {
        const uploadUrl = apiUrl(`/api/researchlog/${entry.id}/attachments/`);
        for (const file of filesToAdd) {
          const form = new FormData();
          form.append("file", file);
          const up = await apiFetch(uploadUrl, { method: "POST", body: form });
          if (!up.ok) attachmentsOk = false;
        }
      }

      // Fetch the final log (includes attachment URLs) and update app state.
      let finalLog: ResearchLog | null = null;
      try {
        const detail = await apiFetch(apiUrl(`/api/researchlog/${entry.id}/`), { method: "GET" });
        if (detail.ok) {
          finalLog = (await detail.json()) as ResearchLog;
          onUpdated(finalLog);
        }
      } catch {
        // ignore
      }

      if (!attachmentsOk) {
        onToast?.("error", t.toastAttachmentEditFailed);
      }

      onToast?.("success", t.toastEntryUpdated);
      onClose();
    } catch (err) {
      console.error("Failed to update research log:", err);
      setSubmitError(t.toastEntryUpdateFailed);
      onToast?.("error", t.toastEntryUpdateFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{t.editEntry}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
          >
            {t.cancel}
          </button>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-1">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.category}</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ResearchCategory)}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {t.categories[c]}
                </option>
              ))}
            </select>
          </label>

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
            {titleError ? <p className="text-xs text-red-700 dark:text-red-300">{titleError}</p> : null}
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

          <div className="space-y-2">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{t.attachments}</span>

            {attachments.length > 0 ? (
              <ul className="space-y-1">
                {attachments.map((a) => {
                  const url = a.file_url;
                  if (!url) return null;
                  const filename = getFilename(url);
                  const pendingRemove = attachmentIdsToRemove.has(a.id);
                  return (
                    <li key={a.id} className="flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950">
                      <div className="min-w-0">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className={
                            pendingRemove
                              ? "truncate text-zinc-400 line-through dark:text-zinc-500"
                              : "truncate text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-200"
                          }
                        >
                          {filename}
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setAttachmentIdsToRemove((prev) => {
                            const next = new Set(prev);
                            if (next.has(a.id)) next.delete(a.id);
                            else next.add(a.id);
                            return next;
                          })
                        }
                        className={
                          pendingRemove
                            ? "shrink-0 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
                            : "shrink-0 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-sm font-medium text-red-900 hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-100 dark:hover:bg-red-950/50"
                        }
                      >
                        {pendingRemove ? t.undo : t.remove}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{t.noAttachments}</p>
            )}

            <input
              type="file"
              multiple
              onChange={(e) => setFilesToAdd(Array.from(e.target.files ?? []))}
              className="block w-full text-sm text-zinc-700 file:mr-3 file:rounded-md file:border file:border-zinc-200 file:bg-white file:px-3 file:py-1.5 file:text-sm file:text-zinc-900 hover:file:bg-zinc-50 dark:text-zinc-200 dark:file:border-zinc-800 dark:file:bg-zinc-900 dark:file:text-zinc-50 dark:hover:file:bg-zinc-800"
            />
          </div>

          {submitError ? <p className="text-sm text-red-700 dark:text-red-300">{submitError}</p> : null}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-sm font-medium text-sky-900 hover:bg-sky-100 disabled:opacity-60 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100 dark:hover:bg-sky-950/50"
            >
              {isSubmitting ? t.saving : t.saveChanges}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
