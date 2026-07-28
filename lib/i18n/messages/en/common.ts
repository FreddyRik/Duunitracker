import type { Messages } from "@/lib/i18n/types";

export const enCommon: Pick<
  Messages,
  | "meta"
  | "landing"
  | "privacy"
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
    title: "Duunitracker – Duunitori job application tracker",
    description:
      "Free job application tracker for Duunitori postings. Import jobs from a link, track application status, and keep notes privately in your browser — no account required.",
  },
  landing: {
    headline: "Track Duunitori applications in your browser",
    subhead:
      "Import Duunitori job postings, follow application status, and keep notes — all stored locally in your browser.",
    cta: "Open tracker",
    howItWorksTitle: "How it works",
    steps: [
      {
        title: "Paste a Duunitori link",
        body: "Copy a job posting URL and import the details automatically into your tracker.",
      },
      {
        title: "Track application status",
        body: "Mark applied jobs, update pipeline status, and add interview dates and notes.",
      },
      {
        title: "Store safely in your browser",
        body: "No account or cloud storage. Export a backup if you want to move data between devices.",
      },
    ],
    privacyTitle: "Your data stays in your browser",
    privacyBody:
      "Duunitracker does not upload your applications to a server. Everything is stored locally in this browser's localStorage.",
    privacyLink: "Read about privacy",
  },
  privacy: {
    title: "Privacy",
    metaDescription:
      "How Duunitracker handles your data: local browser storage, no accounts, and no server-side application data.",
    sections: [
      {
        heading: "Local storage",
        paragraphs: [
          "Duunitracker stores your job applications, notes, and settings in your browser's localStorage. Data is not sent to a server or shared with other users.",
          "Each device and browser keeps its own data. Use JSON export and import to move data between devices.",
        ],
      },
      {
        heading: "Accounts and sign-in",
        paragraphs: [
          "The app does not require an account or sign-in. We do not collect your name, email, or application history on our servers.",
        ],
      },
      {
        heading: "Duunitori link processing",
        paragraphs: [
          "When you import a job from a Duunitori link, the server reads the public job page and returns parsed details to your browser. We do not permanently store imported postings on the server.",
        ],
      },
      {
        heading: "Analytics",
        paragraphs: [
          "The site may use Vercel Analytics for anonymized visitor statistics. It does not include your application data.",
        ],
      },
      {
        heading: "Deleting your data",
        paragraphs: [
          "You can remove all stored applications by clearing this site's browser data or deleting entries in the app. Export a backup first if you want to keep your data.",
        ],
      },
    ],
    backToHome: "Back to home",
    openTracker: "Open tracker",
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
    privacyPage: "Privacy",
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
