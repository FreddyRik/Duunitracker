"use client";

import { toDateInputValue } from "@/lib/format";
import { JobFormField, inputClassName } from "@/components/JobFormField";
import type { JobFormValues } from "@/types/job";

type Props = {
  values: JobFormValues;
  isUrlRequired: boolean;
  onPatch: (partial: Partial<JobFormValues>) => void;
};

export function JobFormPrimaryFields({
  values,
  isUrlRequired,
  onPatch,
}: Props) {
  return (
    <>
      <JobFormField label={isUrlRequired ? "Job URL" : "Job URL (optional)"}>
        <input
          type="url"
          required={isUrlRequired}
          value={values.url}
          onChange={(event) => onPatch({ url: event.target.value })}
          placeholder={
            isUrlRequired
              ? "https://duunitori.fi/..."
              : "Link to the posting, if you have one"
          }
          className={inputClassName}
        />
      </JobFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label="Job title">
          <input
            type="text"
            required
            value={values.title}
            onChange={(event) => onPatch({ title: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label="Company">
          <input
            type="text"
            required
            value={values.company}
            onChange={(event) => onPatch({ company: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label="Location">
          <input
            type="text"
            value={values.location}
            onChange={(event) => onPatch({ location: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label="Deadline">
          <input
            type="date"
            value={toDateInputValue(values.deadline)}
            onChange={(event) => onPatch({ deadline: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <JobFormField label="Description">
        <textarea
          rows={10}
          value={values.description}
          onChange={(event) => onPatch({ description: event.target.value })}
          placeholder="Job description is saved locally so you can review it after the posting expires."
          className={`${inputClassName} resize-y`}
        />
      </JobFormField>
    </>
  );
}
