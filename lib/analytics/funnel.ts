import { isSubmittedApplication } from "@/lib/analytics/applications";
import { FUNNEL_STAGE_IDS, type FunnelReport, type FunnelStage } from "@/types/analytics";
import type { JobApplication } from "@/types/job";

function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

function percentOf(count: number, total: number): number {
  if (total <= 0) return 0;
  return roundPercent((count / total) * 100);
}

function dropOffPercent(previous: number, current: number): number | null {
  if (previous <= 0) return null;
  if (current > previous) return null;
  return roundPercent(((previous - current) / previous) * 100);
}

function reachedInterview(job: JobApplication): boolean {
  if (job.status === "Interview" || job.status === "Offer") return true;
  return Boolean(job.interviewDate);
}

/**
 * Conversion funnel inferred from current status (no status history is stored).
 *
 * - Applied: submitted applications
 * - In Review: entered the employer pipeline (not still Saved)
 * - Interview: reached interview (current Interview/Offer, or an interview date)
 * - Offer: current Offer
 * - Rejected: current Rejected (terminal outcome, not a conversion step)
 */
export function buildFunnel(jobs: JobApplication[]): FunnelReport {
  const submitted = jobs.filter(isSubmittedApplication);
  const submittedCount = submitted.length;
  const waitingCount = submitted.filter((job) => job.status === "Applied").length;
  const respondedCount = submitted.filter(
    (job) =>
      job.status === "Interview" ||
      job.status === "Offer" ||
      job.status === "Rejected",
  ).length;

  const counts: Record<(typeof FUNNEL_STAGE_IDS)[number], number> = {
    applied: submittedCount,
    inReview: submitted.filter((job) => job.status !== "Saved").length,
    interview: submitted.filter(reachedInterview).length,
    offer: submitted.filter((job) => job.status === "Offer").length,
    rejected: submitted.filter((job) => job.status === "Rejected").length,
  };

  const stages: FunnelStage[] = FUNNEL_STAGE_IDS.map((id, index) => {
    const count = counts[id];
    const previousId = index > 0 ? FUNNEL_STAGE_IDS[index - 1] : null;
    const dropOff =
      id === "rejected" || previousId === null
        ? null
        : dropOffPercent(counts[previousId], count);

    return {
      id,
      count,
      percentOfApplied: percentOf(count, submittedCount),
      dropOffPercent: dropOff,
    };
  });

  return {
    submittedCount,
    waitingCount,
    respondedCount,
    stages,
  };
}
