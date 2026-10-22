"use client"

import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { EditableCard } from "@/components/editable-card"

export function TeamView({ locale }: { locale: Locale }) {
  const { project } = useProject()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "team.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "team.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {project.team.map((member, index) => (
          <EditableCard
            key={`${member.role.is}-${index}`}
            cardKey={`team.${index}`}
            title={`${member.role[locale]} · ${member.raci}`}
            locale={locale}
            defaultIs={member.responsibility.is}
            defaultEn={member.responsibility.en}
          />
        ))}
      </div>
    </div>
  )
}
