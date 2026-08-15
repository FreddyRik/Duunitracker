"use client";

import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { ProgressRing } from "@/components/analytics/ProgressRing";
import { WeekBars } from "@/components/analytics/WeekBars";
import { useLocale } from "@/components/LocaleProvider";
import { formatTemplate } from "@/lib/i18n";
import type { QuotaProgress, RangePreset } from "@/types/analytics";

type QuotaTrackerProps = {
  quota: QuotaProgress;
  preset: RangePreset;
  customStart: string;
  customEnd: string;
  rangeError: "invalid" | "order" | null;
  onPresetChange: (preset: RangePreset) => void;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
};

export function QuotaTracker({
  quota,
  preset,
  customStart,
  customEnd,
  rangeError,
  onPresetChange,
  onCustomStartChange,
  onCustomEndChange,
}: QuotaTrackerProps) {
  const { t } = useLocale();
  const caption = quota.met
    ? t.analytics.quotaMet
    : formatTemplate(t.analytics.quotaShort, { remaining: quota.remaining });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
      <DateRangePicker
        preset={preset}
        customStart={customStart}
        customEnd={customEnd}
        rangeError={rangeError}
        onPresetChange={onPresetChange}
        onCustomStartChange={onCustomStartChange}
        onCustomEndChange={onCustomEndChange}
      />

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-between">
        <ProgressRing
          value={quota.appliedCount}
          max={quota.targetCount}
          label={formatTemplate(t.analytics.quotaCount, {
            applied: quota.appliedCount,
            target: quota.targetCount,
          })}
          caption={caption}
          met={quota.met}
        />
        <div className="min-w-0 flex-1">
          <WeekBars weeks={quota.weeks} />
          <p className="mt-1 text-[11px] text-muted">{t.analytics.pacingHint}</p>
        </div>
      </div>
    </div>
  );
}
