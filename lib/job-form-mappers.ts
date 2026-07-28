import { toDateInputValue } from "@/lib/format";
import type {
  CreateJobInput,
  JobApplication,
  JobFormValues,
  ParsedJob,
} from "@/types/job";

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

export function emptyJobFormValues(): JobFormValues {
  return { ...emptyValues };
}

export function mergeJobFormValues(
  initialValues: Partial<JobFormValues>,
): JobFormValues {
  return {
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
  };
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

export function formValuesToPayload(values: JobFormValues): CreateJobInput {
  return {
    url: values.url.trim(),
    title: values.title,
    company: values.company,
    location: values.location || null,
    deadline: values.deadline || null,
    applied: values.applied,
    status: values.status,
    notes: values.notes,
    dateApplied: values.applied ? values.dateApplied || undefined : null,
    interviewDate: values.interviewDate || null,
    contactName: values.contactName || null,
    contactEmail: values.contactEmail || null,
    salary: values.salary || null,
    workType: values.workType || null,
    description: values.description || null,
  };
}
