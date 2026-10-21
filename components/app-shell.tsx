"use client"

import { useEffect, useState } from "react"
import {
  BookOpen,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings2,
  ShieldAlert,
  Users,
} from "lucide-react"
import type { Locale, Section } from "@/lib/i18n"
import {
  LOCALE_STORAGE_KEY,
  readStoredLocale,
  storeLocale,
  t,
} from "@/lib/i18n"
import { pick, projectMeta } from "@/lib/project-data"
import { cn } from "@/lib/utils"
import { DocumentsView } from "@/components/views/documents-view"
import { OverviewView } from "@/components/views/overview-view"
import { RisksView } from "@/components/views/risks-view"
import { SettingsView } from "@/components/views/settings-view"
import { StagesView } from "@/components/views/stages-view"
import { TeamView } from "@/components/views/team-view"
import { WikiView } from "@/components/views/wiki-view"

const navItems: {
  id: Section
  icon: typeof LayoutDashboard
}[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "stages", icon: ClipboardList },
  { id: "risks", icon: ShieldAlert },
  { id: "documents", icon: FileText },
  { id: "wiki", icon: BookOpen },
  { id: "team", icon: Users },
  { id: "settings", icon: Settings2 },
]

export function AppShell() {
  const [locale, setLocale] = useState<Locale>("is")
  const [section, setSection] = useState<Section>("overview")
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setLocale(readStoredLocale())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    document.documentElement.lang = locale
    storeLocale(locale)
  }, [locale, ready])

  function handleLocaleChange(next: Locale) {
    setLocale(next)
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 hidden w-60 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex size-8 items-center justify-center rounded bg-blue-700 text-white">
            <LayoutDashboard size={16} />
          </div>
          <div>
            <strong className="text-sm">{t(locale, "productName")}</strong>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              {t(locale, "productOffice")}
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4 text-sm">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-2 text-left transition",
                  active
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <Icon size={15} />
                {t(locale, `nav.${item.id}`)}
              </button>
            )
          })}
          <div className="my-4 border-t border-slate-200" />
          {navItems.slice(5).map((item) => {
            const Icon = item.icon
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded px-3 py-2 text-left transition",
                  active
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-600 hover:bg-slate-50",
                )}
              >
                <Icon size={15} />
                {t(locale, `nav.${item.id}`)}
              </button>
            )
          })}
        </nav>
      </aside>

      <div className="lg:pl-60">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          <span className="truncate text-xs text-slate-500">
            {t(locale, "projectsBreadcrumb")} /{" "}
            <b className="text-slate-900">{pick(locale, projectMeta.name)}</b>
            <span className="ml-2 hidden text-slate-400 sm:inline">
              · {pick(locale, projectMeta.organisation)}
            </span>
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden rounded border border-slate-200 p-0.5 text-[11px] sm:flex">
              <button
                type="button"
                onClick={() => handleLocaleChange("is")}
                className={cn(
                  "rounded px-2 py-1 font-medium",
                  locale === "is" ? "bg-slate-900 text-white" : "text-slate-600",
                )}
              >
                IS
              </button>
              <button
                type="button"
                onClick={() => handleLocaleChange("en")}
                className={cn(
                  "rounded px-2 py-1 font-medium",
                  locale === "en" ? "bg-slate-900 text-white" : "text-slate-600",
                )}
              >
                EN
              </button>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-600">
              {pick(locale, projectMeta.duration)}
            </span>
          </div>
        </header>

        <div className="border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
          <div className="flex gap-1 overflow-x-auto text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "shrink-0 rounded px-3 py-1.5",
                  section === item.id
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-600",
                )}
              >
                {t(locale, `nav.${item.id}`)}
              </button>
            ))}
          </div>
        </div>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6">
          {section === "overview" && <OverviewView locale={locale} />}
          {section === "stages" && <StagesView locale={locale} />}
          {section === "risks" && <RisksView locale={locale} />}
          {section === "documents" && <DocumentsView locale={locale} />}
          {section === "wiki" && <WikiView locale={locale} />}
          {section === "team" && <TeamView locale={locale} />}
          {section === "settings" && (
            <SettingsView locale={locale} onLocaleChange={handleLocaleChange} />
          )}
        </main>
      </div>
    </div>
  )
}
