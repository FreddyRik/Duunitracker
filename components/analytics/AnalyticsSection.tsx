"use client";

import { useMemo } from "react";
import { ApplicationFunnel } from "@/components/analytics/ApplicationFunnel";
import { OfficialReport } from "@/components/analytics/OfficialReport";
import { QuotaTracker } from "@/components/analytics/QuotaTracker";
import { ResponseTimePanel } from "@/components/analytics/ResponseTimePanel";
import { useLocale } from "@/components/LocaleProvider";
import { useAnalyticsRange } from "@/hooks/useAnalyticsRange";
import {
  buildFunnel,
  buildOfficialReport,
  buildQuotaProgress,
  buildResponseTimeMetrics,
  jobsAppliedInRange,
} from "@/lib/analytics";
import { formatTemplate } from "@/lib/i18n";
import type { JobApplication } from "@/types/job";

type AnalyticsSectionProps = {
  jobs: JobApplication[];
};

export function AnalyticsSection({ jobs }: AnalyticsSectionProps) {
  const { t } = useLocale();
  const {
    preset,
    setPreset,
    customStart,
    customEnd,
    setCustomStart,
    setCustomEnd,
    range,
    rangeError,
  } = useAnalyticsRange();

  const inRange = useMemo(
    () => jobsAppliedInRange(jobs, range),
    [jobs, range],
  );
  const funnel = useMemo(() => buildFunnel(inRange), [inRange]);
  const quota = useMemo(() => buildQuotaProgress(jobs, range), [jobs, range]);
  const responseTime = useMemo(
    () => buildResponseTimeMetrics(inRange),
    [inRange],
  );
  const report = useMemo(
    () => buildOfficialReport(jobs, range, new Date().toISOString()),
    [jobs, range],
  );

  if (jobs.length === 0) {
    return (
      <section className="py-16 text-center">
        <h2 className="text-base font-semibold text-foreground">
          {t.analytics.emptyTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          {t.analytics.emptyHint}
        </p>
      </section>
    );
  }

  return (
    <div className="pb-10">
      <header className="no-print border-b border-border py-5">
        <h1 className="text-base font-semibold text-foreground">
          {t.analytics.title}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {t.analytics.subtitle}
        </p>
      </header>

      <section className="no-print border-b border-border py-8">
        <h2 className="text-sm font-semibold text-foreground">
          {t.analytics.quotaTitle}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {t.analytics.quotaHint}
        </p>
        <div className="mt-6">
          <QuotaTracker
            quota={quota}
            preset={preset}
            customStart={customStart}
            customEnd={customEnd}
            rangeError={rangeError}
            onPresetChange={setPreset}
            onCustomStartChange={setCustomStart}
            onCustomEndChange={setCustomEnd}
          />
        </div>
      </section>

      <section className="no-print border-b border-border py-8">
        <h2 className="text-sm font-semibold text-foreground">
          {t.analytics.funnelTitle}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {t.analytics.funnelHint}
        </p>
        <div className="mt-6">
          <ApplicationFunnel funnel={funnel} />
        </div>
        {funnel.submittedCount > 0 && (
          <p className="mt-4 text-xs text-muted">
            {formatTemplate(t.analytics.funnelWaiting, {
              count: funnel.waitingCount,
            })}
            {" · "}
            {formatTemplate(t.analytics.funnelResponded, {
              count: funnel.respondedCount,
            })}
          </p>
        )}
      </section>

      <section className="no-print border-b border-border py-8">
        <h2 className="text-sm font-semibold text-foreground">
          {t.analytics.responseTitle}
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          {t.analytics.responseHint}
        </p>
        <div className="mt-6">
          <ResponseTimePanel metrics={responseTime} />
        </div>
      </section>

      <section className="py-8">
        <OfficialReport report={report} />
      </section>
    </div>
  );
}
