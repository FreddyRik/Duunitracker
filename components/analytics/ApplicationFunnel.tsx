"use client";

import { useLocale } from "@/components/LocaleProvider";
import {
  FUNNEL_CONVERSION_STAGE_IDS,
  FUNNEL_STAGE_FILL,
} from "@/lib/analytics/colors";
import { formatTemplate, funnelStageLabel } from "@/lib/i18n";
import type { FunnelReport, FunnelStage } from "@/types/analytics";

type ApplicationFunnelProps = {
  funnel: FunnelReport;
};

const SVG_WIDTH = 280;
const STAGE_HEIGHT = 38;
const EMPTY_WIDTH = 22;

function conversionWidth(count: number, maxCount: number): number {
  if (maxCount <= 0) return SVG_WIDTH;
  if (count <= 0) return EMPTY_WIDTH;
  return Math.max(EMPTY_WIDTH, (count / maxCount) * SVG_WIDTH);
}

function FunnelBand({
  stage,
  next,
  maxCount,
}: {
  stage: FunnelStage;
  next: FunnelStage | null;
  maxCount: number;
}) {
  const top = conversionWidth(stage.count, maxCount);
  const bottom = conversionWidth(next?.count ?? stage.count, maxCount);
  const topLeft = (SVG_WIDTH - top) / 2;
  const bottomLeft = (SVG_WIDTH - bottom) / 2;
  const points = [
    `${topLeft},0`,
    `${topLeft + top},0`,
    `${bottomLeft + bottom},${STAGE_HEIGHT}`,
    `${bottomLeft},${STAGE_HEIGHT}`,
  ].join(" ");
  const empty = stage.count <= 0;

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${STAGE_HEIGHT}`}
      className="h-9 w-full"
      aria-hidden="true"
    >
      {empty ? (
        <polygon
          points={points}
          fill="none"
          stroke={FUNNEL_STAGE_FILL[stage.id]}
          strokeDasharray="4 3"
          strokeWidth="1.5"
          opacity="0.6"
        />
      ) : (
        <polygon points={points} fill={FUNNEL_STAGE_FILL[stage.id]} />
      )}
    </svg>
  );
}

function StageCopy({ stage }: { stage: FunnelStage }) {
  const { t } = useLocale();

  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-foreground">
          {funnelStageLabel(t, stage.id)}
        </span>
        <span className="font-mono text-xs text-muted-strong">{stage.count}</span>
      </div>
      <p className="text-[11px] leading-tight text-muted">
        {formatTemplate(t.analytics.ofApplied, {
          percent: stage.percentOfApplied,
        })}
        {stage.dropOffPercent !== null && stage.dropOffPercent > 0
          ? ` · ${formatTemplate(t.analytics.dropOff, {
              percent: stage.dropOffPercent,
            })}`
          : null}
      </p>
    </div>
  );
}

export function ApplicationFunnel({ funnel }: ApplicationFunnelProps) {
  const { t } = useLocale();
  const conversion = FUNNEL_CONVERSION_STAGE_IDS.map(
    (id) => funnel.stages.find((stage) => stage.id === id) ?? null,
  ).filter((stage): stage is FunnelStage => stage !== null);
  const rejected = funnel.stages.find((stage) => stage.id === "rejected");
  const maxCount = Math.max(...conversion.map((stage) => stage.count), 1);

  if (funnel.submittedCount === 0) {
    return (
      <p className="py-8 text-sm text-muted">{t.analytics.funnelEmpty}</p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-col">
        {conversion.map((stage, index) => {
          const next = conversion[index + 1] ?? null;
          return (
            <li
              key={stage.id}
              className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-5"
            >
              <FunnelBand stage={stage} next={next} maxCount={maxCount} />
              <StageCopy stage={stage} />
            </li>
          );
        })}
      </ol>

      {rejected && (
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            {t.analytics.funnelOutcome}
          </h3>
          <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-5">
            <div className="flex h-9 items-center" aria-hidden="true">
              <span
                className="h-9 max-w-full rounded-sm"
                style={{
                  width: `${rejected.percentOfApplied}%`,
                  background: FUNNEL_STAGE_FILL.rejected,
                  minWidth: rejected.count > 0 ? "0.5rem" : 0,
                }}
              />
            </div>
            <StageCopy stage={rejected} />
          </div>
        </div>
      )}
    </div>
  );
}
