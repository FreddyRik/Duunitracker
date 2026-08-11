"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
} from "@/lib/site-config";
import { ensureStorageMigrated } from "@/lib/storage-migration";

export const THEMES = ["light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

export { THEME_STORAGE_KEY };
export const DEFAULT_THEME: Theme = "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function isTheme(value: string | null | undefined): value is Theme {
  return THEMES.includes(value as Theme);
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return DEFAULT_THEME;

  ensureStorageMigrated();

  const fromDom = document.documentElement.getAttribute("data-theme");
  if (isTheme(fromDom)) return fromDom;

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : DEFAULT_THEME;
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getStoredTheme,
    () => DEFAULT_THEME,
  );

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
