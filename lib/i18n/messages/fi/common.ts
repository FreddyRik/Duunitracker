import type { Messages } from "@/lib/i18n/types";

export const fiCommon: Pick<
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
  | "ui"
  | "errors"
> = {
  meta: {
    title: "Duunitracker – Duunitori-hakemusten seuranta",
    description:
      "Ilmainen työhakemusten seurantatyökalu Duunitori-ilmoituksille. Tuo työpaikat linkistä, seuraa hakemusten tilaa ja tallenna muistiinpanot turvallisesti selaimessasi – ilman tiliä.",
  },
  landing: {
    headline: "Duunitori-hakemusten seuranta selaimessa",
    subhead:
      "Tuo työpaikkailmoitukset Duunitorista, seuraa hakemustesi tilaa ja pidä muistiinpanot tallessa – kaikki data pysyy omassa selaimessasi.",
    cta: "Avaa tracker",
    eyebrow: "Ilmainen · Ei tiliä · Data pysyy selaimessasi",
    scrollHint: "Näin se toimii",
    previewLabel: "Esikatselu hakemuslistasta",
    previewJobs: [
      {
        title: "Frontend-kehittäjä",
        company: "Pohjoinen Studio",
        deadline: "2 pv",
      },
      {
        title: "UI-suunnittelija",
        company: "Aalto Digital",
        deadline: "5 pv",
      },
      {
        title: "Full stack -kehittäjä",
        company: "Saaristo Works",
        deadline: "9 pv",
      },
      {
        title: "Tuotedesigner",
        company: "Kaksi Labs",
        deadline: "14 pv",
      },
    ],
    howItWorksTitle: "Näin se toimii",
    steps: [
      {
        title: "Liitä Duunitori-linkki",
        body: "Kopioi työpaikkailmoituksen URL ja tuo tiedot automaattisesti trackeriin.",
      },
      {
        title: "Seuraa hakemusten tilaa",
        body: "Merkitse haetut paikat, päivitä tilat ja lisää haastattelu- sekä muistiinpanot.",
      },
      {
        title: "Tallenna turvallisesti selaimeen",
        body: "Ei tiliä eikä pilvitallennusta. Vie varmuuskopio, jos haluat siirtää dataa laitteelta toiselle.",
      },
    ],
    privacyTitle: "Tietosi pysyvät omassa selaimessasi",
    privacyBody:
      "Duunitracker ei kerää hakemuksiasi palvelimelle. Kaikki tallennetaan paikallisesti localStorageen tässä selaimessa.",
    privacyLink: "Lue tietosuojasta",
  },
  privacy: {
    title: "Tietosuoja",
    metaDescription:
      "Miten Duunitracker käsittelee tietojasi: paikallinen tallennus selaimessa, ei tilejä eikä palvelinpuolen hakemusdataa.",
    sections: [
      {
        heading: "Paikallinen tallennus",
        paragraphs: [
          "Duunitracker tallentaa työhakemuksesi, muistiinpanosi ja asetuksesi selaimen localStorageen. Tietoja ei lähetetä palvelimelle eikä jaeta muiden käyttäjien kanssa.",
          "Jokainen laite ja selain pitää omat tietonsa erillään. Jos käytät sovellusta usealla laitteella, voit viedä ja tuoda JSON-varmuuskopion siirtääksesi dataa.",
        ],
      },
      {
        heading: "Tilit ja kirjautuminen",
        paragraphs: [
          "Sovellus ei vaadi käyttäjätiliä eikä kirjautumista. Emme kerää nimeäsi, sähköpostiosoitettasi tai hakemushistoriaasi palvelimillemme.",
        ],
      },
      {
        heading: "Duunitori-linkkien käsittely",
        paragraphs: [
          "Kun tuot työpaikan Duunitori-linkistä, palvelin lukee julkisen työpaikkasivun ja palauttaa parsitut tiedot selaimeesi. Emme tallenna tuotuja ilmoituksia palvelimelle pysyvästi.",
        ],
      },
      {
        heading: "Analytiikka",
        paragraphs: [
          "Sivusto voi käyttää Vercel Analytics -palvelua anonymisoituun kävijätilastointiin. Se ei sisällä hakemustietojasi.",
        ],
      },
      {
        heading: "Tietojen poistaminen",
        paragraphs: [
          "Voit poistaa kaikki tallennetut hakemukset tyhjentämällä tämän sivuston selaintiedot tai poistamalla hakemukset sovelluksen kautta. Vie varmuuskopio ennen tyhjennystä, jos haluat säilyttää tiedot.",
        ],
      },
    ],
    backToHome: "Takaisin etusivulle",
    openTracker: "Avaa tracker",
  },
  app: {
    name: "Duunitracker",
    intro:
      "Tuo työpaikkailmoitukset Duunitorista, seuraa hakemustesi tilaa ja tallenna muistiinpanot, sekä ilmoitukset turvallisesti selaimeesi.",
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
    privacyPage: "Tietosuoja",
    github: "GitHub",
    source: "Lähdekoodi",
    reportIssue: "Ilmoita ongelmasta",
    siteLinks: "Sivuston linkit",
  },
  backup: {
    export: "Tallenna varmuuskopio",
    import: "Tuo varmuuskopio",
    confirmReplace:
      "Tuonti korvaa kaikki tässä selaimessa tallennetut hakemukset. Jatketaanko?",
    reminder:
      "Varmuuskopio kannattaa viedä ajoittain — selaimen tiedot voivat tyhjentyä ilman varoitusta.",
    dismissReminder: "Muistuta myöhemmin",
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
    expired: "Haku aika loppunut",
  },
  description: {
    empty: "Tälle työpaikalle ei ole tallennettu kuvausta.",
  },
  ui: {
    moreActions: "Lisää toimintoja",
    all: "Kaikki",
    commandHint: "Enter tuo · Esc sulkee",
    clearFilters: "Tyhjennä suodattimet",
    details: "Tiedot",
    notesSaved: "Tallennettu",
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
