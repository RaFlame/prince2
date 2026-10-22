import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import {
  GLOBAL_PROJECT_ID,
  isProjectStateKind,
  type ProjectStateKind,
  type ProjectStateRow,
} from "@/lib/project-state"

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      rows: [] as ProjectStateRow[],
    })
  }

  const supabase = await createServerSupabase()
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      rows: [] as ProjectStateRow[],
    })
  }

  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")
  if (!projectId) {
    return NextResponse.json({ error: "projectId required" }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("project_state")
    .select("project_id, kind, payload, updated_at")
    .in("project_id", [projectId, GLOBAL_PROJECT_ID])

  if (error) {
    return NextResponse.json(
      { configured: true, error: error.message, rows: [] },
      { status: 500 },
    )
  }

  const rows = ((data ?? []) as ProjectStateRow[]).filter(
    (row) =>
      row.project_id === projectId ||
      (row.project_id === GLOBAL_PROJECT_ID && row.kind === "custom_projects"),
  )

  return NextResponse.json({
    configured: true,
    rows,
  })
}

export async function PUT(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      },
      { status: 503 },
    )
  }

  const supabase = await createServerSupabase()
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json()) as {
    projectId?: string
    kind?: string
    payload?: unknown
  }

  if (!body.projectId || typeof body.projectId !== "string") {
    return NextResponse.json({ error: "projectId required" }, { status: 400 })
  }
  if (!body.kind || !isProjectStateKind(body.kind)) {
    return NextResponse.json({ error: "invalid kind" }, { status: 400 })
  }
  if (body.kind === "custom_projects" && body.projectId !== GLOBAL_PROJECT_ID) {
    return NextResponse.json(
      { error: "custom_projects must use projectId _global" },
      { status: 400 },
    )
  }

  const kind = body.kind as ProjectStateKind
  const row = {
    project_id: body.projectId,
    kind,
    payload: body.payload ?? {},
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("project_state")
    .upsert(row, { onConflict: "project_id,kind" })
    .select("project_id, kind, payload, updated_at")
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ row: data as ProjectStateRow })
}
