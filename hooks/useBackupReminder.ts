"use client";

import { useCallback, useMemo, useState } from "react";
import {
  dismissBackupReminder,
  markBackupExported,
  shouldShowBackupReminder,
} from "@/lib/backup-reminder";

export function useBackupReminder(jobCount: number) {
  /** Bumped after export/dismiss so localStorage reads re-evaluate. */
  const [ackVersion, setAckVersion] = useState(0);

  const showReminder = useMemo(() => {
    void ackVersion;
    return shouldShowBackupReminder(jobCount);
  }, [jobCount, ackVersion]);

  const acknowledgeExport = useCallback(() => {
    markBackupExported(jobCount);
    setAckVersion((current) => current + 1);
  }, [jobCount]);

  const dismissReminder = useCallback(() => {
    dismissBackupReminder(jobCount);
    setAckVersion((current) => current + 1);
  }, [jobCount]);

  return { showReminder, acknowledgeExport, dismissReminder };
}
