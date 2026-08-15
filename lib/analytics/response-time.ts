import { diffDays, normalizeJobDate, timestampToLocalIso } from "@/lib/analytics/dates";
import { applicationDate } from "@/lib/analytics/applications";
import type { ResponseTimeMetrics, ResponseTimeRow } from "@/types/analytics";
import type { JobApplication, JobStatus } from "@/types/job";

const RESPONSE_STATUSES: JobStatus[] = ["Interview", "Offer", "Rejected"];

export function responseDate(job: JobApplication): string | null {
  const interview = normalizeJobDate(job.interviewDate);
  if (interview) return interview;

  if (!RESPONSE_STATUSES.includes(job.status)) return null;
  return timestampToLocalIso(job.updatedAt);
}

export function responseDelayDays(job: JobApplication): number | null {
  const applied = applicationDate(job);
  const responded = responseDate(job);
  if (!applied || !responded) return null;
  const days = diffDays(applied, responded);
  if (days === null || days < 0) return null;
  return days;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((total, value) => total + value, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

function rowFromJobs(
  key: string,
  label: string,
  jobs: JobApplication[],
): ResponseTimeRow {
  const delays: number[] = [];
  let pendingCount = 0;

  for (const job of jobs) {
    const delay = responseDelayDays(job);
    if (delay !== null) {
      delays.push(delay);
      continue;
    }
    if (job.status === "Applied") {
      pendingCount += 1;
    }
  }

  return {
    key,
    label,
    sampleSize: delays.length,
    averageDays: average(delays),
    pendingCount,
  };
}

export function buildResponseTimeMetrics(
  jobs: JobApplication[],
): ResponseTimeMetrics {
  const overall = rowFromJobs("overall", "overall", jobs);
  const respondedCount = overall.sampleSize;

  const byStatus = RESPONSE_STATUSES.map((status) =>
    rowFromJobs(
      status,
      status,
      jobs.filter((job) => job.status === status),
    ),
  ).filter((row) => row.sampleSize > 0 || row.pendingCount > 0);

  const companies = new Map<string, JobApplication[]>();
  for (const job of jobs) {
    const name = job.company.trim() || "—";
    const existing = companies.get(name);
    if (existing) {
      existing.push(job);
    } else {
      companies.set(name, [job]);
    }
  }

  const byCompany = [...companies.entries()]
    .map(([company, companyJobs]) => rowFromJobs(company, company, companyJobs))
    .filter((row) => row.sampleSize > 0 || row.pendingCount > 0)
    .sort((left, right) => {
      if (right.sampleSize !== left.sampleSize) {
        return right.sampleSize - left.sampleSize;
      }
      return left.label.localeCompare(right.label);
    });

  return {
    overall: respondedCount > 0 || overall.pendingCount > 0 ? overall : null,
    byStatus,
    byCompany,
    pendingCount: overall.pendingCount,
    respondedCount,
  };
}
