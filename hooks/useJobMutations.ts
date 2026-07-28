"use client";

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
import type { JobApplication, JobFormValues } from "@/types/job";

type MutationSetters = {
  setJobs: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  setImporting: (value: boolean) => void;
  setSaving: (value: boolean) => void;
  setError: (value: string | null) => void;
  setCreateDraft: (value: JobFormValues | null) => void;
  setCreateMode: (value: "import" | "manual") => void;
  setCreateModalOpen: (value: boolean) => void;
  setEditModalOpen: (value: boolean) => void;
  setEditingJob: (value: JobApplication | null) => void;
  editingJob: JobApplication | null;
};

export function useJobMutations(setters: MutationSetters) {
  const {
    setJobs,
    setImporting,
    setSaving,
    setError,
    setCreateDraft,
    setCreateMode,
    setCreateModalOpen,
    setEditModalOpen,
    setEditingJob,
    editingJob,
  } = setters;

  async function handleImport(url: string) {
    setImporting(true);
    setError(null);
    try {
      const parsed = await parseJobFromUrl(url);
      setCreateDraft(parsedJobToFormValues(parsed));
      setCreateMode("import");
      setCreateModalOpen(true);
    } catch (importError) {
      setError(
        importError instanceof Error
          ? importError.message
          : "Failed to import job",
      );
    } finally {
      setImporting(false);
    }
  }

  async function handleCreateJob(values: JobFormValues) {
    setSaving(true);
    setError(null);
    try {
      const created = await createJobRequest(formValuesToPayload(values));
      setJobs((current) => [created, ...current]);
      setCreateModalOpen(false);
      setCreateDraft(null);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Failed to save job",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateJob(
    id: string,
    patch: Partial<JobApplication>,
  ): Promise<boolean> {
    setError(null);
    try {
      const updated = await updateJobRequest(id, patch);
      setJobs((current) =>
        current.map((job) => (job.id === id ? updated : job)),
      );
      return true;
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update job",
      );
      return false;
    }
  }

  async function handleEditSave(values: JobFormValues) {
    if (!editingJob) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await handleUpdateJob(
        editingJob.id,
        formValuesToPayload(values),
      );
      if (updated) {
        setEditModalOpen(false);
        setEditingJob(null);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this job application?")) return;
    setError(null);
    try {
      await deleteJobRequest(id);
      setJobs((current) => current.filter((job) => job.id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete job",
      );
    }
  }

  function handleAddManual() {
    setError(null);
    setCreateDraft(emptyJobFormValues());
    setCreateMode("manual");
    setCreateModalOpen(true);
  }

  return {
    handleImport,
    handleCreateJob,
    handleUpdateJob,
    handleEditSave,
    handleDelete,
    handleAddManual,
  };
}
