"use client";

import { useLocale } from "@/components/LocaleProvider";
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
  const { t } = useLocale();

  return (
    <>
      <JobFormField
        label={isUrlRequired ? t.form.jobUrl : t.form.jobUrlOptional}
      >
        <input
          type="url"
          required={isUrlRequired}
          value={values.url}
          onChange={(event) => onPatch({ url: event.target.value })}
          placeholder={
            isUrlRequired
              ? t.form.urlPlaceholderRequired
              : t.form.urlPlaceholderOptional
          }
          className={inputClassName}
        />
      </JobFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <JobFormField label={t.form.jobTitle}>
          <input
            type="text"
            required
            value={values.title}
            onChange={(event) => onPatch({ title: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label={t.form.company}>
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
        <JobFormField label={t.form.location}>
          <input
            type="text"
            value={values.location}
            onChange={(event) => onPatch({ location: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>

        <JobFormField label={t.form.deadline}>
          <input
            type="date"
            value={toDateInputValue(values.deadline)}
            onChange={(event) => onPatch({ deadline: event.target.value })}
            className={inputClassName}
          />
        </JobFormField>
      </div>

      <JobFormField label={t.form.description}>
        <textarea
          rows={10}
          value={values.description}
          onChange={(event) => onPatch({ description: event.target.value })}
          placeholder={t.form.descriptionPlaceholder}
          className={`${inputClassName} resize-y`}
        />
      </JobFormField>
    </>
  );
}
