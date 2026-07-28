export const JOB_STATUSES = [
  "Saved",
  "Applied",
  "Interview",
  "Rejected",
  "Offer",
] as const;

export const WORK_TYPES = ["Remote", "Hybrid", "On-site"] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];
export type WorkType = (typeof WORK_TYPES)[number];

/** Dashboard list filter — includes composite stat-card filters. */
export type JobListFilter = JobStatus | "All" | "InProgress";

export type JobApplication = {
  id: string;
  url: string;
  title: string;
  company: string;
  location: string | null;
  deadline: string | null;
  applied: boolean;
  status: JobStatus;
  notes: string;
  dateApplied: string | null;
  interviewDate: string | null;
  contactName: string | null;
  contactEmail: string | null;
  salary: string | null;
  workType: WorkType | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ParsedJob = {
  url: string;
  title: string;
  company: string;
  location: string | null;
  deadline: string | null;
  description: string | null;
};

export type CreateJobInput = {
  url: string;
  title: string;
  company: string;
  location?: string | null;
  deadline?: string | null;
  applied?: boolean;
  status?: JobStatus;
  notes?: string;
  dateApplied?: string | null;
  interviewDate?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  salary?: string | null;
  workType?: WorkType | null;
  description?: string | null;
};

export type UpdateJobInput = Partial<
  Omit<JobApplication, "id" | "createdAt" | "updatedAt">
>;

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

export type ApiErrorResponse = {
  error?: string;
};

export type ParseJobRequest = {
  url: string;
};

export type UpdateJobRequest = UpdateJobInput & {
  id: string;
};
