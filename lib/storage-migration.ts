import {
  readStorageItemSoft,
  removeStorageItem,
  writeStorageItemSoft,
} from "@/lib/browser-storage";
import {
  JOBS_STORAGE_KEY,
  LEGACY_JOBS_STORAGE_KEY,
  LEGACY_THEME_STORAGE_KEY,
  THEME_STORAGE_KEY,
} from "@/lib/site-config";

function migrateKey(newKey: string, legacyKey: string): void {
  const existing = readStorageItemSoft(newKey);
  if (existing !== null) {
    removeStorageItem(legacyKey);
    return;
  }

  const legacy = readStorageItemSoft(legacyKey);
  if (legacy === null) return;

  if (writeStorageItemSoft(newKey, legacy)) {
    removeStorageItem(legacyKey);
  }
}

let migrated = false;

export function resetStorageMigrationForTests(): void {
  migrated = false;
}

/** One-time copy of legacy job-tracker-* keys into duunitracker-*. */
export function ensureStorageMigrated(): void {
  if (typeof window === "undefined" || migrated) return;
  try {
    migrateKey(JOBS_STORAGE_KEY, LEGACY_JOBS_STORAGE_KEY);
    migrateKey(THEME_STORAGE_KEY, LEGACY_THEME_STORAGE_KEY);
    migrated = true;
  } catch {
    // Migration must never prevent the app from loading.
  }
}
