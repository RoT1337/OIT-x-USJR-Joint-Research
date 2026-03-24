import { useCallback, useEffect, useMemo, useState } from "react";
import { AppHeader } from "./components/layout/AppHeader";
import { AddEntryModal } from "./components/layout/AddEntryModal";
import { EditEntryModal } from "./components/layout/EditEntryModal";
import { LoginModal } from "./components/layout/LoginModal";
import { NavBar } from "./components/layout/NavBar";
import { ToastHost, type ToastItem, type ToastTone } from "./components/layout/ToastHost";
import { apiFetch, apiUrl } from "./api";
import { useLanguage } from "./context/LanguageContext";
import { translations } from "./i18n/translations";
import { LoginPage } from "./pages/LoginPage";
import { TimelinePage } from "./pages/TimelinePage";
import type { LogEntry } from "./types/LogEntry";
import type { ResearchLog, ResearchLogAffiliation } from "./types/ResearchLog";

const RESEARCHLOG_API_URL = (lang: string) =>
  apiUrl(`/api/researchlog/?lang=${lang}`);
const ME_API_URL = apiUrl("/api/me/");
const LOGOUT_API_URL = apiUrl("/api/logout/");
const GOOGLE_LOGIN_URL = apiUrl("/accounts/google/login/?process=login");
const MICROSOFT_LOGIN_URL = apiUrl("/accounts/microsoft/login/?process=login");

const PREFERRED_AFFILIATION_KEY = "preferredAffiliation";
const PENDING_LOGIN_TOAST_KEY = "pendingLoginToast";

