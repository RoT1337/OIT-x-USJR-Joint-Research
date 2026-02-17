import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useEffect, useMemo, useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";
import type { LogEntry } from "./types/LogEntry";
import type { ResearchLog } from "./types/ResearchLog";

const RESEARCHLOG_API_URL = "http://127.0.0.1:8000/api/researchlog/";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");
  const [logs, setLogs] = useState<ResearchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const res = await fetch(RESEARCHLOG_API_URL);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }

        const data = (await res.json()) as ResearchLog[];
        if (isCancelled) return;
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch research logs:", err);
        if (isCancelled) return;
        setErrorMessage("Could not load research logs from the local API.");
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isCancelled = true;
    };
  }, []);

  const entries: LogEntry[] = useMemo(() => {
    return logs.map((log) => ({
      id: log.id,
      date: log.created_at,
      title: log.title,
      category: log.category,
      affiliation: log.affiliation,
      content: log.content,
    }));
  }, [logs]);

  return (
    <div className="min-h-screen">
      <AppHeader
        title="USJR × OIT Research Log"
        subtitle="Academic prototype rendering research logs from a local Django API."
      />
      <NavBar activePage={activePage} onNavigate={setActivePage} />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {activePage === "timeline" ? (
          <>
            {isLoading ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading research logs…</p>
            ) : errorMessage ? (
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            ) : null}
            <TimelinePage entries={entries} />
          </>
        ) : (
          <AboutPage />
        )}
      </main>
    </div>
  );
}

export default App;
