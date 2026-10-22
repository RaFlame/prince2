"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Check, ChevronDown } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import {
  STAGE_STATUSES,
  stageStatusBadgeClass,
  type StageStatus,
} from "@/lib/stage-status"
import { cn } from "@/lib/utils"

type Props = {
  locale: Locale
  value: StageStatus
  onChange: (status: StageStatus) => void
  id?: string
}

export function StageStatusSelect({ locale, value, onChange, id }: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition",
          "shadow-sm ring-1 ring-black/5 hover:brightness-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)]",
          stageStatusBadgeClass[value],
        )}
      >
        <span
          className={cn(
            "size-1.5 rounded-full",
            value === "notStarted" && "bg-slate-500",
            value === "inProgress" && "bg-emerald-600",
            value === "stopped" && "bg-amber-600",
            value === "done" && "bg-blue-600",
          )}
          aria-hidden
        />
        {t(locale, `status.${value}`)}
        <ChevronDown
          size={12}
          className={cn("opacity-70 transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={t(locale, "stages.status")}
          className="absolute right-0 z-30 mt-1.5 min-w-[11rem] rounded-xl border border-slate-200/80 bg-[var(--panel,#fff)] p-1.5 shadow-lg shadow-slate-900/10"
        >
          {STAGE_STATUSES.map((status) => {
            const selected = status === value
            return (
              <li key={status} role="option" aria-selected={selected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(status)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left transition",
                    "hover:bg-slate-50 dark:hover:bg-slate-800/60",
                    selected && "bg-slate-50 dark:bg-slate-800/40",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex flex-1 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      stageStatusBadgeClass[status],
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        status === "notStarted" && "bg-slate-500",
                        status === "inProgress" && "bg-emerald-600",
                        status === "stopped" && "bg-amber-600",
                        status === "done" && "bg-blue-600",
                      )}
                      aria-hidden
                    />
                    {t(locale, `status.${status}`)}
                  </span>
                  {selected && (
                    <Check size={14} className="shrink-0 text-slate-500" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
