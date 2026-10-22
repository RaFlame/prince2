import type { L, Project } from "@/lib/project-types"
import { emptyScrumColumns } from "@/lib/project-types"

function both(text: string): L {
  return { is: text, en: text }
}

export function createBlankProject(input: {
  id: string
  name: string
  organisation: string
}): Project {
  const name = both(input.name.trim() || "Nýtt verkefni")
  const organisation = both(input.organisation.trim() || "—")

  return {
    id: input.id,
    shortName: organisation.is !== "—" ? organisation : name,
    builtin: false,
    meta: {
      name,
      organisation,
      roleFocus: {
        is: "Verkefnastjóri / sérfræðingur",
        en: "Project manager / specialist",
      },
      status: "onTrack",
      lastUpdated: {
        is: new Date().toLocaleDateString("is-IS", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        en: new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
      duration: {
        is: "Áætlað",
        en: "To be planned",
      },
      overviewSubtitle: {
        is: "Stjórnunaryfirlit — fylltu inn réttlætingu, markmið og áfanga.",
        en: "Governance overview — fill in justification, objectives, and stages.",
      },
      stagesSubtitle: {
        is: "Byrjunaráfangar — aðlagaðu að verkefninu.",
        en: "Starter stages — adapt to the project.",
      },
    },
    justification: {
      is: "Lýstu viðskiptalegri réttlætingu verkefnisins hér.",
      en: "Describe the business justification here.",
    },
    objectives: [
      {
        is: "Markmið 1 — breyttu þessum texta.",
        en: "Objective 1 — edit this text.",
      },
    ],
    benefits: [
      {
        is: "Ávinningur 1 — breyttu þessum texta.",
        en: "Benefit 1 — edit this text.",
      },
    ],
    scope: {
      is: "Lýstu umfangi (inn / út) hér.",
      en: "Describe scope (in / out) here.",
    },
    productsSummary: {
      is: "Lýstu helstu afurðum hér.",
      en: "Describe key products here.",
    },
    thesis: {
      is: "Persónuleg ábyrgðarlýsing / thesis — breyttu þessum texta.",
      en: "Personal accountability / thesis — edit this text.",
    },
    tolerances: [
      {
        id: "time",
        value: { is: "—", en: "—" },
        detail: { is: "Tímaþolmörk", en: "Time tolerance" },
        tone: "neutral",
      },
      {
        id: "cost",
        value: { is: "—", en: "—" },
        detail: { is: "Kostnaðarþolmörk", en: "Cost tolerance" },
        tone: "neutral",
      },
      {
        id: "scope",
        value: { is: "—", en: "—" },
        detail: { is: "Umfangsþolmörk", en: "Scope tolerance" },
        tone: "neutral",
      },
      {
        id: "risk",
        value: { is: "—", en: "—" },
        detail: { is: "Áhættuþolmörk", en: "Risk tolerance" },
        tone: "neutral",
      },
    ],
    stages: [
      {
        id: "P0",
        name: {
          is: "P0 — Upphaf og kröfur",
          en: "P0 — Start & requirements",
        },
        owner: {
          is: "Verkefnastjóri",
          en: "Project manager",
        },
        progress: 0,
        endDate: { is: "áætlun", en: "planned" },
        status: "notStarted",
        gate: {
          is: "Samþykkt upphafsskjal / kröfur",
          en: "Approved start document / requirements",
        },
        outcomes: [
          {
            is: "Kröfulýsing",
            en: "Requirements",
          },
        ],
      },
      {
        id: "P1",
        name: {
          is: "P1 — Undirbúningur",
          en: "P1 — Preparation",
        },
        owner: {
          is: "Verkefnastjóri",
          en: "Project manager",
        },
        progress: 0,
        endDate: { is: "áætlun", en: "planned" },
        status: "notStarted",
        gate: {
          is: "Tilbúið til framkvæmdar",
          en: "Ready to execute",
        },
        outcomes: [
          {
            is: "Áætlun og áhættuskrá",
            en: "Plan and risk register",
          },
        ],
      },
      {
        id: "P2",
        name: {
          is: "P2 — Framkvæmd",
          en: "P2 — Delivery",
        },
        owner: {
          is: "Verkefnastjóri",
          en: "Project manager",
        },
        progress: 0,
        endDate: { is: "áætlun", en: "planned" },
        status: "notStarted",
        gate: {
          is: "Afurðir innan þolmarka",
          en: "Products within tolerance",
        },
        outcomes: [
          {
            is: "Helstu afurðir",
            en: "Key products",
          },
        ],
      },
      {
        id: "P3",
        name: {
          is: "P3 — Lok og lærdómur",
          en: "P3 — Close & learn",
        },
        owner: {
          is: "Verkefnastjóri",
          en: "Project manager",
        },
        progress: 0,
        endDate: { is: "áætlun", en: "planned" },
        status: "notStarted",
        gate: {
          is: "Lokaskýrsla og ákvörðun um framhald",
          en: "Closure report and next-step decision",
        },
        outcomes: [
          {
            is: "Lokaskýrsla",
            en: "Closure report",
          },
        ],
      },
    ],
    risks: [],
    team: [
      {
        role: {
          is: "Verkefnastjóri",
          en: "Project manager",
        },
        responsibility: {
          is: "Dagleg stjórnun, þolmörk, skýrslur",
          en: "Day-to-day control, tolerances, reporting",
        },
        raci: "R",
      },
      {
        role: {
          is: "Stýrihópur",
          en: "Steering group",
        },
        responsibility: {
          is: "Ákvarðanir utan þolmarka",
          en: "Decisions outside tolerance",
        },
        raci: "A",
      },
    ],
    documents: [
      {
        name: {
          is: "Verkefnisáætlun",
          en: "Project plan",
        },
        type: { is: "Stjórnunarskjal", en: "Management product" },
        stage: "P0",
        status: "planned",
      },
    ],
    scrumMeta: {
      sprintLabel: {
        is: "Spretta 1",
        en: "Sprint 1",
      },
      sprintWindow: {
        is: "2 vikur",
        en: "2 weeks",
      },
    },
    scrumColumns: emptyScrumColumns(),
  }
}
