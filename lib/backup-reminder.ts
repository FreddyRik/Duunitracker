import {
  BACKUP_LAST_EXPORT_COUNT_KEY,
  BACKUP_REMINDER_DISMISSED_COUNT_KEY,
  BACKUP_REMINDER_MIN_JOBS,
} from "@/lib/site-config";

function readStoredCount(key: string): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(key);
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function writeStoredCount(key: string, value: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, String(value));
}

export function shouldShowBackupReminder(jobCount: number): boolean {
  if (jobCount < BACKUP_REMINDER_MIN_JOBS) return false;

  const lastExportCount = readStoredCount(BACKUP_LAST_EXPORT_COUNT_KEY);
  const dismissedAtCount = readStoredCount(BACKUP_REMINDER_DISMISSED_COUNT_KEY);
  return jobCount > lastExportCount && jobCount > dismissedAtCount;
}

export function markBackupExported(jobCount: number): void {
  writeStoredCount(BACKUP_LAST_EXPORT_COUNT_KEY, jobCount);
}

export function dismissBackupReminder(jobCount: number): void {
  writeStoredCount(BACKUP_REMINDER_DISMISSED_COUNT_KEY, jobCount);
}
