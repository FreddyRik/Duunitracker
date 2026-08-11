"use client";

import { useEffect, useState } from "react";
import { PipelineRail } from "@/components/job-list/PipelineRail";
import { StatusDot } from "@/components/job-list/StatusDot";
import type { LandingPreviewJob } from "@/lib/i18n/types";
import type { JobStatus } from "@/types/job";

type LandingPreviewProps = {
  label: string;
  appName: string;
  jobs: LandingPreviewJob[];
};

/** The top row walks the pipeline on a loop; the rest hold steady behind it. */
const FEATURED_CYCLE: JobStatus[] = ["Saved", "Applied", "Interview", "Offer"];
const RESTING_STATUSES: JobStatus[] = ["Interview", "Applied", "Saved"];

const BEAT_MS = 2600;
const FRAME_DELAY_MS = 620;
const ROW_DELAY_MS = 820;
const ROW_STAGGER_MS = 90;

export function LandingPreview({ label, appName, jobs }: LandingPreviewProps) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => setBeat((current) => current + 1), BEAT_MS);
    return () => clearInterval(timer);
  }, []);

  const featuredStatus = FEATURED_CYCLE[beat % FEATURED_CYCLE.length];

  return (
    <div
      role="img"
      aria-label={label}
      className="landing-frame overflow-hidden border border-border bg-surface-solid shadow-2xl"
      style={{ animationDelay: `${FRAME_DELAY_MS}ms` }}
    >
      <div className="flex h-11 items-center gap-2 border-b border-border px-3.5">
        <span
          aria-hidden="true"
          className="h-2 w-2 rotate-45 rounded-[1px] bg-status-offer"
        />
        <span className="text-xs font-semibold tracking-tight text-foreground">
          {appName}
        </span>
        <span className="flex-1" />
        <span className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted">
          ⌘K
        </span>
      </div>

      <ul>
        {jobs.map((job, index) => {
          const featured = index === 0;
          const status = featured
            ? featuredStatus
            : RESTING_STATUSES[(index - 1) % RESTING_STATUSES.length];

          return (
            <li
              key={job.title}
              className="landing-row relative isolate flex items-center gap-3 border-b border-border px-3.5 py-3 last:border-b-0"
              style={{
                animationDelay: `${ROW_DELAY_MS + index * ROW_STAGGER_MS}ms`,
              }}
            >
              {featured && (
                <span
                  key={beat}
                  aria-hidden="true"
                  className="landing-beat absolute inset-0 -z-10 bg-row-active"
                />
              )}

              <PipelineRail status={status} />
              <StatusDot status={status} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-foreground">
                  {job.title}
                </p>
                <p className="truncate text-[11px] text-muted">{job.company}</p>
              </div>

              <span className="shrink-0 font-mono text-[11px] text-muted">
                {job.deadline}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
