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

export function daysBetween(startIso: string, endIso: string): number {
  const start = parseIsoDate(startIso)
  const end = parseIsoDate(endIso)
  return Math.round((end.getTime() - start.getTime()) / (24 * 60 * 60 * 1000))
}

export function addDays(iso: string, days: number): string {
  const d = parseIsoDate(iso)
  d.setDate(d.getDate() + days)
  return toIsoDate(d)
}

export function clampIso(iso: string, minIso: string, maxIso: string): string {
  if (iso < minIso) return minIso
  if (iso > maxIso) return maxIso
  return iso
}

/** Inclusive chart window covering all stage dates, with month padding. */
export function computeGanttRange(
  schedules: StageSchedule[],
  today: Date = new Date(),
): { rangeStart: string; rangeEnd: string } {
  const dates: string[] = []
  for (const s of schedules) {
    if (s.startDate) dates.push(s.startDate)
    if (s.endDate) dates.push(s.endDate)
  }
  const todayIso = toIsoDate(today)
  if (dates.length === 0) {
    return {
      rangeStart: todayIso,
      rangeEnd: addCalendarMonths(todayIso, 12),
    }
  }
  dates.sort()
  const min = dates[0]!
  const max = dates[dates.length - 1]!
  const paddedStart = addCalendarMonths(min, -1)
  let paddedEnd = addCalendarMonths(max, 1)
  if (paddedEnd < todayIso) paddedEnd = addCalendarMonths(todayIso, 1)
  if (daysBetween(paddedStart, paddedEnd) < 60) {
    paddedEnd = addCalendarMonths(paddedStart, 3)
  }
  return { rangeStart: paddedStart, rangeEnd: paddedEnd }
}

export function monthTicks(rangeStart: string, rangeEnd: string): string[] {
  const ticks: string[] = []
  const start = parseIsoDate(rangeStart)
  const end = parseIsoDate(rangeEnd)
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1, 12)
  while (cursor <= end) {
    ticks.push(toIsoDate(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return ticks
}

/** ISO-8601 week number and week-year for a calendar date. */
export function isoWeekParts(iso: string): { week: number; year: number } {
  const date = parseIsoDate(iso)
  const utc = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  const dayNum = utc.getUTCDay() || 7
  utc.setUTCDate(utc.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1))
  const week = Math.ceil(
    ((utc.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7,
  )
  return { week, year: utc.getUTCFullYear() }
}

function startOfIsoWeek(iso: string): Date {
  const date = parseIsoDate(iso)
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + mondayOffset)
  monday.setHours(12, 0, 0, 0)
  return monday
}

/**
 * Week-start ticks (Mondays) across the range.
 * Steps every 1 / 2 / 4 weeks depending on span so labels stay readable.
 */
export function weekTicks(rangeStart: string, rangeEnd: string): string[] {
  const end = parseIsoDate(rangeEnd)
  const span = daysBetween(rangeStart, rangeEnd)
  const stepWeeks = span > 400 ? 4 : span > 180 ? 2 : 1
  const cursor = startOfIsoWeek(rangeStart)
  const ticks: string[] = []
  while (cursor <= end) {
    ticks.push(toIsoDate(cursor))
    cursor.setDate(cursor.getDate() + 7 * stepWeeks)
  }
  return ticks
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
