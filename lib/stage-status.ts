export type StageStatus = "notStarted" | "inProgress" | "stopped" | "done"

export const STAGE_STATUSES: StageStatus[] = [
  "notStarted",
  "inProgress",
  "stopped",
  "done",
]

export const STAGE_STATUS_STORAGE_KEY = "prince2-stage-status"

export const stageStatusBadgeClass: Record<StageStatus, string> = {
  notStarted: "bg-slate-100 text-slate-700",
  inProgress: "bg-emerald-100 text-emerald-800",
  stopped: "bg-amber-100 text-amber-900",
  done: "bg-blue-100 text-blue-800",
}

export const stageCardClass: Record<StageStatus, string> = {
  notStarted: "border-slate-200 bg-white",
  inProgress: "border-emerald-200 bg-emerald-50",
  stopped: "border-amber-200 bg-amber-50/40",
  done: "border-blue-200 bg-blue-50/40",
}

function storageKey(projectId: string) {
  return `${STAGE_STATUS_STORAGE_KEY}:${projectId}`
}

export function readStoredStageStatuses(
  projectId: string,
  defaults: Record<string, StageStatus>,
): Record<string, StageStatus> {
  if (typeof window === "undefined") return { ...defaults }
  try {
    let raw = window.localStorage.getItem(storageKey(projectId))
    // Migrate legacy unscoped Fiskistofa statuses
    if (!raw && projectId === "fiskistofa") {
      raw = window.localStorage.getItem(STAGE_STATUS_STORAGE_KEY)
    }
    if (!raw) return { ...defaults }
    const parsed = JSON.parse(raw) as Record<string, string>
    const next = { ...defaults }
    for (const [id, value] of Object.entries(parsed)) {
      if (STAGE_STATUSES.includes(value as StageStatus)) {
        next[id] = value as StageStatus
      }
    }
    return next
  } catch {
    return { ...defaults }
  }
}

export function storeStageStatuses(
  projectId: string,
  map: Record<string, StageStatus>,
) {
  window.localStorage.setItem(storageKey(projectId), JSON.stringify(map))
}
