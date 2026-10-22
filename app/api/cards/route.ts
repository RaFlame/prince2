import { NextResponse } from "next/server"
import type { CardRecord } from "@/lib/card-style"
import { createServerSupabase } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      cards: [] as CardRecord[],
    })
  }

  const supabase = await createServerSupabase()
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      cards: [] as CardRecord[],
    })
  }

  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase.from("card_content").select("*")
  if (error) {
    return NextResponse.json(
      { configured: true, error: error.message, cards: [] },
      { status: 500 },
    )
  }

  return NextResponse.json({
    configured: true,
    cards: (data ?? []) as CardRecord[],
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

  const body = (await request.json()) as CardRecord
  if (!body?.card_key) {
    return NextResponse.json({ error: "card_key required" }, { status: 400 })
  }

  const row = {
    card_key: body.card_key,
    content_is: body.content_is ?? "",
    content_en: body.content_en ?? "",
    font: body.font ?? "sans",
    size: body.size ?? "md",
    color: body.color ?? "slate",
    bold: Boolean(body.bold),
    italic: Boolean(body.italic),
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("card_content")
    .upsert(row, { onConflict: "card_key" })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ card: data as CardRecord })
}
