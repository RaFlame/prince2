import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { pick, stages } from "@/lib/project-data"

export function StagesView({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "stages.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "stages.subtitle")}
        </p>
      </div>

      <div className="space-y-4">
        {stages.map((stage) => (
          <article
            key={stage.id}
            className="overflow-hidden rounded border border-slate-200 bg-white"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
              <div>
                <p className="font-mono text-[11px] text-slate-400">{stage.id}</p>
                <h2 className="text-sm font-semibold text-slate-900">
                  {pick(locale, stage.name)}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {t(locale, "stages.manager")}: {pick(locale, stage.owner)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-1">
                  {t(locale, `status.${stage.status}`)}
                </span>
                <span className="rounded border border-slate-200 px-2 py-1 text-slate-600">
                  {t(locale, "stages.progress")}: {stage.progress}%
                </span>
                <span className="rounded border border-slate-200 px-2 py-1 text-slate-600">
                  {t(locale, "stages.endDate")}: {pick(locale, stage.endDate)}
                </span>
              </div>
            </div>
            <div className="grid gap-4 px-5 py-4 lg:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t(locale, "stages.gate")}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">
                  {pick(locale, stage.gate)}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t(locale, "stages.outcomes")}
                </h3>
                <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm text-slate-700">
                  {stage.outcomes.map((outcome) => (
                    <li key={pick(locale, outcome)}>{pick(locale, outcome)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
