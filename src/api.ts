export const API_BASE: string = import.meta.env.VITE_API_BASE || "";

type ApiLoadingListener = (inFlightCount: number) => void;

let apiInFlightCount = 0;
const apiLoadingListeners = new Set<ApiLoadingListener>();

function notifyApiLoadingListeners(): void {
  for (const listener of apiLoadingListeners) {
    try {
      listener(apiInFlightCount);
    } catch {
      // ignore listener errors
    }
  }
}

export function getApiInFlightCount(): number {
  return apiInFlightCount;
}

export function subscribeApiInFlightCount(listener: ApiLoadingListener): () => void {
  apiLoadingListeners.add(listener);
  return () => {
    apiLoadingListeners.delete(listener);
  };
}

async function trackedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  apiInFlightCount += 1;
  notifyApiLoadingListeners();
  try {
    return await fetch(input, init);
  } finally {
    apiInFlightCount = Math.max(0, apiInFlightCount - 1);
    notifyApiLoadingListeners();
  }
}

export function apiUrl(path: string): string {
  if (!path) return API_BASE;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

function getCookie(name: string): string | null {
  const parts = document.cookie.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (!part.startsWith(`${name}=`)) continue;
    return decodeURIComponent(part.slice(name.length + 1));
  }
  return null;
}

let csrfEnsured = false;

async function ensureCsrfCookie(): Promise<void> {
  if (csrfEnsured && getCookie("csrftoken")) return;

  // Hitting this endpoint causes Django to set the CSRF cookie.
  await trackedFetch(apiUrl("/api/csrf/"), { credentials: "include" });
  csrfEnsured = true;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const isUnsafe = !["GET", "HEAD", "OPTIONS", "TRACE"].includes(method);

  const headers = new Headers(init.headers ?? {});

  if (isUnsafe) {
    await ensureCsrfCookie();
    const csrf = getCookie("csrftoken");
    if (csrf) headers.set("X-CSRFToken", csrf);
  }

  return trackedFetch(apiUrl(path), {
    ...init,
    headers,
    credentials: "include",
  });
}
