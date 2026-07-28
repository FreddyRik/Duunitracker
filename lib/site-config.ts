export const APP_NAME = "Duunitracker";

const DEFAULT_SITE_URL = "https://duunitracker.vercel.app";

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return DEFAULT_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

export const GITHUB_PROFILE = "https://github.com/FreddyRik";
export const GITHUB_REPO = "https://github.com/FreddyRik/duunitracker";
export const GITHUB_ISSUES = `${GITHUB_REPO}/issues`;

export const JOBS_STORAGE_KEY = "duunitracker-jobs";
export const THEME_STORAGE_KEY = "duunitracker-theme";
export const THEME_CHANGE_EVENT = "duunitracker-theme-change";
export const LOCALE_STORAGE_KEY = "duunitracker-locale";
export const LOCALE_CHANGE_EVENT = "duunitracker-locale-change";

export const BACKUP_REMINDER_MIN_JOBS = 3;
export const BACKUP_LAST_EXPORT_COUNT_KEY = "duunitracker-backup-last-export-count";
export const BACKUP_REMINDER_DISMISSED_COUNT_KEY =
  "duunitracker-backup-reminder-dismissed-count";

/** Legacy keys from the previous "job-tracker" branding. */
export const LEGACY_JOBS_STORAGE_KEY = "job-tracker-jobs";
export const LEGACY_THEME_STORAGE_KEY = "job-tracker-theme";
