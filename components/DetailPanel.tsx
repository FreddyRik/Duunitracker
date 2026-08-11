"use client";

import { useEffect, useRef, useState } from "react";
import { DeadlineTag } from "@/components/job-list/DeadlineTag";
import { NotesField } from "@/components/job-list/NotesField";
import { StatusPopover } from "@/components/job-list/StatusPopover";
import { JobFormPrimaryFields } from "@/components/JobFormPrimaryFields";
import { JobFormTrackingFields } from "@/components/JobFormTrackingFields";
import { useLocale } from "@/components/LocaleProvider";
import { formatCompanyName, formatDate } from "@/lib/format";
import { formatTemplate, workTypeLabel } from "@/lib/i18n";
import { jobToFormValues } from "@/lib/job-form-mappers";
import { buildStatusUpdate } from "@/lib/job-status";
import { isSafeHttpUrl } from "@/lib/validate";
import type { PanelMode } from "@/hooks/useModalState";
import type { JobApplication, JobFormValues, JobStatus } from "@/types/job";

type DetailPanelProps = {
  job: JobApplication | null;
  mode: PanelMode;
  saving: boolean;
  onClose: () => void;
  onSetMode: (mode: PanelMode) => void;
  onUpdate: (
    id: string,
    patch: Partial<JobApplication>,
  ) => Promise<boolean | void>;
  onSave: (id: string, values: JobFormValues) => Promise<boolean>;
  onDelete: (id: string) => Promise<void>;
};

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] items-baseline gap-3 border-b border-border py-2 last:border-b-0">
      <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-muted">
        {label}
      </dt>
      <dd className="min-w-0 break-words text-sm text-foreground">{children}</dd>
    </div>
  );
}

function PanelEditForm({
  job,
  saving,
  onCancel,
  onSave,
}: {
  job: JobApplication;
  saving: boolean;
  onCancel: () => void;
  onSave: (values: JobFormValues) => Promise<void>;
}) {
  const { t } = useLocale();
  const [values, setValues] = useState<JobFormValues>(() =>
    jobToFormValues(job),
  );

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await onSave(values);
      }}
      className="space-y-4"
    >
      <JobFormPrimaryFields
        values={values}
        isUrlRequired={false}
        onPatch={(partial) =>
          setValues((current) => ({ ...current, ...partial }))
        }
      />
      <JobFormTrackingFields
        values={values}
        onPatch={(partial) =>
          setValues((current) => ({ ...current, ...partial }))
        }
      />

      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-border bg-surface-solid py-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted"
        >
          {t.actions.cancel}
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-fg transition hover:bg-accent-hover disabled:opacity-60"
        >
          {saving ? t.form.saving : t.form.updateJob}
        </button>
      </div>
    </form>
  );
}

export function DetailPanel({
  job,
  mode,
  saving,
  onClose,
  onSetMode,
  onUpdate,
  onSave,
  onDelete,
}: DetailPanelProps) {
  const { t } = useLocale();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!job) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [job, onClose]);

  const jobId = job?.id ?? null;
  useEffect(() => {
    if (jobId) panelRef.current?.focus();
  }, [jobId]);

  if (!job) return null;

  const hasSafeUrl = Boolean(job.url && isSafeHttpUrl(job.url));
  const editing = mode === "edit";

  return (
    <>
      <button
        type="button"
        aria-label={t.actions.close}
        onClick={onClose}
        className="animate-fade-in fixed inset-0 z-40 cursor-default bg-scrim lg:hidden"
      />

      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label={job.title}
        className="animate-panel-in fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-border bg-surface-solid outline-none"
      >
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border pl-2 pr-3">
          <StatusPopover
            status={job.status}
            showLabel
            onChange={(status: JobStatus) =>
              void onUpdate(job.id, buildStatusUpdate(job, status))
            }
          />
          <span className="flex-1" />
          <button
            type="button"
            onClick={() => onSetMode(editing ? "overview" : "edit")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
              editing
                ? "bg-surface-muted text-foreground"
                : "text-muted hover:bg-surface-muted hover:text-foreground"
            }`}
          >
            {editing ? t.ui.details : t.actions.edit}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.actions.close}
            className="rounded-md px-2 py-1 text-muted transition hover:bg-surface-muted hover:text-foreground"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {editing ? (
            <PanelEditForm
              key={job.id}
              job={job}
              saving={saving}
              onCancel={() => onSetMode("overview")}
              onSave={async (values) => {
                const ok = await onSave(job.id, values);
                if (ok) onSetMode("overview");
              }}
            />
          ) : (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
                  {job.title}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {formatCompanyName(job.company)}
                </p>
                {hasSafeUrl && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-strong underline decoration-border underline-offset-4 transition hover:text-foreground hover:decoration-current"
                  >
                    {formatTemplate(t.job.openPosting, { title: job.title })}
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>

              <dl>
                <MetaRow label={t.form.location}>
                  {job.location || "—"}
                </MetaRow>
                <MetaRow label={t.form.workType}>
                  {job.workType ? workTypeLabel(t, job.workType) : "—"}
                </MetaRow>
                <MetaRow label={t.form.deadline}>
                  {job.deadline ? <DeadlineTag deadline={job.deadline} /> : "—"}
                </MetaRow>
                <MetaRow label={t.form.applied}>
                  {job.applied ? t.form.yes : t.form.no}
                </MetaRow>
                <MetaRow label={t.form.dateApplied}>
                  <span className="font-mono text-[13px]">
                    {formatDate(job.dateApplied)}
                  </span>
                </MetaRow>
                <MetaRow label={t.form.interviewDate}>
                  <span className="font-mono text-[13px]">
                    {formatDate(job.interviewDate)}
                  </span>
                </MetaRow>
                <MetaRow label={t.form.salary}>{job.salary || "—"}</MetaRow>
                <MetaRow label={t.form.contactPerson}>
                  {job.contactName || "—"}
                </MetaRow>
                <MetaRow label={t.form.contactEmail}>
                  {job.contactEmail ? (
                    <a
                      href={`mailto:${job.contactEmail}`}
                      className="underline decoration-border underline-offset-4 transition hover:decoration-current"
                    >
                      {job.contactEmail}
                    </a>
                  ) : (
                    "—"
                  )}
                </MetaRow>
              </dl>

              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  {t.list.notes}
                </h3>
                <NotesField
                  key={`${job.id}-notes`}
                  notes={job.notes}
                  onSave={async (notes) => {
                    await onUpdate(job.id, { notes });
                  }}
                />
              </section>

              <section>
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
                  {t.form.description}
                </h3>
                {job.description ? (
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-strong">
                    {job.description}
                  </p>
                ) : (
                  <p className="text-sm text-muted">{t.description.empty}</p>
                )}
              </section>

              <div className="border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => void onDelete(job.id)}
                  className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition hover:border-danger-border hover:bg-danger-bg hover:text-danger"
                >
                  {t.actions.delete}
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
