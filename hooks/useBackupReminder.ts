"use client";

import { useCallback, useEffect, useState } from "react";
import {
  dismissBackupReminder,
  markBackupExported,
  shouldShowBackupReminder,
} from "@/lib/backup-reminder";

export function useBackupReminder(jobCount: number) {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    setShowReminder(shouldShowBackupReminder(jobCount));
  }, [jobCount]);

  const acknowledgeExport = useCallback(() => {
    markBackupExported(jobCount);
    setShowReminder(false);
  }, [jobCount]);

  const dismissReminder = useCallback(() => {
    dismissBackupReminder(jobCount);
    setShowReminder(false);
  }, [jobCount]);

  return { showReminder, acknowledgeExport, dismissReminder };
}
