"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { useBackupReminder } from "@/hooks/useBackupReminder";
import { useJobMutations } from "@/hooks/useJobMutations";
import { useModalState } from "@/hooks/useModalState";
import { filterJobs } from "@/lib/job-insights";
import {
  parseBackupDocument,
  readJobsDetailed,
  replaceJobs,
  serializeCurrentBackup,
} from "@/lib/jobs-local-store";
import { subscribeJobsChanged } from "@/lib/jobs-sync";
import { MAX_BACKUP_FILE_BYTES } from "@/lib/site-config";
import {
  skippedRecordsMessage,
  toUserFacingError,
} from "@/lib/user-facing-errors";
import type { DashboardViewId } from "@/types/analytics";
import type { JobApplication, JobListFilter } from "@/types/job";

export function useDashboardState() {
  const { t } = useLocale();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobListFilter>("All");
  const [dashboardView, setDashboardView] = useState<DashboardViewId>("list");
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const modals = useModalState();
  const backupReminder = useBackupReminder(jobs.length);
  const deferredSearch = useDeferredValue(search);
  const { acknowledgeExport, dismissReminder, showReminder } = backupReminder;

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const result = await readJobsDetailed();
        if (cancelled) return;
        setJobs(result.jobs);
        if (result.skippedCount > 0) {
          setError(skippedRecordsMessage(result.skippedCount, t));
        }
      } catch (loadError) {
        if (cancelled) return;
        setJobs([]);
        setError(toUserFacingError(loadError, t, t.errors.storageCorrupted));
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    void hydrate();

    const unsubscribe = subscribeJobsChanged(() => {
      void (async () => {
        try {
          const result = await readJobsDetailed();
          if (cancelled) return;
          setJobs(result.jobs);
        } catch (loadError) {
          if (cancelled) return;
          setError(
            toUserFacingError(loadError, t, t.errors.storageCorrupted),
          );
        }
      })();
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydrate once; locale catalog is enough for load errors
  }, []);

  const filteredJobs = useMemo(
    () =>
      filterJobs(jobs, { search: deferredSearch, status: statusFilter }),
    [jobs, deferredSearch, statusFilter],
  );

  const panelJob = useMemo(
    () => jobs.find((job) => job.id === modals.panelJobId) ?? null,
    [jobs, modals.panelJobId],
  );

  const mutations = useJobMutations({
    setJobs,
    setImporting,
    setSaving,
    setError,
    setCreateDraft: modals.setCreateDraft,
    setCreateMode: modals.setCreateMode,
    setCreateModalOpen: modals.setCreateModalOpen,
  });

  const clearFilters = useCallback(() => {
    setSearch("");
    setStatusFilter("All");
  }, []);

  const handleExport = useCallback(async () => {
    setError(null);
    try {
      const blob = new Blob([await serializeCurrentBackup(jobs)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `job-applications-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      acknowledgeExport();
    } catch (exportError) {
      setError(toUserFacingError(exportError, t, t.errors.importBackupFailed));
    }
  }, [jobs, t, acknowledgeExport]);

  const handleImportBackup = useCallback(
    async (file: File) => {
      setError(null);
      if (file.size > MAX_BACKUP_FILE_BYTES) {
        setError(t.errors.importTooLarge);
        return;
      }
      if (file.size === 0) {
        setError(t.errors.importEmpty);
        return;
      }

      try {
        const raw = await file.text();
        const imported = parseBackupDocument(raw);
        const merged = await replaceJobs(imported.jobs, imported.attachments);
        setJobs(merged);
      } catch (importError) {
        setError(
          toUserFacingError(importError, t, t.errors.importBackupFailed),
        );
      }
    },
    [t],
  );

  return {
    jobs,
    filteredJobs,
    hydrated,
    importing,
    saving,
    error,
    search,
    statusFilter,
    dashboardView,
    commandBarOpen,
    activeRowId,
    panelJob,
    setSearch,
    setStatusFilter,
    setDashboardView,
    setCommandBarOpen,
    setActiveRowId,
    setError,
    clearFilters,
    handleExport,
    handleImportBackup,
    showBackupReminder: showReminder,
    dismissBackupReminder: dismissReminder,
    ...modals,
    ...mutations,
  };
}
