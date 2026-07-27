"use client";

import { useState } from "react";
import { toDateInputValue } from "@/lib/format";
import type {
  JobApplication,
  JobStatus,
  ParsedJob,
  WorkType,
} from "@/lib/types";
import { JOB_STATUSES, WORK_TYPES } from "@/lib/types";

export type JobFormValues = {
  url: string;
  title: string;
  company: string;
  location: string;
  deadline: string;
  applied: boolean;
  status: JobStatus;
  notes: string;
  dateApplied: string;
  interviewDate: string;
  contactName: string;
  contactEmail: string;
  salary: string;
  workType: WorkType | "";
  description: string;
};

type JobFormModalProps = {
  open: boolean;
  mode: "import" | "manual" | "edit";
  initialValues: Partial<JobFormValues>;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: JobFormValues) => Promise<void>;
};

const emptyValues: JobFormValues = {
  url: "",
  title: "",
  company: "",
  location: "",
  deadline: "",
  applied: false,
  status: "Saved",
  notes: "",
  dateApplied: "",
  interviewDate: "",
  contactName: "",
  contactEmail: "",
  salary: "",
  workType: "",
  description: "",
};

export function JobFormModal({
  open,
  mode,
  initialValues,
  saving = false,
  onClose,
  onSave,
}: JobFormModalProps) {
  const [values, setValues] = useState<JobFormValues>(() => ({
    ...emptyValues,
    ...initialValues,
    location: initialValues.location ?? "",
    deadline: initialValues.deadline ?? "",
    notes: initialValues.notes ?? "",
    dateApplied: initialValues.dateApplied ?? "",
    interviewDate: initialValues.interviewDate ?? "",
    contactName: initialValues.contactName ?? "",
    contactEmail: initialValues.contactEmail ?? "",
    salary: initialValues.salary ?? "",
    workType: initialValues.workType ?? "",
    description: initialValues.description ?? "",
  }));

  if (!open) return null;

  const isUrlRequired = mode === "import";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSave(values);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-surface-solid p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {mode === "import"
                ? "Confirm imported job"
                : mode === "manual"
                  ? "Add job manually"
                  : "Edit job"}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {mode === "manual"
                ? "Fill in the job details for postings outside Duunitori."
                : "Review and adjust the details before saving."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label={isUrlRequired ? "Job URL" : "Job URL (optional)"}>
            <input
              type="url"
              required={isUrlRequired}
              value={values.url}
              onChange={(event) =>
                setValues((current) => ({ ...current, url: event.target.value }))
              }
              placeholder={
                isUrlRequired
                  ? "https://duunitori.fi/..."
                  : "Link to the posting, if you have one"
              }
              className={inputClassName}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Job title">
              <input
                type="text"
                required
                value={values.title}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Company">
              <input
                type="text"
                required
                value={values.company}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    company: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location">
              <input
                type="text"
                value={values.location}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    location: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Deadline">
              <input
                type="date"
                value={toDateInputValue(values.deadline)}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    deadline: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              rows={10}
              value={values.description}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Job description is saved locally so you can review it after the posting expires."
              className={`${inputClassName} resize-y`}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Applied">
              <select
                value={values.applied ? "yes" : "no"}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    applied: event.target.value === "yes",
                  }))
                }
                className={inputClassName}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </Field>

            <Field label="Status">
              <select
                value={values.status}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    status: event.target.value as JobStatus,
                  }))
                }
                className={inputClassName}
              >
                {JOB_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date applied">
              <input
                type="date"
                value={values.dateApplied}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    dateApplied: event.target.value,
                  }))
                }
                disabled={!values.applied}
                className={inputClassName}
              />
            </Field>

            <Field label="Interview date">
              <input
                type="date"
                value={values.interviewDate}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    interviewDate: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Work type">
              <select
                value={values.workType}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    workType: event.target.value as WorkType | "",
                  }))
                }
                className={inputClassName}
              >
                <option value="">Not set</option>
                {WORK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Salary / pay range">
              <input
                type="text"
                value={values.salary}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    salary: event.target.value,
                  }))
                }
                placeholder="e.g. 3500–4500 EUR/month"
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Contact person">
              <input
                type="text"
                value={values.contactName}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    contactName: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </Field>

            <Field label="Contact email">
              <input
                type="email"
                value={values.contactEmail}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    contactEmail: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              rows={3}
              value={values.notes}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  notes: event.target.value,
                }))
              }
              className={`${inputClassName} resize-y`}
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border-strong px-4 py-2 text-sm font-medium text-muted-strong transition hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : mode === "edit"
                  ? "Update job"
                  : "Save job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium text-muted-strong">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "w-full rounded-xl border border-border-strong bg-surface-solid px-3 py-2 text-sm text-foreground outline-none transition focus:border-accent focus:ring-2 focus:ring-ring disabled:bg-input-disabled disabled:text-muted";

export function emptyJobFormValues(): JobFormValues {
  return { ...emptyValues };
}

export function parsedJobToFormValues(parsed: ParsedJob): JobFormValues {
  return {
    url: parsed.url,
    title: parsed.title,
    company: parsed.company,
    location: parsed.location ?? "",
    deadline: parsed.deadline ?? "",
    applied: false,
    status: "Saved",
    notes: "",
    dateApplied: "",
    interviewDate: "",
    contactName: "",
    contactEmail: "",
    salary: "",
    workType: "",
    description: parsed.description ?? "",
  };
}

export function jobToFormValues(job: JobApplication): JobFormValues {
  return {
    url: job.url,
    title: job.title,
    company: job.company,
    location: job.location ?? "",
    deadline: job.deadline ?? "",
    applied: job.applied,
    status: job.status,
    notes: job.notes,
    dateApplied: toDateInputValue(job.dateApplied),
    interviewDate: toDateInputValue(job.interviewDate),
    contactName: job.contactName ?? "",
    contactEmail: job.contactEmail ?? "",
    salary: job.salary ?? "",
    workType: job.workType ?? "",
    description: job.description ?? "",
  };
}

function formValuesToPayload(values: JobFormValues) {
  return {
    url: values.url.trim(),
    title: values.title,
    company: values.company,
    location: values.location || null,
    deadline: values.deadline || null,
    applied: values.applied,
    status: values.status,
    notes: values.notes,
    dateApplied: values.applied
      ? values.dateApplied || undefined
      : null,
    interviewDate: values.interviewDate || null,
    contactName: values.contactName || null,
    contactEmail: values.contactEmail || null,
    salary: values.salary || null,
    workType: values.workType || null,
    description: values.description || null,
  };
}

export { formValuesToPayload };
