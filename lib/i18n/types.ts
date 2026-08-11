import type { JobStatus, WorkType } from "@/types/job";

export type LandingStep = {
  title: string;
  body: string;
};

/** Illustrative rows for the landing hero preview. Not real postings. */
export type LandingPreviewJob = {
  title: string;
  company: string;
  deadline: string;
};

export type PrivacySection = {
  heading: string;
  paragraphs: string[];
};

export type Messages = {
  meta: { title: string; description: string };
  landing: {
    headline: string;
    subhead: string;
    cta: string;
    eyebrow: string;
    scrollHint: string;
    previewLabel: string;
    previewJobs: LandingPreviewJob[];
    howItWorksTitle: string;
    steps: LandingStep[];
    privacyTitle: string;
    privacyBody: string;
    privacyLink: string;
  };
  privacy: {
    title: string;
    metaDescription: string;
    sections: PrivacySection[];
    backToHome: string;
    openTracker: string;
  };
  app: { name: string; intro: string };
  theme: { ariaLabel: string; light: string; dark: string };
  language: { ariaLabel: string };
  footer: {
    privacy: string;
    privacyPage: string;
    github: string;
    source: string;
    reportIssue: string;
    siteLinks: string;
  };
  backup: {
    export: string;
    import: string;
    confirmReplace: string;
    reminder: string;
    dismissReminder: string;
  };
  stats: {
    totalJobs: string;
    applied: string;
    inProgress: string;
    rejected: string;
  };
  importBar: {
    urlLabel: string;
    placeholder: string;
    importing: string;
    importJob: string;
    or: string;
    addManual: string;
  };
  filters: {
    searchLabel: string;
    searchPlaceholder: string;
    statusLabel: string;
    allStatuses: string;
    inProgress: string;
  };
  list: {
    job: string;
    status: string;
    notes: string;
    actions: string;
    emptyTitle: string;
    emptyHint: string;
    noMatchTitle: string;
    noMatchHint: string;
  };
  actions: {
    view: string;
    edit: string;
    delete: string;
    cancel: string;
    close: string;
  };
  notes: {
    add: string;
    placeholder: string;
  };
  job: {
    appliedOn: string;
    interviewOn: string;
    salary: string;
    openPosting: string;
  };
  status: Record<JobStatus, string>;
  workType: Record<WorkType, string> & { notSet: string };
  deadline: {
    due: string;
    dueToday: string;
    dueTomorrow: string;
    dueInDays: string;
    expired: string;
  };
  form: {
    confirmImport: string;
    addManual: string;
    editJob: string;
    manualHint: string;
    reviewHint: string;
    jobUrl: string;
    jobUrlOptional: string;
    urlPlaceholderRequired: string;
    urlPlaceholderOptional: string;
    jobTitle: string;
    company: string;
    location: string;
    deadline: string;
    description: string;
    descriptionPlaceholder: string;
    applied: string;
    yes: string;
    no: string;
    status: string;
    dateApplied: string;
    interviewDate: string;
    workType: string;
    salary: string;
    salaryPlaceholder: string;
    contactPerson: string;
    contactEmail: string;
    notes: string;
    saving: string;
    saveJob: string;
    updateJob: string;
  };
  description: {
    empty: string;
  };
  ui: {
    moreActions: string;
    all: string;
    commandHint: string;
    clearFilters: string;
    details: string;
    notesSaved: string;
  };
  errors: {
    invalidJson: string;
    importBackupFailed: string;
    importJobFailed: string;
    saveJobFailed: string;
    updateJobFailed: string;
    deleteJobFailed: string;
    deleteConfirm: string;
  };
};
