import type { LogEntry } from "../types/LogEntry";
import { LogCard } from "./LogCard";

interface Props {
  entries: LogEntry[];
}

export function TimelineFeed({ entries }: Props) {
  if (entries.length === 0) {
    return <p className="text-sm text-zinc-600">No entries yet.</p>;
  }

  return (
    <section aria-label="Research timeline">
      <ol className="space-y-3">
        {entries.map((entry) => (
          <li key={entry.id}>
            <LogCard entry={entry} />
          </li>
        ))}
      </ol>
    </section>
  );
}
