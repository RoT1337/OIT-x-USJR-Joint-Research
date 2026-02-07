import type { LogEntry } from "../types/LogEntry";

interface Props {
  logs: LogEntry[];
}

export function LogList({ logs }: Props) {
  return (
    <div>
      {logs.map(log => (
        <div key={log.id} style={{ borderBottom: "1px solid #ccc", marginBottom: "1rem" }}>
          <h3>{log.title}</h3>
          <small>{log.date} · {log.category} · {log.author}</small>
          <p>{log.content}</p>
        </div>
      ))}
    </div>
  );
}
