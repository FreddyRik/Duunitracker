import { jobAttachmentBackupSchema } from "@/lib/attachment-schema";
import {
  exportAttachmentBackups,
  importAttachmentBackups,
} from "@/lib/attachments-store";
import { formatCompanyName, todayDateString } from "@/lib/format";
import { StorageError } from "@/lib/browser-storage";
import {
  extractBackupDocument,
  jobApplicationSchema,
  parseStoredJobsList,
  parseStrictJobs,
} from "@/lib/job-schema";
import {
  applyAppliedSideEffects,
  applyStatusSideEffects,
  normalizeJob,
  resolveDateApplied,
  validateCreateInput,
  validateUpdatePatch,
} from "@/lib/job-validation";
import { notifyJobsChanged } from "@/lib/jobs-sync";
import { getOfflineStore } from "@/lib/offline-adapter";
import {
  MAX_BACKUP_FILE_BYTES,
  MAX_STORED_JOBS,
} from "@/lib/site-config";
import { ensureStorageMigrated } from "@/lib/storage-migration";
import { ValidationError } from "@/lib/validate";
import type { JobAttachmentBackup } from "@/types/attachment";
import { JOBS_SCHEMA_VERSION, type JobsBackupDocument } from "@/types/backup";
import type { CreateJobInput, JobApplication, UpdateJobInput } from "@/types/job";
import type { OfflineStore } from "@/types/offline-store";

export { JOBS_STORAGE_KEY } from "@/lib/site-config";
export { ValidationError };

export type ReadJobsResult = {
  jobs: JobApplication[];
  skippedCount: number;
};

export type ParsedJobsBackup = {
  jobs: JobApplication[];
  attachments: JobAttachmentBackup[];
};

let refuseOverwriteCorrupted = false;

