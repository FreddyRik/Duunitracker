"use client";

import { useMemo, useState } from "react";
import {
  emptyJobFormValues,
  formValuesToPayload,
  JobFormModal,
  jobToFormValues,
  parsedJobToFormValues,
} from "@/components/JobFormModal";
import { JobDescriptionModal } from "@/components/JobDescriptionModal";
import { JobFilters } from "@/components/JobFilters";
import { JobList } from "@/components/JobList";
import { SummaryStats } from "@/components/SummaryStats";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { UrlImportBar } from "@/components/UrlImportBar";
import type { JobApplication, JobStatus, ParsedJob } from "@/lib/types";

type DashboardProps = {
  initialJobs: JobApplication[];
};

export function Dashboard({ initialJobs }: DashboardProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [importing, setImporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "All">("All");

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"import" | "manual">("import");
  const [createDraft, setCreateDraft] = useState<ReturnType<
    typeof emptyJobFormValues
  > | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [viewingJob, setViewingJob] = useState<JobApplication | null>(null);

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesStatus =
        statusFilter === "All" ? true : job.status === statusFilter;
      const matchesSearch =
        query.length === 0
          ? true
          : job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            (job.description?.toLowerCase().includes(query) ?? false);

      return matchesStatus && matchesSearch;
    });
  }, [jobs, search, statusFilter]);

  async function handleImport(url: string) {
    setImporting(true);
    setError(null);

    try {
      const response = await fetch("/api/parse-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = (await response.json()) as ParsedJob & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to parse job posting");
      }

      setCreateDraft(parsedJobToFormValues(data));
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

  function handleAddManual() {
    setError(null);
    setCreateDraft(emptyJobFormValues());
    setCreateMode("manual");
    setCreateModalOpen(true);
  }

  async function handleCreateJob(
    values: ReturnType<typeof emptyJobFormValues>,
  ) {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValuesToPayload(values)),
      });

      const data = (await response.json()) as JobApplication & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save job");
      }

      setJobs((current) => [data, ...current]);
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
      const response = await fetch("/api/jobs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });

      const data = (await response.json()) as JobApplication & {
        error?: string;
      };

      if (!response.ok) {
        setError(data.error ?? "Failed to update job");
        return false;
      }

      setJobs((current) =>
        current.map((job) => (job.id === id ? data : job)),
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

  async function handleEditSave(values: ReturnType<typeof jobToFormValues>) {
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
      const response = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Failed to delete job");
        return;
      }

      setJobs((current) => current.filter((job) => job.id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete job",
      );
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Local tracker
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Job Application Tracker
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
              Import Duunitori postings or add jobs manually, then track your
              applications locally on this machine.
            </p>
          </div>
          <ThemeSwitcher />
        </div>
      </header>

      <section className="mb-6">
        <SummaryStats jobs={jobs} />
      </section>

      <section className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-sm backdrop-blur">
        <UrlImportBar
          onImport={handleImport}
          onAddManual={handleAddManual}
          loading={importing}
        />
        {error && (
          <p className="mt-3 rounded-xl border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}
      </section>

      <section className="mb-4">
        <JobFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusFilterChange={setStatusFilter}
        />
      </section>

      <section>
        <JobList
          jobs={filteredJobs}
          hasJobs={jobs.length > 0}
          onUpdate={handleUpdateJob}
          onEdit={(job) => {
            setEditingJob(job);
            setEditModalOpen(true);
          }}
          onDelete={handleDelete}
          onViewDescription={setViewingJob}
        />
      </section>

      <JobDescriptionModal
        job={viewingJob}
        onClose={() => setViewingJob(null)}
      />

      <JobFormModal
        key={
          createDraft
            ? `${createMode}-${createDraft.url || "manual"}`
            : "create-closed"
        }
        open={createModalOpen}
        mode={createMode}
        initialValues={createDraft ?? {}}
        saving={saving}
        onClose={() => {
          setCreateModalOpen(false);
          setCreateDraft(null);
        }}
        onSave={handleCreateJob}
      />

      <JobFormModal
        key={editingJob ? `edit-${editingJob.id}` : "edit-closed"}
        open={editModalOpen}
        mode="edit"
        initialValues={editingJob ? jobToFormValues(editingJob) : {}}
        saving={saving}
        onClose={() => {
          setEditModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleEditSave}
      />
    </main>
  );
}
