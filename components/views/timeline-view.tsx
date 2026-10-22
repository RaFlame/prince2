"use client"

import type { Locale, Section } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { useStageSchedules } from "@/lib/stage-schedule-context"
import { useStageStatuses } from "@/lib/stage-status-context"
import { StageGantt } from "@/components/stage-gantt"
import { StagesSubnav } from "@/components/stages-subnav"

export function TimelineView({
  locale,
  onSelectSection,
}: {
  locale: Locale
  onSelectSection: (id: Section) => void
}) {
  const { project } = useProject()
  const { getSchedule, setSchedule, setStartDate } = useStageSchedules()
  const { getStatus } = useStageStatuses()

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
            {t(locale, "timeline.title")}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[var(--mute-slate)]">
            {t(locale, "timeline.subtitle")}
          </p>
        </div>
        <StagesSubnav
          locale={locale}
          active="timeline"
          onSelect={onSelectSection}
        />
      </div>

      <StageGantt
        locale={locale}
        stages={project.stages}
        getSchedule={getSchedule}
        getStatus={getStatus}
        setSchedule={setSchedule}
        setStartDate={setStartDate}
      />
    </div>
  )
}
