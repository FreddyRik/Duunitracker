import { formatCompanyName, todayDateString } from "@/lib/format";
import { assertSafeHttpUrl, ValidationError } from "@/lib/validate";
import type { CreateJobInput, JobApplication, UpdateJobInput } from "@/types/job";
import { JOB_STATUSES, WORK_TYPES } from "@/types/job";

export function applyStatusSideEffects(
  existing: JobApplication,
  patch: UpdateJobInput,
): UpdateJobInput {
  if (patch.status === undefined) {
    return patch;
  }

  const next: UpdateJobInput = { ...patch };

  if (patch.status === "Applied") {
    next.applied = true;
    if (next.dateApplied === undefined && !existing.dateApplied) {
      next.dateApplied = todayDateString();
    }
  } else {
    next.applied = false;
  }

  return next;
}

export function normalizeJob(job: JobApplication): JobApplication {
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

export function resolveDateApplied(
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

export function validateCreateInput(input: CreateJobInput): CreateJobInput {
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

export function validateUpdatePatch(patch: UpdateJobInput): UpdateJobInput {
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
