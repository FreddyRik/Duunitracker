import {
  JOBS_STORAGE_KEY,
  LEGACY_JOBS_STORAGE_KEY,
  LEGACY_THEME_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "@/lib/site-config";

function migrateKey(newKey: string, legacyKey: string): void {
  if (typeof window === "undefined") return;

  const existing = window.localStorage.getItem(newKey);
  if (existing !== null) {
    window.localStorage.removeItem(legacyKey);
    return;
  }

  const legacy = window.localStorage.getItem(legacyKey);
  if (legacy === null) return;

  window.localStorage.setItem(newKey, legacy);
  window.localStorage.removeItem(legacyKey);
}

let migrated = false;

/** One-time copy of legacy job-tracker-* keys into duunitracker-*. */
export function ensureStorageMigrated(): void {
  if (typeof window === "undefined" || migrated) return;
  migrateKey(JOBS_STORAGE_KEY, LEGACY_JOBS_STORAGE_KEY);
  migrateKey(THEME_STORAGE_KEY, LEGACY_THEME_STORAGE_KEY);
  migrated = true;
}
