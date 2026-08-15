"use client";

import { memo, useState } from "react";
import { DeadlineTag } from "@/components/job-list/DeadlineTag";
import { NotesField } from "@/components/job-list/NotesField";
import { PipelineRail } from "@/components/job-list/PipelineRail";
import { StatusPopover } from "@/components/job-list/StatusPopover";
import { Tag } from "@/components/job-list/Tag";
import type { JobListHandlers } from "@/components/job-list/types";
import { useLocale } from "@/components/LocaleProvider";
import { formatCompanyName, formatDate } from "@/lib/format";
import { formatTemplate, workTypeLabel } from "@/lib/i18n";
import { buildStatusUpdate } from "@/lib/job-status";
import { workTypeStyles } from "@/lib/job-status-styles";
import { isSafeHttpUrl } from "@/lib/validate";
import type { JobApplication, JobStatus } from "@/types/job";

type JobRowProps = {
  job: JobApplication;
  active: boolean;
} & JobListHandlers;

export const JobRow = memo(function JobRow({
  job,
  active,
  onUpdate,
  onEdit,
  onDelete,
  onOpen,
}: JobRowProps) {
  const { t } = useLocale();
  const hasNotes = job.notes.trim().length > 0;
  const [notesOpen, setNotesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hasSafeUrl = Boolean(job.url && isSafeHttpUrl(job.url));

  function handleStatusChange(status: JobStatus) {
    void onUpdate(job.id, buildStatusUpdate(job, status));
  }

  const appliedMeta = job.dateApplied
    ? formatTemplate(t.job.appliedOn, { date: formatDate(job.dateApplied) })
    : null;
  const interviewMeta = job.interviewDate
    ? formatTemplate(t.job.interviewOn, { date: formatDate(job.interviewDate) })
    : null;

  return (
    <li
      data-row-id={job.id}
      className={`group relative border-b border-border transition-colors last:border-b-0 has-[:focus-visible]:bg-row-active ${
        menuOpen ? "z-30" : ""
      } ${active ? "bg-row-active" : "hover:bg-row-hover"}`}
    >
      <div className="flex min-h-14 items-center gap-3 px-3 py-2">
        <PipelineRail status={job.status} />

        <div className="relative z-10">
          <StatusPopover
            status={job.status}
            onChange={handleStatusChange}
            onOpenChange={setMenuOpen}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {/* Stretched target: covers the row while nested controls stay above it. */}
            <button
              type="button"
              onClick={() => onOpen(job)}
              aria-current={active ? "true" : undefined}
              className="truncate text-left text-sm font-medium text-foreground after:absolute after:inset-0 after:content-['']"
            >
              {job.title}
            </button>
            {hasSafeUrl && (
              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                aria-label={formatTemplate(t.job.openPosting, {
                  title: job.title,
                })}
                className="relative z-10 shrink-0 rounded text-muted opacity-0 transition hover:text-foreground focus-visible:opacity-100 group-hover:opacity-100"
              >
                ↗
              </a>
            )}
          </div>
          <p className="truncate text-xs text-muted">
            {formatCompanyName(job.company)}
            {job.location && (
              <span className="hidden sm:inline"> · {job.location}</span>
            )}
          </p>

          {/* Narrow screens drop the trailing column, so keep urgency inline. */}
          {(job.workType || job.deadline) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 md:hidden">
              {job.workType && (
                <span
                  className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${workTypeStyles[job.workType]}`}
                >
                  {workTypeLabel(t, job.workType)}
                </span>
              )}
              {job.deadline && <DeadlineTag deadline={job.deadline} />}
            </div>
          )}
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 md:flex">
          {job.workType && (
            <span
              className={`inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[11px] font-medium ${workTypeStyles[job.workType]}`}
            >
              {workTypeLabel(t, job.workType)}
            </span>
          )}
          {job.deadline && <DeadlineTag deadline={job.deadline} />}
          {interviewMeta && (
            <Tag tone="outline">
              <span className="font-mono">{interviewMeta}</span>
            </Tag>
          )}
          {!interviewMeta && appliedMeta && (
            <span className="font-mono text-[11px] text-muted">
              {appliedMeta}
            </span>
          )}
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity md:opacity-0 md:focus-within:opacity-100 md:group-hover:opacity-100">
          <button
            type="button"
            onClick={() => setNotesOpen((current) => !current)}
            aria-expanded={notesOpen}
            aria-label={t.list.notes}
            className={`rounded px-1.5 py-1 text-xs transition hover:bg-surface-muted ${
              hasNotes ? "text-foreground" : "text-muted"
            }`}
          >
            <span aria-hidden="true">{hasNotes ? "▣" : "▢"}</span>
          </button>
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="rounded px-2 py-1 text-xs font-medium text-muted transition hover:bg-surface-muted hover:text-foreground"
          >
            {t.actions.edit}
          </button>
          <button
            type="button"
            onClick={() => void onDelete(job.id)}
            className="rounded px-2 py-1 text-xs font-medium text-muted transition hover:bg-danger-bg hover:text-danger"
          >
            {t.actions.delete}
          </button>
        </div>
      </div>

      {notesOpen && (
        <div className="relative z-10 px-3 pb-3 pl-[3.75rem]">
          <NotesField
            notes={job.notes}
            onSave={async (notes) => {
              await onUpdate(job.id, { notes });
            }}
          />
        </div>
      )}
    </li>
  );
});
