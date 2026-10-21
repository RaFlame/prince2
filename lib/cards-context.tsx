"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import type { CardRecord } from "@/lib/card-style"
import { DEFAULT_CARD_STYLE } from "@/lib/card-style"

const STORAGE_KEY = "prince2-card-content"

type CardsContextValue = {
  ready: boolean
  configured: boolean
  getCard: (key: string, defaults: { is: string; en: string }) => CardRecord
  saveCard: (card: CardRecord) => Promise<{ ok: boolean; error?: string }>
}

const CardsContext = createContext<CardsContextValue | null>(null)

function readLocal(): Record<string, CardRecord> {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as Record<string, CardRecord>
  } catch {
    return {}
  }
}

function writeLocal(map: Record<string, CardRecord>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function CardsProvider({ children }: { children: React.ReactNode }) {
  const [map, setMap] = useState<Record<string, CardRecord>>({})
  const [ready, setReady] = useState(false)
  const [configured, setConfigured] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const local = readLocal()
      if (!cancelled) setMap(local)

      try {
        const res = await fetch("/api/cards")
        const json = (await res.json()) as {
          configured: boolean
          cards?: CardRecord[]
        }
        if (cancelled) return
        setConfigured(Boolean(json.configured))
        if (json.configured && Array.isArray(json.cards)) {
          const next: Record<string, CardRecord> = { ...local }
          for (const card of json.cards) {
            next[card.card_key] = card
          }
          setMap(next)
          writeLocal(next)
        }
      } catch {
        if (!cancelled) setConfigured(false)
      } finally {
        if (!cancelled) setReady(true)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const getCard = useCallback(
    (key: string, defaults: { is: string; en: string }): CardRecord => {
      const existing = map[key]
      if (existing) {
        return {
          ...DEFAULT_CARD_STYLE,
          ...existing,
          card_key: key,
          content_is: existing.content_is || defaults.is,
          content_en: existing.content_en || defaults.en,
        }
      }
      return {
        card_key: key,
        content_is: defaults.is,
        content_en: defaults.en,
        ...DEFAULT_CARD_STYLE,
      }
    },
    [map],
  )

  const saveCard = useCallback(async (card: CardRecord) => {
    setMap((prev) => {
      const next = { ...prev, [card.card_key]: card }
      writeLocal(next)
      return next
    })

    try {
      const res = await fetch("/api/cards", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
      })
      if (res.status === 503) {
        return { ok: true }
      }
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string }
        return { ok: false, error: json.error ?? "Save failed" }
      }
      setConfigured(true)
      return { ok: true }
    } catch {
      return { ok: true }
    }
  }, [])

  const value = useMemo(
    () => ({ ready, configured, getCard, saveCard }),
    [ready, configured, getCard, saveCard],
  )

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>
}

export function useCards() {
  const ctx = useContext(CardsContext)
  if (!ctx) throw new Error("useCards must be used within CardsProvider")
  return ctx
}
