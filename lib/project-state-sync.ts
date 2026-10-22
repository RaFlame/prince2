import {
  GLOBAL_PROJECT_ID,
  isPayloadEmpty,
  type ProjectStateKind,
  type ProjectStateRow,
} from "@/lib/project-state"

export type ProjectStateFetchResult = {
  configured: boolean
  rows: ProjectStateRow[]
  error?: string
}

export async function fetchProjectState(
  projectId: string,
): Promise<ProjectStateFetchResult> {
  try {
    const res = await fetch(
      `/api/project-state?projectId=${encodeURIComponent(projectId)}`,
    )
    if (res.status === 401) {
      return { configured: false, rows: [] }
    }
    const json = (await res.json()) as {
      configured?: boolean
      rows?: ProjectStateRow[]
      error?: string
    }
    return {
      configured: Boolean(json.configured),
      rows: Array.isArray(json.rows) ? json.rows : [],
      error: json.error,
    }
  } catch {
    return { configured: false, rows: [] }
  }
}

export async function saveProjectState(input: {
  projectId: string
  kind: ProjectStateKind
  payload: unknown
}): Promise<{ ok: boolean; configured: boolean; error?: string }> {
  try {
    const res = await fetch("/api/project-state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
    if (res.status === 503) {
      return { ok: true, configured: false }
    }
    if (res.status === 401) {
      return { ok: false, configured: false, error: "Unauthorized" }
    }
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      return {
        ok: false,
        configured: true,
        error: json.error ?? "Save failed",
      }
    }
    return { ok: true, configured: true }
  } catch {
    return { ok: true, configured: false }
  }
}

export function rowForKind(
  rows: ProjectStateRow[],
  kind: ProjectStateKind,
  projectId: string = kind === "custom_projects" ? GLOBAL_PROJECT_ID : "",
): ProjectStateRow | undefined {
  return rows.find(
    (row) =>
      row.kind === kind &&
      (kind === "custom_projects"
        ? row.project_id === GLOBAL_PROJECT_ID
        : row.project_id === projectId),
  )
}

/**
 * If the server has no data for this kind but local has data, push local up.
 * Returns the payload that should be used (server if present, else local).
 */
export async function resolveWithMigration<T>(opts: {
  projectId: string
  kind: ProjectStateKind
  serverPayload: unknown
  localPayload: T
  isLocalEmpty: (local: T) => boolean
}): Promise<{ payload: T | unknown; migrated: boolean }> {
  const { projectId, kind, serverPayload, localPayload, isLocalEmpty } = opts
  if (!isPayloadEmpty(serverPayload)) {
    return { payload: serverPayload, migrated: false }
  }
  if (isLocalEmpty(localPayload)) {
    return { payload: localPayload, migrated: false }
  }
  await saveProjectState({
    projectId: kind === "custom_projects" ? GLOBAL_PROJECT_ID : projectId,
    kind,
    payload: localPayload,
  })
  return { payload: localPayload, migrated: true }
}
