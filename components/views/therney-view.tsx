"use client"

import { useCallback, useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { Loader2, RefreshCw } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { pick } from "@/lib/project-types"
import {
  THERNEY_VOYAGE_CACHE_KEY,
  type LiveVoyageSnapshot,
} from "@/lib/therney-voyage-live"
import {
  therneyPhotos,
  therneyVessel,
  therneyVoyage,
} from "@/lib/vessel-therney"
import { cn } from "@/lib/utils"

const TherneyVoyageMap = dynamic(
  () =>
    import("@/components/therney-voyage-map").then((m) => m.TherneyVoyageMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[8rem] items-center justify-center bg-slate-100 text-xs text-slate-500">
        …
      </div>
    ),
  },
)

function readCachedVoyage(): LiveVoyageSnapshot | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(THERNEY_VOYAGE_CACHE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as LiveVoyageSnapshot
  } catch {
    return null
  }
}

function writeCachedVoyage(voyage: LiveVoyageSnapshot) {
  window.localStorage.setItem(THERNEY_VOYAGE_CACHE_KEY, JSON.stringify(voyage))
}

export function TherneyView({ locale }: { locale: Locale }) {
  const dep = therneyVoyage.departure
  const arr = therneyVoyage.arrival
  const [live, setLive] = useState<LiveVoyageSnapshot | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setLive(readCachedVoyage())
  }, [])

  const refresh = useCallback(async () => {
    setRefreshing(true)
    setStatus("idle")
    setErrorMessage(null)
    try {
      const res = await fetch("/api/therney-voyage", { cache: "no-store" })
      const json = (await res.json()) as {
        ok?: boolean
        voyage?: LiveVoyageSnapshot
        error?: string
      }
      if (!res.ok || !json.ok || !json.voyage) {
        setStatus("error")
        setErrorMessage(json.error ?? t(locale, "therney.refreshVoyageError"))
        return
      }
      setLive(json.voyage)
      writeCachedVoyage(json.voyage)
      setStatus("ok")
    } catch {
      setStatus("error")
      setErrorMessage(t(locale, "therney.refreshVoyageError"))
    } finally {
      setRefreshing(false)
    }
  }, [locale])

  const actualDeparture =
    live?.actualDeparture ?? pick(locale, therneyVoyage.actualDeparture)
  const reportedEta =
    live?.reportedEta ?? pick(locale, therneyVoyage.reportedEta)
  const departurePlace = live?.departurePlace ?? pick(locale, dep.place)
  const departureCode = live?.departureCode ?? dep.code
  const arrivalPlace = live?.arrivalPlace ?? pick(locale, arr.place)
  const arrivalCode = live?.arrivalCode ?? arr.code

  return (
    <div className="flex h-[calc(100dvh-7rem)] flex-col gap-3">
      <div className="shrink-0">
        <h1 className="text-xl font-semibold text-slate-950 sm:text-2xl">
          {t(locale, "therney.title")}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          {t(locale, "therney.subtitle")}
        </p>
      </div>

      <div className="grid min-h-0 flex-1 gap-3 sm:grid-cols-2 sm:grid-rows-2">
        {therneyPhotos.map((photo) => (
          <section
            key={photo.id}
            className="flex min-h-0 flex-col overflow-hidden rounded border border-slate-200 bg-white"
          >
            <div className="shrink-0 border-b border-slate-200 px-3 py-2">
              <h2 className="truncate text-xs font-semibold text-slate-900 sm:text-sm">
                {t(locale, photo.altKey)}
              </h2>
            </div>
            <div className="relative min-h-0 flex-1 bg-slate-100">
              <Image
                src={photo.src}
                alt={t(locale, photo.altKey)}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority={photo.id === "exterior"}
              />
            </div>
          </section>
        ))}

        <section className="flex min-h-0 flex-col overflow-hidden rounded border border-slate-200 bg-white">
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
            <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">
              {t(locale, "therney.currentVoyage")}
            </h2>
            <button
              type="button"
              onClick={() => void refresh()}
              disabled={refreshing}
              className={cn(
                "neo-icon-btn inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium sm:text-xs",
                "disabled:cursor-wait disabled:opacity-60",
              )}
              aria-label={t(locale, "therney.refreshVoyage")}
            >
              {refreshing ? (
                <Loader2 size={12} className="animate-spin" aria-hidden />
              ) : (
                <RefreshCw size={12} aria-hidden />
              )}
              {refreshing
                ? t(locale, "therney.refreshingVoyage")
                : t(locale, "therney.refreshVoyage")}
            </button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-[1.2] border-b border-slate-100">
              <TherneyVoyageMap livePosition={live?.position ?? null} />
            </div>
            <div className="shrink-0 space-y-2 overflow-y-auto px-3 py-2 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                    {t(locale, "therney.departure")}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-900 sm:text-sm">
                    {departurePlace} {pick(locale, dep.country)}{" "}
                    <span className="font-mono text-[10px] text-slate-500 sm:text-xs">
                      {departureCode}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                    {t(locale, "therney.arrival")}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-900 sm:text-sm">
                    {arrivalPlace} {pick(locale, arr.country)}{" "}
                    <span className="font-mono text-[10px] text-slate-500 sm:text-xs">
                      {arrivalCode}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                    {t(locale, "therney.actualDeparture")}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-900 sm:text-sm">
                    {actualDeparture}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                    {t(locale, "therney.reportedEta")}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-900 sm:text-sm">
                    {reportedEta}
                  </p>
                </div>
              </div>
              {live?.lastReported && (
                <div>
                  <p className="text-[10px] font-medium text-slate-500 sm:text-xs">
                    {t(locale, "therney.lastReported")}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-900 sm:text-sm">
                    {live.lastReported}
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span
                    className="inline-block h-0.5 w-4 bg-[var(--signal)]"
                    aria-hidden
                  />
                  {t(locale, "therney.pastTrack")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span
                    className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[var(--seafoam)]"
                    aria-hidden
                  />
                  {t(locale, "therney.routeForecast")}
                </span>
              </div>
              {status === "ok" && (
                <p className="text-[10px] text-emerald-700">
                  {t(locale, "therney.refreshVoyageOk")}
                </p>
              )}
              {status === "error" && (
                <p className="text-[10px] text-amber-800">
                  {errorMessage ?? t(locale, "therney.refreshVoyageError")}
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="flex min-h-0 flex-col overflow-hidden rounded border border-slate-200 bg-white">
          <div className="shrink-0 border-b border-slate-200 px-3 py-2">
            <h2 className="text-xs font-semibold text-slate-900 sm:text-sm">
              {t(locale, "therney.general")}
            </h2>
          </div>
          <dl className="min-h-0 flex-1 divide-y divide-slate-100 overflow-y-auto">
            {therneyVessel.fields.map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-[minmax(6.5rem,9rem)_1fr] gap-2 px-3 py-1.5 text-sm sm:py-2"
              >
                <dt className="text-[10px] font-medium text-slate-500 sm:text-xs">
                  {t(locale, `therney.${field.id}`)}
                </dt>
                <dd className="text-xs font-medium text-slate-900 sm:text-sm">
                  {pick(locale, field.value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}
