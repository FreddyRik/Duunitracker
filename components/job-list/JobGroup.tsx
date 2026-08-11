"use client";

import { useLocale } from "@/components/LocaleProvider";
import { statusLabel } from "@/lib/i18n";
import type { JobStatus } from "@/types/job";

export function JobGroup({
  status,
  count,
  children,
}: {
  status: JobStatus;
  count: number;
  children: React.ReactNode;
}) {
  const { t } = useLocale();

  return (
    <section>
      <div className="sticky top-14 z-20 flex items-center gap-3 bg-background/80 py-2 backdrop-blur-sm">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
          {statusLabel(t, status)}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span className="font-mono text-[11px] text-muted">{count}</span>
      </div>
      <ul className="border-t border-border">{children}</ul>
    </section>
  );
}
