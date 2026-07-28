import type { Messages } from "@/lib/i18n/types";

export const enCommon: Pick<
  Messages,
  | "meta"
  | "app"
  | "theme"
  | "language"
  | "footer"
  | "backup"
  | "stats"
  | "importBar"
  | "filters"
  | "list"
  | "actions"
  | "notes"
  | "job"
  | "status"
  | "workType"
  | "deadline"
  | "description"
  | "errors"
> = {
  meta: {
    title: "Duunitracker",
    description: "Track Duunitori job applications in your browser.",
  },
  app: {
    name: "Duunitracker",
    intro:
      "A simple tracker for your Duunitori job search. Import postings, follow application status, and keep notes — all stored privately in your browser.",
  },
  theme: {
    ariaLabel: "Color theme",
    light: "Light",
    dark: "Dark",
  },
  language: { ariaLabel: "Language" },
  footer: {
    privacy:
      "Your data stays in this browser. Export a backup before clearing site data.",
    github: "GitHub",
    source: "Source",
    reportIssue: "Report issue",
    siteLinks: "Site links",
  },
  backup: {
    export: "Export backup",
    import: "Import backup",
    confirmReplace:
      "Import will replace all jobs stored in this browser. Continue?",
    reminder:
      "You have several applications saved. Export a backup so you don't lose data if browser storage is cleared.",
    dismissReminder: "Not now",
  },
  stats: {
    totalJobs: "Total Jobs",
    applied: "Applied",
    inProgress: "In Progress",
    rejected: "Rejected",
  },
  importBar: {
    urlLabel: "Duunitori job URL",
    placeholder: "Paste a Duunitori job link...",
    importing: "Importing...",
    importJob: "Import Job",
    or: "or",
    addManual: "Add Job Manually",
  },
  filters: {
    searchLabel: "Search jobs",
    searchPlaceholder: "Search by title, company, or description...",
    statusLabel: "Filter by status",
    allStatuses: "All statuses",
    inProgress: "In Progress",
  },
  list: {
    job: "Job",
    status: "Status",
    notes: "Notes",
    actions: "Actions",
    emptyTitle: "No applications yet",
    emptyHint: "Paste a Duunitori link above to import your first job.",
    noMatchTitle: "No matching applications",
    noMatchHint: "Try adjusting your search or status filter.",
  },
  actions: {
    view: "View",
    edit: "Edit",
    delete: "Delete",
    cancel: "Cancel",
    close: "Close",
  },
  notes: {
    add: "+ Note",
    placeholder: "Add notes...",
  },
  job: {
    appliedOn: "Applied {date}",
    interviewOn: "Interview {date}",
    salary: "Salary: {salary}",
    openPosting: "Open {title} posting",
  },
  status: {
    Saved: "Saved",
    Applied: "Applied",
    Interview: "Interview",
    Rejected: "Rejected",
    Offer: "Offer",
  },
  workType: {
    Remote: "Remote",
    Hybrid: "Hybrid",
    "On-site": "On-site",
    notSet: "Not set",
  },
  deadline: {
    due: "Due",
    dueToday: "Due today",
    dueTomorrow: "Due tomorrow",
    dueInDays: "Due in {days} days",
    overdueOne: "Overdue by 1 day",
    overdueMany: "Overdue by {days} days",
  },
  description: {
    empty: "No description saved for this job.",
  },
  errors: {
    invalidJson: "Import file is not valid JSON",
    importBackupFailed: "Failed to import backup",
    importJobFailed: "Failed to import job",
    saveJobFailed: "Failed to save job",
    updateJobFailed: "Failed to update job",
    deleteJobFailed: "Failed to delete job",
    deleteConfirm: "Delete this job application?",
  },
};
