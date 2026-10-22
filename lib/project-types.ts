import type { Locale } from "./i18n"
import { loc } from "./i18n"
import type { StageStatus } from "@/lib/stage-status"

export type L = { is: string; en: string }

export type ToleranceId = "time" | "cost" | "scope" | "risk"
export type RiskSeverity = "high" | "medium" | "low"
export type RiskStatus = "open" | "mitigating" | "monitoring"
export type ScrumColumnId = "backlog" | "todo" | "doing" | "done"

export type ProjectMeta = {
  name: L
  organisation: L
  roleFocus: L
  status: "onTrack" | "atRisk"
  lastUpdated: L
  duration: L
  overviewSubtitle: L
  stagesSubtitle: L
}

export type ProjectStage = {
  id: string
  name: L
  owner: L
  progress: number
  endDate: L
  status: StageStatus
  gate: L
  outcomes: L[]
}

export type ProjectRisk = {
  ref: string
  description: L
  owner: L
  category: L
  severity: RiskSeverity
  status: RiskStatus
  target: L
  mitigation: L
}

export type ProjectTeamMember = {
  role: L
  responsibility: L
  raci: "R" | "A" | "C" | "I"
}

export type ProjectDocument = {
  name: L
  type: L
  stage: string
  status: "planned" | "draft"
}

export type ProjectTolerance = {
  id: ToleranceId
  value: L
  detail: L
  tone: "good" | "neutral" | "watch"
}

export type ScrumItem = { id: string; title: L; detail: L }

export type ScrumColumn = {
  id: ScrumColumnId
  title: L
  items: ScrumItem[]
}

export type Project = {
  id: string
  shortName: L
  builtin: boolean
  meta: ProjectMeta
  justification: L
  objectives: L[]
  benefits: L[]
  scope: L
  productsSummary: L
  thesis: L
  tolerances: ProjectTolerance[]
  stages: ProjectStage[]
  risks: ProjectRisk[]
  team: ProjectTeamMember[]
  documents: ProjectDocument[]
  scrumMeta: {
    sprintLabel: L
    sprintWindow: L
  }
  scrumColumns: ScrumColumn[]
}

export function pick(locale: Locale, value: L): string {
  return loc(locale, value)
}

export function emptyScrumColumns(): ScrumColumn[] {
  return [
    {
      id: "backlog",
      title: { is: "Baklogg", en: "Backlog" },
      items: [],
    },
    {
      id: "todo",
      title: { is: "Að gera", en: "To do" },
      items: [],
    },
    {
      id: "doing",
      title: { is: "Í vinnslu", en: "In progress" },
      items: [],
    },
    {
      id: "done",
      title: { is: "Lokið", en: "Done" },
      items: [],
    },
  ]
}
