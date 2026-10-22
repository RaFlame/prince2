"use client"

import { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { createBrowserSupabase } from "@/lib/supabase/client"
import {
  fetchUsageEvents,
  type UsageEvent,
  type UsageEventType,
} from "@/lib/usage"
import { cn } from "@/lib/utils"

function eventLabel(locale: Locale, type: string) {
  const key =
    type === "login"
      ? "settings.usageLogin"
      : type === "session"
        ? "settings.usageSession"
        : type === "heartbeat"
          ? "settings.usageHeartbeat"
          : type === "section"
            ? "settings.usageSection"
            : null
  return key ? t(locale, key) : type
}

function formatWhen(iso: string, locale: Locale) {
  try {
    return new Date(iso).toLocaleString(locale === "is" ? "is-IS" : "en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

function eventDetail(locale: Locale, event: UsageEvent) {
  if (event.event_type !== "section") return null
  const section = event.meta?.section
  if (typeof section !== "string") return null
  return section
}

export function SettingsView({
  locale,
  onLocaleChange,
}: {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}) {
  const [email, setEmail] = useState<string | null>(null)
  const [events, setEvents] = useState<UsageEvent[]>([])
  const [usageConfigured, setUsageConfigured] = useState(false)
  const [usageError, setUsageError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createBrowserSupabase()
    if (!supabase) return
    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    void fetchUsageEvents(60).then((result) => {
      if (cancelled) return
      setUsageConfigured(result.configured)
      setEvents(result.events)
      setUsageError(result.error ?? null)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "settings.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "settings.subtitle")}
        </p>
      </div>

      <section className="max-w-xl rounded border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          {t(locale, "settings.account")}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {t(locale, "settings.accountHint")}
        </p>
        {email && (
          <p className="mt-3 text-sm text-slate-800">
            {t(locale, "settings.signedInAs")}:{" "}
            <span className="font-medium">{email}</span>
          </p>
        )}
        <form action="/auth/signout" method="post" className="mt-4">
          <button type="submit" className="neo-btn-primary">
            {t(locale, "settings.signOut")}
          </button>
        </form>
      </section>

      <section className="max-w-3xl rounded border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          {t(locale, "settings.usage")}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {t(locale, "settings.usageHint")}
        </p>
        {!usageConfigured || events.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            {usageError ?? t(locale, "settings.usageEmpty")}
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-medium">
                    {t(locale, "settings.usageWhen")}
                  </th>
                  <th className="py-2 pr-3 font-medium">
                    {t(locale, "settings.usageUser")}
                  </th>
                  <th className="py-2 font-medium">
                    {t(locale, "settings.usageEvent")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const detail = eventDetail(locale, event)
                  return (
                    <tr
                      key={event.id}
                      className="border-b border-slate-100 text-slate-800"
                    >
                      <td className="py-2 pr-3 tabular-nums text-slate-600">
                        {formatWhen(event.created_at, locale)}
                      </td>
                      <td className="py-2 pr-3">
                        {event.user_email ?? event.user_id.slice(0, 8)}
                      </td>
                      <td className="py-2">
                        <span className="font-medium">
                          {eventLabel(
                            locale,
                            event.event_type as UsageEventType,
                          )}
                        </span>
                        {detail && (
                          <span className="ml-1.5 text-slate-500">
                            ({detail})
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="max-w-xl rounded border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          {t(locale, "settings.language")}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {t(locale, "settings.languageHint")}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onLocaleChange("is")}
            className={cn(
              "rounded border px-4 py-2 text-sm font-medium transition",
              locale === "is"
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            {t(locale, "settings.icelandic")}
          </button>
          <button
            type="button"
            onClick={() => onLocaleChange("en")}
            className={cn(
              "rounded border px-4 py-2 text-sm font-medium transition",
              locale === "en"
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            {t(locale, "settings.english")}
          </button>
        </div>
      </section>
    </div>
  )
}
