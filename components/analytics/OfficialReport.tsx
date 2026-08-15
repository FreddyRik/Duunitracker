"use client";

import { useCallback } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { formatDate } from "@/lib/format";
import { formatTemplate, statusLabel } from "@/lib/i18n";
import { APP_NAME } from "@/lib/site-config";
import { OFFICIAL_REPORT_ID } from "@/lib/ui-constants";
import type { OfficialReportData } from "@/types/analytics";

type OfficialReportProps = {
  report: OfficialReportData;
};

export function OfficialReport({ report }: OfficialReportProps) {
  const { t, locale } = useLocale();

  const handlePrint = useCallback(() => {
    const previousTitle = document.title;
    document.title = `${t.analytics.reportOfficialTitle} ${report.range.start}–${report.range.end}`;

    function restore() {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    }

    window.addEventListener("afterprint", restore);
    window.print();
  }, [report.range.end, report.range.start, t.analytics.reportOfficialTitle]);

  const generated = new Date(report.generatedAt);
  const generatedLabel = Number.isNaN(generated.getTime())
    ? report.generatedAt
    : generated.toLocaleString(locale === "fi" ? "fi-FI" : "en-GB");

  return (
    <div>
      <div className="no-print mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            {t.analytics.reportTitle}
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted">
            {t.analytics.reportHint}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover"
        >
          {t.analytics.reportPrint}
        </button>
      </div>

      <article
        id={OFFICIAL_REPORT_ID}
        className="border border-border bg-surface-solid px-5 py-6 sm:px-8 sm:py-8"
      >
        <header className="border-b border-border pb-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
            {APP_NAME}
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            {t.analytics.reportOfficialTitle}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {t.analytics.reportOfficialSubtitle}
          </p>
        </header>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted">{t.analytics.reportPeriod}</dt>
            <dd className="font-medium text-foreground">
              {formatDate(report.range.start)} – {formatDate(report.range.end)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted">{t.analytics.reportGenerated}</dt>
            <dd className="font-medium text-foreground">{generatedLabel}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted">{t.analytics.reportQuotaLabel}</dt>
            <dd className="font-medium text-foreground">
              {formatTemplate(t.analytics.reportQuotaValue, {
                applied: report.quota.appliedCount,
                target: report.quota.targetCount,
                days: report.quota.rangeDays,
              })}
              {" · "}
              {report.quota.met
                ? t.analytics.quotaMet
                : formatTemplate(t.analytics.quotaShort, {
                    remaining: report.quota.remaining,
                  })}
            </dd>
          </div>
        </dl>

        {report.rows.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            {t.analytics.reportNoApplications}
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
                  <th className="py-2 pr-3 font-medium">{t.analytics.colDate}</th>
                  <th className="py-2 pr-3 font-medium">
                    {t.analytics.colEmployer}
                  </th>
                  <th className="py-2 pr-3 font-medium">
                    {t.analytics.colPosition}
                  </th>
                  <th className="py-2 pr-3 font-medium">
                    {t.analytics.colLocation}
                  </th>
                  <th className="py-2 pr-3 font-medium">
                    {t.analytics.colStatus}
                  </th>
                  <th className="py-2 font-medium">{t.analytics.colUrl}</th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row, index) => (
                  <tr
                    key={`${row.dateApplied}-${row.company}-${row.title}-${index}`}
                    className="border-b border-border"
                  >
                    <td className="py-2 pr-3 align-top font-mono text-xs">
                      {formatDate(row.dateApplied)}
                    </td>
                    <td className="py-2 pr-3 align-top">{row.company}</td>
                    <td className="py-2 pr-3 align-top">{row.title}</td>
                    <td className="py-2 pr-3 align-top text-muted">
                      {row.location ?? "—"}
                    </td>
                    <td className="py-2 pr-3 align-top">
                      {statusLabel(t, row.status)}
                    </td>
                    <td className="py-2 align-top text-xs text-muted break-all">
                      {row.url || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-6 text-xs leading-relaxed text-muted">
          {t.analytics.reportDisclaimer}
        </p>

        <div className="mt-10 grid gap-8 text-sm sm:grid-cols-2">
          <p>
            <span className="block text-xs text-muted">
              {t.analytics.reportSignature}
            </span>
            <span className="mt-6 block border-b border-border-strong" />
          </p>
          <p>
            <span className="block text-xs text-muted">
              {t.analytics.reportDateLine}
            </span>
            <span className="mt-6 block border-b border-border-strong" />
          </p>
        </div>
      </article>
    </div>
  );
}
