type L = { is: string; en: string }

export const scrumMeta = {
  sprintLabel: {
    is: "Spretta 1 · Learning phase",
    en: "Sprint 1 · Learning phase",
  } satisfies L,
  sprintWindow: {
    is: "2 vikur · tengt áfanga P0–P1",
    en: "2 weeks · linked to stages P0–P1",
  } satisfies L,
}

export type ScrumColumnId = "backlog" | "todo" | "doing" | "done"

export const scrumColumns: {
  id: ScrumColumnId
  title: L
  items: { id: string; title: L; detail: L }[]
}[] = [
  {
    id: "backlog",
    title: { is: "Baklogg", en: "Backlog" },
    items: [
      {
        id: "SCR-04",
        title: {
          is: "Drög að matsspjald (vendor)",
          en: "Draft vendor evaluation matrix",
        },
        detail: {
          is: "Viðmið: tegund, vigt, FOV, rekstur um borð.",
          en: "Criteria: species, weight, FOV, onboard ops.",
        },
      },
      {
        id: "SCR-05",
        title: {
          is: "Hafró gagnasamantekt — forathugun",
          en: "Hafró data product — early look",
        },
        detail: {
          is: "Hvaða samantektir eru gagnlegar vísindunum.",
          en: "Which aggregates help science.",
        },
      },
    ],
  },
  {
    id: "todo",
    title: { is: "Að gera", en: "To do" },
    items: [
      {
        id: "SCR-01",
        title: {
          is: "Endurræsa uppsetningu á einu skipi",
          en: "Restart installation on one vessel",
        },
        detail: {
          is: "Samningur undirritaður — bið eftir útgerð.",
          en: "Contract signed — waiting on operator.",
        },
      },
      {
        id: "SCR-02",
        title: {
          is: "SRS-lite: umhverfi og myndsvið",
          en: "SRS-lite: environment and FOV",
        },
        detail: {
          is: "Færiband að mjöl — horn, þekja, lýsing.",
          en: "Meal-plant conveyor — angle, coverage, lighting.",
        },
      },
    ],
  },
  {
    id: "doing",
    title: { is: "Í vinnslu", en: "In progress" },
    items: [
      {
        id: "SCR-03",
        title: {
          is: "Orðalisti og sameiginleg skilgreining",
          en: "Glossary and shared definitions",
        },
        detail: {
          is: "AI, CV, EM, SOP — tilbúið í Wiki.",
          en: "AI, CV, EM, SOP — live in Wiki.",
        },
      },
    ],
  },
  {
    id: "done",
    title: { is: "Lokið", en: "Done" },
    items: [
      {
        id: "SCR-00",
        title: {
          is: "PRINCE2 stjórnunaryfirlit — grunnur",
          en: "PRINCE2 control dashboard — baseline",
        },
        detail: {
          is: "Yfirlit, áfangar, áhætta, skjöl, teymi.",
          en: "Overview, stages, risks, documents, team.",
        },
      },
    ],
  },
]
