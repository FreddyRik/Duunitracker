import { parseStoredJobsList } from "@/lib/job-schema";
import { normalizeJob } from "@/lib/job-validation";
import {
  getAttachmentRecord,
  listAttachmentRecords,
  listAttachmentRecordsByJob,
  putAttachmentRecord,
  removeAttachmentRecord,
  removeAttachmentRecordsByJob,
  replaceAllAttachmentRecords,
} from "@/lib/idb/attachments-repository";
import {
  closeTrackerDatabase,
  deleteTrackerDatabase,
  openTrackerDatabase,
} from "@/lib/idb/database";
import {
  countJobs,
  listJobRecords,
  putJobRecord,
  removeJobRecord,
  replaceAllJobRecords,
} from "@/lib/idb/jobs-repository";
import { getMetaValue, setMetaValue } from "@/lib/idb/meta-repository";
import {
  readStorageItem,
  readStorageItemSoft,
  removeStorageItem,
  StorageError,
  writeStorageItem,
} from "@/lib/browser-storage";
import { extractBackupJobs } from "@/lib/job-schema";
import {
  IDB_META_JOBS_MIGRATED_KEY,
  JOBS_STORAGE_KEY,
  JOBS_UNREADABLE_BACKUP_KEY,
} from "@/lib/site-config";
import { ensureStorageMigrated } from "@/lib/storage-migration";
import { ValidationError } from "@/lib/validate";
import { JOBS_SCHEMA_VERSION } from "@/types/backup";
import type { JobApplication } from "@/types/job";
import type { OfflineStore } from "@/types/offline-store";

let storePromise: Promise<OfflineStore> | null = null;

function createIdbAdapter(): OfflineStore {
  return {
    kind: "indexeddb",
    attachmentsSupported: true,
    async countJobs() {
      return countJobs(await openTrackerDatabase());
    },
    async listJobs() {
      return listJobRecords(await openTrackerDatabase());
    },
    async putJob(job) {
      await putJobRecord(await openTrackerDatabase(), job);
    },
    async removeJob(id) {
      await removeJobRecord(await openTrackerDatabase(), id);
    },
    async replaceAllJobs(jobs) {
      await replaceAllJobRecords(await openTrackerDatabase(), jobs);
    },
    async listAttachments() {
      return listAttachmentRecords(await openTrackerDatabase());
    },
    async listAttachmentsByJob(jobId) {
      return listAttachmentRecordsByJob(await openTrackerDatabase(), jobId);
    },
    async getAttachment(id) {
      return getAttachmentRecord(await openTrackerDatabase(), id);
    },
    async putAttachment(record) {
      await putAttachmentRecord(await openTrackerDatabase(), record);
    },
    async removeAttachment(id) {
      await removeAttachmentRecord(await openTrackerDatabase(), id);
    },
    async removeAttachmentsByJob(jobId) {
      await removeAttachmentRecordsByJob(await openTrackerDatabase(), jobId);
    },
    async replaceAllAttachments(records) {
      await replaceAllAttachmentRecords(await openTrackerDatabase(), records);
    },
  };
}

function attachmentsUnavailable(): never {
  throw new StorageError(
    "attachments_unavailable",
    "Attachments require IndexedDB",
  );
}

function writeJobsDocumentToLocalStorage(jobs: JobApplication[]): void {
  writeStorageItem(
    JOBS_STORAGE_KEY,
    JSON.stringify({
      schemaVersion: JOBS_SCHEMA_VERSION,
      jobs,
    }),
  );
}

