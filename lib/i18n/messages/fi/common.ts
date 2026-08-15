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
      "Duunitracker ei kerää hakemuksiasi palvelimelle. Kaikki tallennetaan paikallisesti IndexedDB:hen tässä selaimessa, ja asennettuna sovellus toimii myös ilman verkkoyhteyttä.",
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
          "Duunitracker tallentaa työhakemuksesi, muistiinpanosi, CV:t, saatekirjeet ja asetukset selaimeen (IndexedDB, ja localStorage varalla). Tietoja ei lähetetä palvelimelle eikä jaeta muiden käyttäjien kanssa.",
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
  pwa: {
    installTitle: "Asenna Duunitracker",
    installBody:
      "Lisää Koti-valikkoon, niin sovellus aukeaa nopeammin ja toimii myös ilman verkkoyhteyttä.",
    install: "Asenna",
    dismiss: "Ei nyt",
    iosHint: "iPhonessa napauta Jaa ja valitse Lisää Koti-valikkoon.",
    offline: "Ei yhteyttä",
    offlineTitle: "Ei verkkoyhteyttä",
    offlineBody:
      "Duunitracker avautuu silti tällä laitteella. Työpaikkalinkkien tuonti vaatii verkkoyhteyden.",
    openTracker: "Avaa tracker",
  },
  attachments: {
    title: "Liitteet",
    kinds: {
      cv: "CV",
      cover_letter: "Saatekirje",
      other: "Tiedosto",
    },
    coverLetterPlaceholder: "Kirjoita saatekirjeluonnos tälle hakemukselle...",
    uploadCv: "Lataa CV (PDF)",
    uploadFile: "Lisää tiedosto",
    download: "Lataa",
    empty: "Ei liitteitä vielä.",
    tooLarge: "Tiedosto on liian suuri. Enimmäiskoko on {size}.",
    unsupportedType: "Käytä PDF-, Word- tai tekstitiedostoa.",
    draftSaved: "Luonnos tallennettu",
    limitReached: "Tällä hakemuksella on jo enimmäismäärä tiedostoja.",
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
  analytics: {
    navApplications: "Hakemukset",
    navReports: "Raportit",
    title: "Analytiikka ja raportit",
    subtitle:
      "Suppilokaavio, työnhakuvelvoitteen seuranta, vastausajat ja tulostettava raportti Kelaa / Työmarkkinatoria varten.",
    emptyTitle: "Ei vielä hakemuksia analysoitavaksi",
    emptyHint:
      "Tuo tai lisää työpaikkoja ja merkitse ne haetuiksi, niin raportit täyttyvät.",
    funnelTitle: "Hakemussuppilo",
    funnelHint:
      "Muuntuminen lähetetyistä hakemuksista. Käsittelyssä on työnantajan prosessi; Hylätty on lopputulos, ei myöhempi vaihe.",
    funnelEmpty: "Ei lähetettyjä hakemuksia tällä jaksolla.",
    funnelWaiting: "{count} odottaa vielä vastausta",
    funnelResponded: "{count} sai vastauksen",
    dropOff: "{percent} % putosi",
    ofApplied: "{percent} % haetuista",
    quotaTitle: "Viikko- ja kuukausitavoite",
    quotaHint:
      "Suomen työnhakuvelvoite: 4 hakemusta 4 viikossa. Valitse jakso seurataksesi edistymistä.",
    quotaMet: "Velvoite täytetty",
    quotaShort: "Vielä {remaining} tarvitaan",
    quotaCount: "{applied} / {target}",
    rangeLabel: "Jakso",
    rangeFrom: "Alkaa",
    rangeTo: "Päättyy",
    presetRolling: "Viimeiset 4 viikkoa",
    presetThisMonth: "Tämä kuukausi",
    presetLastMonth: "Viime kuukausi",
    presetCustom: "Mukautettu",
    invalidRange: "Valitse kelvollinen alku- ja loppupäivä.",
    rangeOrder: "Alkupäivän on oltava ennen loppupäivää tai sama päivä.",
    weekLabel: "Viikko {index}",
    pacingHint: "Yksi hakemus viikossa pitää tahdin 4 / 4 viikkoa.",
    responseTitle: "Vastausaika",
    responseHint:
      "Keskimääräiset kalenteripäivät hakemuspäivästä haastattelupäivään, tai viimeiseen päivitykseen tiloissa Haastattelu, Tarjous tai Hylätty.",
    responseEmpty: "Ei vastausaikoja tällä jaksolla.",
    responseOverall: "Yhteensä",
    responsePending: "{count} odottaa",
    responseAverageDays: "{days} pv",
    responseSample: "{count} vastausta",
    byCompany: "Yrityksittäin",
    byStatus: "Tiloittain",
    noResponseYet: "Ei vielä vastausta",
    reportTitle: "Virallinen seurantaraportti",
    reportHint:
      "Siisti tulostettava listaus valitun jakson hakemuksista. Tulosta-toiminnolla voit tallentaa PDF:n Kelaa tai Työmarkkinatoria varten.",
    reportPrint: "Tulosta / Tallenna PDF",
    reportOfficialTitle: "Työnhaun seurantaraportti",
    reportOfficialSubtitle: "Tukiasiakirja Kelaa / Työmarkkinatoria varten",
    reportPeriod: "Raportointijakso",
    reportGenerated: "Luotu",
    reportDisclaimer:
      "Tämä asiakirja on muodostettu Duunitrackeriin paikallisesti tallennetuista tiedoista. Se ei ole Kelan tai Työmarkkinatorin virallinen lomake. Varmista, että lista vastaa työnhakuvelvoitettasi ennen toimittamista.",
    reportQuotaLabel: "Hakemukset vs. 4 / 4 viikon velvoite",
    reportQuotaValue: "{applied} / {target} {days} päivässä",
    reportNoApplications: "Tällä jaksolla ei ole merkittyjä hakemuksia.",
    reportSignature: "Allekirjoitus",
    reportDateLine: "Päiväys",
    colDate: "Hakupäivä",
    colEmployer: "Työnantaja",
    colPosition: "Tehtävä",
    colLocation: "Paikkakunta",
    colStatus: "Tila",
    colUrl: "Ilmoitus",
    stageApplied: "Haettu",
    stageInReview: "Käsittelyssä",
    stageInterview: "Haastattelu",
    stageOffer: "Tarjous",
    stageRejected: "Hylätty",
  },
  errors: {
    invalidJson: "Tuontitiedosto ei ole kelvollista JSON-muotoa",
    importBackupFailed: "Varmuuskopion tuonti epäonnistui",
    importEmpty: "Tuontitiedosto ei sisällä hakemuksia",
    importTooLarge: "Tuontitiedosto on liian suuri",
    importUnsupportedVersion:
      "Varmuuskopio on luotu uudemmalla Duunitracker-versiolla",
    importSchemaInvalid: "Varmuuskopio ei vastaa odotettua hakemusrakennetta",
    storageQuotaExceeded:
      "Selaimen tallennustila on täynnä. Poista hakemuksia tai vie varmuuskopio ja yritä uudelleen.",
    storageUnavailable:
      "Selaimen tallennustilaa ei voitu käyttää. Tarkista yksityisen selauksen asetukset.",
    storageCorrupted:
      "Tallennettuja hakemuksia ei voitu lukea. Palauta tiedot tuomalla varmuuskopio.",
    storageOverwriteBlocked:
      "Tallennetut hakemukset ovat lukukelvottomia, joten uusia ei tallennettu. Tuo ensin varmuuskopio.",
    storagePartialSkip:
      "Hakemukset ladattiin, mutta {count} virheellistä tietuetta ohitettiin.",
    attachmentsUnavailable:
      "Tämä selain ei voi tallentaa CV:itä tai saatekirjeitä. Hakemukset tallentuvat silti.",
    attachmentFailed: "Asiakirjaa ei voitu tallentaa.",
    parseInvalidUrl: "Liitä kelvollinen Duunitori-työpaikkalinkki.",
    parseTimeout: "Duunitori-ilmoituksen lataus aikakatkaistiin.",
    parseNetwork:
      "Duunitori-ilmoitusta ei voitu noutaa. Tarkista linkki ja yritä uudelleen.",
    parseBlocked: "Työpaikkasivu estettiin ennen kuin sitä ehdittiin lukea.",
    parseInvalidHtml: "Sivu ei ollut kelvollinen työpaikkailmoitus.",
    parseUnparseable: "Työpaikan tietoja ei voitu lukea tältä sivulta.",
    parseTooLarge: "Työpaikkasivu on liian suuri tuotavaksi.",
    importJobFailed: "Työpaikan tuonti epäonnistui",
    saveJobFailed: "Työpaikan tallennus epäonnistui",
    updateJobFailed: "Työpaikan päivitys epäonnistui",
    deleteJobFailed: "Työpaikan poisto epäonnistui",
    deleteConfirm: "Poistetaanko tämä hakemus?",
  },
};
