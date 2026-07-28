"use client";

import { DataBackupControls } from "@/components/DataBackupControls";
import { JobDescriptionModal } from "@/components/JobDescriptionModal";
import { JobFilters } from "@/components/JobFilters";
import { JobFormModal } from "@/components/JobFormModal";
import { JobList } from "@/components/JobList";
import { SiteFooter } from "@/components/SiteFooter";
import { SummaryStats } from "@/components/SummaryStats";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { UrlImportBar } from "@/components/UrlImportBar";
import type { useDashboardState } from "@/hooks/useDashboardState";
import { jobToFormValues } from "@/lib/job-form-mappers";

type DashboardState = ReturnType<typeof useDashboardState>;

export function DashboardView(state: DashboardState) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Browser tracker
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Job Application Tracker
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
              Import Duunitori postings or add jobs manually. Your applications
              stay in this browser only.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <ThemeSwitcher />
            <DataBackupControls
              jobCount={state.jobs.length}
              onExport={state.handleExport}
              onImport={state.handleImportBackup}
            />
          </div>
        </div>
      </header>

      <section className="mb-6">
        <SummaryStats
          jobs={state.jobs}
          statusFilter={state.statusFilter}
          onFilterChange={state.setStatusFilter}
        />
      </section>

      <section className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-sm backdrop-blur">
        <UrlImportBar
          onImport={state.handleImport}
          onAddManual={state.handleAddManual}
          loading={state.importing}
        />
        {state.error && (
          <p className="mt-3 rounded-xl border border-danger-border bg-danger-bg px-3 py-2 text-sm text-danger">
            {state.error}
          </p>
        )}
      </section>

      <section className="mb-4">
        <JobFilters
          search={state.search}
          statusFilter={state.statusFilter}
          onSearchChange={state.setSearch}
          onStatusFilterChange={state.setStatusFilter}
        />
      </section>

      <section>
        <JobList
          jobs={state.filteredJobs}
          hasJobs={state.jobs.length > 0}
          onUpdate={state.handleUpdateJob}
          onEdit={state.openEdit}
          onDelete={state.handleDelete}
          onViewDescription={state.setViewingJob}
        />
      </section>

      <SiteFooter />

      <JobDescriptionModal
        job={state.viewingJob}
        onClose={() => state.setViewingJob(null)}
      />

      <JobFormModal
        key={
          state.createDraft
            ? `${state.createMode}-${state.createDraft.url || "manual"}`
            : "create-closed"
        }
        open={state.createModalOpen}
        mode={state.createMode}
        initialValues={state.createDraft ?? {}}
        saving={state.saving}
        onClose={state.closeCreate}
        onSave={state.handleCreateJob}
      />

      <JobFormModal
        key={state.editingJob ? `edit-${state.editingJob.id}` : "edit-closed"}
        open={state.editModalOpen}
        mode="edit"
        initialValues={
          state.editingJob ? jobToFormValues(state.editingJob) : {}
        }
        saving={state.saving}
        onClose={state.closeEdit}
        onSave={state.handleEditSave}
      />
    </main>
  );
}
