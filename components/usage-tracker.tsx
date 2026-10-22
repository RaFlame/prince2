"use client"

import { useEffect, useRef } from "react"
import type { Section } from "@/lib/i18n"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { logUsageEvent } from "@/lib/usage"

const HEARTBEAT_MS = 5 * 60 * 1000

/** Logs session start, section changes, and periodic heartbeats while visible. */
export function UsageTracker({ section }: { section: Section }) {
  const lastSection = useRef<Section | null>(null)
  const sessionLogged = useRef(false)

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    if (sessionLogged.current) return
    sessionLogged.current = true
    void logUsageEvent("session", { path: window.location.pathname })
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured()) return
    if (lastSection.current === section) return
    const prev = lastSection.current
    lastSection.current = section
    if (prev == null) {
      // First paint after session — still record landing section once.
      void logUsageEvent("section", { section })
      return
    }
    void logUsageEvent("section", { section, from: prev })
  }, [section])

  useEffect(() => {
    if (!isSupabaseConfigured()) return

    function beat() {
      if (document.visibilityState !== "visible") return
      void logUsageEvent("heartbeat", { section: lastSection.current })
    }

    const id = window.setInterval(beat, HEARTBEAT_MS)
    function onVisible() {
      if (document.visibilityState === "visible") beat()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  return null
}