export function createLocalStorageAdapter(): OfflineStore {
  return {
    kind: "localstorage",
    attachmentsSupported: false,
    async countJobs() {
      const jobs = await this.listJobs();
      return jobs.length;
    },
    async listJobs() {
      ensureStorageMigrated();
      const raw = readStorageItem(JOBS_STORAGE_KEY);
      if (!raw) return [];
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw) as unknown;
      } catch {
        throw new StorageError(
          "corrupted",
          "Stored job data could not be read",
        );
      }
      try {
        return extractBackupJobs(parsed, "lenient");
      } catch (error) {
        if (error instanceof ValidationError && error.code === "too_large") {
          throw error;
        }
        throw new StorageError(
          "corrupted",
          "Stored job data could not be read",
        );
      }
    },
    async putJob(job) {
      const current = await this.listJobs();
      const { jobs } = parseStoredJobsList(current);
      const next = [job, ...jobs.filter((existing) => existing.id !== job.id)];
      writeJobsDocumentToLocalStorage(next.map(normalizeJob));
    },
    async removeJob(id) {
      const current = await this.listJobs();
      const { jobs } = parseStoredJobsList(current);
      writeJobsDocumentToLocalStorage(
        jobs.filter((job) => job.id !== id).map(normalizeJob),
      );
    },
    async replaceAllJobs(jobs) {
      writeJobsDocumentToLocalStorage(jobs);
    },
    async listAttachments() {
      return [];
    },
    async listAttachmentsByJob() {
      return [];
    },
    async getAttachment() {
      return null;
    },
    async putAttachment() {
      attachmentsUnavailable();
    },
    async removeAttachment() {
      attachmentsUnavailable();
    },
    async removeAttachmentsByJob() {
      return;
    },
    async replaceAllAttachments(records) {
      if (records.length > 0) attachmentsUnavailable();
    },
  };
}

async function migrateLocalStorageJobs(db: IDBDatabase): Promise<void> {
  ensureStorageMigrated();
  const alreadyMigrated = await getMetaValue(db, IDB_META_JOBS_MIGRATED_KEY);
  if (alreadyMigrated === "1") return;

  const existing = await listJobRecords(db);
  if (existing.length > 0) {
    await setMetaValue(db, IDB_META_JOBS_MIGRATED_KEY, "1");
    return;
  }

  const raw = readStorageItemSoft(JOBS_STORAGE_KEY);
  if (!raw) {
    await setMetaValue(db, IDB_META_JOBS_MIGRATED_KEY, "1");
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    writeStorageItem(JOBS_UNREADABLE_BACKUP_KEY, raw);
    throw new StorageError("corrupted", "Stored job data could not be read");
  }

  let items: unknown[];
  try {
    items = extractBackupJobs(parsed, "lenient");
  } catch (error) {
    if (error instanceof ValidationError && error.code === "too_large") {
      throw error;
    }
    writeStorageItem(JOBS_UNREADABLE_BACKUP_KEY, raw);
    throw new StorageError("corrupted", "Stored job data could not be read");
  }

  const { jobs } = parseStoredJobsList(items);
  if (items.length > 0 && jobs.length === 0) {
    writeStorageItem(JOBS_UNREADABLE_BACKUP_KEY, raw);
    throw new StorageError("corrupted", "Stored job data could not be read");
  }

  await replaceAllJobRecords(db, jobs.map(normalizeJob));
  await setMetaValue(db, IDB_META_JOBS_MIGRATED_KEY, "1");
  removeStorageItem(JOBS_STORAGE_KEY);
}

async function createPreferredStore(): Promise<OfflineStore> {
  try {
    const db = await openTrackerDatabase();
    await migrateLocalStorageJobs(db);
    return createIdbAdapter();
  } catch (error) {
    if (error instanceof StorageError && error.code === "corrupted") {
      throw error;
    }
    if (error instanceof ValidationError) {
      throw error;
    }
    return createLocalStorageAdapter();
  }
}

export function getOfflineStore(): Promise<OfflineStore> {
  if (!storePromise) {
    storePromise = createPreferredStore();
  }
  return storePromise;
}

export async function resetOfflineStoreForTests(): Promise<void> {
  storePromise = null;
  try {
    await deleteTrackerDatabase();
  } catch {
    await closeTrackerDatabase();
  }
}

export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.storage?.persist) {
    return false;
  }
  try {
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
