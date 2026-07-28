"use client";

import { useEffect, useMemo, useState } from "react";
import { useJobMutations } from "@/hooks/useJobMutations";
import { useModalState } from "@/hooks/useModalState";
import { parseJobsImport, readJobs, replaceJobs } from "@/lib/jobs-local-store";
import { ValidationError } from "@/lib/validate";
import type { JobApplication, JobListFilter } from "@/types/job";

export function useDashboardState() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobListFilter>("All");
  const modals = useModalState();

  useEffect(() => {
    setJobs(readJobs());
    setHydrated(true);
  }, []);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === "All"
          ? true
          : statusFilter === "InProgress"
            ? job.status === "Interview" || job.status === "Offer"
            : job.status === statusFilter;
      const matchesSearch =
        query.length === 0
          ? true
          : job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            (job.description?.toLowerCase().includes(query) ?? false);
      return matchesStatus && matchesSearch;
    });
  }, [jobs, search, statusFilter]);

  const mutations = useJobMutations({
    setJobs,
    setImporting,
    setSaving,
    setError,
    setCreateDraft: modals.setCreateDraft,
    setCreateMode: modals.setCreateMode,
    setCreateModalOpen: modals.setCreateModalOpen,
    setEditModalOpen: modals.setEditModalOpen,
    setEditingJob: modals.setEditingJob,
    editingJob: modals.editingJob,
  });

  function handleExport() {
    setError(null);
    const blob = new Blob([`${JSON.stringify(jobs, null, 2)}\n`], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `job-applications-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportBackup(file: File) {
    setError(null);
    try {
      const raw = await file.text();
      const imported = parseJobsImport(raw);
      const merged = replaceJobs(imported);
      setJobs(merged);
    } catch (importError) {
      if (importError instanceof ValidationError) {
        setError(importError.message);
        return;
      }
      if (importError instanceof SyntaxError) {
        setError("Import file is not valid JSON");
        return;
      }
      setError(
        importError instanceof Error
          ? importError.message
          : "Failed to import backup",
      );
    }
  }

  return {
    jobs,
    filteredJobs,
    hydrated,
    importing,
    saving,
    error,
    search,
    statusFilter,
    setSearch,
    setStatusFilter,
    handleExport,
    handleImportBackup,
    ...modals,
    ...mutations,
  };
}
