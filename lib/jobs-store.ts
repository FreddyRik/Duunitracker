import { promises as fs } from "fs";
import path from "path";
import { formatCompanyName, todayDateString } from "./format";
import type { CreateJobInput, JobApplication, UpdateJobInput } from "./types";
import { JOB_STATUSES, WORK_TYPES } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const JOBS_FILE = path.join(DATA_DIR, "jobs.json");

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

export async function readJobs(): Promise<JobApplication[]> {
  await ensureStore();
  const raw = await fs.readFile(JOBS_FILE, "utf-8");
  const jobs = JSON.parse(raw) as JobApplication[];
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
  const jobs = await readJobs();
  const now = new Date().toISOString();
  const applied = input.applied ?? false;

  const job: JobApplication = {
    id: crypto.randomUUID(),
    url: input.url,
    title: input.title,
    company: formatCompanyName(input.company),
    location: input.location ?? null,
    deadline: input.deadline ?? null,
    applied,
    status: input.status ?? "Saved",
    notes: input.notes ?? "",
    dateApplied:
      input.dateApplied ??
      (applied ? todayDateString() : null),
    interviewDate: input.interviewDate ?? null,
    contactName: input.contactName ?? null,
    contactEmail: input.contactEmail ?? null,
    salary: input.salary ?? null,
    workType: input.workType ?? null,
    description: input.description ?? null,
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
  const jobs = await readJobs();
  const index = jobs.findIndex((job) => job.id === id);

  if (index === -1) {
    return null;
  }

  if (patch.status && !JOB_STATUSES.includes(patch.status)) {
    throw new Error("Invalid status");
  }

  if (patch.workType && !WORK_TYPES.includes(patch.workType)) {
    throw new Error("Invalid work type");
  }

  const existing = jobs[index];
  const nextCompany =
    patch.company !== undefined
      ? formatCompanyName(patch.company)
      : existing.company;

  const updated: JobApplication = {
    ...existing,
    ...patch,
    company: nextCompany,
    dateApplied: resolveDateApplied(existing, patch),
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
