import type { Project } from "@/lib/project-types"
import { eldarPowerProject } from "@/lib/projects/eldar-power"
import { fiskistofaProject } from "@/lib/projects/fiskistofa"
import { createBlankProject } from "@/lib/projects/scaffold"

export const BUILTIN_PROJECTS: Project[] = [
  fiskistofaProject,
  eldarPowerProject,
]

export const DEFAULT_PROJECT_ID = fiskistofaProject.id

export const PROJECT_STORAGE_KEY = "prince2-active-project"
export const CUSTOM_PROJECTS_STORAGE_KEY = "prince2-custom-projects"

export function getBuiltinProject(id: string): Project | undefined {
  return BUILTIN_PROJECTS.find((p) => p.id === id)
}

export function readCustomProjects(): Project[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(CUSTOM_PROJECTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Project[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((p) => p && typeof p.id === "string" && !p.builtin)
  } catch {
    return []
  }
}

export function storeCustomProjects(projects: Project[]) {
  window.localStorage.setItem(
    CUSTOM_PROJECTS_STORAGE_KEY,
    JSON.stringify(projects),
  )
}

export function listProjects(custom: Project[] = []): Project[] {
  const byId = new Map<string, Project>()
  for (const p of BUILTIN_PROJECTS) byId.set(p.id, p)
  for (const p of custom) byId.set(p.id, p)
  return [...byId.values()]
}

export function readStoredProjectId(validIds: string[]): string {
  if (typeof window === "undefined") return DEFAULT_PROJECT_ID
  const stored = window.localStorage.getItem(PROJECT_STORAGE_KEY)
  if (stored && validIds.includes(stored)) return stored
  return DEFAULT_PROJECT_ID
}

export function storeProjectId(id: string) {
  window.localStorage.setItem(PROJECT_STORAGE_KEY, id)
}

export function newCustomProjectId(): string {
  return `custom-${Date.now().toString(36)}`
}

export { createBlankProject }
