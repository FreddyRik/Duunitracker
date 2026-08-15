import { STATUS_GROUP_ORDER } from "@/lib/job-status-styles";
import type { JobApplication, JobListFilter, JobStatus } from "@/types/job";

/** Statuses that the "In progress" composite filter covers. */
const IN_PROGRESS: JobStatus[] = ["Interview", "Offer"];

export const JOB_LIST_FILTERS: JobListFilter[] = [
  "All",
  "Saved",
  "Applied",
  "InProgress",
  "Interview",
  "Offer",
  "Rejected",
];

export function matchesFilter(
  job: JobApplication,
  filter: JobListFilter,
): boolean {
  if (filter === "All") return true;
  if (filter === "InProgress") return IN_PROGRESS.includes(job.status);
  return job.status === filter;
}

export function jobMatchesSearch(job: JobApplication, query: string): boolean {
  if (query.length === 0) return true;
  return (
    job.title.toLowerCase().includes(query) ||
    job.company.toLowerCase().includes(query) ||
    (job.description?.toLowerCase().includes(query) ?? false)
  );
}

export function filterJobs(
  jobs: JobApplication[],
  options: { search: string; status: JobListFilter },
): JobApplication[] {
  const query = options.search.trim().toLowerCase();
  return jobs.filter(
    (job) =>
      matchesFilter(job, options.status) && jobMatchesSearch(job, query),
  );
}

export function countByFilter(
  jobs: JobApplication[],
  filter: JobListFilter,
): number {
  return jobs.reduce(
    (total, job) => (matchesFilter(job, filter) ? total + 1 : total),
    0,
  );
}

/** Single pass over the list so the tab strip does not recount per filter. */
export function countAllFilters(
  jobs: JobApplication[],
): Record<JobListFilter, number> {
  const counts: Record<JobListFilter, number> = {
    All: jobs.length,
    Saved: 0,
    Applied: 0,
    InProgress: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  for (const job of jobs) {
    counts[job.status] += 1;
    if (IN_PROGRESS.includes(job.status)) {
      counts.InProgress += 1;
    }
  }

  return counts;
}

export type JobStatusGroup = {
  status: JobStatus;
  jobs: JobApplication[];
};

/** Groups rows by status in pipeline order: active work first, archive last. */
export function groupByStatus(jobs: JobApplication[]): JobStatusGroup[] {
  return STATUS_GROUP_ORDER.map((status) => ({
    status,
    jobs: jobs.filter((job) => job.status === status),
  })).filter((group) => group.jobs.length > 0);
}

/** Visual row order, so keyboard navigation matches what the eye sees. */
export function orderJobsForDisplay(
  jobs: JobApplication[],
  grouped: boolean,
): JobApplication[] {
  if (!grouped) return jobs;
  return groupByStatus(jobs).flatMap((group) => group.jobs);
}

/**
 * Drives the header brand dot: an open offer outranks a scheduled interview,
 * and anything else leaves the mark in plain ink.
 */
export function deriveBrandStatus(jobs: JobApplication[]): JobStatus | null {
  if (jobs.some((job) => job.status === "Offer")) return "Offer";
  if (jobs.some((job) => job.status === "Interview")) return "Interview";
  return null;
}
