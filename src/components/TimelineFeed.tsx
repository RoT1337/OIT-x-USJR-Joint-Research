import type { LogEntry } from "../types/LogEntry";
import { LogCard } from "./LogCard";

interface Props {
  entries: LogEntry[];
  canEditEntry?: (entry: LogEntry) => boolean;
  onRequestEdit?: (entry: LogEntry) => void;
}

export function TimelineFeed({ entries, canEditEntry, onRequestEdit }: Props) {
  if (entries.length === 0) {
    return <p className="text-sm text-zinc-600">No entries yet.</p>;
  }

  return (
    <section aria-label="Research timeline">
      <ol className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id}>
            <LogCard
              entry={entry}
              canEdit={Boolean(onRequestEdit) && Boolean(canEditEntry?.(entry))}
              onEdit={onRequestEdit ? () => onRequestEdit(entry) : undefined}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
