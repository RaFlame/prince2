"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { stages } from "@/lib/project-data"
import {
  readStoredStageStatuses,
  storeStageStatuses,
  type StageStatus,
} from "@/lib/stage-status"

type StageStatusContextValue = {
  ready: boolean
  getStatus: (stageId: string) => StageStatus
  setStatus: (stageId: string, status: StageStatus) => void
  stageIdsByStatus: (status: StageStatus) => string[]
  inProgressStageIds: string[]
}

const StageStatusContext = createContext<StageStatusContextValue | null>(null)

function defaultMap(): Record<string, StageStatus> {
  return Object.fromEntries(
    stages.map((stage) => [stage.id, stage.status as StageStatus]),
  )
}

function snapshotStageCards(stageId: string) {
  if (typeof window === "undefined") return
  try {
    const raw = window.localStorage.getItem("prince2-card-content")
    const cards = raw
      ? (JSON.parse(raw) as Record<string, Record<string, unknown>>)
      : {}
    let changed = false
    for (const part of ["gate", "outcomes"] as const) {
      const sourceKey = `stage.${stageId}.${part}`
      const targetKey = `scrum.stage.${stageId}.${part}`
      if (cards[sourceKey] && !cards[targetKey]) {
        cards[targetKey] = {
          ...cards[sourceKey],
          card_key: targetKey,
        }
        changed = true
      }
    }
    if (changed) {
      window.localStorage.setItem("prince2-card-content", JSON.stringify(cards))
    }
  } catch {
    /* ignore snapshot errors */
  }
}

export function StageStatusProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [map, setMap] = useState<Record<string, StageStatus>>(defaultMap)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMap(readStoredStageStatuses(defaultMap()))
    setReady(true)
  }, [])

  const getStatus = useCallback(
    (stageId: string) => map[stageId] ?? "notStarted",
    [map],
  )

  const setStatus = useCallback((stageId: string, status: StageStatus) => {
    if (status === "inProgress" || status === "stopped" || status === "done") {
      snapshotStageCards(stageId)
    }
    setMap((prev) => {
      const next = { ...prev, [stageId]: status }
      storeStageStatuses(next)
      return next
    })
  }, [])

  const stageIdsByStatus = useCallback(
    (status: StageStatus) =>
      stages.map((stage) => stage.id).filter((id) => map[id] === status),
    [map],
  )

  const inProgressStageIds = useMemo(
    () => stageIdsByStatus("inProgress"),
    [stageIdsByStatus],
  )

  const value = useMemo(
    () => ({
      ready,
      getStatus,
      setStatus,
      stageIdsByStatus,
      inProgressStageIds,
    }),
    [ready, getStatus, setStatus, stageIdsByStatus, inProgressStageIds],
  )

  return (
    <StageStatusContext.Provider value={value}>
      {children}
    </StageStatusContext.Provider>
  )
}

export function useStageStatuses() {
  const ctx = useContext(StageStatusContext)
  if (!ctx) {
    throw new Error("useStageStatuses must be used within StageStatusProvider")
  }
  return ctx
}
