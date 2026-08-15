"use client";

import { inputClassName } from "@/components/JobFormField";
import { useLocale } from "@/components/LocaleProvider";
import { RANGE_PRESETS, type RangePreset } from "@/types/analytics";

type DateRangePickerProps = {
  preset: RangePreset;
  customStart: string;
  customEnd: string;
  rangeError: "invalid" | "order" | null;
  onPresetChange: (preset: RangePreset) => void;
  onCustomStartChange: (value: string) => void;
  onCustomEndChange: (value: string) => void;
};

const PRESET_LABEL: Record<RangePreset, "presetRolling" | "presetThisMonth" | "presetLastMonth" | "presetCustom"> =
  {
    rolling4Weeks: "presetRolling",
    thisMonth: "presetThisMonth",
    lastMonth: "presetLastMonth",
    custom: "presetCustom",
  };

export function DateRangePicker({
  preset,
  customStart,
  customEnd,
  rangeError,
  onPresetChange,
  onCustomStartChange,
  onCustomEndChange,
}: DateRangePickerProps) {
  const { t } = useLocale();
  const errorMessage =
    rangeError === "invalid"
      ? t.analytics.invalidRange
      : rangeError === "order"
        ? t.analytics.rangeOrder
        : null;

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-strong">
        {t.analytics.rangeLabel}
      </p>
      <div
        role="group"
        aria-label={t.analytics.rangeLabel}
        className="flex flex-wrap gap-1"
      >
        {RANGE_PRESETS.map((value) => {
          const active = preset === value;
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              onClick={() => onPresetChange(value)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                active
                  ? "bg-accent text-accent-fg"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              {t.analytics[PRESET_LABEL[value]]}
            </button>
          );
        })}
      </div>

      {preset === "custom" && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-medium text-muted-strong">
              {t.analytics.rangeFrom}
            </span>
            <input
              type="date"
              value={customStart}
              onChange={(event) => onCustomStartChange(event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-xs font-medium text-muted-strong">
              {t.analytics.rangeTo}
            </span>
            <input
              type="date"
              value={customEnd}
              onChange={(event) => onCustomEndChange(event.target.value)}
              className={inputClassName}
            />
          </label>
        </div>
      )}

      {errorMessage && (
        <p className="mt-2 text-xs text-danger" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
