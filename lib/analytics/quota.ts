import { applicationDate } from "@/lib/analytics/applications";
import {
  inclusiveDayCount,
  isDateInRange,
  quotaTargetForRangeDays,
  weekWindows,
} from "@/lib/analytics/dates";
import { EMPLOYMENT_QUOTA_WEEKLY_PACING } from "@/lib/site-config";
import type { DateRange, QuotaProgress, QuotaWeek } from "@/types/analytics";
import type { JobApplication } from "@/types/job";

export function jobsAppliedInRange(
  jobs: JobApplication[],
  range: DateRange,
): JobApplication[] {
  return jobs.filter((job) => {
    const applied = applicationDate(job);
    return applied !== null && isDateInRange(applied, range);
  });
}

export function buildQuotaProgress(
  jobs: JobApplication[],
  range: DateRange,
): QuotaProgress {
  const rangeDays = inclusiveDayCount(range);
  const applied = jobsAppliedInRange(jobs, range);
  const appliedCount = applied.length;
  const targetCount = quotaTargetForRangeDays(rangeDays);
  const remaining = Math.max(0, targetCount - appliedCount);
  const percent =
    targetCount <= 0
      ? 0
      : Math.round((appliedCount / targetCount) * 1000) / 10;

  const weeks: QuotaWeek[] = weekWindows(range).map((window) => ({
    start: window.start,
    end: window.end,
    count: jobsAppliedInRange(jobs, window).length,
    pacingTarget: EMPLOYMENT_QUOTA_WEEKLY_PACING,
  }));

  return {
    range,
    rangeDays,
    appliedCount,
    targetCount,
    percent,
    remaining,
    met: appliedCount >= targetCount,
    weeks,
  };
}
