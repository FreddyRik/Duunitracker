"use client";

import { useCallback } from "react";
import { useLocale } from "@/components/LocaleProvider";
import {
  createJobRequest,
  deleteJobRequest,
  parseJobFromUrl,
  updateJobRequest,
} from "@/lib/jobs-api";
import {
  emptyJobFormValues,
  formValuesToPayload,
  parsedJobToFormValues,
} from "@/lib/job-form-mappers";
import { toUserFacingError } from "@/lib/user-facing-errors";
import type { JobApplication, JobFormValues } from "@/types/job";

type MutationSetters = {
  setJobs: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  setImporting: (value: boolean) => void;
  setSaving: (value: boolean) => void;
  setError: (value: string | null) => void;
  setCreateDraft: (value: JobFormValues | null) => void;
  setCreateMode: (value: "import" | "manual") => void;
  setCreateModalOpen: (value: boolean) => void;
};

export function useJobMutations(setters: MutationSetters) {
  const { t } = useLocale();
  const {
    setJobs,
    setImporting,
    setSaving,
    setError,
    setCreateDraft,
    setCreateMode,
    setCreateModalOpen,
  } = setters;

  const handleImport = useCallback(
    async (url: string) => {
      setImporting(true);
      setError(null);
      try {
        const parsed = await parseJobFromUrl(url);
        setCreateDraft(parsedJobToFormValues(parsed));
        setCreateMode("import");
        setCreateModalOpen(true);
      } catch (importError) {
        setError(toUserFacingError(importError, t, t.errors.importJobFailed));
      } finally {
        setImporting(false);
      }
    },
    [
      t,
      setImporting,
      setError,
      setCreateDraft,
      setCreateMode,
      setCreateModalOpen,
    ],
  );

  const handleCreateJob = useCallback(
    async (values: JobFormValues) => {
      setSaving(true);
      setError(null);
      try {
        const created = await createJobRequest(formValuesToPayload(values));
        setJobs((current) => [created, ...current]);
        setCreateModalOpen(false);
        setCreateDraft(null);
      } catch (saveError) {
        setError(toUserFacingError(saveError, t, t.errors.saveJobFailed));
      } finally {
        setSaving(false);
      }
    },
    [t, setJobs, setSaving, setError, setCreateModalOpen, setCreateDraft],
  );

  const handleUpdateJob = useCallback(
    async (
      id: string,
      patch: Partial<JobApplication>,
    ): Promise<boolean> => {
      setError(null);
      try {
        const updated = await updateJobRequest(id, patch);
        setJobs((current) =>
          current.map((job) => (job.id === id ? updated : job)),
        );
        return true;
      } catch (updateError) {
        setError(toUserFacingError(updateError, t, t.errors.updateJobFailed));
        return false;
      }
    },
    [t, setJobs, setError],
  );

  const handleEditSave = useCallback(
    async (id: string, values: JobFormValues): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        return await handleUpdateJob(id, formValuesToPayload(values));
      } finally {
        setSaving(false);
      }
    },
    [handleUpdateJob, setSaving, setError],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm(t.errors.deleteConfirm)) return;
      setError(null);
      try {
        await deleteJobRequest(id);
        setJobs((current) => current.filter((job) => job.id !== id));
      } catch (deleteError) {
        setError(toUserFacingError(deleteError, t, t.errors.deleteJobFailed));
      }
    },
    [t, setJobs, setError],
  );

  const handleAddManual = useCallback(() => {
    setError(null);
    setCreateDraft(emptyJobFormValues());
    setCreateMode("manual");
    setCreateModalOpen(true);
  }, [setError, setCreateDraft, setCreateMode, setCreateModalOpen]);

  return {
    handleImport,
    handleCreateJob,
    handleUpdateJob,
    handleEditSave,
    handleDelete,
    handleAddManual,
  };
}
