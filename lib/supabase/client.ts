import { createBrowserClient } from "@supabase/ssr"
import type { SupabaseClient } from "@supabase/supabase-js"
import {
  isSupabaseConfigured,
  supabaseAnonKey,
  supabaseUrl,
} from "@/lib/supabase/env"

export { isSupabaseConfigured }

let browserClient: SupabaseClient | null = null

/** Browser client with cookie session (for Client Components). */
export function createBrowserSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  if (browserClient) return browserClient
  browserClient = createBrowserClient(supabaseUrl(), supabaseAnonKey())
  return browserClient
}

/** @deprecated use createBrowserSupabase */
export function getSupabaseBrowser(): SupabaseClient | null {
  return createBrowserSupabase()
}
