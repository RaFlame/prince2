import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import { fetchLiveTherneyVoyage } from "@/lib/therney-voyage-live"

export async function GET() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase()
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { data: claimsData } = await supabase.auth.getClaims()
    if (!claimsData?.claims) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  }

  try {
    const voyage = await fetchLiveTherneyVoyage()
    return NextResponse.json({ ok: true, voyage })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to refresh voyage data"
    return NextResponse.json({ ok: false, error: message }, { status: 502 })
  }
}
