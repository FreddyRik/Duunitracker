"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { StatusDot } from "@/components/job-list/StatusDot";
import { useLocale } from "@/components/LocaleProvider";
import { statusLabel } from "@/lib/i18n";
import type { Messages } from "@/lib/i18n/types";
import { countAllFilters } from "@/lib/job-insights";
import { nextIndexOnArrowKey } from "@/lib/keyboard";
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

function labelFor(
  filter: JobListFilter,
  status: JobStatus | null,
  allLabel: string,
  inProgressLabel: string,
  catalog: Messages,
): string {
  if (filter === "All") return allLabel;
  if (filter === "InProgress") return inProgressLabel;
  if (!status) return filter;
  return statusLabel(catalog, status);
}

function StatusTabsComponent({ jobs, value, onChange }: StatusTabsProps) {
  const { t } = useLocale();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const counts = useMemo(() => countAllFilters(jobs), [jobs]);

  const activeIndex = TABS.findIndex((tab) => tab.filter === value);

  /** Label and count widths both shift the underline, so remeasure on either. */
  useEffect(() => {
    const node = tabRefs.current[activeIndex];
    if (!node) return;
    setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
  }, [activeIndex, counts, t]);

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const next = nextIndexOnArrowKey(event.key, index, TABS.length);
    if (next === null) return;
    event.preventDefault();
    onChange(TABS[next].filter);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={t.filters.statusLabel}
      className="no-print relative -mx-4 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0"
    >
      <div className="relative flex w-max items-center gap-1">
        {TABS.map((tab, index) => {
          const active = tab.filter === value;
          const count = counts[tab.filter];

          return (
            <button
              key={tab.filter}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              type="button"
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              onClick={() => onChange(tab.filter)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-t-md px-3 py-2.5 text-xs transition-colors ${
                active
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted hover:text-foreground"
              }`}
            >
              {tab.status && <StatusDot status={tab.status} size="sm" />}
              <span>
                {labelFor(
                  tab.filter,
                  tab.status,
                  t.ui.all,
                  t.filters.inProgress,
                  t,
                )}
              </span>
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

export const StatusTabs = memo(StatusTabsComponent);
