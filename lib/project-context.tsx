"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { Project } from "@/lib/project-types"
import { GLOBAL_PROJECT_ID } from "@/lib/project-state"
import {
  fetchProjectState,
  resolveWithMigration,
  rowForKind,
  saveProjectState,
} from "@/lib/project-state-sync"
import {
  createBlankProject,
  DEFAULT_PROJECT_ID,
  getBuiltinProject,
  listProjects,
  newCustomProjectId,
  readCustomProjects,
  readStoredProjectId,
  storeCustomProjects,
  storeProjectId,
} from "@/lib/projects"

type ProjectContextValue = {
  ready: boolean
  projectId: string
  project: Project
  projects: Project[]
  setProjectId: (id: string) => void
  createProject: (input: { name: string; organisation: string }) => Project
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

const fallbackProject =
  getBuiltinProject(DEFAULT_PROJECT_ID) ?? listProjects()[0]

function parseCustomProjects(payload: unknown): Project[] {
  if (!Array.isArray(payload)) return []
  return payload.filter(
    (p): p is Project =>
      !!p &&
      typeof p === "object" &&
      typeof (p as Project).id === "string" &&
      !(p as Project).builtin,
  )
}

function persistCustom(list: Project[]) {
  storeCustomProjects(list)
  void saveProjectState({
    projectId: GLOBAL_PROJECT_ID,
    kind: "custom_projects",
    payload: list,
  })
}

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [custom, setCustom] = useState<Project[]>([])
  const [projectId, setProjectIdState] = useState(DEFAULT_PROJECT_ID)
  const [ready, setReady] = useState(false)

  const projects = useMemo(() => listProjects(custom), [custom])

  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId) ?? fallbackProject
  }, [projects, projectId])

  useEffect(() => {
    let cancelled = false
    const local = readCustomProjects()
    setCustom(local)
    const ids = listProjects(local).map((p) => p.id)
    setProjectIdState(readStoredProjectId(ids))

    async function load() {
      // Use default project id to fetch; custom_projects is always _global
      const result = await fetchProjectState(DEFAULT_PROJECT_ID)
      if (cancelled) return
      if (!result.configured) {
        setReady(true)
        return
      }
      const row = rowForKind(result.rows, "custom_projects")
      const resolved = await resolveWithMigration({
        projectId: GLOBAL_PROJECT_ID,
        kind: "custom_projects",
        serverPayload: row?.payload,
        localPayload: local,
        isLocalEmpty: (payload) => payload.length === 0,
      })
      if (cancelled) return
      const next = parseCustomProjects(resolved.payload)
      storeCustomProjects(next)
      setCustom(next)
      const nextIds = listProjects(next).map((p) => p.id)
      setProjectIdState((prev) =>
        nextIds.includes(prev) ? prev : readStoredProjectId(nextIds),
      )
      setReady(true)
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const setProjectId = useCallback(
    (id: string) => {
      if (!projects.some((p) => p.id === id)) return
      setProjectIdState(id)
      storeProjectId(id)
    },
    [projects],
  )

  const createProject = useCallback(
    (input: { name: string; organisation: string }) => {
      const next = createBlankProject({
        id: newCustomProjectId(),
        name: input.name,
        organisation: input.organisation,
      })
      setCustom((prev) => {
        const list = [...prev, next]
        persistCustom(list)
        return list
      })
      setProjectIdState(next.id)
      storeProjectId(next.id)
      return next
    },
    [],
  )

  const value = useMemo(
    () => ({
      ready,
      projectId,
      project,
      projects,
      setProjectId,
      createProject,
    }),
    [ready, projectId, project, projects, setProjectId, createProject],
  )

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  )
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error("useProject must be used within ProjectProvider")
  return ctx
}
