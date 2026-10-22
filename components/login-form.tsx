"use client"

import { FormEvent, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createBrowserSupabase } from "@/lib/supabase/client"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createBrowserSupabase()
    if (!supabase) {
      setError(
        "Supabase er ekki stillt. Settu NEXT_PUBLIC_SUPABASE_* umhverfisbreytur.",
      )
      setLoading(false)
      return
    }

    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (signError) {
      setError(
        signError.message === "Invalid login credentials"
          ? "Rangt netfang eða lykilorð."
          : signError.message,
      )
      return
    }

    router.replace(next.startsWith("/") ? next : "/")
    router.refresh()
  }

  return (
    <div className="neo-deck flex min-h-screen items-center justify-center p-4 text-[var(--ink)]">
      <form
        onSubmit={onSubmit}
        className="neo-recessed w-full max-w-sm p-6 sm:p-8"
      >
        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--mute-slate)]">
          PRINCE2 Control
        </p>
        <h1 className="mt-1 text-xl font-semibold">Innskráning</h1>
        <p className="mt-2 text-xs text-[var(--mute-slate)]">
          Notaðu netfang og lykilorð sem þú fékkst send. Engin opin skráning —
          aðgangur er veittur af verkefnisstjóra.
        </p>

        <label className="mt-6 block text-xs font-medium">
          Netfang
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="neo-recessed mt-1 w-full px-3 py-2 text-sm"
          />
        </label>

        <label className="mt-3 block text-xs font-medium">
          Lykilorð
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="neo-recessed mt-1 w-full px-3 py-2 text-sm"
          />
        </label>

        {error && (
          <p className="mt-3 text-xs text-rose-700" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="neo-btn-primary mt-6 w-full disabled:opacity-60"
        >
          {loading ? "Skrái inn…" : "Skrá inn"}
        </button>
      </form>
    </div>
  )
}
