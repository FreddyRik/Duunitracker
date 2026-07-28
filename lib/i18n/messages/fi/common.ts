import type { Messages } from "@/lib/i18n/types";

export const fiCommon: Pick<
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
    description: "Seuraa Duunitori-hakemuksiasi selaimessa.",
  },
  app: {
    name: "Duunitracker",
    intro:
      "Pidä työnhakusi hallinnassa. Tuo ilmoitukset Duunitorista, seuraa hakemustesi tilaa ja tallenna muistiinpanot, sekä ilmoitukset turvallisesti selaimeesi.",
  },
  theme: {
    ariaLabel: "Väriteema",
    light: "Vaalea",
    dark: "Tumma",
  },
  language: { ariaLabel: "Kieli" },
  footer: {
    privacy:
      "Tietosi pysyvät tässä selaimessa. Vie varmuuskopio ennen sivuston tietojen tyhjennystä.",
    github: "GitHub",
    source: "Lähdekoodi",
    reportIssue: "Ilmoita ongelmasta",
    siteLinks: "Sivuston linkit",
  },
  backup: {
    export: "Vie varmuuskopio",
    import: "Tuo varmuuskopio",
    confirmReplace:
      "Tuonti korvaa kaikki tässä selaimessa tallennetut hakemukset. Jatketaanko?",
    reminder:
      "Sinulla on useita hakemuksia tallennettuna. Vie varmuuskopio, jotta et menetä tietoja, jos selaimen data tyhjennetään.",
    dismissReminder: "Ei nyt",
  },
  stats: {
    totalJobs: "Yhteensä",
    applied: "Haettu",
    inProgress: "Käsittelyssä",
    rejected: "Hylätty",
  },
  importBar: {
    urlLabel: "Duunitori-työpaikan URL",
    placeholder: "Liitä Duunitori-työpaikkalinkki...",
    importing: "Tuodaan...",
    importJob: "Tuo työpaikka",
    or: "tai",
    addManual: "Lisää manuaalisesti",
  },
  filters: {
    searchLabel: "Hae työpaikkoja",
    searchPlaceholder: "Hae työnimikkeellä, yrityksen nimellä tai kuvauksella...",
    statusLabel: "Suodata tilan mukaan",
    allStatuses: "Kaikki",
    inProgress: "Käsittelyssä",
  },
  list: {
    job: "Työpaikka",
    status: "Tila",
    notes: "Muistiinpanot",
    actions: "Toiminnot",
    emptyTitle: "Ei hakemuksia vielä",
    emptyHint: "Liitä Duunitori-linkki yllä tuodaksesi ensimmäisen työpaikan.",
    noMatchTitle: "Ei vastaavia hakemuksia",
    noMatchHint: "Kokeile muuttaa hakua tai tilasuodatinta.",
  },
  actions: {
    view: "Näytä",
    edit: "Muokkaa",
    delete: "Poista",
    cancel: "Peruuta",
    close: "Sulje",
  },
  notes: {
    add: "+ Muistiinpano",
    placeholder: "Lisää muistiinpanoja...",
  },
  job: {
    appliedOn: "Haettu {date}",
    interviewOn: "Haastattelu {date}",
    salary: "Palkka: {salary}",
    openPosting: "Avaa ilmoitus: {title}",
  },
  status: {
    Saved: "Tallennettu",
    Applied: "Haettu",
    Interview: "Haastattelu",
    Rejected: "Hylätty",
    Offer: "Tarjous",
  },
  workType: {
    Remote: "Etä",
    Hybrid: "Hybrid",
    "On-site": "Paikan päällä",
    notSet: "Ei asetettu",
  },
  deadline: {
    due: "Hakuaika päättyy",
    dueToday: "Hakuaika päättyy tänään",
    dueTomorrow: "Hakuaika päättyy huomenna",
    dueInDays: "Hakuaika päättyy {days} päivän kuluttua",
    overdueOne: "Myöhässä 1 päivä",
    overdueMany: "Myöhässä {days} päivää",
  },
  description: {
    empty: "Tälle työpaikalle ei ole tallennettu kuvausta.",
  },
  errors: {
    invalidJson: "Tuontitiedosto ei ole kelvollista JSON-muotoa",
    importBackupFailed: "Varmuuskopion tuonti epäonnistui",
    importJobFailed: "Työpaikan tuonti epäonnistui",
    saveJobFailed: "Työpaikan tallennus epäonnistui",
    updateJobFailed: "Työpaikan päivitys epäonnistui",
    deleteJobFailed: "Työpaikan poisto epäonnistui",
    deleteConfirm: "Poistetaanko tämä hakemus?",
  },
};
