"use client";

import { formatCompanyName, formatDate } from "@/lib/format";
import type { JobApplication, JobStatus, WorkType } from "@/lib/types";
import { JOB_STATUSES } from "@/lib/types";
import { isSafeHttpUrl } from "@/lib/validate";

type JobListProps = {
  jobs: JobApplication[];
  hasJobs?: boolean;
  onUpdate: (id: string, patch: Partial<JobApplication>) => Promise<void>;
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => Promise<void>;
  onViewDescription: (job: JobApplication) => void;
};

const statusStyles: Record<JobStatus, string> = {
  Saved: "bg-badge-saved-bg text-badge-saved-fg",
  Applied: "bg-badge-applied-bg text-badge-applied-fg",
  Interview: "bg-badge-interview-bg text-badge-interview-fg",
  Rejected: "bg-badge-rejected-bg text-badge-rejected-fg",
  Offer: "bg-badge-offer-bg text-badge-offer-fg",
};

const workTypeStyles: Record<WorkType, string> = {
  Remote: "bg-badge-remote-bg text-badge-remote-fg",
  Hybrid: "bg-badge-hybrid-bg text-badge-hybrid-fg",
  "On-site": "bg-badge-onsite-bg text-badge-onsite-fg",
};

export function JobList({
  jobs,
  hasJobs = false,
  onUpdate,
  onEdit,
  onDelete,
  onViewDescription,
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
        <p className="text-lg font-medium text-foreground">
          {hasJobs ? "No matching applications" : "No applications yet"}
        </p>
        <p className="mt-2 text-sm text-muted">
          {hasJobs
            ? "Try adjusting your search or status filter."
            : "Paste a Duunitori link above to import your first job."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:block">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <JobRowDesktop
                key={job.id}
                job={job}
                onUpdate={onUpdate}
                onEdit={onEdit}
                onDelete={onDelete}
                onViewDescription={onViewDescription}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {jobs.map((job) => (
          <JobCardMobile
            key={job.id}
            job={job}
            onUpdate={onUpdate}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewDescription={onViewDescription}
          />
        ))}
      </div>
    </>
  );
}

function JobRowDesktop({
  job,
  onUpdate,
  onEdit,
  onDelete,
  onViewDescription,
}: {
  job: JobApplication;
  onUpdate: JobListProps["onUpdate"];
  onEdit: JobListProps["onEdit"];
  onDelete: JobListProps["onDelete"];
  onViewDescription: JobListProps["onViewDescription"];
}) {
  return (
    <tr className="align-top">
      <td className="px-4 py-4">
        <JobSummary job={job} />
      </td>
      <td className="px-4 py-4">
        <AppliedToggle
          applied={job.applied}
          onChange={(applied) => onUpdate(job.id, { applied })}
        />
        {job.dateApplied && (
          <p className="mt-2 text-xs text-muted">{formatDate(job.dateApplied)}</p>
        )}
      </td>
      <td className="px-4 py-4">
        <StatusSelect
          status={job.status}
          onChange={(status) => onUpdate(job.id, { status })}
        />
      </td>
      <td className="px-4 py-4">
        <NotesField
          notes={job.notes}
          onSave={(notes) => onUpdate(job.id, { notes })}
        />
      </td>
      <td className="px-4 py-4">
        <ActionButtons
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDescription={onViewDescription}
        />
      </td>
    </tr>
  );
}

function JobCardMobile({
  job,
  onUpdate,
  onEdit,
  onDelete,
  onViewDescription,
}: {
  job: JobApplication;
  onUpdate: JobListProps["onUpdate"];
  onEdit: JobListProps["onEdit"];
  onDelete: JobListProps["onDelete"];
  onViewDescription: JobListProps["onViewDescription"];
}) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <JobSummary job={job} />
      <div className="mt-4 grid gap-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted-strong">Applied</span>
          <div className="text-right">
            <AppliedToggle
              applied={job.applied}
              onChange={(applied) => onUpdate(job.id, { applied })}
            />
            {job.dateApplied && (
              <p className="mt-1 text-xs text-muted">
                {formatDate(job.dateApplied)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-muted-strong">Status</span>
          <StatusSelect
            status={job.status}
            onChange={(status) => onUpdate(job.id, { status })}
          />
        </div>
        <NotesField
          notes={job.notes}
          onSave={(notes) => onUpdate(job.id, { notes })}
        />
        <ActionButtons
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewDescription={onViewDescription}
        />
      </div>
    </article>
  );
}

function JobSummary({ job }: { job: JobApplication }) {
  const metaParts = [
    job.location,
    job.deadline ? `Deadline: ${formatDate(job.deadline)}` : null,
    job.dateApplied ? `Applied: ${formatDate(job.dateApplied)}` : null,
    job.interviewDate ? `Interview: ${formatDate(job.interviewDate)}` : null,
  ].filter(Boolean);

  const contactParts = [
    job.contactName,
    job.contactEmail,
    job.salary ? `Salary: ${job.salary}` : null,
  ].filter(Boolean);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {job.url && isSafeHttpUrl(job.url) ? (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-foreground underline decoration-accent/40 underline-offset-2 transition hover:text-accent"
          >
            {job.title}
          </a>
        ) : (
          <span className="font-semibold text-foreground">{job.title}</span>
        )}
        {job.workType && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${workTypeStyles[job.workType]}`}
          >
            {job.workType}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">{formatCompanyName(job.company)}</p>
      {metaParts.length > 0 && (
        <p className="mt-2 text-xs text-muted">{metaParts.join(" · ")}</p>
      )}
      {contactParts.length > 0 && (
        <p className="mt-1 text-xs text-muted">{contactParts.join(" · ")}</p>
      )}
    </div>
  );
}

function AppliedToggle({
  applied,
  onChange,
}: {
  applied: boolean;
  onChange: (applied: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={applied}
      onClick={() => onChange(!applied)}
      className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
        applied ? "bg-accent" : "bg-toggle-off"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-surface-solid shadow transition ${
          applied ? "translate-x-8" : "translate-x-1"
        }`}
      />
      <span className="sr-only">{applied ? "Applied" : "Not applied"}</span>
    </button>
  );
}

function StatusSelect({
  status,
  onChange,
}: {
  status: JobStatus;
  onChange: (status: JobStatus) => void;
}) {
  return (
    <select
      value={status}
      onChange={(event) => onChange(event.target.value as JobStatus)}
      className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[status]}`}
    >
      {JOB_STATUSES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function NotesField({
  notes,
  onSave,
}: {
  notes: string;
  onSave: (notes: string) => Promise<void>;
}) {
  return (
    <textarea
      key={notes}
      defaultValue={notes}
      onBlur={(event) => {
        if (event.target.value !== notes) {
          void onSave(event.target.value);
        }
      }}
      rows={2}
      placeholder="Add notes..."
      className="w-full min-w-[12rem] rounded-xl border border-border-strong bg-surface-solid px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring"
    />
  );
}

function ActionButtons({
  job,
  onEdit,
  onDelete,
  onViewDescription,
}: {
  job: JobApplication;
  onEdit: JobListProps["onEdit"];
  onDelete: JobListProps["onDelete"];
  onViewDescription: JobListProps["onViewDescription"];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onViewDescription(job)}
        disabled={!job.description}
        className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        View
      </button>
      <button
        type="button"
        onClick={() => onEdit(job)}
        className="rounded-lg border border-border-strong px-3 py-1.5 text-xs font-medium text-muted-strong transition hover:bg-surface-muted"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={() => void onDelete(job.id)}
        className="rounded-lg border border-danger-border px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger-bg"
      >
        Delete
      </button>
    </div>
  );
}
