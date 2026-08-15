"use client";

import { useLocale } from "@/components/LocaleProvider";
import { FUNNEL_STAGE_FILL } from "@/lib/analytics/colors";
import { formatTemplate, funnelStageLabel } from "@/lib/i18n";
import type { FunnelReport, FunnelStage } from "@/types/analytics";

type ApplicationFunnelProps = {
  funnel: FunnelReport;
};

const SVG_WIDTH = 280;
const STAGE_HEIGHT = 40;

function barWidth(count: number, maxCount: number): number {
  const min = 48;
  if (maxCount <= 0) return min;
  return min + ((SVG_WIDTH - min) * count) / maxCount;
}

function StageShape({
  stage,
  next,
  maxCount,
}: {
  stage: FunnelStage;
  next: FunnelStage | null;
  maxCount: number;
}) {
  const top = barWidth(stage.count, maxCount);
  const bottom = barWidth(next?.count ?? stage.count, maxCount);
  const topLeft = (SVG_WIDTH - top) / 2;
  const bottomLeft = (SVG_WIDTH - bottom) / 2;
  const points = [
    `${topLeft},0`,
    `${topLeft + top},0`,
    `${bottomLeft + bottom},${STAGE_HEIGHT}`,
    `${bottomLeft},${STAGE_HEIGHT}`,
  ].join(" ");

  return (
    <svg
      viewBox={`0 0 ${SVG_WIDTH} ${STAGE_HEIGHT}`}
      className="h-10 w-full max-w-xs"
      aria-hidden="true"
    >
      <polygon
        points={points}
        fill={FUNNEL_STAGE_FILL[stage.id]}
        opacity={stage.id === "rejected" ? 0.72 : 0.92}
      />
    </svg>
  );
}

export function ApplicationFunnel({ funnel }: ApplicationFunnelProps) {
  const { t } = useLocale();
  const { stages } = funnel;
  const maxCount = Math.max(...stages.map((stage) => stage.count), 1);

  if (funnel.submittedCount === 0) {
    return (
      <p className="py-8 text-sm text-muted">{t.analytics.funnelEmpty}</p>
    );
  }

  return (
    <ol className="flex flex-col">
      {stages.map((stage, index) => {
        const next = stages[index + 1] ?? null;
        const taperTo =
          stage.id === "rejected" || next?.id === "rejected" ? null : next;

        return (
          <li key={stage.id}>
            {stage.dropOffPercent !== null && stage.dropOffPercent > 0 && (
              <p className="py-1.5 text-center text-[11px] text-muted">
                {formatTemplate(t.analytics.dropOff, {
                  percent: stage.dropOffPercent,
                })}
              </p>
            )}
            <div className="flex items-center gap-4">
              <StageShape stage={stage} next={taperTo} maxCount={maxCount} />
              <div className="min-w-[9rem] shrink-0">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {funnelStageLabel(t, stage.id)}
                  </span>
                  <span className="font-mono text-xs text-muted-strong">
                    {stage.count}
                  </span>
                </div>
                <p className="text-[11px] text-muted">
                  {formatTemplate(t.analytics.ofApplied, {
                    percent: stage.percentOfApplied,
                  })}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
