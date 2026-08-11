"use client";

import { useEffect, useRef, useState } from "react";
import { StatusDot } from "@/components/job-list/StatusDot";
import { useLocale } from "@/components/LocaleProvider";
import { statusLabel } from "@/lib/i18n";
import { countByFilter } from "@/lib/job-insights";
import type { JobApplication, JobListFilter, JobStatus } from "@/types/job";

type StatusTabsProps = {
  jobs: JobApplication[];
  value: JobListFilter;
  onChange: (filter: JobListFilter) => void;
};

/** Real statuses render a dot; composite filters do not. */
const TABS: { filter: JobListFilter; status: JobStatus | null }[] = [
  { filter: "All", status: null },
  { filter: "Saved", status: "Saved" },
  { filter: "Applied", status: "Applied" },
  { filter: "InProgress", status: null },
  { filter: "Interview", status: "Interview" },
  { filter: "Offer", status: "Offer" },
  { filter: "Rejected", status: "Rejected" },
];

export function StatusTabs({ jobs, value, onChange }: StatusTabsProps) {
  const { t } = useLocale();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const activeIndex = TABS.findIndex((tab) => tab.filter === value);

  /** Label and count widths both shift the underline, so remeasure on either. */
  useEffect(() => {
    const node = tabRefs.current[activeIndex];
    if (!node) return;
    setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
  }, [activeIndex, jobs, t]);

  function labelFor(filter: JobListFilter, status: JobStatus | null): string {
    if (filter === "All") return t.ui.all;
    if (filter === "InProgress") return t.filters.inProgress;
    return statusLabel(t, status as JobStatus);
  }

  return (
    <div
      role="tablist"
      aria-label={t.filters.statusLabel}
      className="relative -mx-4 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0"
    >
      <div className="relative flex w-max items-center gap-1">
        {TABS.map((tab, index) => {
          const active = tab.filter === value;
          const count = countByFilter(jobs, tab.filter);

          return (
            <button
              key={tab.filter}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(tab.filter)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-t-md px-3 py-2.5 text-xs transition-colors ${
                active
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted hover:text-foreground"
              }`}
            >
              {tab.status && <StatusDot status={tab.status} size="sm" />}
              <span>{labelFor(tab.filter, tab.status)}</span>
              <span
                className={`font-mono text-[11px] ${
                  active ? "text-muted-strong" : "text-muted"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}

        <span
          aria-hidden="true"
          className="absolute bottom-0 h-[2px] bg-accent transition-all duration-200"
          style={{
            left: `${indicator.left}px`,
            width: `${indicator.width}px`,
            transitionTimingFunction: "var(--ease-spring)",
          }}
        />
      </div>
    </div>
  );
}
