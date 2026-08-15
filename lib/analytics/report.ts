import { buildFunnel } from "@/lib/analytics/funnel";
import { applicationDate } from "@/lib/analytics/applications";
import {
  buildQuotaProgress,
  jobsAppliedInRange,
} from "@/lib/analytics/quota";
import { buildResponseTimeMetrics } from "@/lib/analytics/response-time";
import type { DateRange, OfficialReportData, OfficialReportRow } from "@/types/analytics";
import type { JobApplication } from "@/types/job";

export function buildOfficialReport(
  jobs: JobApplication[],
  range: DateRange,
  generatedAt: string,
): OfficialReportData {
  const inRange = jobsAppliedInRange(jobs, range);
  const rows: OfficialReportRow[] = inRange
    .map((job) => {
      const dateApplied = applicationDate(job);
      if (!dateApplied) return null;
      return {
        dateApplied,
        company: job.company,
        title: job.title,
        location: job.location,
        status: job.status,
        url: job.url,
      };
    })
    .filter((row): row is OfficialReportRow => row !== null)
    .sort((left, right) => {
      if (left.dateApplied !== right.dateApplied) {
        return left.dateApplied.localeCompare(right.dateApplied);
      }
      return left.company.localeCompare(right.company);
    });

  return {
    generatedAt,
    range,
    quota: buildQuotaProgress(jobs, range),
    rows,
    funnel: buildFunnel(inRange),
    responseTime: buildResponseTimeMetrics(inRange),
  };
}
