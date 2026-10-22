import {
  benefits,
  documents,
  justification,
  objectives,
  productsSummary,
  projectMeta,
  risks,
  scope,
  stages,
  team,
  thesis,
  tolerances,
} from "@/lib/project-data"
import { scrumColumns, scrumMeta } from "@/lib/scrum-data"
import type { Project } from "@/lib/project-types"

export const fiskistofaProject: Project = {
  id: "fiskistofa",
  shortName: { is: "Fiskistofa", en: "Fiskistofa" },
  builtin: true,
  meta: projectMeta,
  justification,
  objectives,
  benefits,
  scope,
  productsSummary,
  thesis,
  tolerances,
  stages,
  risks,
  team,
  documents,
  scrumMeta,
  scrumColumns,
}
