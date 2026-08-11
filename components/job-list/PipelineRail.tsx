import {
  PIPELINE_SEGMENTS,
  STATUS_PIPELINE_INDEX,
  statusDotStyles,
} from "@/lib/job-status-styles";
import type { JobStatus } from "@/types/job";

/**
 * Four-segment vertical spine showing how far an application has progressed.
 * Decorative only — StatusDot carries the accessible label.
 */
export function PipelineRail({ status }: { status: JobStatus }) {
  const filled = STATUS_PIPELINE_INDEX[status];
  const closed = status === "Rejected";

  return (
    <span
      aria-hidden="true"
      className={`flex h-7 w-[3px] shrink-0 flex-col-reverse gap-[2px] ${
        closed ? "opacity-40" : ""
      }`}
    >
      {Array.from({ length: PIPELINE_SEGMENTS }, (_, index) => {
        const isFilled = index < filled;
        return (
          <span
            key={index}
            className={`flex-1 rounded-full ${
              isFilled ? `${statusDotStyles[status]} rail-segment` : "bg-rail-track"
            }`}
            style={isFilled ? { animationDelay: `${index * 60}ms` } : undefined}
          />
        );
      })}
    </span>
  );
}
