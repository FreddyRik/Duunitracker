import { readStorageItemSoft, writeStorageItemSoft } from "@/lib/browser-storage";
import {
  BACKUP_LAST_EXPORT_COUNT_KEY,
  BACKUP_REMINDER_ACK_AT_KEY,
  BACKUP_REMINDER_COOLDOWN_MS,
  BACKUP_REMINDER_DISMISSED_COUNT_KEY,
  BACKUP_REMINDER_JOB_DELTA,
  BACKUP_REMINDER_MIN_JOBS,
} from "@/lib/site-config";

function readStoredCount(key: string): number {
  const raw = readStorageItemSoft(key);
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function writeStoredCount(key: string, value: number): void {
  writeStorageItemSoft(key, String(value));
}

function readStoredTimestamp(key: string): number {
  const raw = readStorageItemSoft(key);
  if (!raw) return 0;
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function acknowledge(jobCount: number): void {
  writeStoredCount(BACKUP_LAST_EXPORT_COUNT_KEY, jobCount);
  writeStoredCount(BACKUP_REMINDER_DISMISSED_COUNT_KEY, jobCount);
  writeStoredCount(BACKUP_REMINDER_ACK_AT_KEY, Date.now());
}

/**
 * Show only when the list is large enough, has grown by a meaningful delta
 * since the last export/dismiss, and the cooldown window has elapsed.
 * That stops the banner from reappearing on every new job.
 */
export function shouldShowBackupReminder(
  jobCount: number,
  now = Date.now(),
): boolean {
  if (jobCount < BACKUP_REMINDER_MIN_JOBS) return false;

  const lastExportCount = readStoredCount(BACKUP_LAST_EXPORT_COUNT_KEY);
  const dismissedAtCount = readStoredCount(BACKUP_REMINDER_DISMISSED_COUNT_KEY);
  const lastAckCount = Math.max(lastExportCount, dismissedAtCount);

  if (jobCount < lastAckCount + BACKUP_REMINDER_JOB_DELTA) return false;

  const ackAt = readStoredTimestamp(BACKUP_REMINDER_ACK_AT_KEY);
  if (ackAt > 0 && now - ackAt < BACKUP_REMINDER_COOLDOWN_MS) return false;

  return true;
}

export function markBackupExported(jobCount: number): void {
  acknowledge(jobCount);
}

export function dismissBackupReminder(jobCount: number): void {
  acknowledge(jobCount);
}
