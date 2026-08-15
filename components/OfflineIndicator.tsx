"use client";

import { useLocale } from "@/components/LocaleProvider";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineIndicator() {
  const { t } = useLocale();
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
      {t.pwa.offline}
    </span>
  );
}
