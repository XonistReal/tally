"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const listenersByKey = new Map<string, Set<() => void>>();

function listenersFor(key: string) {
  let set = listenersByKey.get(key);
  if (!set) {
    set = new Set();
    listenersByKey.set(key, set);
  }
  return set;
}

function subscribeKey(key: string, cb: () => void) {
  const set = listenersFor(key);
  set.add(cb);
  const onStorage = (event: StorageEvent) => {
    if (event.key === key) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    set.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function notify(key: string) {
  listenersFor(key).forEach((cb) => cb());
}

function readRaw(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function parseValue<T>(raw: string, initial: T): T {
  if (!raw) return initial;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return initial;
  }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const subscribe = useCallback((cb: () => void) => subscribeKey(key, cb), [key]);
  const getSnapshot = useCallback(() => readRaw(key), [key]);
  const getServerSnapshot = useCallback(() => "", []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => parseValue<T>(raw, initial), [raw, initial]);

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const current = parseValue<T>(readRaw(key), initial);
      const updated =
        typeof next === "function" ? (next as (prev: T) => T)(current) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(updated));
      } catch {
      }
      notify(key);
    },
    [key, initial],
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
    }
    notify(key);
  }, [key]);

  return { value, setValue, hydrated: true, reset };
}

export function makeId() {
  return Math.random().toString(36).slice(2, 10);
}
