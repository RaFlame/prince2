import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { CardRecord } from "@/lib/card-style"

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function GET() {
  const supabase = serverClient()
  if (!supabase) {
    return NextResponse.json({
      configured: false,
      cards: [] as CardRecord[],
    })
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
  const supabase = serverClient()
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
      { status: 503 },
    )
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
