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
  STAGE_STATUSES,
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

function defaultMap(
  stages: { id: string; status: StageStatus }[],
): Record<string, StageStatus> {
  return Object.fromEntries(
    stages.map((stage) => [stage.id, stage.status as StageStatus]),
  )
}

function parseStatusPayload(
  payload: unknown,
  defaults: Record<string, StageStatus>,
): Record<string, StageStatus> {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ...defaults }
  }
  const next = { ...defaults }
  for (const [id, value] of Object.entries(payload as Record<string, unknown>)) {
    if (typeof value === "string" && STAGE_STATUSES.includes(value as StageStatus)) {
      next[id] = value as StageStatus
    }
  }
  return next
}

function snapshotStageCards(projectId: string, stageId: string) {
  if (typeof window === "undefined") return
  try {
    const raw = window.localStorage.getItem("prince2-card-content")
    const cards = raw
      ? (JSON.parse(raw) as Record<string, Record<string, unknown>>)
      : {}
    let changed = false
    for (const part of ["gate", "outcomes"] as const) {
      const localKey = `stage.${stageId}.${part}`
      const sourceKeys = [`${projectId}:${localKey}`, localKey]
      const targetKey = `${projectId}:scrum.stage.${stageId}.${part}`
      if (cards[targetKey]) continue
      const source = sourceKeys.map((k) => cards[k]).find(Boolean)
      if (source) {
        cards[targetKey] = {
          ...source,
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
  const { projectId, project, ready: projectReady } = useProject()
  const [map, setMap] = useState<Record<string, StageStatus>>({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!projectReady) return
    let cancelled = false
    const defaults = defaultMap(project.stages)
    const local = readStoredStageStatuses(projectId, defaults)
    setMap(local)

    async function load() {
      const result = await fetchProjectState(projectId)
      if (cancelled) return
      if (!result.configured) {
        setReady(true)
        return
      }
      const row = rowForKind(result.rows, "stage_status", projectId)
      const resolved = await resolveWithMigration({
        projectId,
        kind: "stage_status",
        serverPayload: row?.payload,
        localPayload: local,
        isLocalEmpty: (payload) =>
          Object.keys(payload).every((id) => payload[id] === defaults[id]),
      })
      if (cancelled) return
      const next = parseStatusPayload(resolved.payload, defaults)
      storeStageStatuses(projectId, next)
      setMap(next)
      setReady(true)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [projectReady, projectId, project.stages])

  const getStatus = useCallback(
    (stageId: string) => map[stageId] ?? "notStarted",
    [map],
  )

  const setStatus = useCallback(
    (stageId: string, status: StageStatus) => {
      if (status === "inProgress" || status === "stopped" || status === "done") {
        snapshotStageCards(projectId, stageId)
      }
      setMap((prev) => {
        const next = { ...prev, [stageId]: status }
        storeStageStatuses(projectId, next)
        void saveProjectState({
          projectId,
          kind: "stage_status",
          payload: next,
        })
        return next
      })
    },
    [projectId],
  )

  const stageIdsByStatus = useCallback(
    (status: StageStatus) =>
      project.stages.map((stage) => stage.id).filter((id) => map[id] === status),
    [map, project.stages],
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
