type ProgressRingProps = {
  value: number;
  max: number;
  label: string;
  caption: string;
  met: boolean;
};

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRing({
  value,
  max,
  label,
  caption,
  met,
}: ProgressRingProps) {
  const progress = max <= 0 ? 0 : Math.min(value / max, 1);
  const dash = CIRCUMFERENCE * progress;
  const stroke = met ? "var(--status-offer)" : "var(--status-applied)";

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 140 140"
        className="h-36 w-36"
        role="img"
        aria-label={`${label}. ${caption}`}
      >
        <circle
          cx="70"
          cy="70"
          r={RADIUS}
          fill="none"
          stroke="var(--rail-track)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={RADIUS}
          fill="none"
          stroke={stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
          transform="rotate(-90 70 70)"
        />
        <text
          x="70"
          y="66"
          textAnchor="middle"
          fill="var(--foreground)"
          style={{ fontSize: "22px", fontWeight: 600 }}
        >
          {label}
        </text>
        <text
          x="70"
          y="86"
          textAnchor="middle"
          fill="var(--muted)"
          style={{ fontSize: "11px" }}
        >
          {caption}
        </text>
      </svg>
    </div>
  );
}
