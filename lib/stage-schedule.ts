export type StageSchedule = {
  startDate: string | null
  endDate: string | null
}

export const STAGE_SCHEDULE_STORAGE_KEY = "prince2-stage-schedule"

function storageKey(projectId: string) {
  return `${STAGE_SCHEDULE_STORAGE_KEY}:${projectId}`
}

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export function emptySchedule(): StageSchedule {
  return { startDate: null, endDate: null }
}

/** Parse YYYY-MM-DD as a local calendar day (noon avoids DST edge cases). */
export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number)
  return new Date(y, m - 1, d, 12, 0, 0, 0)
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function addCalendarMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split("-").map(Number)
  const targetMonth = new Date(y, m - 1 + months, 1)
  const lastDay = new Date(
    targetMonth.getFullYear(),
    targetMonth.getMonth() + 1,
    0,
  ).getDate()
  return toIsoDate(
    new Date(
      targetMonth.getFullYear(),
      targetMonth.getMonth(),
      Math.min(d, lastDay),
      12,
      0,
      0,
      0,
    ),
  )
}

/**
 * Elapsed share of the stage window from start → end, using "today"
 * (the day the user views the page). Clamped 0–100.
 */
export function scheduleProgressPercent(
  startDate: string | null,
  endDate: string | null,
  today: Date = new Date(),
): number {
  if (!startDate || !endDate) return 0
  const start = parseIsoDate(startDate)
  const end = parseIsoDate(endDate)
  const now = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    12,
    0,
    0,
    0,
  )
  const total = end.getTime() - start.getTime()
  if (total <= 0) return now >= end ? 100 : 0
  if (now <= start) return 0
  if (now >= end) return 100
  return Math.round(((now.getTime() - start.getTime()) / total) * 100)
}

export function formatScheduleDate(
  iso: string | null,
  localeTag: string,
): string | null {
  if (!iso) return null
  return parseIsoDate(iso).toLocaleDateString(localeTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function readStoredStageSchedules(
  projectId: string,
  stageIds: string[],
): Record<string, StageSchedule> {
  const defaults = Object.fromEntries(
    stageIds.map((id) => [id, emptySchedule()]),
  )
  if (typeof window === "undefined") return defaults
  try {
    const raw = window.localStorage.getItem(storageKey(projectId))
    if (!raw) return defaults
    const parsed = JSON.parse(raw) as Record<string, Partial<StageSchedule>>
    const next = { ...defaults }
    for (const id of stageIds) {
      const row = parsed[id]
      if (!row) continue
      next[id] = {
        startDate: isIsoDate(row.startDate) ? row.startDate : null,
        endDate: isIsoDate(row.endDate) ? row.endDate : null,
      }
    }
    return next
  } catch {
    return defaults
  }
}

export function storeStageSchedules(
  projectId: string,
  map: Record<string, StageSchedule>,
) {
  window.localStorage.setItem(storageKey(projectId), JSON.stringify(map))
}
