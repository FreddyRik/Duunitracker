import { statusDotStyles, statusRingStyles } from "@/lib/job-status-styles";
import type { JobStatus } from "@/types/job";

type StatusDotProps = {
  status: JobStatus;
  size?: "sm" | "md";
};

/**
 * Saved renders as a ring rather than a fill so it reads as "not started yet".
 */
export function StatusDot({ status, size = "md" }: StatusDotProps) {
  const dimension = size === "sm" ? "h-1.5 w-1.5" : "h-2.5 w-2.5";

  if (status === "Saved") {
    return (
      <span
        aria-hidden="true"
        className={`${dimension} shrink-0 rounded-full bg-transparent ring-1 ring-inset ${statusRingStyles.Saved} transition-colors`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${dimension} shrink-0 rounded-full transition-colors ${statusDotStyles[status]}`}
    />
  );
}
