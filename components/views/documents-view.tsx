"use client"

import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { EditableCard } from "@/components/editable-card"

export function DocumentsView({ locale }: { locale: Locale }) {
  const { project } = useProject()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "documents.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "documents.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {project.documents.map((doc, index) => (
          <EditableCard
            key={`${doc.name.is}-${index}`}
            cardKey={`document.${index}`}
            title={doc.name[locale]}
            locale={locale}
            defaultIs={`${doc.type.is}\n${t("is", "documents.stage")}: ${doc.stage}\n${t("is", "documents.status")}: ${t("is", `status.${doc.status}`)}`}
            defaultEn={`${doc.type.en}\n${t("en", "documents.stage")}: ${doc.stage}\n${t("en", "documents.status")}: ${t("en", `status.${doc.status}`)}`}
          />
        ))}
      </div>
    </div>
  )
}
