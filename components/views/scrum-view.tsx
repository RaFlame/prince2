"use client"

import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { pick } from "@/lib/project-types"

export function ScrumView({ locale }: { locale: Locale }) {
  const { project } = useProject()
  const { scrumMeta, scrumColumns } = project

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {pick(locale, scrumMeta.sprintLabel)}
          </span>
          <span className="text-xs text-slate-500">
            {pick(locale, scrumMeta.sprintWindow)}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "scrum.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "scrum.subtitle")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {scrumColumns.map((column) => (
          <section
            key={column.id}
            className="rounded border border-slate-200 bg-white p-3"
          >
            <header className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                {pick(locale, column.title)}
              </h2>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                {column.items.length}
              </span>
            </header>
            <ul className="space-y-2">
              {column.items.map((item) => (
                <li
                  key={item.id}
                  className="rounded border border-slate-100 bg-slate-50 p-3"
                >
                  <p className="font-mono text-[10px] text-slate-400">
                    {item.id}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {pick(locale, item.title)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {pick(locale, item.detail)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
