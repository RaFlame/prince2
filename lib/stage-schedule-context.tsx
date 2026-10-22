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
import {
  fetchProjectState,
  resolveWithMigration,
  rowForKind,
  saveProjectState,
} from "@/lib/project-state-sync"
import {
  addCalendarMonths,
  emptySchedule,
  readStoredStageSchedules,
  storeStageSchedules,
  type StageSchedule,
} from "@/lib/stage-schedule"

type StageScheduleContextValue = {
  ready: boolean
  getSchedule: (stageId: string) => StageSchedule
  setStartDate: (stageId: string, startDate: string | null) => void
  setEndDate: (stageId: string, endDate: string | null) => void
}

const StageScheduleContext = createContext<StageScheduleContextValue | null>(
  null,
)

function isIsoDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
}

function parseSchedulePayload(
  payload: unknown,
  stageIds: string[],
): Record<string, StageSchedule> {
  const defaults = Object.fromEntries(
    stageIds.map((id) => [id, emptySchedule()]),
  )
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return defaults
  }
  const next = { ...defaults }
  for (const id of stageIds) {
    const row = (payload as Record<string, Partial<StageSchedule>>)[id]
    if (!row) continue
    next[id] = {
      startDate: isIsoDate(row.startDate) ? row.startDate : null,
      endDate: isIsoDate(row.endDate) ? row.endDate : null,
    }
  }
  return next
}

function isScheduleMapEmpty(map: Record<string, StageSchedule>) {
  return Object.values(map).every(
    (row) => row.startDate == null && row.endDate == null,
  )
}

export function StageScheduleProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { projectId, project, ready: projectReady } = useProject()
  const [map, setMap] = useState<Record<string, StageSchedule>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!projectReady) return
    let cancelled = false
    const ids = project.stages.map((stage) => stage.id)
    const local = readStoredStageSchedules(projectId, ids)
    setMap(local)

    async function load() {
      const result = await fetchProjectState(projectId)
      if (cancelled) return
      if (!result.configured) {
        setReady(true)
        return
      }
      const row = rowForKind(result.rows, "stage_schedule", projectId)
      const resolved = await resolveWithMigration({
        projectId,
        kind: "stage_schedule",
        serverPayload: row?.payload,
        localPayload: local,
        isLocalEmpty: isScheduleMapEmpty,
      })
      if (cancelled) return
      const next = parseSchedulePayload(resolved.payload, ids)
      storeStageSchedules(projectId, next)
      setMap(next)
      setReady(true)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [projectReady, projectId, project.stages])

  const getSchedule = useCallback(
    (stageId: string) => map[stageId] ?? emptySchedule(),
    [map],
  )

  const setStartDate = useCallback(
    (stageId: string, startDate: string | null) => {
      setMap((prev) => {
        const next: Record<string, StageSchedule> = {
          ...prev,
          [stageId]: {
            startDate,
            endDate: startDate ? addCalendarMonths(startDate, 3) : null,
          },
        }
        storeStageSchedules(projectId, next)
        void saveProjectState({
          projectId,
          kind: "stage_schedule",
          payload: next,
        })
        return next
      })
    },
    [projectId],
  )

  const setEndDate = useCallback(
    (stageId: string, endDate: string | null) => {
      setMap((prev) => {
        const current = prev[stageId] ?? emptySchedule()
        const next = {
          ...prev,
          [stageId]: { ...current, endDate },
        }
        storeStageSchedules(projectId, next)
        void saveProjectState({
          projectId,
          kind: "stage_schedule",
          payload: next,
        })
        return next
      })
    },
    [projectId],
  )

  const value = useMemo(
    () => ({ ready, getSchedule, setStartDate, setEndDate }),
    [ready, getSchedule, setStartDate, setEndDate],
  )

  return (
    <StageScheduleContext.Provider value={value}>
      {children}
    </StageScheduleContext.Provider>
  )
}

export function useStageSchedules() {
  const ctx = useContext(StageScheduleContext)
  if (!ctx) {
    throw new Error(
      "useStageSchedules must be used within StageScheduleProvider",
    )
  }
  return ctx
}
