"use client";

import { Kbd } from "@/components/Kbd";
import { useLocale } from "@/components/LocaleProvider";

type EmptyStateProps = {
  variant: "empty" | "no-match";
  onImport: () => void;
  onClearFilters: () => void;
};

/** A ghost of the interface itself, rather than clip-art. */
function SkeletonRows() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 top-0 opacity-30">
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          className="flex h-14 items-center gap-3 border-b border-border px-3"
        >
          <span className="flex h-7 w-[3px] flex-col-reverse gap-[2px]">
            {[0, 1, 2, 3].map((segment) => (
              <span key={segment} className="flex-1 rounded-full bg-rail-track" />
            ))}
          </span>
          <span className="h-2.5 w-2.5 rounded-full bg-rail-track" />
          <span className="flex flex-1 flex-col gap-1.5">
            <span
              className="h-2 rounded bg-rail-track"
              style={{ width: `${42 - row * 8}%` }}
            />
            <span
              className="h-2 rounded bg-rail-track"
              style={{ width: `${24 - row * 4}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  variant,
  onImport,
  onClearFilters,
}: EmptyStateProps) {
  const { t } = useLocale();
  const isEmpty = variant === "empty";

  return (
    <div className="relative overflow-hidden pt-2">
      <SkeletonRows />

      <div className="relative flex flex-col items-center px-6 py-20 text-center">
        <h2 className="text-base font-semibold text-foreground">
          {isEmpty ? t.list.emptyTitle : t.list.noMatchTitle}
        </h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
          {isEmpty ? t.app.intro : t.list.noMatchHint}
        </p>

        {isEmpty ? (
          <button
            type="button"
            onClick={onImport}
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover"
          >
            {t.importBar.importJob}
            <Kbd>C</Kbd>
          </button>
        ) : (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-6 inline-flex items-center rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface-muted"
          >
            {t.ui.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
}
