"use client";

import { JobFormField, inputClassName } from "@/components/JobFormField";
import type { JobFormValues, JobStatus, WorkType } from "@/types/job";
import { JOB_STATUSES, WORK_TYPES } from "@/types/job";

type Props = {
  values: JobFormValues;
  onPatch: (partial: Partial<JobFormValues>) => void;
};

export function JobFormTrackingFields({ values, onPatch }: Props) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label="Applied">
          <select
            value={values.applied ? "yes" : "no"}
            onChange={(event) =>
              onPatch({ applied: event.target.value === "yes" })
            }
            className={inputClassName}
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </JobFormField>

        <JobFormField label="Status">
          <select
            value={values.status}
            onChange={(event) =>
              onPatch({ status: event.target.value as JobStatus })
            }
            className={inputClassName}
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </JobFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label="Date applied">
          <input
            type="date"
            value={values.dateApplied}
            onChange={(event) => onPatch({ dateApplied: event.target.value })}
            disabled={!values.applied}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label="Interview date">
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
        <JobFormField label="Work type">
          <select
            value={values.workType}
            onChange={(event) =>
              onPatch({ workType: event.target.value as WorkType | "" })
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
        </JobFormField>

        <JobFormField label="Salary / pay range">
          <input
            type="text"
            value={values.salary}
            onChange={(event) => onPatch({ salary: event.target.value })}
            placeholder="e.g. 3500–4500 EUR/month"
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label="Contact person">
          <input
            type="text"
            value={values.contactName}
            onChange={(event) => onPatch({ contactName: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label="Contact email">
          <input
            type="email"
            value={values.contactEmail}
            onChange={(event) => onPatch({ contactEmail: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <JobFormField label="Notes">
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
