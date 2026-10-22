"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BookOpen,
  ClipboardList,
  FileText,
  GanttChart,
  Kanban,
  LayoutDashboard,
  Layers,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Settings2,
  ShieldAlert,
  Ship,
  Sun,
  Users,
} from "lucide-react"
import type { Locale, Section } from "@/lib/i18n"
import {
  LOCALE_STORAGE_KEY,
  readStoredLocale,
  storeLocale,
  t,
} from "@/lib/i18n"
import { ProjectProvider, useProject } from "@/lib/project-context"
import { pick } from "@/lib/project-types"
import {
  applyTheme,
  readStoredTheme,
  storeTheme,
  type Theme,
} from "@/lib/theme"
import { cn } from "@/lib/utils"
import { ProjectSwitcher } from "@/components/project-switcher"
import { DocumentsView } from "@/components/views/documents-view"
import { OverviewView } from "@/components/views/overview-view"
import { RisksView } from "@/components/views/risks-view"
import { ScrumStagesView } from "@/components/views/scrum-stages-view"
import { ScrumView } from "@/components/views/scrum-view"
import { SettingsView } from "@/components/views/settings-view"
import { StagesView } from "@/components/views/stages-view"
import { TeamView } from "@/components/views/team-view"
import { TherneyView } from "@/components/views/therney-view"
import { TimelineView } from "@/components/views/timeline-view"
import { WikiView } from "@/components/views/wiki-view"
import { CardsProvider } from "@/lib/cards-context"
import {
  StageStatusProvider,
  useStageStatuses,
} from "@/lib/stage-status-context"
import { StageScheduleProvider } from "@/lib/stage-schedule-context"
import { ScrumBoardProvider } from "@/lib/scrum-board-context"
import type { StageStatus } from "@/lib/stage-status"

type NavItem = {
  id: Section
  icon: typeof LayoutDashboard
  tone?: string
}

const prince2NavBase: NavItem[] = [
  { id: "overview", icon: LayoutDashboard },
  { id: "stages", icon: ClipboardList },
  { id: "timeline", icon: GanttChart },
  { id: "risks", icon: ShieldAlert },
  { id: "documents", icon: FileText },
  { id: "wiki", icon: BookOpen },
]

const therneyNav: NavItem = { id: "therney", icon: Ship }

const scrumBoardNav: NavItem = { id: "scrum", icon: Kanban }

const scrumStageNav: {
  id: Section
  icon: typeof LayoutDashboard
  tone: string
  status: Exclude<StageStatus, "notStarted">
}[] = [
  {
    id: "scrumStages",
    icon: Layers,
    tone: "text-emerald-700",
    status: "inProgress",
  },
  {
    id: "scrumStagesStopped",
    icon: Layers,
    tone: "text-amber-800",
    status: "stopped",
  },
  {
    id: "scrumStagesDone",
    icon: Layers,
    tone: "text-blue-800",
    status: "done",
  },
]

const sharedNav: NavItem[] = [
  { id: "team", icon: Users },
  { id: "settings", icon: Settings2 },
]

function NavButton({
  item,
  active,
  locale,
  onSelect,
}: {
  item: { id: Section; icon: typeof LayoutDashboard; tone?: string }
  active: boolean
  locale: Locale
  onSelect: (id: Section) => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-left",
        active ? "neo-nav-active" : "neo-nav-idle",
        !active && item.tone,
      )}
    >
      <Icon size={15} className={cn(!active && item.tone)} />
      <span className={cn(!active && item.tone)}>
        {t(locale, `nav.${item.id}`)}
      </span>
    </button>
  )
}

export function AppShell() {
  return (
    <ProjectProvider>
      <CardsProvider>
        <StageStatusProvider>
          <StageScheduleProvider>
            <ScrumBoardProvider>
              <AppShellInner />
            </ScrumBoardProvider>
          </StageScheduleProvider>
        </StageStatusProvider>
      </CardsProvider>
    </ProjectProvider>
  )
}

const SIDEBAR_STORAGE_KEY = "prince2-sidebar"

