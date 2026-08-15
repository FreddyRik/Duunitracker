"use client";

import { formatTemplate, statusLabel } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";
import type { ResponseTimeMetrics, ResponseTimeRow } from "@/types/analytics";
import { JOB_STATUSES, type JobStatus } from "@/types/job";

type ResponseTimePanelProps = {
  metrics: ResponseTimeMetrics;
};

function isJobStatus(value: string): value is JobStatus {
  return JOB_STATUSES.some((status) => status === value);
}

function BarRow({
  row,
  maxDays,
  label,
}: {
  row: ResponseTimeRow;
  maxDays: number;
  label: string;
}) {
  const { t } = useLocale();
  const width =
    maxDays <= 0 || row.sampleSize === 0
      ? 0
      : Math.max(4, (row.averageDays / maxDays) * 100);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)_auto] items-center gap-3 py-1.5">
      <p className="truncate text-xs font-medium text-foreground">{label}</p>
      <div className="h-2 rounded-full bg-rail-track">
        {row.sampleSize > 0 && (
          <div
            className="h-2 rounded-full bg-status-interview"
            style={{ width: `${width}%` }}
          />
        )}
      </div>
      <p className="whitespace-nowrap text-right font-mono text-[11px] text-muted-strong">
        {row.sampleSize > 0
          ? formatTemplate(t.analytics.responseAverageDays, {
              days: row.averageDays,
            })
          : t.analytics.noResponseYet}
      </p>
    </div>
  );
}

export function ResponseTimePanel({ metrics }: ResponseTimePanelProps) {
  const { t } = useLocale();
  const companyRows = metrics.byCompany.slice(0, 12);
  const maxDays = Math.max(
    metrics.overall?.averageDays ?? 0,
    ...metrics.byStatus.map((row) => row.averageDays),
    ...companyRows.map((row) => row.averageDays),
    1,
  );

  if (!metrics.overall) {
    return (
      <p className="py-8 text-sm text-muted">{t.analytics.responseEmpty}</p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t.analytics.byStatus}
        </h3>
        <div className="mt-3">
          <BarRow
            row={metrics.overall}
            maxDays={maxDays}
            label={t.analytics.responseOverall}
          />
          {metrics.byStatus.map((row) => (
            <BarRow
              key={row.key}
              row={row}
              maxDays={maxDays}
              label={isJobStatus(row.label) ? statusLabel(t, row.label) : row.label}
            />
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted">
          {formatTemplate(t.analytics.responseSample, {
            count: metrics.respondedCount,
          })}
          {" · "}
          {formatTemplate(t.analytics.responsePending, {
            count: metrics.pendingCount,
          })}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          {t.analytics.byCompany}
        </h3>
        <div className="mt-3">
          {companyRows.length === 0 ? (
            <p className="py-4 text-sm text-muted">{t.analytics.responseEmpty}</p>
          ) : (
            companyRows.map((row) => (
              <BarRow
                key={row.key}
                row={row}
                maxDays={maxDays}
                label={row.label}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
