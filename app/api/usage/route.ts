import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { isUsageEventType, type UsageEvent } from "@/lib/usage"

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ configured: false, events: [] as UsageEvent[] })
  }

  const supabase = await createServerSupabase()
  if (!supabase) {
    return NextResponse.json({ configured: false, events: [] as UsageEvent[] })
  }

  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const limitRaw = Number(searchParams.get("limit") ?? "80")
  const limit = Number.isFinite(limitRaw)
    ? Math.min(Math.max(Math.floor(limitRaw), 1), 200)
    : 80

  const { data, error } = await supabase
    .from("usage_events")
    .select("id, user_id, user_email, event_type, meta, created_at")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    return NextResponse.json(
      { configured: true, error: error.message, events: [] },
      { status: 500 },
    )
  }

  return NextResponse.json({
    configured: true,
    events: (data ?? []) as UsageEvent[],
  })
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, configured: false })
  }

  const supabase = await createServerSupabase()
  if (!supabase) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    eventType?: string
    meta?: Record<string, unknown>
  }

  if (!body.eventType || !isUsageEventType(body.eventType)) {
    return NextResponse.json({ error: "invalid eventType" }, { status: 400 })
  }

  const row = {
    user_id: user.id,
    user_email: user.email ?? null,
    event_type: body.eventType,
    meta: body.meta && typeof body.meta === "object" ? body.meta : {},
  }

  const { error } = await supabase.from("usage_events").insert(row)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, configured: true })
}
