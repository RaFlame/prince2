"use client"

import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { pick } from "@/lib/project-types"
import { EditableCard } from "@/components/editable-card"
import { useStageStatuses } from "@/lib/stage-status-context"
import {
  stageCardClass,
  stageStatusBadgeClass,
  type StageStatus,
} from "@/lib/stage-status"
import { cn } from "@/lib/utils"

const pageTone: Record<
  Exclude<StageStatus, "notStarted">,
  { title: string; border: string }
> = {
  inProgress: {
    title: "text-emerald-700",
    border: "border-emerald-100/80",
  },
  stopped: {
    title: "text-amber-800",
    border: "border-amber-100/80",
  },
  done: {
    title: "text-blue-800",
    border: "border-blue-100/80",
  },
}

const pageCopy: Record<
  Exclude<StageStatus, "notStarted">,
  { title: string; subtitle: string; empty: string }
> = {
  inProgress: {
    title: "scrum.stagesTitle",
    subtitle: "scrum.stagesSubtitle",
    empty: "scrum.stagesEmpty",
  },
  stopped: {
    title: "scrum.stoppedTitle",
    subtitle: "scrum.stoppedSubtitle",
    empty: "scrum.stoppedEmpty",
  },
  done: {
    title: "scrum.doneTitle",
    subtitle: "scrum.doneSubtitle",
    empty: "scrum.doneEmpty",
  },
}

export function ScrumStagesView({
  locale,
  filterStatus,
}: {
  locale: Locale
  filterStatus: Exclude<StageStatus, "notStarted">
}) {
  const { stageIdsByStatus, getStatus } = useStageStatuses()
  const { project } = useProject()
  const active = project.stages.filter((stage) =>
    stageIdsByStatus(filterStatus).includes(stage.id),
  )
  const tone = pageTone[filterStatus]
  const copy = pageCopy[filterStatus]

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn("text-2xl font-semibold", tone.title)}>
          {t(locale, copy.title)}
        </h1>
        <p className={cn("mt-1 text-sm", tone.title, "opacity-80")}>
          {t(locale, copy.subtitle)}
        </p>
      </div>

      {active.length === 0 ? (
        <section className="rounded border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t(locale, copy.empty)}
        </section>
      ) : (
        <div className="space-y-4">
          {active.map((stage) => {
            const status = getStatus(stage.id)
            return (
              <article
                key={stage.id}
                className={cn(
                  "overflow-hidden rounded border",
                  stageCardClass[status],
                )}
              >
                <div
                  className={cn(
                    "flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4",
                    tone.border,
                  )}
                >
                  <div>
                    <p className={cn("font-mono text-[11px]", tone.title, "opacity-60")}>
                      {stage.id} · SCRUM
                    </p>
                    <h2 className={cn("text-sm font-semibold", tone.title)}>
                      {pick(locale, stage.name)}
                    </h2>
                    <p className={cn("mt-1 text-xs", tone.title, "opacity-75")}>
                      {t(locale, "stages.manager")}:{" "}
                      {pick(locale, stage.owner)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 font-medium",
                        stageStatusBadgeClass[status],
                      )}
                    >
                      {t(locale, `status.${status}`)}
                    </span>
                    <span className="rounded border border-slate-200 bg-white/70 px-2 py-1 text-slate-600">
                      {t(locale, "stages.progress")}: {stage.progress}%
                    </span>
                    <span className="rounded border border-slate-200 bg-white/70 px-2 py-1 text-slate-600">
                      {t(locale, "stages.endDate")}:{" "}
                      {pick(locale, stage.endDate)}
                    </span>
                  </div>
                </div>
                <div className="grid gap-4 p-4 lg:grid-cols-2">
                  <EditableCard
                    cardKey={`scrum.stage.${stage.id}.gate`}
                    title={t(locale, "stages.gate")}
                    locale={locale}
                    defaultIs={stage.gate.is}
                    defaultEn={stage.gate.en}
                    className="border-slate-100 shadow-none"
                  />
                  <EditableCard
                    cardKey={`scrum.stage.${stage.id}.outcomes`}
                    title={t(locale, "stages.outcomes")}
                    locale={locale}
                    defaultIs={stage.outcomes
                      .map((o) => `• ${o.is}`)
                      .join("\n")}
                    defaultEn={stage.outcomes
                      .map((o) => `• ${o.en}`)
                      .join("\n")}
                    asList
                    className="border-slate-100 shadow-none"
                  />
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
