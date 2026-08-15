import { formatDate } from "@/lib/format";
import { formatTemplate } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";
import type { QuotaWeek } from "@/types/analytics";

type WeekBarsProps = {
  weeks: QuotaWeek[];
};

export function WeekBars({ weeks }: WeekBarsProps) {
  const { t } = useLocale();
  if (weeks.length === 0) return null;

  const max = Math.max(
    ...weeks.map((week) => Math.max(week.count, week.pacingTarget)),
    1,
  );
  const barWidth = 28;
  const gap = 12;
  const chartHeight = 96;
  const width = weeks.length * barWidth + (weeks.length - 1) * gap;
  const pacingY = chartHeight - (weeks[0].pacingTarget / max) * chartHeight;
  const svgWidth = Math.max(width, 240);

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgWidth} ${chartHeight + 28}`}
        width={svgWidth}
        height={144}
        className="max-w-none"
        role="img"
        aria-label={t.analytics.pacingHint}
      >
        <line
          x1="0"
          x2={width}
          y1={pacingY}
          y2={pacingY}
          stroke="var(--border-strong)"
          strokeDasharray="4 4"
        />
        {weeks.map((week, index) => {
          const height = (week.count / max) * chartHeight;
          const x = index * (barWidth + gap);
          const y = chartHeight - height;
          const met = week.count >= week.pacingTarget;
          return (
            <g key={`${week.start}-${week.end}`}>
              <title>
                {formatTemplate(t.analytics.weekLabel, { index: index + 1 })}
                {`: ${week.count} (${formatDate(week.start)} – ${formatDate(week.end)})`}
              </title>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(height, week.count === 0 ? 0 : 2)}
                rx="3"
                fill={met ? "var(--status-offer)" : "var(--status-applied)"}
                opacity="0.9"
              />
              <text
                x={x + barWidth / 2}
                y={chartHeight + 16}
                textAnchor="middle"
                fill="var(--muted)"
                style={{ fontSize: "10px" }}
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
