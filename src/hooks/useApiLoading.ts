import { useSyncExternalStore } from "react";
import { getApiInFlightCount, subscribeApiInFlightCount } from "../api";

function subscribe(callback: () => void): () => void {
  return subscribeApiInFlightCount(() => callback());
}

function getSnapshot(): number {
  return getApiInFlightCount();
}

export function useApiInFlightCount(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useApiIsLoading(): boolean {
  return useApiInFlightCount() > 0;
}
