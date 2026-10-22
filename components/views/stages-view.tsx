"use client"

import type { Locale, Section } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { pick } from "@/lib/project-types"
import { EditableCard } from "@/components/editable-card"
import { StageStatusSelect } from "@/components/stage-status-select"
import { StagesSubnav } from "@/components/stages-subnav"
import { useStageStatuses } from "@/lib/stage-status-context"
import { useStageSchedules } from "@/lib/stage-schedule-context"
import {
  formatScheduleDate,
  scheduleProgressPercent,
} from "@/lib/stage-schedule"
import { stageCardClass } from "@/lib/stage-status"
import { cn } from "@/lib/utils"

function localeTag(locale: Locale) {
  return locale === "is" ? "is-IS" : "en-GB"
}

export function StagesView({
  locale,
  onSelectSection,
}: {
  locale: Locale
  onSelectSection: (id: Section) => void
}) {
  const { getStatus, setStatus } = useStageStatuses()
  const { getSchedule, setStartDate, setEndDate } = useStageSchedules()
  const { project } = useProject()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">
            {t(locale, "stages.title")}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {pick(locale, project.meta.stagesSubtitle)}
          </p>
        </div>
        <StagesSubnav
          locale={locale}
          active="stages"
          onSelect={onSelectSection}
        />
      </div>

      <div className="space-y-4">
        {project.stages.map((stage) => {
          const status = getStatus(stage.id)
          const schedule = getSchedule(stage.id)
          const progress = scheduleProgressPercent(
            schedule.startDate,
            schedule.endDate,
          )
          const endLabel =
            formatScheduleDate(schedule.endDate, localeTag(locale)) ??
            pick(locale, stage.endDate)

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
                  <label className="neo-meta-badge gap-1.5">
                    <span>{t(locale, "stages.startDate")}</span>
                    <input
                      type="date"
                      className="neo-field px-1.5 py-0.5 text-[11px] text-[var(--ink)]"
                      value={schedule.startDate ?? ""}
                      onChange={(event) =>
                        setStartDate(stage.id, event.target.value || null)
                      }
                      aria-label={t(locale, "stages.startDate")}
                    />
                  </label>
                  <label className="neo-meta-badge gap-1.5">
                    <span>{t(locale, "stages.endDate")}</span>
                    <input
                      type="date"
                      className="neo-field px-1.5 py-0.5 text-[11px] text-[var(--ink)]"
                      value={schedule.endDate ?? ""}
                      min={schedule.startDate ?? undefined}
                      onChange={(event) =>
                        setEndDate(stage.id, event.target.value || null)
                      }
                      aria-label={t(locale, "stages.endDate")}
                    />
                  </label>
                  <span className="neo-meta-badge">
                    {t(locale, "stages.progress")}: {progress}%
                  </span>
                  <span className="neo-meta-badge">
                    {t(locale, "stages.estimatedEndDate")}: {endLabel}
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
