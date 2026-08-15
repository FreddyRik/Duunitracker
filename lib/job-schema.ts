import { z, ZodError } from "zod";
import {
  JOB_FIELD_LIMITS,
  MAX_BACKUP_ATTACHMENTS,
  MAX_JOB_HTML_CHARS,
  MAX_STORED_JOBS,
} from "@/lib/site-config";
import { isRecord, ValidationError } from "@/lib/validate";
import { JOBS_SCHEMA_VERSION } from "@/types/backup";
import {
  JOB_STATUSES,
  WORK_TYPES,
  type JobApplication,
  type JobStatus,
  type WorkType,
} from "@/types/job";

export function isJobStatus(value: unknown): value is JobStatus {
  return (
    typeof value === "string" && JOB_STATUSES.some((status) => status === value)
  );
}

export function isWorkType(value: unknown): value is WorkType {
  return typeof value === "string" && WORK_TYPES.some((type) => type === value);
}

const jobStatusSchema = z.custom<JobStatus>(isJobStatus, {
  message: "Invalid status",
});
const workTypeSchema = z.custom<WorkType>(isWorkType, {
  message: "Invalid work type",
});

function nullableString(max: number) {
  return z
    .union([z.string().max(max), z.null()])
    .optional()
    .transform((value) => value ?? null);
}

function isParseableTimestamp(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

/** Strict job record — used for backup import so corrupt files never land in storage. */
export const jobApplicationSchema = z
  .object({
    id: z.string().min(1).max(JOB_FIELD_LIMITS.id),
    url: z.string().max(JOB_FIELD_LIMITS.url),
    title: z.string().trim().min(1).max(JOB_FIELD_LIMITS.title),
    company: z.string().trim().min(1).max(JOB_FIELD_LIMITS.company),
    location: nullableString(JOB_FIELD_LIMITS.location),
    deadline: nullableString(JOB_FIELD_LIMITS.deadline),
    applied: z.boolean(),
    status: jobStatusSchema,
    notes: z.string().max(JOB_FIELD_LIMITS.notes),
    dateApplied: nullableString(JOB_FIELD_LIMITS.date),
    interviewDate: nullableString(JOB_FIELD_LIMITS.date),
    contactName: nullableString(JOB_FIELD_LIMITS.contactName),
    contactEmail: nullableString(JOB_FIELD_LIMITS.contactEmail),
    salary: nullableString(JOB_FIELD_LIMITS.salary),
    workType: z
      .union([workTypeSchema, z.null()])
      .optional()
      .transform((value) => value ?? null),
    description: nullableString(JOB_FIELD_LIMITS.description),
    createdAt: z
      .string()
      .refine(isParseableTimestamp, { message: "Invalid createdAt" }),
    updatedAt: z
      .string()
      .refine(isParseableTimestamp, { message: "Invalid updatedAt" }),
  })
  .strip();

function coerceJobStatus(value: unknown): JobStatus {
  return isJobStatus(value) ? value : "Saved";
}

function coerceWorkType(value: unknown): WorkType | null {
  return isWorkType(value) ? value : null;
}

function coerceNullableString(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function coerceTimestamp(value: unknown): string {
  if (typeof value === "string" && isParseableTimestamp(value)) {
    return new Date(value).toISOString();
  }
  return new Date().toISOString();
}

/**
 * Lenient job record for local persistence. Recovers older or slightly damaged
 * records instead of dropping a user's data.
 */
export const storedJobSchema = z.unknown().transform(
  (value, ctx) => {
    if (!isRecord(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Job must be an object",
      });
      return z.NEVER;
    }

    const id =
      typeof value.id === "string"
        ? value.id.trim().slice(0, JOB_FIELD_LIMITS.id)
        : "";
    const title =
      typeof value.title === "string"
        ? value.title.trim().slice(0, JOB_FIELD_LIMITS.title)
        : "";
    const company =
      typeof value.company === "string"
        ? value.company.trim().slice(0, JOB_FIELD_LIMITS.company)
        : "";

    if (!id || !title || !company) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Job is missing id, title, or company",
      });
      return z.NEVER;
    }

    const job: JobApplication = {
      id,
      url:
        typeof value.url === "string"
          ? value.url.slice(0, JOB_FIELD_LIMITS.url)
          : "",
      title,
      company,
      location: coerceNullableString(value.location, JOB_FIELD_LIMITS.location),
      deadline: coerceNullableString(value.deadline, JOB_FIELD_LIMITS.deadline),
      applied: value.applied === true,
      status: coerceJobStatus(value.status),
      notes:
        typeof value.notes === "string"
          ? value.notes.slice(0, JOB_FIELD_LIMITS.notes)
          : "",
      dateApplied: coerceNullableString(
        value.dateApplied,
        JOB_FIELD_LIMITS.date,
      ),
      interviewDate: coerceNullableString(
        value.interviewDate,
        JOB_FIELD_LIMITS.date,
      ),
      contactName: coerceNullableString(
        value.contactName,
        JOB_FIELD_LIMITS.contactName,
      ),
      contactEmail: coerceNullableString(
        value.contactEmail,
        JOB_FIELD_LIMITS.contactEmail,
      ),
      salary: coerceNullableString(value.salary, JOB_FIELD_LIMITS.salary),
      workType: coerceWorkType(value.workType),
      description: coerceNullableString(
        value.description,
        JOB_FIELD_LIMITS.description,
      ),
      createdAt: coerceTimestamp(value.createdAt),
      updatedAt: coerceTimestamp(value.updatedAt),
    };

    return job;
  },
);

