"use client";

import { useState } from "react";
import { JobFormPrimaryFields } from "@/components/JobFormPrimaryFields";
import { JobFormTrackingFields } from "@/components/JobFormTrackingFields";
import { mergeJobFormValues } from "@/lib/job-form-mappers";
import type { JobFormValues } from "@/types/job";

type JobFormModalProps = {
  open: boolean;
  mode: "import" | "manual" | "edit";
  initialValues: Partial<JobFormValues>;
  saving?: boolean;
  onClose: () => void;
  onSave: (values: JobFormValues) => Promise<void>;
};

export function JobFormModal({
  open,
  mode,
  initialValues,
  saving = false,
  onClose,
  onSave,
}: JobFormModalProps) {
  const [values, setValues] = useState<JobFormValues>(() =>
    mergeJobFormValues(initialValues),
  );

  if (!open) return null;

  const isUrlRequired = mode === "import";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSave(values);
  }

  function onPatch(partial: Partial<JobFormValues>) {
    setValues((current) => ({ ...current, ...partial }));
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
          <JobFormPrimaryFields
            values={values}
            isUrlRequired={isUrlRequired}
            onPatch={onPatch}
          />
          <JobFormTrackingFields values={values} onPatch={onPatch} />

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

export {
  emptyJobFormValues,
  formValuesToPayload,
  jobToFormValues,
  parsedJobToFormValues,
} from "@/lib/job-form-mappers";
