import { NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createServerSupabase()
  if (supabase) {
    await supabase.auth.signOut()
  }

  const url = new URL(request.url)
  return NextResponse.redirect(new URL("/login", url.origin), {
    status: 303,
  })
}
