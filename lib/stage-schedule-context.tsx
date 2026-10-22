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
    const ids = project.stages.map((stage) => stage.id)
    setMap(readStoredStageSchedules(projectId, ids))
    setReady(true)
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
            // Estimated end is always start + 3 months when start changes.
            endDate: startDate ? addCalendarMonths(startDate, 3) : null,
          },
        }
        storeStageSchedules(projectId, next)
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
