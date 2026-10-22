import type { L, ScrumColumn, ScrumColumnId } from "@/lib/project-types"
import type { StageStatus } from "@/lib/stage-status"

/** Manual column for stages still “Ekki hafið” (backlog ↔ todo). */
export type ScrumPrepColumn = "backlog" | "todo"

export type ScrumTask = {
  id: string
  title: L
  detail: L
  column: ScrumColumnId
}

export type ScrumBoardState = {
  tasks: ScrumTask[]
  stagePrep: Record<string, ScrumPrepColumn>
}

export const SCRUM_BOARD_STORAGE_KEY = "prince2-scrum-board"

const COLUMN_IDS: ScrumColumnId[] = ["backlog", "todo", "doing", "done"]

function storageKey(projectId: string) {
  return `${SCRUM_BOARD_STORAGE_KEY}:${projectId}`
}

function isColumn(value: string): value is ScrumColumnId {
  return COLUMN_IDS.includes(value as ScrumColumnId)
}

function isPrep(value: string): value is ScrumPrepColumn {
  return value === "backlog" || value === "todo"
}

export function seedTasksFromColumns(columns: ScrumColumn[]): ScrumTask[] {
  const tasks: ScrumTask[] = []
  for (const column of columns) {
    for (const item of column.items) {
      tasks.push({
        id: item.id,
        title: item.title,
        detail: item.detail,
        column: column.id,
      })
    }
  }
  return tasks
}

export function nextScrumTaskId(tasks: ScrumTask[]): string {
  let max = -1
  for (const task of tasks) {
    const match = /^SCR-(\d+)$/i.exec(task.id)
    if (match) max = Math.max(max, Number(match[1]))
  }
  return `SCR-${String(max + 1).padStart(2, "0")}`
}

export function readScrumBoardState(
  projectId: string,
  seedColumns: ScrumColumn[],
): ScrumBoardState {
  const seeded = seedTasksFromColumns(seedColumns)
  if (typeof window === "undefined") {
    return { tasks: seeded, stagePrep: {} }
  }
  try {
    const raw = window.localStorage.getItem(storageKey(projectId))
    if (!raw) return { tasks: seeded, stagePrep: {} }

    const parsed = JSON.parse(raw) as {
      tasks?: unknown
      stagePrep?: unknown
      // legacy: whole object was stagePrep map
      [key: string]: unknown
    }

    // New shape
    if (Array.isArray(parsed.tasks)) {
      const tasks: ScrumTask[] = []
      for (const item of parsed.tasks) {
        if (!item || typeof item !== "object") continue
        const row = item as Record<string, unknown>
        if (typeof row.id !== "string") continue
        if (!isColumn(String(row.column))) continue
        const title = row.title as L | undefined
        const detail = row.detail as L | undefined
        if (!title?.is || !title?.en || !detail?.is || !detail?.en) continue
        tasks.push({
          id: row.id,
          title: { is: title.is, en: title.en },
          detail: { is: detail.is, en: detail.en },
          column: row.column as ScrumColumnId,
        })
      }
      const stagePrep: Record<string, ScrumPrepColumn> = {}
      if (parsed.stagePrep && typeof parsed.stagePrep === "object") {
        for (const [id, col] of Object.entries(
          parsed.stagePrep as Record<string, string>,
        )) {
          if (isPrep(col)) stagePrep[id] = col
        }
      }
      return { tasks, stagePrep }
    }

    // Legacy stage-prep-only map
    const stagePrep: Record<string, ScrumPrepColumn> = {}
    for (const [id, col] of Object.entries(parsed)) {
      if (typeof col === "string" && isPrep(col)) stagePrep[id] = col
    }
    return { tasks: seeded, stagePrep }
  } catch {
    return { tasks: seeded, stagePrep: {} }
  }
}

export function storeScrumBoardState(
  projectId: string,
  state: ScrumBoardState,
) {
  window.localStorage.setItem(storageKey(projectId), JSON.stringify(state))
}

/** @deprecated use readScrumBoardState */
export function readScrumPrepPlacements(
  projectId: string,
): Record<string, ScrumPrepColumn> {
  return readScrumBoardState(projectId, []).stagePrep
}

/** @deprecated use storeScrumBoardState */
export function storeScrumPrepPlacements(
  projectId: string,
  map: Record<string, ScrumPrepColumn>,
) {
  const existing = readScrumBoardState(projectId, [])
  storeScrumBoardState(projectId, { ...existing, stagePrep: map })
}

/**
 * Where a stage card sits on the SCRUM board.
 * notStarted → backlog by default, or todo if the user dragged it there.
 * inProgress / stopped → doing; done → done.
 */
export function scrumColumnForStage(
  status: StageStatus,
  prep: ScrumPrepColumn | undefined,
): ScrumColumnId {
  if (status === "done") return "done"
  if (status === "inProgress" || status === "stopped") return "doing"
  return prep === "todo" ? "todo" : "backlog"
}
