import { promises as fs } from "fs";
import path from "path";
import { formatCompanyName, todayDateString } from "./format";
import type { CreateJobInput, JobApplication, UpdateJobInput } from "./types";
import { JOB_STATUSES, WORK_TYPES } from "./types";
import { assertSafeHttpUrl, ValidationError } from "./validate";

const DATA_DIR = path.join(process.cwd(), "data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

export { ValidationError };

async function ensureStore(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(JOBS_FILE);
  } catch {
    await fs.writeFile(JOBS_FILE, "[]\n", "utf-8");
  }
}

function normalizeJob(job: JobApplication): JobApplication {
  return {
    ...job,
    dateApplied: job.dateApplied ?? null,
    interviewDate: job.interviewDate ?? null,
    contactName: job.contactName ?? null,
    contactEmail: job.contactEmail ?? null,
    salary: job.salary ?? null,
    workType: job.workType ?? null,
    description: job.description ?? null,
    company: formatCompanyName(job.company),
  };
}

function resolveDateApplied(
  existing: JobApplication,
  patch: UpdateJobInput,
): string | null {
  if (patch.applied === false) {
    return null;
  }

  if (patch.dateApplied !== undefined) {
    return patch.dateApplied;
  }

  if (patch.applied === true) {
    return existing.dateApplied ?? todayDateString();
  }

  return existing.dateApplied ?? null;
}

function validateUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed) {
    assertSafeHttpUrl(trimmed);
  }
  return trimmed;
}

function validateCreateInput(input: CreateJobInput): CreateJobInput {
  const title = input.title.trim();
  const company = input.company.trim();

  if (!title) {
    throw new ValidationError("title is required");
  }

  if (!company) {
    throw new ValidationError("company is required");
  }

  const status = input.status ?? "Saved";
  if (!JOB_STATUSES.includes(status)) {
    throw new ValidationError("Invalid status");
  }

  if (input.workType && !WORK_TYPES.includes(input.workType)) {
    throw new ValidationError("Invalid work type");
  }

  return {
    ...input,
    title,
    company,
    url: validateUrl(input.url),
    status,
  };
}

function validateUpdatePatch(patch: UpdateJobInput): UpdateJobInput {
  const next: UpdateJobInput = { ...patch };

  if (patch.title !== undefined) {
    const title = patch.title.trim();
    if (!title) {
      throw new ValidationError("title is required");
    }
    next.title = title;
  }

  if (patch.company !== undefined) {
    const company = patch.company.trim();
    if (!company) {
      throw new ValidationError("company is required");
    }
    next.company = company;
  }

  if (patch.url !== undefined) {
    next.url = validateUrl(patch.url);
  }

  if (patch.status && !JOB_STATUSES.includes(patch.status)) {
    throw new ValidationError("Invalid status");
  }

  if (patch.workType && !WORK_TYPES.includes(patch.workType)) {
    throw new ValidationError("Invalid work type");
  }

  return next;
}

export async function readJobs(): Promise<JobApplication[]> {
  await ensureStore();
  const raw = await fs.readFile(JOBS_FILE, "utf-8");

  let jobs: JobApplication[];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("jobs.json is not an array");
    }
    jobs = parsed as JobApplication[];
  } catch (error) {
    const backupPath = `${JOBS_FILE}.corrupt.${Date.now()}`;
    try {
      await fs.rename(JOBS_FILE, backupPath);
    } catch {
      // If rename fails, overwrite with empty store.
    }
    await fs.writeFile(JOBS_FILE, "[]\n", "utf-8");
    console.error(
      "Recovered from corrupt jobs.json; backup:",
      backupPath,
      error,
    );
    return [];
  }

  return jobs
    .map(normalizeJob)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
}

async function writeJobs(jobs: JobApplication[]): Promise<void> {
  await ensureStore();
  await fs.writeFile(JOBS_FILE, `${JSON.stringify(jobs, null, 2)}\n`, "utf-8");
}

export async function createJob(input: CreateJobInput): Promise<JobApplication> {
  const validated = validateCreateInput(input);
  const jobs = await readJobs();
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
  await writeJobs(jobs);
  return job;
}

export async function updateJob(
  id: string,
  patch: UpdateJobInput,
): Promise<JobApplication | null> {
  const validated = validateUpdatePatch(patch);
  const jobs = await readJobs();
  const index = jobs.findIndex((job) => job.id === id);

  if (index === -1) {
    return null;
  }

  const existing = jobs[index];
  const nextCompany =
    validated.company !== undefined
      ? formatCompanyName(validated.company)
      : existing.company;

  const updated: JobApplication = {
    ...existing,
    ...validated,
    company: nextCompany,
    dateApplied: resolveDateApplied(existing, validated),
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  jobs[index] = updated;
  await writeJobs(jobs);
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
  const jobs = await readJobs();
  const nextJobs = jobs.filter((job) => job.id !== id);

  if (nextJobs.length === jobs.length) {
    return false;
  }

  await writeJobs(nextJobs);
  return true;
}
