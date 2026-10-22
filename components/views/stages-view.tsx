"use client"

import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { pick } from "@/lib/project-types"
import { EditableCard } from "@/components/editable-card"
import { StageStatusSelect } from "@/components/stage-status-select"
import { useStageStatuses } from "@/lib/stage-status-context"
import { stageCardClass } from "@/lib/stage-status"
import { cn } from "@/lib/utils"

export function StagesView({ locale }: { locale: Locale }) {
  const { getStatus, setStatus } = useStageStatuses()
  const { project } = useProject()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "stages.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {pick(locale, project.meta.stagesSubtitle)}
        </p>
      </div>

      <div className="space-y-4">
        {project.stages.map((stage) => {
          const status = getStatus(stage.id)
          return (
            <article
              key={stage.id}
              className={cn(
                "overflow-hidden rounded border transition-colors",
                stageCardClass[status],
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100/80 px-5 py-4">
                <div>
                  <p className="font-mono text-[11px] text-slate-400">
                    {stage.id}
                  </p>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {pick(locale, stage.name)}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {t(locale, "stages.manager")}: {pick(locale, stage.owner)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <StageStatusSelect
                    id={`stage-status-${stage.id}`}
                    locale={locale}
                    value={status}
                    onChange={(next) => setStatus(stage.id, next)}
                  />
                  <span className="neo-meta-badge">
                    {t(locale, "stages.progress")}: {stage.progress}%
                  </span>
                  <span className="neo-meta-badge">
                    {t(locale, "stages.endDate")}: {pick(locale, stage.endDate)}
                  </span>
                </div>
              </div>
              <div className="grid gap-4 p-4 lg:grid-cols-2">
                <EditableCard
                  cardKey={`stage.${stage.id}.gate`}
                  title={t(locale, "stages.gate")}
                  locale={locale}
                  defaultIs={stage.gate.is}
                  defaultEn={stage.gate.en}
                  className="border-slate-100 shadow-none"
                />
                <EditableCard
                  cardKey={`stage.${stage.id}.outcomes`}
                  title={t(locale, "stages.outcomes")}
                  locale={locale}
                  defaultIs={stage.outcomes.map((o) => `• ${o.is}`).join("\n")}
                  defaultEn={stage.outcomes.map((o) => `• ${o.en}`).join("\n")}
                  asList
                  className="border-slate-100 shadow-none"
                />
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
