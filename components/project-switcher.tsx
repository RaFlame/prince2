"use client"

import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { pick } from "@/lib/project-types"
import { cn } from "@/lib/utils"

export function ProjectSwitcher({ locale }: { locale: Locale }) {
  const { project, projects, setProjectId, createProject } = useProject()
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState("")
  const [organisation, setOrganisation] = useState("")
  const [mounted, setMounted] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (creating) setCreating(false)
        else setOpen(false)
      }
    }
    document.addEventListener("mousedown", onDoc)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDoc)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, creating])

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    createProject({ name: name.trim(), organisation: organisation.trim() })
    setName("")
    setOrganisation("")
    setCreating(false)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        className="neo-theme-btn inline-flex w-auto max-w-[11rem] items-center gap-1.5 px-2"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        title={t(locale, "projects.switch")}
        aria-label={t(locale, "projects.switch")}
      >
        <span className="truncate text-xs font-medium">
          {pick(locale, project.shortName)}
        </span>
        <ChevronsUpDown size={12} className="shrink-0 opacity-70" />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-40 mt-1 min-w-[14rem] overflow-hidden rounded-[var(--radius-sm)] border border-[var(--hairline)] bg-[var(--deck)] py-1 shadow-[var(--shadow-raised-sm)]"
          role="listbox"
        >
          {projects.map((p) => {
            const active = p.id === project.id
            return (
              <button
                key={p.id}
                type="button"
                role="option"
                aria-selected={active}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-xs",
                    active
                    ? "bg-[var(--signal-soft)] text-[var(--signal)]"
                    : "text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--deck)_85%,var(--neo-light))]",
                )}
                onClick={() => {
                  setProjectId(p.id)
                  setOpen(false)
                }}
              >
                <span className="min-w-0 flex-1 truncate font-medium">
                  {pick(locale, p.shortName)}
                </span>
                {active && <Check size={12} className="shrink-0" />}
              </button>
            )
          })}
          <div className="my-1 border-t border-[var(--hairline)]" />
          <button
            type="button"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--deck)_85%,var(--neo-light))]"
            onClick={() => setCreating(true)}
          >
            <Plus size={12} />
            {t(locale, "projects.new")}
          </button>
        </div>
      )}

      {mounted &&
        creating &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            role="presentation"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setCreating(false)
            }}
          >
            <form
              className="w-full max-w-md rounded-[var(--radius-md)] border border-[var(--hairline)] bg-[var(--deck)] p-5 shadow-[var(--shadow-raised-sm)]"
              onSubmit={handleCreate}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <h2
                id={titleId}
                className="text-sm font-semibold text-[var(--ink)]"
              >
                {t(locale, "projects.newTitle")}
              </h2>
              <p className="mt-1 text-xs text-[var(--mute-slate)]">
                {t(locale, "projects.newHint")}
              </p>
              <label className="mt-4 block text-xs font-medium text-[var(--ink)]">
                {t(locale, "projects.name")}
                <input
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neo-recessed mt-1 w-full px-3 py-2 text-sm"
                />
              </label>
              <label className="mt-3 block text-xs font-medium text-[var(--ink)]">
                {t(locale, "projects.organisation")}
                <input
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                  className="neo-recessed mt-1 w-full px-3 py-2 text-sm"
                />
              </label>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  className="neo-theme-btn w-auto px-3 text-xs"
                  onClick={() => setCreating(false)}
                >
                  {t(locale, "cards.cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-[var(--radius-sm)] bg-[var(--ink)] px-3 py-1.5 text-xs font-medium text-[var(--deck)]"
                >
                  {t(locale, "projects.create")}
                </button>
              </div>
            </form>
          </div>,
          document.body,
        )}
    </div>
  )
}
