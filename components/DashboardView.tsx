"use client";

import { useCallback, useEffect, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AnalyticsSection } from "@/components/analytics/AnalyticsSection";
import { AnalyticsViewToggle } from "@/components/analytics/AnalyticsViewToggle";
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
import { deriveBrandStatus, groupByStatus } from "@/lib/job-insights";

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
    setError,
    setSearch,
    setStatusFilter,
    setDashboardView,
    handleAddManual,
    handleExport,
    handleImportBackup,
    handleUpdateJob,
    handleDelete,
    handleImport,
    handleCreateJob,
    handleEditSave,
    closePanel,
    closeCreate,
    clearFilters,
  } = state;

  const openCommandBar = useCallback(
    () => setCommandBarOpen(true),
    [setCommandBarOpen],
  );
  const closeCommandBar = useCallback(
    () => setCommandBarOpen(false),
    [setCommandBarOpen],
  );
  const dismissError = useCallback(() => setError(null), [setError]);

  /** A successful import hands off to the confirm form. */
  useEffect(() => {
    if (createModalOpen) setCommandBarOpen(false);
  }, [createModalOpen, setCommandBarOpen]);

  /** Closing eagerly avoids a frame where both overlays are painted. */
  const onAddManual = useCallback(() => {
    setCommandBarOpen(false);
    handleAddManual();
  }, [setCommandBarOpen, handleAddManual]);

  const grouped = statusFilter === "All";
  const statusGroups = useMemo(
    () => (grouped ? groupByStatus(filteredJobs) : null),
    [filteredJobs, grouped],
  );
  const orderedJobs = useMemo(
    () =>
      statusGroups
        ? statusGroups.flatMap((group) => group.jobs)
        : filteredJobs,
    [filteredJobs, statusGroups],
  );
  const brandStatus = useMemo(() => deriveBrandStatus(jobs), [jobs]);

  useKeyboardShortcuts({
    enabled: !commandBarOpen && !createModalOpen && !panelJob && state.dashboardView === "list",
    rows: orderedJobs,
    activeRowId: state.activeRowId,
    setActiveRowId,
    onOpenCommandBar: openCommandBar,
    onOpenRow: openPanel,
    onEditRow: openPanelEdit,
  });

  return (
    <div className="flex min-h-dvh flex-col">
      <AppHeader
        search={state.search}
        onSearchChange={setSearch}
        onOpenCommandBar={openCommandBar}
        onAddManual={onAddManual}
        jobCount={jobs.length}
        onExport={handleExport}
        onImportBackup={handleImportBackup}
        brandStatus={brandStatus}
      />

      {state.error && !commandBarOpen && (
        <ErrorStrip message={state.error} onDismiss={dismissError} />
      )}

      <main className="mx-auto w-full max-w-[1100px] flex-1 px-4 sm:px-6">
        {state.showBackupReminder && (
          <div className="no-print pt-4">
            <BackupReminderBanner
              onExport={handleExport}
              onDismiss={state.dismissBackupReminder}
            />
          </div>
        )}

        <AnalyticsViewToggle
          value={state.dashboardView}
          onChange={setDashboardView}
        />

        {state.dashboardView === "analytics" ? (
          <div
            role="tabpanel"
            id="dashboard-panel-analytics"
            aria-labelledby="dashboard-tab-analytics"
          >
            <AnalyticsSection jobs={jobs} />
          </div>
        ) : (
          <div
            role="tabpanel"
            id="dashboard-panel-list"
            aria-labelledby="dashboard-tab-list"
          >
            <StatusTabs
              jobs={jobs}
              value={statusFilter}
              onChange={setStatusFilter}
            />

            <JobList
              jobs={orderedJobs}
              groups={statusGroups}
              hasJobs={jobs.length > 0}
              activeRowId={state.activeRowId}
              onImport={openCommandBar}
              onClearFilters={clearFilters}
              onUpdate={handleUpdateJob}
              onEdit={openPanelEdit}
              onDelete={handleDelete}
              onOpen={openPanel}
            />

            {jobs.length > 0 && (
              <div className="no-print hidden items-center justify-end gap-5 py-5 text-[11px] text-muted lg:flex">
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
          </div>
        )}
      </main>

      <div className="no-print mx-auto w-full max-w-[1100px] px-4 pb-8 sm:px-6">
        <SiteFooter />
      </div>

      <CommandBar
        open={commandBarOpen}
        loading={state.importing}
        error={state.error}
        onImport={handleImport}
        onAddManual={onAddManual}
        onClose={closeCommandBar}
      />

      <DetailPanel
        job={panelJob}
        mode={state.panelMode}
        saving={state.saving}
        onClose={closePanel}
        onSetMode={state.setPanelMode}
        onUpdate={handleUpdateJob}
        onSave={handleEditSave}
        onDelete={handleDelete}
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
        onClose={closeCreate}
        onSave={handleCreateJob}
      />
    </div>
  );
}
