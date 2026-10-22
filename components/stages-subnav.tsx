"use client"

import type { Locale, Section } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const TABS: { id: "stages" | "timeline"; labelKey: string }[] = [
  { id: "stages", labelKey: "stages.tabPlans" },
  { id: "timeline", labelKey: "stages.tabTimeline" },
]

export function StagesSubnav({
  locale,
  active,
  onSelect,
}: {
  locale: Locale
  active: "stages" | "timeline"
  onSelect: (id: Section) => void
}) {
  return (
    <div
      className="neo-locale inline-flex"
      role="tablist"
      aria-label={t(locale, "stages.title")}
    >
      {TABS.map((tab) => {
        const selected = tab.id === active
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab.id)}
            className={cn(
              "neo-locale-btn px-3 py-1.5 text-xs font-medium",
              selected && "text-white",
            )}
            aria-pressed={selected}
          >
            {t(locale, tab.labelKey)}
          </button>
        )
      })}
    </div>
  )
}
