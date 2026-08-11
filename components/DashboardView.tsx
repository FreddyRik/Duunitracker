"use client";

import { useEffect, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BackupReminderBanner } from "@/components/BackupReminderBanner";
import { CommandBar } from "@/components/CommandBar";
import { DetailPanel } from "@/components/DetailPanel";
import { ErrorStrip } from "@/components/ErrorStrip";
import { JobFormModal } from "@/components/JobFormModal";
import { JobList } from "@/components/JobList";
import { Kbd } from "@/components/Kbd";
import { useLocale } from "@/components/LocaleProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusTabs } from "@/components/StatusTabs";
import type { useDashboardState } from "@/hooks/useDashboardState";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { deriveBrandStatus, orderJobsForDisplay } from "@/lib/job-insights";

type DashboardState = ReturnType<typeof useDashboardState>;

export function DashboardView(state: DashboardState) {
  const { t } = useLocale();
  const {
    createModalOpen,
    commandBarOpen,
    setCommandBarOpen,
    statusFilter,
    filteredJobs,
    jobs,
    panelJob,
    openPanel,
    openPanelEdit,
    setActiveRowId,
  } = state;

  /** A successful import hands off to the confirm form. */
  useEffect(() => {
    if (createModalOpen) setCommandBarOpen(false);
  }, [createModalOpen, setCommandBarOpen]);

  /** Closing eagerly avoids a frame where both overlays are painted. */
  function handleAddManual() {
    setCommandBarOpen(false);
    state.handleAddManual();
  }

  const grouped = statusFilter === "All";
  const orderedJobs = useMemo(
    () => orderJobsForDisplay(filteredJobs, grouped),
    [filteredJobs, grouped],
  );
  const brandStatus = useMemo(() => deriveBrandStatus(jobs), [jobs]);

  useKeyboardShortcuts({
    enabled: !commandBarOpen && !createModalOpen && !panelJob,
    rows: orderedJobs,
    activeRowId: state.activeRowId,
    setActiveRowId,
    onOpenCommandBar: () => setCommandBarOpen(true),
    onOpenRow: openPanel,
    onEditRow: openPanelEdit,
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        search={state.search}
        onSearchChange={state.setSearch}
        onOpenCommandBar={() => setCommandBarOpen(true)}
        onAddManual={handleAddManual}
        jobCount={jobs.length}
        onExport={state.handleExport}
        onImportBackup={state.handleImportBackup}
        brandStatus={brandStatus}
      />

      {state.error && !commandBarOpen && (
        <ErrorStrip
          message={state.error}
          onDismiss={() => state.setError(null)}
        />
      )}

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 sm:px-6">
        {state.showBackupReminder && (
          <div className="pt-4">
            <BackupReminderBanner
              onExport={state.handleExport}
              onDismiss={state.dismissBackupReminder}
            />
          </div>
        )}

        <StatusTabs
          jobs={jobs}
          value={statusFilter}
          onChange={state.setStatusFilter}
        />

        <JobList
          jobs={orderedJobs}
          hasJobs={jobs.length > 0}
          grouped={grouped}
          activeRowId={state.activeRowId}
          onImport={() => setCommandBarOpen(true)}
          onClearFilters={state.clearFilters}
          onUpdate={state.handleUpdateJob}
          onEdit={openPanelEdit}
          onDelete={state.handleDelete}
          onOpen={openPanel}
        />

        {jobs.length > 0 && (
          <div className="hidden items-center justify-end gap-5 py-5 text-[11px] text-muted lg:flex">
            <span className="flex items-center gap-1.5">
              <Kbd>C</Kbd> {t.importBar.importJob}
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>/</Kbd> {t.filters.searchLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>J</Kbd>
              <Kbd>K</Kbd> {t.list.job}
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>E</Kbd> {t.actions.edit}
            </span>
          </div>
        )}
      </main>

      <div className="mx-auto w-full max-w-[1100px] px-4 pb-8 sm:px-6">
        <SiteFooter />
      </div>

      <CommandBar
        open={commandBarOpen}
        loading={state.importing}
        error={state.error}
        onImport={state.handleImport}
        onAddManual={handleAddManual}
        onClose={() => setCommandBarOpen(false)}
      />

      <DetailPanel
        job={panelJob}
        mode={state.panelMode}
        saving={state.saving}
        onClose={state.closePanel}
        onSetMode={state.setPanelMode}
        onUpdate={state.handleUpdateJob}
        onSave={state.handleEditSave}
        onDelete={state.handleDelete}
      />

      <JobFormModal
        key={
          state.createDraft
            ? `${state.createMode}-${state.createDraft.url || "manual"}`
            : "create-closed"
        }
        open={createModalOpen}
        mode={state.createMode}
        initialValues={state.createDraft ?? {}}
        saving={state.saving}
        onClose={state.closeCreate}
        onSave={state.handleCreateJob}
      />
    </div>
  );
}
