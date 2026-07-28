import { formatCompanyName, todayDateString } from "@/lib/format";
import {
  applyStatusSideEffects,
  normalizeJob,
  resolveDateApplied,
  validateCreateInput,
  validateUpdatePatch,
} from "@/lib/job-validation";
import { JOBS_STORAGE_KEY } from "@/lib/site-config";
import { ensureStorageMigrated } from "@/lib/storage-migration";
import { ValidationError } from "@/lib/validate";
import type { CreateJobInput, JobApplication, UpdateJobInput } from "@/types/job";

export { JOBS_STORAGE_KEY };
export { ValidationError };

function assertBrowser(): void {
  if (typeof window === "undefined") {
    throw new Error("Job storage is only available in the browser");
  }
}

function parseStoredJobs(raw: string): JobApplication[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("Stored jobs are not an array");
    }
    return parsed
      .filter(isJobApplication)
      .map(normalizeJob)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  } catch {
    return [];
  }
}

function isJobApplication(value: unknown): value is JobApplication {
  if (!value || typeof value !== "object") {
    return false;
  }

  const job = value as Record<string, unknown>;
  return (
    typeof job.id === "string" &&
    typeof job.url === "string" &&
    typeof job.title === "string" &&
    typeof job.company === "string" &&
    typeof job.applied === "boolean" &&
    typeof job.status === "string" &&
    typeof job.notes === "string" &&
    typeof job.createdAt === "string" &&
    typeof job.updatedAt === "string"
  );
}

function writeJobs(jobs: JobApplication[]): void {
  assertBrowser();
  ensureStorageMigrated();
  window.localStorage.setItem(JOBS_STORAGE_KEY, `${JSON.stringify(jobs, null, 2)}\n`);
}

export function readJobs(): JobApplication[] {
  assertBrowser();
  ensureStorageMigrated();
  const raw = window.localStorage.getItem(JOBS_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  return parseStoredJobs(raw);
}

export function replaceJobs(jobs: JobApplication[]): JobApplication[] {
  const normalized = jobs
    .filter(isJobApplication)
    .map(normalizeJob)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  writeJobs(normalized);
  return normalized;
}

export function createJob(input: CreateJobInput): JobApplication {
  const validated = validateCreateInput(input);
  const jobs = readJobs();
  const now = new Date().toISOString();
  const applied = validated.applied ?? false;

  const job: JobApplication = {
    id: crypto.randomUUID(),
    url: validated.url,
    title: validated.title,
    company: formatCompanyName(validated.company),
    location: validated.location ?? null,
    deadline: validated.deadline ?? null,
    applied,
    status: validated.status ?? "Saved",
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

  jobs.unshift(job);
  writeJobs(jobs);
  return job;
}

export function updateJob(
  id: string,
  patch: UpdateJobInput,
): JobApplication | null {
  const jobs = readJobs();
  const index = jobs.findIndex((job) => job.id === id);
  if (index === -1) return null;

  const existing = jobs[index];
  const withStatus = applyStatusSideEffects(existing, patch);
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

  jobs[index] = updated;
  writeJobs(jobs);
  return updated;
}

export function deleteJob(id: string): boolean {
  const jobs = readJobs();
  const nextJobs = jobs.filter((job) => job.id !== id);
  if (nextJobs.length === jobs.length) return false;
  writeJobs(nextJobs);
  return true;
}

export function parseJobsImport(raw: string): JobApplication[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new ValidationError("Import file must contain a JSON array of jobs");
  }

  const jobs = parsed.filter(isJobApplication).map(normalizeJob);
  if (jobs.length === 0 && parsed.length > 0) {
    throw new ValidationError("No valid job records found in import file");
  }

  return jobs.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
