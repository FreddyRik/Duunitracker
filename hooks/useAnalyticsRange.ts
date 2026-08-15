"use client";

import { useCallback, useMemo, useState } from "react";
import { resolvePresetRange, rollingFourWeekRange } from "@/lib/analytics";
import { todayDateString } from "@/lib/format";
import type { DateRange, RangePreset } from "@/types/analytics";

export function useAnalyticsRange() {
  const [preset, setPresetState] = useState<RangePreset>("rolling4Weeks");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const resolved = useMemo(
    () =>
      resolvePresetRange(preset, todayDateString(), {
        start: customStart,
        end: customEnd,
      }),
    [preset, customStart, customEnd],
  );

  const setPreset = useCallback(
    (next: RangePreset) => {
      if (next === "custom") {
        const current =
          resolved.error === null
            ? resolved.range
            : rollingFourWeekRange(todayDateString());
        setCustomStart((start) => start || current.start);
        setCustomEnd((end) => end || current.end);
      }
      setPresetState(next);
    },
    [resolved],
  );

  const range: DateRange = resolved.range;
  const rangeError = resolved.error;

  return {
    preset,
    setPreset,
    customStart,
    customEnd,
    setCustomStart,
    setCustomEnd,
    range,
    rangeError,
  };
}
