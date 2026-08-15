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
/** Raw blob preserved when the primary jobs document cannot be parsed. */
export const JOBS_UNREADABLE_BACKUP_KEY = "duunitracker-jobs-unreadable";
export const THEME_STORAGE_KEY = "duunitracker-theme";
export const THEME_CHANGE_EVENT = "duunitracker-theme-change";
export const LOCALE_STORAGE_KEY = "duunitracker-locale";
export const LOCALE_CHANGE_EVENT = "duunitracker-locale-change";

export const IDB_NAME = "duunitracker";
/** IndexedDB object-store schema. Independent of JOBS_SCHEMA_VERSION. */
export const IDB_SCHEMA_VERSION = 1;
export const IDB_STORE_JOBS = "jobs";
export const IDB_STORE_ATTACHMENTS = "attachments";
export const IDB_STORE_META = "meta";
export const IDB_META_JOBS_MIGRATED_KEY = "jobsMigratedFromLocalStorage";
export const JOBS_SYNC_CHANNEL = "duunitracker-jobs";

export const PWA_THEME_COLOR = "#141413";
export const PWA_BACKGROUND_COLOR = "#f7f7f5";
export const PWA_THEME_COLOR_DARK = "#0c0c0b";
export const PWA_INSTALL_DISMISSED_KEY = "duunitracker-pwa-install-dismissed";
export const PWA_INSTALL_DISMISS_MS = 14 * 24 * 60 * 60 * 1000;
export const SERVICE_WORKER_PATH = "/sw.js";

export const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_JOB = 8;
export const MAX_BACKUP_ATTACHMENTS = 2_000;

export const ALLOWED_ATTACHMENT_MIME_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/** First reminder only once the list is non-trivial. */
export const BACKUP_REMINDER_MIN_JOBS = 5;
/** After dismiss/export, wait until this many more jobs exist. */
export const BACKUP_REMINDER_JOB_DELTA = 5;
/** And wait at least this long before nagging again. */
export const BACKUP_REMINDER_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;
export const BACKUP_LAST_EXPORT_COUNT_KEY = "duunitracker-backup-last-export-count";
export const BACKUP_REMINDER_DISMISSED_COUNT_KEY =
  "duunitracker-backup-reminder-dismissed-count";
export const BACKUP_REMINDER_ACK_AT_KEY = "duunitracker-backup-reminder-ack-at";

/** Legacy keys from the previous "job-tracker" branding. */
export const LEGACY_JOBS_STORAGE_KEY = "job-tracker-jobs";
export const LEGACY_THEME_STORAGE_KEY = "job-tracker-theme";

export const MAX_BACKUP_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_STORED_JOBS = 5000;
export const MAX_JOB_HTML_CHARS = 1_500_000;
export const PARSE_JOB_TIMEOUT_MS = 15_000;
export const PARSE_JOB_CLIENT_TIMEOUT_MS = 20_000;

/** Finnish työnhakuvelvoite default: 4 applications in 4 weeks. */
export const EMPLOYMENT_QUOTA_APPLICATIONS = 4;
export const EMPLOYMENT_QUOTA_PERIOD_DAYS = 28;
/** Pacing guide used by the weekly bars (4 applications / 4 weeks). */
export const EMPLOYMENT_QUOTA_WEEKLY_PACING = 1;

export const JOB_FIELD_LIMITS = {
  id: 128,
  url: 2048,
  title: 500,
  company: 500,
  location: 200,
  deadline: 64,
  date: 64,
  notes: 50_000,
  description: 100_000,
  contactName: 200,
  contactEmail: 320,
  salary: 200,
} as const;
