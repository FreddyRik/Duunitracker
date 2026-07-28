"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { getMessages } from "@/lib/i18n";
import type { Messages } from "@/lib/i18n/types";
import {
  LOCALE_CHANGE_EVENT,
  LOCALE_STORAGE_KEY,
} from "@/lib/site-config";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALES,
  type Locale,
} from "@/types/locale";

export { LOCALES, DEFAULT_LOCALE, type Locale };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function applyLocale(locale: Locale) {
  document.documentElement.lang = locale;
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;

  const fromDom = document.documentElement.getAttribute("lang");
  if (isLocale(fromDom)) return fromDom;

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return isLocale(stored) ? stored : DEFAULT_LOCALE;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  };
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getStoredLocale,
    () => DEFAULT_LOCALE,
  );

  const t = useMemo(() => getMessages(locale), [locale]);

  const setLocale = useCallback((next: Locale) => {
    applyLocale(next);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  useEffect(() => {
    applyLocale(locale);
    document.title = t.app.name;
  }, [locale, t.app.name]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
