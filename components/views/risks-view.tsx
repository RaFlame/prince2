"use client"

import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { pick } from "@/lib/project-types"
import {
  riskCardClass,
  riskSeverityBadgeClass,
} from "@/lib/risk-severity"
import { EditableCard } from "@/components/editable-card"
import { cn } from "@/lib/utils"

const severityOrder = { high: 0, medium: 1, low: 2 } as const

export function RisksView({ locale }: { locale: Locale }) {
  const { project } = useProject()
  const risks = [...project.risks].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "risks.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "risks.subtitle")}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {(["high", "medium", "low"] as const).map((level) => (
            <span
              key={level}
              className={cn(
                "rounded-full px-2.5 py-1 font-medium",
                riskSeverityBadgeClass[level],
              )}
            >
              {t(locale, `severity.${level}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {risks.map((risk) => (
          <EditableCard
            key={risk.ref}
            cardKey={`risk.${risk.ref}`}
            className={cn(riskCardClass[risk.severity])}
            title={`${risk.ref} · ${t(locale, `severity.${risk.severity}`)} · ${t(locale, `status.${risk.status}`)}`}
            locale={locale}
            defaultIs={`${risk.description.is}\n\n${t("is", "risks.owner")}: ${risk.owner.is}\n${t("is", "risks.category")}: ${risk.category.is}\n${t("is", "risks.target")}: ${risk.target.is}\n\n${t("is", "risks.mitigation")}:\n${risk.mitigation.is}`}
            defaultEn={`${risk.description.en}\n\n${t("en", "risks.owner")}: ${risk.owner.en}\n${t("en", "risks.category")}: ${risk.category.en}\n${t("en", "risks.target")}: ${risk.target.en}\n\n${t("en", "risks.mitigation")}:\n${risk.mitigation.en}`}
          />
        ))}
      </div>

      {project.risks.length === 0 && (
        <p className="text-sm text-slate-500">
          {pick(locale, {
            is: "Engin áhætta skráð enn — bættu við í klippiborði eða breyttu kortum.",
            en: "No risks recorded yet — add via edits on cards as you go.",
          })}
        </p>
      )}
    </div>
  )
}
