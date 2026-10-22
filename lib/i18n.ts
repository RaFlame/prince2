export type Locale = "is" | "en"

export type Section =
  | "overview"
  | "therney"
  | "stages"
  | "timeline"
  | "risks"
  | "documents"
  | "wiki"
  | "scrum"
  | "scrumStages"
  | "scrumStagesStopped"
  | "scrumStagesDone"
  | "team"
  | "settings"

const ui = {
  productName: { is: "PRINCE2 Control", en: "PRINCE2 Control" },
  productOffice: { is: "Verkefnaskrifstofa", en: "Project Office" },
  projectsBreadcrumb: { is: "Verkefni", en: "Projects" },
  orgName: { is: "Fiskistofa", en: "Directorate of Fisheries" },
  lastUpdated: { is: "Síðast uppfært", en: "Last updated" },
  onTrack: { is: "Á áætlun", en: "On track" },
  atRisk: { is: "Í hættu", en: "At risk" },
  workspaces: {
    prince2: { is: "PRINCE2", en: "PRINCE2" },
    scrum: { is: "SCRUM", en: "SCRUM" },
    shared: { is: "Sameiginlegt", en: "Shared" },
  },
  nav: {
    overview: { is: "Yfirlit", en: "Overview" },
    therney: { is: "Þerney", en: "Therney" },
    stages: { is: "Áætlanir áfanga", en: "Stage plans" },
    timeline: { is: "Tímalína", en: "Timeline" },
    risks: { is: "Áhættuskrá", en: "Risk register" },
    documents: { is: "Skjöl og afurðir", en: "Documents" },
    wiki: { is: "Wiki", en: "Wiki" },
    scrum: { is: "SCRUM", en: "SCRUM" },
    scrumStages: { is: "Áfangar í vinnslu", en: "Stages in progress" },
    scrumStagesStopped: { is: "Áfangar Stoppað", en: "Stages Stopped" },
    scrumStagesDone: { is: "Áfangar Búið", en: "Stages Done" },
    team: { is: "Teymi og hlutverk", en: "Team & roles" },
    settings: { is: "Stillingar", en: "Settings" },
  },
  therney: {
    title: { is: "Þerney", en: "Therney" },
    subtitle: {
      is: "Skipsupplýsingar fyrir tilraunaskipið í learning phase.",
      en: "Vessel particulars for the learning-phase trial vessel.",
    },
    general: { is: "Almennt", en: "General" },
    photos: { is: "Myndir", en: "Photos" },
    photoExterior: {
      is: "Útlit skips — Þerney",
      en: "Vessel exterior — Therney",
    },
    photoProcessing: {
      is: "Vinnsludekk um borð",
      en: "Onboard processing deck",
    },
    currentVoyage: { is: "Núverandi ferð", en: "Current voyage" },
    departure: { is: "Brottför frá", en: "Departure from" },
    arrival: { is: "Komustaður", en: "Arrival at" },
    actualDeparture: {
      is: "Rauntími brottfarar",
      en: "Actual time of departure",
    },
    reportedEta: { is: "Tilkynnt ETA", en: "Reported ETA" },
    lastReported: {
      is: "Síðast tilkynnt",
      en: "Last reported",
    },
    refreshVoyage: { is: "Uppfæra", en: "Refresh" },
    refreshingVoyage: { is: "Sæki…", en: "Refreshing…" },
    refreshVoyageOk: {
      is: "Uppfært úr AIS (MarineTraffic-gögn)",
      en: "Updated from AIS (MarineTraffic data)",
    },
    refreshVoyageError: {
      is: "Gat ekki sótt nýjustu gögn",
      en: "Could not fetch latest data",
    },
    pastTrack: { is: "Fyrri ferill", en: "Past track" },
    routeForecast: { is: "Áætluð leið", en: "Route forecast" },
    name: { is: "Nafn", en: "Name" },
    flag: { is: "Fáni", en: "Flag" },
    imo: { is: "IMO", en: "IMO" },
    mmsi: { is: "MMSI", en: "MMSI" },
    callSign: { is: "Kallmerki", en: "Call sign" },
    aisClass: { is: "AIS-flokkur", en: "AIS transponder class" },
    generalType: { is: "Almenn skipstegund", en: "General vessel type" },
    detailedType: { is: "Nánari skipstegund", en: "Detailed vessel type" },
  },
  scrum: {
    title: { is: "SCRUM — sprettaborð", en: "SCRUM — sprint board" },
    subtitle: {
      is: "Áfangar í „Ekki hafið“ lenda í Baklogg. Dragðu yfir í Að gera þegar þú undirbýrð áfanga fyrir Í vinnslu.",
      en: "Stages marked “Not started” land in Backlog. Drag to To do when you start preparing a stage for In progress.",
    },
    stageCard: { is: "Áfangi", en: "Stage" },
    taskCard: { is: "Verkefni", en: "Task" },
    dragHint: {
      is: "Dragðu áfanga og verkefni milli dálka",
      en: "Drag stages and tasks between columns",
    },
    dropHere: { is: "Slepptu hér", en: "Drop here" },
    addTask: { is: "Bæta við verkefni", en: "Add task" },
    deleteTask: { is: "Eyða verkefni", en: "Delete task" },
    newTaskTitle: { is: "Nýtt verkefni", en: "New task" },
    newTaskDetail: {
      is: "Lýsing — smelltu til að breyta.",
      en: "Description — click to edit.",
    },
    editTask: { is: "Breyta verkefni", en: "Edit task" },
    taskTitle: { is: "Titill", en: "Title" },
    taskDetail: { is: "Lýsing", en: "Detail" },
    stagesTitle: {
      is: "Áfangar í vinnslu",
      en: "Stages in progress",
    },
    stagesSubtitle: {
      is: "Afrit af PRINCE2 áföngum sem merktir eru „Í vinnslu“ — uppfærist sjálfkrafa.",
      en: "Copies of PRINCE2 stages marked “In progress” — updated automatically.",
    },
    stagesEmpty: {
      is: "Enginn áfangi í vinnslu. Veldu „Í vinnslu“ undir Áætlanir áfanga.",
      en: "No stage in progress. Choose “In progress” under Stage plans.",
    },
    stoppedTitle: {
      is: "Áfangar Stoppað",
      en: "Stages Stopped",
    },
    stoppedSubtitle: {
      is: "Afrit af PRINCE2 áföngum sem merktir eru „Stoppað“.",
      en: "Copies of PRINCE2 stages marked “Stopped”.",
    },
    stoppedEmpty: {
      is: "Enginn áfangi stoppaður. Veldu „Stoppað“ undir Áætlanir áfanga.",
      en: "No stopped stages. Choose “Stopped” under Stage plans.",
    },
    doneTitle: {
      is: "Áfangar Búið",
      en: "Stages Done",
    },
    doneSubtitle: {
      is: "Afrit af PRINCE2 áföngum sem merktir eru „Búið“.",
      en: "Copies of PRINCE2 stages marked “Done”.",
    },
    doneEmpty: {
      is: "Enginn áfangi búinn. Veldu „Búið“ undir Áætlanir áfanga.",
      en: "No completed stages. Choose “Done” under Stage plans.",
    },
  },
  wiki: {
    title: { is: "Wiki", en: "Wiki" },
    subtitle: {
      is: "Sameiginlegar skilgreiningar og orðalisti verkefnisins.",
      en: "Shared definitions and project glossary.",
    },
    glossaryTitle: { is: "Orðalisti", en: "Glossary" },
    glossarySubtitle: {
      is: "Skammstafanir og hugtök sem notuð eru í áætluninni.",
      en: "Abbreviations and terms used in the plan.",
    },
    abbreviations: { is: "Skammstafanir", en: "Abbreviations" },
    abbr: { is: "Skammstöfun", en: "Abbreviation" },
    expansion: { is: "Útskrifað", en: "Expansion" },
    definition: { is: "Skilgreining", en: "Definition" },
  },
  overview: {
    title: { is: "Yfirlit verkefnis", en: "Project overview" },
    subtitle: {
      is: "Stjórnunaryfirlit verkefnisins.",
      en: "Project governance overview.",
    },
    justification: { is: "Viðskiptaleg réttlæting", en: "Business justification" },
    objectives: { is: "Markmið", en: "Objectives" },
    benefits: { is: "Ávinningur", en: "Benefits" },
    scope: { is: "Umfang", en: "Scope" },
    products: { is: "Afurðir", en: "Products" },
    tolerances: { is: "Þolmörk", en: "Tolerance status" },
    tolerancesHint: {
      is: "Staða gagnvart samþykktum þolmörkum verkefnisins.",
      en: "Current position against approved project tolerances.",
    },
    stagesPreview: { is: "Áfangar (yfirlit)", en: "Stages (summary)" },
  },
  stages: {
    title: { is: "Áætlanir áfanga", en: "Stage plans" },
    subtitle: {
      is: "Áfangar verkefnisins með hliðum og afurðum.",
      en: "Project stages with gates and products.",
    },
    manager: { is: "Ábyrgð", en: "Owner" },
    progress: { is: "Framvinda", en: "Progress" },
    startDate: { is: "Upphafsdagur", en: "Start date" },
    endDate: { is: "Lokadagur", en: "End date" },
    estimatedEndDate: {
      is: "Áætlaður lokadagur",
      en: "Estimated end date",
    },
    status: { is: "Staða", en: "Status" },
    gate: { is: "Go / no-go", en: "Go / no-go" },
    outcomes: { is: "Áætlaðar afurðir áfangans", en: "Planned stage outcomes" },
    tabPlans: { is: "Áætlanir áfanga", en: "Stage plans" },
    tabTimeline: { is: "Tímalína", en: "Timeline" },
  },
  timeline: {
    title: { is: "Tímalína", en: "Timeline" },
    subtitle: {
      is: "Gantt-yfirlit áfanga — dragðu stikur til að breyta upphafs- og lokadegi.",
      en: "Stage Gantt — drag bars to change start and end dates.",
    },
    today: { is: "Í dag", en: "Today" },
    noDates: {
      is: "Engin dagsetning — veldu upphaf hér",
      en: "No dates — pick a start here",
    },
    setDefaultRange: {
      is: "Setja byrjun (í dag → +3 mán.)",
      en: "Set start (today → +3 mo.)",
    },
    dragHint: {
      is: "Dragðu enda til að breyta dögum, eða miðju til að færa.",
      en: "Drag edges to resize, or the middle to move.",
    },
  },
  risks: {
    title: { is: "Áhættuskrá", en: "Risk register" },
    subtitle: {
      is: "Virk áhætta sem krefst yfirsýnar stýrihóps / yfirstjórnar.",
      en: "Active risks requiring steering group / executive oversight.",
    },
    ref: { is: "Tilvísun", en: "Ref" },
    description: { is: "Lýsing", en: "Risk description" },
    owner: { is: "Eigandi", en: "Owner" },
    category: { is: "Flokkur", en: "Category" },
    severity: { is: "Alvarleiki", en: "Severity" },
    status: { is: "Staða", en: "Status" },
    target: { is: "Markdagur", en: "Target date" },
    mitigation: { is: "Mótvægisaðgerð", en: "Mitigation" },
  },
  documents: {
    title: { is: "Skjöl og afurðir", en: "Documents & products" },
    subtitle: {
      is: "Áætlaðar stjórnunar- og tækniáætlanir verkefnisins.",
      en: "Planned management and technical products for the project.",
    },
    name: { is: "Afurð", en: "Product" },
    type: { is: "Tegund", en: "Type" },
    stage: { is: "Áfangi", en: "Stage" },
    status: { is: "Staða", en: "Status" },
  },
  team: {
    title: { is: "Teymi og hlutverk", en: "Team & roles" },
    subtitle: {
      is: "RACI fyrir learning phase — sérfræðingur í tækniþróun sem brú milli Eftirlits og UT.",
      en: "RACI for the learning phase — monitoring tech specialist as bridge between Inspection and IT.",
    },
    role: { is: "Hlutverk", en: "Role" },
    responsibility: { is: "Ábyrgð", en: "Responsibility" },
    raci: { is: "RACI", en: "RACI" },
  },
  settings: {
    title: { is: "Stillingar", en: "Settings" },
    subtitle: {
      is: "Viðmótstungumál og aðgangur að stjórnunaryfirlitinu.",
      en: "Interface language and access to this governance dashboard.",
    },
    language: { is: "Tungumál", en: "Language" },
    languageHint: {
      is: "Íslenska er sjálfgefið. Enska er tiltæk fyrir kynningu eða samstarfsaðila.",
      en: "Icelandic is the default. English is available for presentations or partners.",
    },
    icelandic: { is: "Íslenska", en: "Icelandic" },
    english: { is: "Enska", en: "English" },
    account: { is: "Aðgangur", en: "Account" },
    accountHint: {
      is: "Þú ert skráð(ur) inn. Aðgangur er veittur af verkefnisstjóra (engin opin skráning).",
      en: "You are signed in. Access is granted by the project owner (no public sign-up).",
    },
    signedInAs: { is: "Skráð(ur) inn sem", en: "Signed in as" },
    signOut: { is: "Skrá út", en: "Sign out" },
    usage: { is: "Notkun", en: "Usage" },
    usageHint: {
      is: "Innskráningar og virkni notenda (síðustu atburðir). Sjá einnig töfluna usage_events í Supabase.",
      en: "Logins and user activity (recent events). Also see the usage_events table in Supabase.",
    },
    usageEmpty: {
      is: "Engin atburðaskrá enn — keyrðu schema.sql og skráðu þig inn aftur.",
      en: "No events yet — run schema.sql and sign in again.",
    },
    usageWhen: { is: "Tími", en: "When" },
    usageUser: { is: "Notandi", en: "User" },
    usageEvent: { is: "Atburður", en: "Event" },
    usageLogin: { is: "Innskráning", en: "Login" },
    usageSession: { is: "Lota", en: "Session" },
    usageHeartbeat: { is: "Virkni", en: "Active" },
    usageSection: { is: "Síða", en: "Section" },
  },
  theme: {
    toDark: { is: "Skipta í dökkt þema", en: "Switch to dark theme" },
    toLight: { is: "Skipta í ljóst þema", en: "Switch to light theme" },
  },
  sidebar: {
    hide: { is: "Fela hliðarspjald", en: "Hide sidepanel" },
    show: { is: "Sýna hliðarspjald", en: "Show sidepanel" },
  },
  projects: {
    switch: { is: "Skipta um verkefni", en: "Switch project" },
    new: { is: "Nýtt verkefni", en: "New project" },
    newTitle: { is: "Búa til verkefni", en: "Create project" },
    newHint: {
      is: "Grunnur með PRINCE2 áföngum — þú fyllir inn efni á eftir.",
      en: "Starts with PRINCE2 stages — fill in content afterward.",
    },
    name: { is: "Heiti verkefnis", en: "Project name" },
    organisation: { is: "Skipulagseining", en: "Organisation" },
    create: { is: "Stofna", en: "Create" },
  },
  status: {
    notStarted: { is: "Ekki hafið", en: "Not started" },
    inProgress: { is: "Í vinnslu", en: "In progress" },
    stopped: { is: "Stoppað", en: "Stopped" },
    done: { is: "Búið", en: "Done" },
    complete: { is: "Lokið", en: "Complete" },
    planned: { is: "Áætlað", en: "Planned" },
    draft: { is: "Drög", en: "Draft" },
    open: { is: "Opið", en: "Open" },
    mitigating: { is: "Mótvægi í gangi", en: "Mitigating" },
    monitoring: { is: "Eftirlit", en: "Monitoring" },
  },
  severity: {
    high: { is: "Hátt", en: "High" },
    medium: { is: "Meðal", en: "Medium" },
    low: { is: "Lágt", en: "Low" },
  },
  tolerance: {
    time: { is: "Tími", en: "Time" },
    cost: { is: "Kostnaður", en: "Cost" },
    scope: { is: "Umfang", en: "Scope" },
    risk: { is: "Áhætta", en: "Risk" },
  },
  cards: {
    edit: { is: "Breyta", en: "Edit" },
    save: { is: "Vista", en: "Save" },
    cancel: { is: "Hætta við", en: "Cancel" },
    font: { is: "Letur", en: "Font" },
    size: { is: "Stærð", en: "Size" },
    color: { is: "Litur", en: "Color" },
    bold: { is: "Feitletrað", en: "Bold" },
    italic: { is: "Skáletrað", en: "Italic" },
    savedCloud: { is: "Vistað", en: "Saved" },
    savedLocal: {
      is: "Vistað á þessari tölvu (settu upp Supabase fyrir ský)",
      en: "Saved on this device (configure Supabase for cloud)",
    },
    saveError: { is: "Villa við vistun", en: "Save failed" },
  },
} as const

type Localized = { is: string; en: string }

function resolve(value: Localized, locale: Locale): string {
  return value[locale]
}

export function t(locale: Locale, path: string): string {
  const parts = path.split(".")
  let node: unknown = ui
  for (const part of parts) {
    if (node && typeof node === "object" && part in node) {
      node = (node as Record<string, unknown>)[part]
    } else {
      return path
    }
  }
  if (node && typeof node === "object" && "is" in node && "en" in node) {
    return resolve(node as Localized, locale)
  }
  return path
}

export function loc(locale: Locale, value: Localized): string {
  return value[locale]
}

export const LOCALE_STORAGE_KEY = "prince2-locale"

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "is"
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return stored === "en" ? "en" : "is"
}

export function storeLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}
