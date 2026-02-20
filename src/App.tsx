import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";
import type { LogEntry } from "./types/LogEntry";
import type { ResearchLog } from "./types/ResearchLog";
import { useLanguage } from "./context/LanguageContext";
import { translations } from "./i18n/translations";
import type { ResearchLogAffiliation } from "./types/ResearchLog";
import { LoginModal } from "./components/layout/LoginModal";
import { AddEntryModal } from "./components/layout/AddEntryModal";
import { apiUrl } from "./api";

const RESEARCHLOG_API_URL = apiUrl("/api/researchlog/");

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");
  const [logs, setLogs] = useState<ResearchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [sessionAffiliation, setSessionAffiliation] = useState<ResearchLogAffiliation | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [openAddAfterLogin, setOpenAddAfterLogin] = useState(false);

  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const loadLogs = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await fetch(RESEARCHLOG_API_URL, { signal });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as ResearchLog[];
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      console.error("Failed to fetch research logs:", err);
      setErrorMessage("Could not load research logs from the local API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  function requestLogin() {
    setIsLoginOpen(true);
  }

  function requestAddEntry() {
    if (sessionAffiliation) {
      setIsAddEntryOpen(true);
      return;
    }

    setOpenAddAfterLogin(true);
    requestLogin();
  }

  function handleLogin(affiliation: ResearchLogAffiliation) {
    setSessionAffiliation(affiliation);
    setIsLoginOpen(false);

    if (openAddAfterLogin) {
      setOpenAddAfterLogin(false);
      setIsAddEntryOpen(true);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    void loadLogs(controller.signal);
    return () => {
      controller.abort();
    };
  }, [loadLogs]);

  const entries: LogEntry[] = useMemo(() => {
    return logs.map((log) => ({
      id: log.id,
      date: log.created_at,
      title: log.title,
      category: log.category,
      affiliation: log.affiliation,
      content: log.content,
      attachments: log.attachments ?? [],
    }));
  }, [logs]);

  return (
    <div className="min-h-screen relative">
      <AppHeader title={t.appTitle} subtitle={t.appSubtitle} />

      <NavBar
        activePage={activePage}
        onNavigate={setActivePage}
        language={language}
        onToggleLanguage={toggleLanguage}
        isLoggedIn={sessionAffiliation !== null}
        onRequestLogin={requestLogin}
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
            <TimelinePage entries={entries} onRefresh={() => void loadLogs()} isRefreshing={isLoading} />
          </>
        ) : (
          <AboutPage />
        )}
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        language={language}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      {sessionAffiliation ? (
        <AddEntryModal
          isOpen={isAddEntryOpen}
          language={language}
          affiliation={sessionAffiliation}
          onClose={() => setIsAddEntryOpen(false)}
          onCreated={(created) => setLogs((prev) => [created, ...prev])}
        />
      ) : null}
    </div>
  );
}

export default App;