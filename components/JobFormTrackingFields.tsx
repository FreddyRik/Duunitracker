"use client";

import { useLocale } from "@/components/LocaleProvider";
import { JobFormField, inputClassName } from "@/components/JobFormField";
import { statusLabel, workTypeLabel } from "@/lib/i18n";
import type { JobFormValues, JobStatus, WorkType } from "@/types/job";
import { JOB_STATUSES, WORK_TYPES } from "@/types/job";

type Props = {
  values: JobFormValues;
  onPatch: (partial: Partial<JobFormValues>) => void;
};

export function JobFormTrackingFields({ values, onPatch }: Props) {
  const { t } = useLocale();

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label={t.form.applied}>
          <select
            value={values.applied ? "yes" : "no"}
            onChange={(event) =>
              onPatch({ applied: event.target.value === "yes" })
            }
            className={inputClassName}
          >
            <option value="no">{t.form.no}</option>
            <option value="yes">{t.form.yes}</option>
          </select>
        </JobFormField>

        <JobFormField label={t.form.status}>
          <select
            value={values.status}
            onChange={(event) =>
              onPatch({ status: event.target.value as JobStatus })
            }
            className={inputClassName}
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(t, status)}
              </option>
            ))}
          </select>
        </JobFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label={t.form.dateApplied}>
          <input
            type="date"
            value={values.dateApplied}
            onChange={(event) => onPatch({ dateApplied: event.target.value })}
            disabled={!values.applied}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label={t.form.interviewDate}>
          <input
            type="date"
            value={values.interviewDate}
            onChange={(event) =>
              onPatch({ interviewDate: event.target.value })
            }
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label={t.form.workType}>
          <select
            value={values.workType}
            onChange={(event) =>
              onPatch({ workType: event.target.value as WorkType | "" })
            }
            className={inputClassName}
          >
            <option value="">{t.workType.notSet}</option>
            {WORK_TYPES.map((type) => (
              <option key={type} value={type}>
                {workTypeLabel(t, type)}
              </option>
            ))}
          </select>
        </JobFormField>

        <JobFormField label={t.form.salary}>
          <input
            type="text"
            value={values.salary}
            onChange={(event) => onPatch({ salary: event.target.value })}
            placeholder={t.form.salaryPlaceholder}
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label={t.form.contactPerson}>
          <input
            type="text"
            value={values.contactName}
            onChange={(event) => onPatch({ contactName: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label={t.form.contactEmail}>
          <input
            type="email"
            value={values.contactEmail}
            onChange={(event) => onPatch({ contactEmail: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <JobFormField label={t.form.notes}>
        <textarea
          rows={3}
          value={values.notes}
          onChange={(event) => onPatch({ notes: event.target.value })}
          className={`${inputClassName} resize-y`}
        />
      </JobFormField>
    </>
  );
}
