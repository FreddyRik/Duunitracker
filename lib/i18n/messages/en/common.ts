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
  | "pwa"
  | "attachments"
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
  | "ui"
  | "errors"
  | "analytics"
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
    eyebrow: "Free · No account · Data stays in your browser",
    scrollHint: "How it works",
    previewLabel: "Preview of the application list",
    previewJobs: [
      {
        title: "Frontend Developer",
        company: "Pohjoinen Studio",
        deadline: "2d",
      },
      {
        title: "UI Designer",
        company: "Aalto Digital",
        deadline: "5d",
      },
      {
        title: "Full Stack Developer",
        company: "Saaristo Works",
        deadline: "9d",
      },
      {
        title: "Product Designer",
        company: "Kaksi Labs",
        deadline: "14d",
      },
    ],
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
      "Duunitracker does not upload your applications to a server. Everything is stored locally in this browser with IndexedDB, and works offline as an installed app.",
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
          "Duunitracker stores your job applications, notes, CVs, cover letter drafts, and settings in your browser (IndexedDB, with a localStorage fallback). Data is not sent to a server or shared with other users.",
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
      "Worth exporting a backup now and then — browser storage can be cleared without warning.",
    dismissReminder: "Remind me later",
  },
  pwa: {
    installTitle: "Install Duunitracker",
    installBody:
      "Add it to your home screen for faster access and full offline tracking.",
    install: "Install",
    dismiss: "Not now",
    iosHint: "On iPhone, tap Share, then Add to Home Screen.",
    offline: "Offline",
    offlineTitle: "You are offline",
    offlineBody:
      "Duunitracker still opens from this device. Imported job links need a network connection.",
    openTracker: "Open tracker",
  },
  attachments: {
    title: "Documents",
    kinds: {
      cv: "CV / résumé",
      cover_letter: "Cover letter",
      other: "File",
    },
    coverLetterPlaceholder: "Write a cover letter draft for this application...",
    uploadCv: "Upload CV (PDF)",
    uploadFile: "Add file",
    download: "Download",
    empty: "No documents attached yet.",
    tooLarge: "That file is too large. Maximum size is {size}.",
    unsupportedType: "Use a PDF, Word document, or plain text file.",
    draftSaved: "Draft saved",
    limitReached: "This application already has the maximum number of files.",
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
    expired: "Application closed",
  },
  description: {
    empty: "No description saved for this job.",
  },
  ui: {
    moreActions: "More actions",
    all: "All",
    commandHint: "Enter to import · Esc to close",
    clearFilters: "Clear filters",
    details: "Details",
    notesSaved: "Saved",
  },
  analytics: {
    navApplications: "Applications",
    navReports: "Reports",
    title: "Analytics & reports",
    subtitle:
      "Funnel, employment-quota progress, response times, and a printable activity report for Kela / Työmarkkinatori.",
    emptyTitle: "No applications to analyse yet",
    emptyHint: "Import or add jobs, then mark them applied to see reports.",
    funnelTitle: "Application funnel",
    funnelHint:
      "How far submitted applications have progressed. Rejected is listed separately as an outcome, not a later funnel stage.",
    funnelEmpty: "No submitted applications in this period.",
    funnelWaiting: "{count} still waiting for a response",
    funnelResponded: "{count} received a response",
    dropOff: "{percent}% drop-off",
    ofApplied: "{percent}% of applied",
    quotaTitle: "Weekly & monthly target",
    quotaHint:
      "Finnish job-search obligation: 4 applications per 4 weeks. Choose a period to track progress.",
    quotaMet: "Quota met",
    quotaShort: "{remaining} more needed",
    quotaCount: "{applied} / {target}",
    rangeLabel: "Period",
    rangeFrom: "From",
    rangeTo: "To",
    presetRolling: "Last 4 weeks",
    presetThisMonth: "This month",
    presetLastMonth: "Last month",
    presetCustom: "Custom",
    invalidRange: "Choose a valid start and end date.",
    rangeOrder: "Start date must be on or before the end date.",
    weekLabel: "Week {index}",
    pacingHint: "One application a week keeps the 4-in-4-weeks pace.",
    responseTitle: "Response time",
    responseHint:
      "Average calendar days from the application date to an interview date, or to the last update after Interview, Offer, or Rejected.",
    responseEmpty: "No response times in this period yet.",
    responseOverall: "Overall",
    responsePending: "{count} waiting",
    responseAverageDays: "{days} days",
    responseSample: "{count} responses",
    byCompany: "By company",
    byStatus: "By status",
    noResponseYet: "No response yet",
    reportTitle: "Official activity report",
    reportHint:
      "A clean layout of applications in the selected period. Save a PDF for Kela or Työmarkkinatori, or print a paper copy.",
    reportPrint: "Print",
    reportSavePdf: "Save PDF",
    reportPdfFailed: "Could not save the PDF. Try again, or use Print instead.",
    funnelOutcome: "Outcome",
    reportOfficialTitle: "Job search activity report",
    reportOfficialSubtitle: "Supporting record for Kela / Työmarkkinatori",
    reportPeriod: "Reporting period",
    reportGenerated: "Generated",
    reportDisclaimer:
      "This document is generated from records stored locally in Duunitracker. It is not an official Kela or Työmarkkinatori form. Check that the list matches your job-search obligation before submitting.",
    reportQuotaLabel: "Applications vs. 4 / 4-week quota",
    reportQuotaValue: "{applied} of {target} in {days} days",
    reportNoApplications: "No applications recorded in this period.",
    reportSignature: "Signature",
    reportDateLine: "Date",
    colDate: "Date applied",
    colEmployer: "Employer",
    colPosition: "Position",
    colLocation: "Location",
    colStatus: "Status",
    colUrl: "Posting",
    stageApplied: "Applied",
    stageInReview: "In Review",
    stageInterview: "Interview",
    stageOffer: "Offer",
    stageRejected: "Rejected",
  },
  errors: {
    invalidJson: "Import file is not valid JSON",
    importBackupFailed: "Failed to import backup",
    importEmpty: "Import file contains no job records",
    importTooLarge: "Import file is too large",
    importUnsupportedVersion:
      "This backup was created by a newer version of Duunitracker",
    importSchemaInvalid: "Backup does not match the expected job schema",
    storageQuotaExceeded:
      "Browser storage is full. Delete some jobs or export a backup, then try again.",
    storageUnavailable:
      "Browser storage is unavailable. Check private browsing settings and try again.",
    storageCorrupted:
      "Stored applications could not be read. Import a backup to restore your data.",
    storageOverwriteBlocked:
      "Stored applications are unreadable, so new jobs were not saved. Import a backup first.",
    storagePartialSkip:
      "Loaded your applications, but {count} invalid records were skipped.",
    attachmentsUnavailable:
      "This browser cannot store CVs or cover letters. Job data is still saved.",
    attachmentFailed: "Could not save that document.",
    parseInvalidUrl: "Paste a valid Duunitori job posting link.",
    parseTimeout: "Timed out while loading the Duunitori posting.",
    parseNetwork: "Could not load the Duunitori posting. Check the link and try again.",
    parseBlocked: "The job page was blocked before it could be read.",
    parseInvalidHtml: "That page was not a valid job posting.",
    parseUnparseable: "Could not read job details from that page.",
    parseTooLarge: "That job page is too large to import.",
    importJobFailed: "Failed to import job",
    saveJobFailed: "Failed to save job",
    updateJobFailed: "Failed to update job",
    deleteJobFailed: "Failed to delete job",
    deleteConfirm: "Delete this job application?",
  },
};
