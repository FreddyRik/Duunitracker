import type { AttachmentKind } from "@/types/attachment";
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
  pwa: {
    installTitle: string;
    installBody: string;
    install: string;
    dismiss: string;
    iosHint: string;
    offline: string;
    offlineTitle: string;
    offlineBody: string;
    openTracker: string;
  };
  attachments: {
    title: string;
    kinds: Record<AttachmentKind, string>;
    coverLetterPlaceholder: string;
    uploadCv: string;
    uploadFile: string;
    download: string;
    empty: string;
    tooLarge: string;
    unsupportedType: string;
    draftSaved: string;
    limitReached: string;
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
  analytics: {
    navApplications: string;
    navReports: string;
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyHint: string;
    funnelTitle: string;
    funnelHint: string;
    funnelEmpty: string;
    funnelWaiting: string;
    funnelResponded: string;
    dropOff: string;
    ofApplied: string;
    quotaTitle: string;
    quotaHint: string;
    quotaMet: string;
    quotaShort: string;
    quotaCount: string;
    rangeLabel: string;
    rangeFrom: string;
    rangeTo: string;
    presetRolling: string;
    presetThisMonth: string;
    presetLastMonth: string;
    presetCustom: string;
    invalidRange: string;
    rangeOrder: string;
    weekLabel: string;
    pacingHint: string;
    responseTitle: string;
    responseHint: string;
    responseEmpty: string;
    responseOverall: string;
    responsePending: string;
    responseAverageDays: string;
    responseSample: string;
    byCompany: string;
    byStatus: string;
    noResponseYet: string;
    reportTitle: string;
    reportHint: string;
    reportPrint: string;
    reportSavePdf: string;
    reportPdfFailed: string;
    funnelOutcome: string;
    reportOfficialTitle: string;
    reportOfficialSubtitle: string;
    reportPeriod: string;
    reportGenerated: string;
    reportDisclaimer: string;
    reportQuotaLabel: string;
    reportQuotaValue: string;
    reportNoApplications: string;
    reportSignature: string;
    reportDateLine: string;
    colDate: string;
    colEmployer: string;
    colPosition: string;
    colLocation: string;
    colStatus: string;
    colUrl: string;
    stageApplied: string;
    stageInReview: string;
    stageInterview: string;
    stageOffer: string;
    stageRejected: string;
  };
  errors: {
    invalidJson: string;
    importBackupFailed: string;
    importEmpty: string;
    importTooLarge: string;
    importUnsupportedVersion: string;
    importSchemaInvalid: string;
    storageQuotaExceeded: string;
    storageUnavailable: string;
    storageCorrupted: string;
    storageOverwriteBlocked: string;
    storagePartialSkip: string;
    attachmentsUnavailable: string;
    attachmentFailed: string;
    parseInvalidUrl: string;
    parseTimeout: string;
    parseNetwork: string;
    parseBlocked: string;
    parseInvalidHtml: string;
    parseUnparseable: string;
    parseTooLarge: string;
    importJobFailed: string;
    saveJobFailed: string;
    updateJobFailed: string;
    deleteJobFailed: string;
    deleteConfirm: string;
  };
};