function sortJobs(jobs: JobApplication[]): JobApplication[] {
  return [...jobs].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

function assertWritable(): void {
  if (refuseOverwriteCorrupted) {
    throw new StorageError(
      "overwrite_blocked",
      "Refusing to overwrite unreadable job data",
    );
  }
}

function parseAttachmentBackups(items: unknown[]): JobAttachmentBackup[] {
  const attachments: JobAttachmentBackup[] = [];
  for (let index = 0; index < items.length; index += 1) {
    const result = jobAttachmentBackupSchema.safeParse(items[index]);
    if (!result.success) {
      throw new ValidationError(
        `Attachment ${index + 1} failed schema validation`,
        "invalid_schema",
      );
    }
    attachments.push(result.data);
  }
  return attachments;
}

async function loadValidatedJobs(store: OfflineStore): Promise<ReadJobsResult> {
  const items = await store.listJobs();
  const { jobs, skippedCount } = parseStoredJobsList(items);
  if (items.length > 0 && jobs.length === 0) {
    refuseOverwriteCorrupted = true;
    throw new StorageError(
      "corrupted",
      "Stored job data could not be read",
    );
  }

  refuseOverwriteCorrupted = false;
  return {
    jobs: sortJobs(jobs.map(normalizeJob)),
    skippedCount,
  };
}

export function serializeJobsBackup(
  jobs: JobApplication[],
  attachments: JobAttachmentBackup[] = [],
): string {
  const document: JobsBackupDocument = {
    schemaVersion: JOBS_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    jobs: parseStrictJobs(jobs),
    ...(attachments.length > 0 ? { attachments } : {}),
  };
  return `${JSON.stringify(document, null, 2)}\n`;
}

export async function readJobsDetailed(): Promise<ReadJobsResult> {
  ensureStorageMigrated();
  try {
    const store = await getOfflineStore();
    return await loadValidatedJobs(store);
  } catch (error) {
    if (error instanceof StorageError && error.code === "corrupted") {
      refuseOverwriteCorrupted = true;
    }
    throw error;
  }
}

export async function readJobs(): Promise<JobApplication[]> {
  return (await readJobsDetailed()).jobs;
}

export async function replaceJobs(
  jobs: JobApplication[],
  attachments: JobAttachmentBackup[] = [],
): Promise<JobApplication[]> {
  const validated = jobs.map((job) => {
    const result = jobApplicationSchema.safeParse(job);
    if (!result.success) {
      throw new ValidationError("Imported jobs failed schema validation", "invalid_schema");
    }
    return normalizeJob(result.data);
  });

  if (validated.length > MAX_STORED_JOBS) {
    throw new ValidationError(
      `Cannot store more than ${MAX_STORED_JOBS} jobs`,
      "too_large",
    );
  }

  const normalized = sortJobs(validated);
  const store = await getOfflineStore();
  refuseOverwriteCorrupted = false;
  await store.replaceAllJobs(normalized);
  await importAttachmentBackups(store, attachments);
  notifyJobsChanged();
  return normalized;
}

export async function createJob(input: CreateJobInput): Promise<JobApplication> {
  assertWritable();
  const validated = validateCreateInput(input);
  const store = await getOfflineStore();
  const count = await store.countJobs();
  if (count >= MAX_STORED_JOBS) {
    throw new ValidationError(
      `Cannot store more than ${MAX_STORED_JOBS} jobs`,
      "too_large",
    );
  }

  const now = new Date().toISOString();
  const applied = validated.applied ?? false;
  const status =
    applied && (validated.status ?? "Saved") === "Saved"
      ? "Applied"
      : (validated.status ?? "Saved");

  const job: JobApplication = {
    id: crypto.randomUUID(),
    url: validated.url,
    title: validated.title,
    company: formatCompanyName(validated.company),
    location: validated.location ?? null,
    deadline: validated.deadline ?? null,
    applied,
    status,
    notes: validated.notes ?? "",
    dateApplied:
      validated.dateApplied ?? (applied ? todayDateString() : null),
    interviewDate: validated.interviewDate ?? null,
    contactName: validated.contactName ?? null,
    contactEmail: validated.contactEmail ?? null,
    salary: validated.salary ?? null,
    workType: validated.workType ?? null,
    description: validated.description ?? null,
    createdAt: now,
    updatedAt: now,
  };

  await store.putJob(job);
  notifyJobsChanged();
  return job;
}

export async function updateJob(
  id: string,
  patch: UpdateJobInput,
): Promise<JobApplication | null> {
  assertWritable();
  const jobs = await readJobs();
  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  const existing = jobs[index];
  const withApplied = applyAppliedSideEffects(existing, patch);
  const withStatus = applyStatusSideEffects(existing, withApplied);
  const validated = validateUpdatePatch(withStatus);
  const updated: JobApplication = {
    ...existing,
    ...validated,
    company:
      validated.company !== undefined
        ? formatCompanyName(validated.company)
        : existing.company,
    dateApplied: resolveDateApplied(existing, validated),
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  const store = await getOfflineStore();
  await store.putJob(updated);
  notifyJobsChanged();
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
  assertWritable();
  const jobs = await readJobs();
  const exists = jobs.some((job) => job.id === id);
  if (!exists) return false;

  const store = await getOfflineStore();
  await store.removeJob(id);
  await store.removeAttachmentsByJob(id);
  notifyJobsChanged();
  return true;
}

export function parseBackupDocument(raw: string): ParsedJobsBackup {
  if (raw.length > MAX_BACKUP_FILE_BYTES) {
    throw new ValidationError("Import file is too large", "too_large");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    throw new ValidationError("Import file is not valid JSON", "invalid_json");
  }

  const extracted = extractBackupDocument(parsed, "strict");
  if (extracted.jobs.length === 0) {
    throw new ValidationError(
      "Import file contains no job records",
      "empty",
    );
  }

  return {
    jobs: sortJobs(parseStrictJobs(extracted.jobs).map(normalizeJob)),
    attachments: parseAttachmentBackups(extracted.attachments),
  };
}

export function parseJobsImport(raw: string): JobApplication[] {
  return parseBackupDocument(raw).jobs;
}

export async function serializeCurrentBackup(
  jobs: JobApplication[],
): Promise<string> {
  const store = await getOfflineStore();
  const attachments = await exportAttachmentBackups(store);
  return serializeJobsBackup(jobs, attachments);
}

export function resetJobsLocalStoreForTests(): void {
  refuseOverwriteCorrupted = false;
}
