import { AppHeader } from "./components/layout/AppHeader";
import { NavBar, type PageKey } from "./components/layout/NavBar";
import { useState } from "react";
import { AboutPage } from "./pages/AboutPage";
import { TimelinePage } from "./pages/TimelinePage";
import { mockLogs } from "./data/mockLogs";
import type { Affiliation, LogEntry } from "./types/LogEntry";
import { LoginModal } from "./components/layout/LoginModal";
import { AddEntryModal } from "./components/layout/AddEntryModal";

function App() {
  const [activePage, setActivePage] = useState<PageKey>("timeline");
  const [sessionAffiliation, setSessionAffiliation] = useState<Affiliation | null>(null);
  const [entries, setEntries] = useState<LogEntry[]>(mockLogs);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [pageAfterLogin, setPageAfterLogin] = useState<PageKey>("timeline");
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [openAddAfterLogin, setOpenAddAfterLogin] = useState(false);

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
    <div className="min-h-screen">
      <AppHeader
        title="USJR × OIT Research Log"
        subtitle="Academic prototype for logging research updates (mock data only)."
      />
      <NavBar
        activePage={activePage}
        onNavigate={setActivePage}
        isLoggedIn={sessionAffiliation !== null}
        onRequestLogin={() => requestLogin("timeline")}
        onRequestAddEntry={requestAddEntry}
        isAddEntryOpen={isAddEntryOpen}
      />
      <main className="mx-auto max-w-5xl px-4 py-6">
        {activePage === "timeline" ? <TimelinePage entries={entries} /> : <AboutPage />}
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
