export const PROJECT_STATE_KINDS = [
  "stage_status",
  "stage_schedule",
  "scrum_board",
  "custom_projects",
] as const

export type ProjectStateKind = (typeof PROJECT_STATE_KINDS)[number]

export const GLOBAL_PROJECT_ID = "_global"

export type ProjectStateRow = {
  project_id: string
  kind: ProjectStateKind
  payload: unknown
  updated_at?: string
}

export function isProjectStateKind(value: string): value is ProjectStateKind {
  return (PROJECT_STATE_KINDS as readonly string[]).includes(value)
}

export function isPayloadEmpty(payload: unknown): boolean {
  if (payload == null) return true
  if (Array.isArray(payload)) return payload.length === 0
  if (typeof payload === "object") {
    return Object.keys(payload as object).length === 0
  }
  return false
}
