"use client";

import { useRef } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { nextIndexOnArrowKey } from "@/lib/keyboard";
import type { DashboardViewId } from "@/types/analytics";

type AnalyticsViewToggleProps = {
  value: DashboardViewId;
  onChange: (view: DashboardViewId) => void;
};

const TABS: DashboardViewId[] = ["list", "analytics"];

export function AnalyticsViewToggle({
  value,
  onChange,
}: AnalyticsViewToggleProps) {
  const { t } = useLocale();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = TABS.indexOf(value);

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const next = nextIndexOnArrowKey(event.key, index, TABS.length);
    if (next === null) return;
    event.preventDefault();
    onChange(TABS[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={t.analytics.title}
      className="no-print flex gap-1 pt-4"
    >
      {TABS.map((view, index) => {
        const active = value === view;
        const label =
          view === "list"
            ? t.analytics.navApplications
            : t.analytics.navReports;
        return (
          <button
            key={view}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`dashboard-tab-${view}`}
            aria-controls={`dashboard-panel-${view}`}
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(view)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              active
                ? "bg-surface-muted text-foreground"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
