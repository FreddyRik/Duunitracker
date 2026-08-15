"use client";

import { useRef, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { JobFormPrimaryFields } from "@/components/JobFormPrimaryFields";
import { JobFormTrackingFields } from "@/components/JobFormTrackingFields";
import { useFocusTrap } from "@/hooks/useFocusTrap";
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

type JobFormModalContentProps = Omit<JobFormModalProps, "open">;

function JobFormModalContent({
  mode,
  initialValues,
  saving = false,
  onClose,
  onSave,
}: JobFormModalContentProps) {
  const { t } = useLocale();
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = "job-form-title";
  const [values, setValues] = useState<JobFormValues>(() =>
    mergeJobFormValues(initialValues),
  );

  useFocusTrap({
    enabled: true,
    containerRef: dialogRef,
    onClose,
    lockScroll: true,
  });

  const isUrlRequired = mode === "import";
  const title =
    mode === "import"
      ? t.form.confirmImport
      : mode === "manual"
        ? t.form.addManual
        : t.form.editJob;
  const hint = mode === "manual" ? t.form.manualHint : t.form.reviewHint;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSave(values);
  }

  function onPatch(partial: Partial<JobFormValues>) {
    setValues((current) => ({ ...current, ...partial }));
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t.actions.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-scrim backdrop-blur-[2px]"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="animate-command-in relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-border bg-surface-solid p-6 shadow-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2
              id={titleId}
              className="text-xl font-semibold text-foreground"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted">{hint}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-muted transition hover:bg-surface-muted hover:text-foreground"
            aria-label={t.actions.close}
          >
            <span aria-hidden="true">×</span>
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
              className="rounded-md border border-border-strong px-4 py-2 text-sm font-medium text-muted-strong transition hover:bg-surface-muted"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-fg transition hover:bg-accent-hover disabled:opacity-60"
            >
              {saving
                ? t.form.saving
                : mode === "edit"
                  ? t.form.updateJob
                  : t.form.saveJob}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function JobFormModal({ open, ...props }: JobFormModalProps) {
  if (!open) return null;
  return <JobFormModalContent {...props} />;
}

export {
  emptyJobFormValues,
  formValuesToPayload,
  jobToFormValues,
  parsedJobToFormValues,
} from "@/lib/job-form-mappers";
