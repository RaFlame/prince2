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

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [custom, setCustom] = useState<Project[]>([])
  const [projectId, setProjectIdState] = useState(DEFAULT_PROJECT_ID)
  const [ready, setReady] = useState(false)

  const projects = useMemo(() => listProjects(custom), [custom])

  const project = useMemo(() => {
    return projects.find((p) => p.id === projectId) ?? fallbackProject
  }, [projects, projectId])

  useEffect(() => {
    const loaded = readCustomProjects()
    setCustom(loaded)
    const ids = listProjects(loaded).map((p) => p.id)
    setProjectIdState(readStoredProjectId(ids))
    setReady(true)
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
        storeCustomProjects(list)
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
