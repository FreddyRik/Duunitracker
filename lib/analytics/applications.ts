import { normalizeJobDate } from "@/lib/analytics/dates";
import type { JobApplication } from "@/types/job";

const SUBMITTED_STATUSES = new Set(["Applied", "Interview", "Offer", "Rejected"]);

export function isSubmittedApplication(job: JobApplication): boolean {
  if (job.dateApplied) return true;
  return SUBMITTED_STATUSES.has(job.status);
}

export function applicationDate(job: JobApplication): string | null {
  const stamped = normalizeJobDate(job.dateApplied);
  if (stamped) return stamped;
  if (!isSubmittedApplication(job)) return null;
  return normalizeJobDate(job.createdAt.slice(0, 10));
}
