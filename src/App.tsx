import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";
import { mockLogs } from "./data/mockLogs";
import type { Affiliation, LogEntry } from "./types/LogEntry";
import { LoginModal } from "./components/layout/LoginModal";
import { AddEntryModal } from "./components/layout/AddEntryModal";
import { useLanguage } from "./context/LanguageContext";
import { translations } from "./i18n/translations";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");
  const [sessionAffiliation, setSessionAffiliation] = useState<Affiliation | null>(null);
  const [entries, setEntries] = useState<LogEntry[]>(mockLogs);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pageAfterLogin, setPageAfterLogin] = useState<PageKey>("timeline");
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [openAddAfterLogin, setOpenAddAfterLogin] = useState(false);

  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  function requestLogin(nextPage: PageKey = "timeline") {
    setPageAfterLogin(nextPage);
    setIsLoginOpen(true);
  }

  function requestAddEntry() {
    if (sessionAffiliation) {
      setIsAddEntryOpen(true);
      return;
    }

    setOpenAddAfterLogin(true);
    requestLogin(activePage);
  }

  function handleLogin(affiliation: Affiliation) {
    setSessionAffiliation(affiliation);
    setIsLoginOpen(false);

    if (openAddAfterLogin) {
      setOpenAddAfterLogin(false);
      setIsAddEntryOpen(true);
      return;
    }

    setActivePage(pageAfterLogin);
  }

  function handleAdd(newEntry: Omit<LogEntry, "id">) {
    setEntries((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((e) => e.id)) + 1 : 1;
      return [{ ...newEntry, id: nextId }, ...prev];
    });
    setActivePage("timeline");
  }

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
          <TimelinePage entries={entries} />
        ) : (
          <AboutPage />
        )}
      </main>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />

      <AddEntryModal
        isOpen={isAddEntryOpen}
        affiliation={sessionAffiliation}
        onClose={() => setIsAddEntryOpen(false)}
        onAdd={handleAdd}
        onRequestLogin={() => requestLogin(activePage)}
      />
    </div>
  );
}

export default App;