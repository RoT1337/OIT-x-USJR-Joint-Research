import { useEffect, useMemo, useState } from "react";
import type { Affiliation, LogEntry, ResearchCategory } from "../../types/LogEntry";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

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
  const { language } = useLanguage();
  const t = translations[language];

  const [date, setDate] = useState(defaultDate);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ResearchCategory>("Rectenna");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-md border bg-white p-5 shadow-sm dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">{t.addEntry}</h2>
            <p className="mt-1 text-sm">{t.addEntryDescription}</p>
          </div>
          <button onClick={onClose} className="rounded-md border px-2.5 py-1.5 text-sm">
            {t.cancel}
          </button>
        </div>

        {!affiliation ? (
          <div className="mt-5 text-sm">
            <p>{t.mustLoginFirst}</p>
            <button onClick={onRequestLogin} className="mt-3 rounded-md border px-3 py-1.5 text-sm">
              {t.openLogin}
            </button>
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim() || !content.trim()) return;

              onAdd({
                date,
                title: title.trim(),
                category,
                affiliation,
                authorName: authorName.trim() || undefined,
                content: content.trim(),
                details: details.trim() || undefined,
              });

              onClose();
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-sm font-medium">{t.date}</span>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>

              <label className="space-y-1">
                <span className="text-sm font-medium">{t.category}</span>
                <select value={category} onChange={(e) => setCategory(e.target.value as ResearchCategory)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {t.categories[c]}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              <span>{t.title}</span>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>

            <label>
              <span>{t.authorName}</span>
              <input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </label>

            <label>
              <span>{t.content}</span>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </label>

            <label>
              <span>{t.details}</span>
              <textarea value={details} onChange={(e) => setDetails(e.target.value)} />
            </label>

            <div className="flex justify-between">
              <p>{t.affiliation}: {affiliation}</p>
              <button type="submit">{t.addEntry}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}