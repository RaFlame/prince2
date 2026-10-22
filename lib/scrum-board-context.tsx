"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useProject } from "@/lib/project-context"
import type { ScrumColumnId } from "@/lib/project-types"
import {
  fetchProjectState,
  resolveWithMigration,
  rowForKind,
  saveProjectState,
} from "@/lib/project-state-sync"
import {
  readScrumBoardState,
  seedTasksFromColumns,
  storeScrumBoardState,
  type ScrumBoardState,
  type ScrumPrepColumn,
  type ScrumTask,
} from "@/lib/scrum-board"

type ScrumBoardContextValue = {
  ready: boolean
  tasks: ScrumTask[]
  stagePrep: Record<string, ScrumPrepColumn>
  setTasks: (
    updater: ScrumTask[] | ((prev: ScrumTask[]) => ScrumTask[]),
  ) => void
  setStagePrep: (
    updater:
      | Record<string, ScrumPrepColumn>
      | ((prev: Record<string, ScrumPrepColumn>) => Record<string, ScrumPrepColumn>),
  ) => void
  replaceBoard: (tasks: ScrumTask[], stagePrep: Record<string, ScrumPrepColumn>) => void
}

const ScrumBoardContext = createContext<ScrumBoardContextValue | null>(null)

const COLUMN_IDS: ScrumColumnId[] = ["backlog", "todo", "doing", "done"]

function isPrep(value: unknown): value is ScrumPrepColumn {
  return value === "backlog" || value === "todo"
}

function isColumn(value: unknown): value is ScrumColumnId {
  return (
    typeof value === "string" && COLUMN_IDS.includes(value as ScrumColumnId)
  )
}

function parseBoardPayload(
  payload: unknown,
  fallback: ScrumBoardState,
): ScrumBoardState {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return fallback
  }
  const raw = payload as {
    tasks?: unknown
    stagePrep?: unknown
  }
  const tasks: ScrumTask[] = []
  if (Array.isArray(raw.tasks)) {
    for (const item of raw.tasks) {
      if (!item || typeof item !== "object") continue
      const row = item as Partial<ScrumTask>
      if (typeof row.id !== "string") continue
      if (!row.title || typeof row.title !== "object") continue
      if (!row.detail || typeof row.detail !== "object") continue
      if (!isColumn(row.column)) continue
      const title = row.title as { is?: unknown; en?: unknown }
      const detail = row.detail as { is?: unknown; en?: unknown }
      if (typeof title.is !== "string" || typeof title.en !== "string") continue
      if (typeof detail.is !== "string" || typeof detail.en !== "string")
        continue
      tasks.push({
        id: row.id,
        title: { is: title.is, en: title.en },
        detail: { is: detail.is, en: detail.en },
        column: row.column,
      })
    }
  }
  const stagePrep: Record<string, ScrumPrepColumn> = {}
  if (raw.stagePrep && typeof raw.stagePrep === "object") {
    for (const [id, col] of Object.entries(
      raw.stagePrep as Record<string, unknown>,
    )) {
      if (isPrep(col)) stagePrep[id] = col
    }
  }
  if (tasks.length === 0 && Object.keys(stagePrep).length === 0) {
    return fallback
  }
  return {
    tasks: tasks.length > 0 ? tasks : fallback.tasks,
    stagePrep,
  }
}

function isBoardEmpty(state: ScrumBoardState, seeded: ScrumBoardState) {
  const prepEmpty = Object.keys(state.stagePrep).length === 0
  const tasksMatchSeed =
    state.tasks.length === seeded.tasks.length &&
    state.tasks.every((task, i) => {
      const seed = seeded.tasks[i]
      return (
        seed &&
        task.id === seed.id &&
        task.column === seed.column &&
        task.title.is === seed.title.is &&
        task.title.en === seed.title.en
      )
    })
  return prepEmpty && tasksMatchSeed
}

export function ScrumBoardProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { projectId, project, ready: projectReady } = useProject()
  const [board, setBoard] = useState<ScrumBoardState>({
    tasks: [],
    stagePrep: {},
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!projectReady) return
    let cancelled = false
    const local = readScrumBoardState(projectId, project.scrumColumns)
    const seedFallback: ScrumBoardState = {
      tasks: seedTasksFromColumns(project.scrumColumns),
      stagePrep: {},
    }
    setBoard(local)

    async function load() {
      const result = await fetchProjectState(projectId)
      if (cancelled) return
      if (!result.configured) {
        setReady(true)
        return
      }
      const row = rowForKind(result.rows, "scrum_board", projectId)
      const resolved = await resolveWithMigration({
        projectId,
        kind: "scrum_board",
        serverPayload: row?.payload,
        localPayload: local,
        isLocalEmpty: (payload) => isBoardEmpty(payload, seedFallback),
      })
      if (cancelled) return
      const next = parseBoardPayload(resolved.payload, seedFallback)
      storeScrumBoardState(projectId, next)
      setBoard(next)
      setReady(true)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [projectReady, projectId, project.scrumColumns])

  const commit = useCallback(
    (next: ScrumBoardState) => {
      setBoard(next)
      storeScrumBoardState(projectId, next)
      void saveProjectState({
        projectId,
        kind: "scrum_board",
        payload: next,
      })
    },
    [projectId],
  )

  const setTasks = useCallback(
    (updater: ScrumTask[] | ((prev: ScrumTask[]) => ScrumTask[])) => {
      setBoard((prev) => {
        const nextTasks =
          typeof updater === "function" ? updater(prev.tasks) : updater
        const next = { tasks: nextTasks, stagePrep: prev.stagePrep }
        storeScrumBoardState(projectId, next)
        void saveProjectState({
          projectId,
          kind: "scrum_board",
          payload: next,
        })
        return next
      })
    },
    [projectId],
  )

  const setStagePrep = useCallback(
    (
      updater:
        | Record<string, ScrumPrepColumn>
        | ((
            prev: Record<string, ScrumPrepColumn>,
          ) => Record<string, ScrumPrepColumn>),
    ) => {
      setBoard((prev) => {
        const nextPrep =
          typeof updater === "function" ? updater(prev.stagePrep) : updater
        const next = { tasks: prev.tasks, stagePrep: nextPrep }
        storeScrumBoardState(projectId, next)
        void saveProjectState({
          projectId,
          kind: "scrum_board",
          payload: next,
        })
        return next
      })
    },
    [projectId],
  )

  const replaceBoard = useCallback(
    (tasks: ScrumTask[], stagePrep: Record<string, ScrumPrepColumn>) => {
      commit({ tasks, stagePrep })
    },
    [commit],
  )

  const value = useMemo(
    () => ({
      ready,
      tasks: board.tasks,
      stagePrep: board.stagePrep,
      setTasks,
      setStagePrep,
      replaceBoard,
    }),
    [ready, board.tasks, board.stagePrep, setTasks, setStagePrep, replaceBoard],
  )

  return (
    <ScrumBoardContext.Provider value={value}>
      {children}
    </ScrumBoardContext.Provider>
  )
}

export function useScrumBoard() {
  const ctx = useContext(ScrumBoardContext)
  if (!ctx) {
    throw new Error("useScrumBoard must be used within ScrumBoardProvider")
  }
  return ctx
}