const jobsBackupEnvelopeSchema = z.object({
  schemaVersion: z.number().int().positive(),
  exportedAt: z.string().optional(),
  jobs: z.array(z.unknown()).max(MAX_STORED_JOBS),
  attachments: z.array(z.unknown()).max(MAX_BACKUP_ATTACHMENTS).optional(),
});

export const parsedJobSchema = z.object({
  url: z.string(),
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().nullable(),
  deadline: z.string().nullable(),
  description: z.string().nullable(),
});

export const parseJobRequestSchema = z.object({
  url: z.string().trim().min(1).max(JOB_FIELD_LIMITS.url),
  html: z.string().max(MAX_JOB_HTML_CHARS).optional(),
});

export function formatZodError(error: ZodError): string {
  const issue = error.issues[0];
  if (!issue) return "Invalid job data";
  const path = issue.path.length > 0 ? issue.path.join(".") : "job";
  return `${path}: ${issue.message}`;
}

export type ExtractedBackup = {
  jobs: unknown[];
  attachments: unknown[];
};

export function extractBackupDocument(
  parsed: unknown,
  mode: "strict" | "lenient",
): ExtractedBackup {
  if (Array.isArray(parsed)) {
    if (parsed.length > MAX_STORED_JOBS) {
      throw new ValidationError(
        `Import exceeds the maximum of ${MAX_STORED_JOBS} jobs`,
        "too_large",
      );
    }
    return { jobs: parsed, attachments: [] };
  }

  const envelope = jobsBackupEnvelopeSchema.safeParse(parsed);
  if (!envelope.success) {
    throw new ValidationError(
      "Import file must be a job list or a Duunitracker backup",
      "invalid_shape",
    );
  }

  if (envelope.data.schemaVersion < 1) {
    throw new ValidationError(
      "Backup schema version is invalid",
      "unsupported_version",
    );
  }

  if (mode === "strict" && envelope.data.schemaVersion > JOBS_SCHEMA_VERSION) {
    throw new ValidationError(
      "Backup was created by a newer version of Duunitracker",
      "unsupported_version",
    );
  }

  return {
    jobs: envelope.data.jobs,
    attachments: envelope.data.attachments ?? [],
  };
}

export function extractBackupJobs(
  parsed: unknown,
  mode: "strict" | "lenient",
): unknown[] {
  return extractBackupDocument(parsed, mode).jobs;
}

export function parseStrictJobs(items: unknown[]): JobApplication[] {
  const jobs: JobApplication[] = [];

  for (let index = 0; index < items.length; index += 1) {
    const result = jobApplicationSchema.safeParse(items[index]);
    if (!result.success) {
      throw new ValidationError(
        `Job ${index + 1}: ${formatZodError(result.error)}`,
        "invalid_schema",
      );
    }
    jobs.push(result.data);
  }

  return jobs;
}

export function parseStoredJobsList(items: unknown[]): {
  jobs: JobApplication[];
  skippedCount: number;
} {
  const jobs: JobApplication[] = [];
  let skippedCount = 0;

  for (const item of items) {
    const result = storedJobSchema.safeParse(item);
    if (result.success) {
      jobs.push(result.data);
    } else {
      skippedCount += 1;
    }
  }

  return { jobs, skippedCount };
}