function App() {
  const [logs, setLogs] = useState<ResearchLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userAffiliation, setUserAffiliation] = useState<ResearchLogAffiliation | null>(null);
  const [affiliationEnforced, setAffiliationEnforced] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogEntry | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [preferredAffiliation, setPreferredAffiliation] = useState<ResearchLogAffiliation>(() => {
    const raw = window.localStorage.getItem(PREFERRED_AFFILIATION_KEY);
    return raw === "OIT" ? "OIT" : "USJR";
  });

  const { language, toggleLanguage } = useLanguage();
  const t = translations[language];

  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const addToast = useCallback(
    (tone: ToastTone, message: string) => {
      const id = (globalThis.crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, tone, message }]);
      window.setTimeout(() => dismissToast(id), 3500);
    },
    [dismissToast]
  );

  useEffect(() => {
    window.localStorage.setItem(PREFERRED_AFFILIATION_KEY, preferredAffiliation);
  }, [preferredAffiliation]);

  const loadLogs = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await apiFetch(RESEARCHLOG_API_URL(language), { signal });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setIsAuthenticated(false);
          setUserName("");
          setUserEmail("");
          setUserAffiliation(null);
          setAffiliationEnforced(false);
          setIsStaff(false);
          throw new Error(`Not authenticated (HTTP ${response.status})`);
        }
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as ResearchLog[];
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      console.error("Failed to fetch research logs:", err);
      setErrorMessage("Could not load research logs from the local API.");
    } finally {
      setIsLoading(false);
    }
    }, [language]);

  function requestLogin() {
    setIsLoginOpen(true);
  }

  function continueWithGoogleLogin() {
    window.localStorage.setItem(PENDING_LOGIN_TOAST_KEY, "1");
    window.location.assign(GOOGLE_LOGIN_URL);
  }

  function continueWithMicrosoftLogin() {
    window.localStorage.setItem(PENDING_LOGIN_TOAST_KEY, "1");
    window.location.assign(MICROSOFT_LOGIN_URL);
  }

  function requestAddEntry() {
    if (!isAuthenticated) {
      requestLogin();
      return;
    }
    setIsAddEntryOpen(true);
  }

  const requestLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      setErrorMessage(null);
      const response = await apiFetch(LOGOUT_API_URL, { method: "POST" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      setIsAuthenticated(false);
      setUserName("");
      setUserEmail("");
      setUserAffiliation(null);
      setAffiliationEnforced(false);
      setIsStaff(false);
      setIsAddEntryOpen(false);
      addToast("info", t.toastLoggedOut);
    } catch (err) {
      console.error("Logout failed:", err);
      setErrorMessage(t.toastLogoutFailed);
      addToast("error", t.toastLogoutFailed);
    } finally {
      setIsLoggingOut(false);
    }
  }, [addToast, t.toastLoggedOut, t.toastLogoutFailed]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const response = await apiFetch(ME_API_URL, { signal: controller.signal });
        if (!response.ok) {
          setIsAuthenticated(false);
          return;
        }

        const data = (await response.json()) as {
          isAuthenticated?: boolean;
          name?: string;
          email?: string;
          affiliationEnforced?: boolean;
          affiliation?: ResearchLogAffiliation | null;
          isStaff?: boolean;
        };

        const authed = Boolean(data?.isAuthenticated);
        setIsAuthenticated(authed);
        if (authed) {
          setUserName((data?.name ?? "").trim());
          setUserEmail((data?.email ?? "").trim());
          setAffiliationEnforced(Boolean(data?.affiliationEnforced));
          setUserAffiliation((data?.affiliation as any) ?? null);
          setIsStaff(Boolean(data?.isStaff));

          const pending = window.localStorage.getItem(PENDING_LOGIN_TOAST_KEY);
          if (pending) {
            window.localStorage.removeItem(PENDING_LOGIN_TOAST_KEY);
            addToast("success", t.toastLoggedIn);
          }
        }
      } catch {
        // If this fails in dev, we still allow read-only usage.
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecked(true);
      }
    })();
    return () => controller.abort();
  }, [addToast, t.toastLoggedIn]);

  useEffect(() => {
    if (!isAuthChecked) return;
    if (!isAuthenticated) {
      setLogs([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    void loadLogs(controller.signal);
    return () => controller.abort();
  }, [isAuthChecked, isAuthenticated, loadLogs]);

  const entries: LogEntry[] = useMemo(() => {
    return logs.map((log) => ({
      id: log.id,
      date: log.created_at,
      title:
        language === "jp" && log.translated_title
          ? log.translated_title
          : log.title,
      category: log.category,
      affiliation: log.affiliation,
      categories: log.categories ?? [log.category],
      affiliations: log.affiliations ?? [log.affiliation],
      authorName:
        (log.created_by_name ?? "").trim() || (log.created_by_email ?? "").trim() || undefined,
      authorEmail: (log.created_by_email ?? "").trim() || undefined,
      content:
        language === "jp" && log.translated_content
          ? log.translated_content
          : log.content,
      attachments: log.attachments ?? [],
    }));
  }, [logs]);

  const canEditEntry = useCallback(
    (entry: LogEntry) => {
      if (!isAuthenticated) return false;
      if (isStaff) return true;

      if (affiliationEnforced) {
        if (!userAffiliation) return false;
        const tags = entry.affiliations && entry.affiliations.length > 0 ? entry.affiliations : [entry.affiliation];
        return tags.includes(userAffiliation as any);
      }

      // Dev / fallback mode: creator-only edits.
      return Boolean(entry.authorEmail) && entry.authorEmail === userEmail;
    },
    [affiliationEnforced, isAuthenticated, isStaff, userAffiliation, userEmail]
  );

  return (
    <div className="min-h-screen relative">
      <AppHeader title={t.appTitle} subtitle={t.appSubtitle} />

      <NavBar
        language={language}
        onToggleLanguage={toggleLanguage}
        isLoggedIn={isAuthenticated}
        userLabel={(userName || userEmail).trim()}
        userAffiliation={userAffiliation}
        onRequestLogin={requestLogin}
        onRequestLogout={isLoggingOut ? undefined : requestLogout}
        onRequestAddEntry={requestAddEntry}
        isAddEntryOpen={isAddEntryOpen}
      />

      <main className="mx-auto max-w-5xl px-4 py-6">
        {!isAuthChecked ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Checking session…</p>
        ) : !isAuthenticated ? (
          <LoginPage
            language={language}
            onLoginGoogle={continueWithGoogleLogin}
            onLoginMicrosoft={continueWithMicrosoftLogin}
          />
        ) : (
          <>
            {errorMessage ? (
              <p className="text-sm text-red-700 dark:text-red-300">{errorMessage}</p>
            ) : null}
            <TimelinePage
              entries={entries}
              onRefresh={() => void loadLogs()}
              isRefreshing={isLoading}
              canEditEntry={canEditEntry}
              onRequestEdit={(entry) => {
                if (!isAuthenticated) {
                  requestLogin();
                  return;
                }
                setEditingEntry(entry);
              }}
            />
          </>
        )}
      </main>

      {isAuthenticated ? (
        <AddEntryModal
          isOpen={isAddEntryOpen}
          language={language}
          defaultAffiliation={userAffiliation ?? preferredAffiliation}
          onClose={() => setIsAddEntryOpen(false)}
          onCreated={(created) => {
            setLogs((prev) => [created, ...prev]);
            setPreferredAffiliation(created.affiliation);
            addToast("success", t.toastEntryCreated);
          }}
          onToast={(tone, message) => addToast(tone, message)}
        />
      ) : null}

      {isAuthenticated ? (
        <EditEntryModal
          isOpen={Boolean(editingEntry)}
          language={language}
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onUpdated={(updated) => {
            setLogs((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
          }}
          onToast={(tone, message) => addToast(tone, message)}
        />
      ) : null}

      <LoginModal
        isOpen={isLoginOpen}
        language={language}
        onClose={() => setIsLoginOpen(false)}
        onLoginGoogle={() => {
          setIsLoginOpen(false);
          continueWithGoogleLogin();
        }}
        onLoginMicrosoft={() => {
          setIsLoginOpen(false);
          continueWithMicrosoftLogin();
        }}
      />

      <ToastHost toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;