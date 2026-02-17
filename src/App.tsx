import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useEffect, useMemo, useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";
import type { Affiliation, LogEntry } from "./types/LogEntry";
import type { ResearchLog } from "./types/ResearchLog";
import { mockLogs } from "./data/mockLogs";
import { LoginModal } from "./components/layout/LoginModal";
import { AddEntryModal } from "./components/layout/AddEntryModal";
import { useLanguage } from "./context/LanguageContext";
import { translations } from "./i18n/translations";

const RESEARCHLOG_API_URL = "http://127.0.0.1:8000/api/researchlog/";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");
  const [logs, setLogs] = useState<ResearchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  function requestLogin(nextPage: PageKey = "timeline") {
    setPageAfterLogin(nextPage);
    setIsLoginOpen(true);
  }

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
    <div className="min-h-screen relative">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="absolute right-4 top-4 rounded-md border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:hover:bg-zinc-800"
      >
        {language === "en" ? "日本語" : "English"}
      </button>

      <AppHeader title={t.appTitle} subtitle={t.appSubtitle} />

      <NavBar
        activePage={activePage}
        onNavigate={setActivePage}
        isLoggedIn={sessionAffiliation !== null}
        onRequestLogin={() => requestLogin("timeline")}
        onRequestAddEntry={requestAddEntry}
        isAddEntryOpen={isAddEntryOpen}
      />
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