function AppShellInner() {
  const { stageIdsByStatus } = useStageStatuses()
  const { project } = useProject()
  const [locale, setLocale] = useState<Locale>("is")
  const [theme, setTheme] = useState<Theme>("light")
  const [section, setSection] = useState<Section>("overview")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [ready, setReady] = useState(false)

  const visibleScrumStageNav = useMemo(
    () =>
      scrumStageNav.filter(
        (item) => stageIdsByStatus(item.status).length > 0,
      ),
    [stageIdsByStatus],
  )

  const scrumNavVisible = useMemo(
    () => [scrumBoardNav, ...visibleScrumStageNav],
    [visibleScrumStageNav],
  )

  const prince2Nav = useMemo(() => {
    if (project.id !== "fiskistofa") return prince2NavBase
    const [overview, ...rest] = prince2NavBase
    return [overview, therneyNav, ...rest]
  }, [project.id])

  const allNav = useMemo(
    () => [...prince2Nav, ...scrumNavVisible, ...sharedNav],
    [prince2Nav, scrumNavVisible],
  )

  useEffect(() => {
    setLocale(readStoredLocale())
    const nextTheme = readStoredTheme()
    setTheme(nextTheme)
    applyTheme(nextTheme)
    const storedSidebar = window.localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (storedSidebar === "closed") setSidebarOpen(false)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    document.documentElement.lang = locale
    storeLocale(locale)
  }, [locale, ready])

  useEffect(() => {
    const stillVisible = allNav.some((item) => item.id === section)
    if (!stillVisible) setSection("overview")
  }, [allNav, section])

  function handleLocaleChange(next: Locale) {
    setLocale(next)
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
  }

  function handleThemeToggle() {
    const next: Theme = theme === "light" ? "dark" : "light"
    setTheme(next)
    storeTheme(next)
  }

  function handleSidebarToggle() {
    setSidebarOpen((open) => {
      const next = !open
      window.localStorage.setItem(
        SIDEBAR_STORAGE_KEY,
        next ? "open" : "closed",
      )
      return next
    })
  }

  const workspaceCrumb =
    section === "scrum" ||
    section === "scrumStages" ||
    section === "scrumStagesStopped" ||
    section === "scrumStagesDone"
      ? t(locale, "workspaces.scrum")
      : section === "team" || section === "settings"
        ? t(locale, "workspaces.shared")
        : t(locale, "workspaces.prince2")

  const sidebarLabel = sidebarOpen
    ? t(locale, "sidebar.hide")
    : t(locale, "sidebar.show")

  return (
    <div className="neo-deck min-h-screen text-[var(--ink)]">
      <aside
        id="app-sidepanel"
        className={cn(
          "fixed inset-y-0 z-20 w-60 border-r border-[var(--hairline)] bg-[var(--deck)] transition-transform duration-200 ease-out",
          "hidden lg:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex h-16 items-center gap-3 border-b border-[var(--hairline)] px-5">
          <div className="neo-mark">
            <LayoutDashboard size={16} />
          </div>
          <div>
            <strong className="text-sm text-[var(--ink)]">
              {t(locale, "productName")}
            </strong>
            <p className="text-[10px] uppercase tracking-wider text-[var(--mute-slate)]">
              {t(locale, "productOffice")}
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 overflow-y-auto p-4 text-sm">
          {prince2Nav.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={section === item.id}
              locale={locale}
              onSelect={setSection}
            />
          ))}

          <div className="my-3 border-t border-[var(--hairline)]" />

          {scrumNavVisible.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={section === item.id}
              locale={locale}
              onSelect={setSection}
            />
          ))}

          <div className="my-3 border-t border-[var(--hairline)]" />

          {sharedNav.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              active={section === item.id}
              locale={locale}
              onSelect={setSection}
            />
          ))}
        </nav>
      </aside>

      <div
        className={cn(
          "transition-[padding] duration-200 ease-out",
          sidebarOpen ? "lg:pl-60" : "lg:pl-0",
        )}
      >
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b border-[var(--hairline)] bg-[var(--deck)]/95 px-4 backdrop-blur-sm sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              className="neo-theme-btn hidden shrink-0 lg:inline-flex"
              onClick={handleSidebarToggle}
              title={sidebarLabel}
              aria-label={sidebarLabel}
              aria-expanded={sidebarOpen}
              aria-controls="app-sidepanel"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={15} />
              ) : (
                <PanelLeftOpen size={15} />
              )}
            </button>
            <ProjectSwitcher locale={locale} />
            <span className="truncate text-xs text-[var(--mute-slate)]">
              {workspaceCrumb} /{" "}
              <b className="text-[var(--ink)]">
                {pick(locale, project.meta.name)}
              </b>
              <span className="ml-2 hidden text-[var(--mute-slate)] sm:inline">
                · {pick(locale, project.meta.organisation)}
              </span>
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="neo-locale flex" role="group">
              <button
                type="button"
                onClick={() => handleLocaleChange("is")}
                className="neo-locale-btn"
                aria-pressed={locale === "is"}
              >
                IS
              </button>
              <button
                type="button"
                onClick={() => handleLocaleChange("en")}
                className="neo-locale-btn"
                aria-pressed={locale === "en"}
              >
                EN
              </button>
            </div>
            <button
              type="button"
              className="neo-theme-btn"
              onClick={handleThemeToggle}
              title={
                theme === "light"
                  ? t(locale, "theme.toDark")
                  : t(locale, "theme.toLight")
              }
              aria-label={
                theme === "light"
                  ? t(locale, "theme.toDark")
                  : t(locale, "theme.toLight")
              }
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <span className="neo-chip hidden sm:inline-flex">
              {pick(locale, project.meta.duration)}
            </span>
          </div>
        </header>

        <div className="border-b border-[var(--hairline)] bg-[var(--deck)] px-4 py-2 lg:hidden">
          <div className="flex gap-1 overflow-x-auto text-xs">
            {allNav.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={cn(
                  "shrink-0 px-3 py-1.5",
                  section === item.id ? "neo-nav-active" : "neo-nav-idle",
                  section !== item.id && item.tone,
                )}
              >
                {t(locale, `nav.${item.id}`)}
              </button>
            ))}
          </div>
        </div>

        <main className="mx-auto max-w-[1500px] p-4 sm:p-6">
          {section === "overview" && <OverviewView locale={locale} />}
          {section === "therney" && <TherneyView locale={locale} />}
          {section === "stages" && (
            <StagesView locale={locale} onSelectSection={setSection} />
          )}
          {section === "timeline" && (
            <TimelineView locale={locale} onSelectSection={setSection} />
          )}
          {section === "risks" && <RisksView locale={locale} />}
          {section === "documents" && <DocumentsView locale={locale} />}
          {section === "wiki" && <WikiView locale={locale} />}
          {section === "scrum" && <ScrumView locale={locale} />}
          {section === "scrumStages" && (
            <ScrumStagesView locale={locale} filterStatus="inProgress" />
          )}
          {section === "scrumStagesStopped" && (
            <ScrumStagesView locale={locale} filterStatus="stopped" />
          )}
          {section === "scrumStagesDone" && (
            <ScrumStagesView locale={locale} filterStatus="done" />
          )}
          {section === "team" && <TeamView locale={locale} />}
          {section === "settings" && (
            <SettingsView
              locale={locale}
              onLocaleChange={handleLocaleChange}
            />
          )}
        </main>
      </div>
    </div>
  )
}
