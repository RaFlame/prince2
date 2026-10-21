import {
  CalendarDays,
  CircleDollarSign,
  ListChecks,
  ShieldCheck,
} from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import {
  benefits,
  justification,
  objectives,
  pick,
  productsSummary,
  projectMeta,
  scope,
  stages,
  thesis,
  tolerances,
  type ToleranceId,
} from "@/lib/project-data"
import { cn } from "@/lib/utils"

const toleranceIcons: Record<ToleranceId, typeof CalendarDays> = {
  time: CalendarDays,
  cost: CircleDollarSign,
  scope: ListChecks,
  risk: ShieldCheck,
}

const toneClass = {
  good: "text-emerald-700",
  neutral: "text-blue-700",
  watch: "text-amber-700",
} as const

export function OverviewView({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            {t(locale, "onTrack")}
          </span>
          <span className="text-xs text-slate-500">
            {t(locale, "lastUpdated")} {pick(locale, projectMeta.lastUpdated)}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "overview.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "overview.subtitle")}
        </p>
        <p className="mt-4 max-w-3xl rounded border border-blue-100 bg-blue-50/60 p-4 text-sm leading-relaxed text-slate-800">
          {pick(locale, thesis)}
        </p>
      </div>

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-slate-900">
            {t(locale, "overview.tolerances")}
          </h2>
          <p className="text-xs text-slate-500">
            {t(locale, "overview.tolerancesHint")}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {tolerances.map((item) => {
            const Icon = toleranceIcons[item.id]
            return (
              <div
                key={item.id}
                className="rounded border border-slate-200 bg-white p-4"
              >
                <div className="flex justify-between gap-2">
                  <div>
                    <p className="text-xs text-slate-500">
                      {t(locale, `tolerance.${item.id}`)}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-xl font-semibold",
                        toneClass[item.tone],
                      )}
                    >
                      {pick(locale, item.value)}
                    </p>
                  </div>
                  <span className="text-slate-400">
                    <Icon size={17} />
                  </span>
                </div>
                <div className="mt-4 h-1.5 rounded bg-slate-100">
                  <div
                    className={cn(
                      "h-full rounded",
                      item.tone === "watch" ? "w-1/2 bg-amber-500" : "w-3/4 bg-blue-600",
                    )}
                  />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  {pick(locale, item.detail)}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Article
          title={t(locale, "overview.justification")}
          body={pick(locale, justification)}
        />
        <Article
          title={t(locale, "overview.scope")}
          body={pick(locale, scope)}
        />
        <ArticleList
          title={t(locale, "overview.objectives")}
          items={objectives.map((o) => pick(locale, o))}
        />
        <ArticleList
          title={t(locale, "overview.benefits")}
          items={benefits.map((b) => pick(locale, b))}
        />
      </div>

      <Article
        title={t(locale, "overview.products")}
        body={pick(locale, productsSummary)}
      />

      <section className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold">
            {t(locale, "overview.stagesPreview")}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "stages.title")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "stages.progress")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "stages.endDate")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "stages.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage) => (
                <tr className="border-t border-slate-100" key={stage.id}>
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {pick(locale, stage.name)}
                  </td>
                  <td className="px-5 py-3">{stage.progress}%</td>
                  <td className="px-5 py-3">{pick(locale, stage.endDate)}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px]">
                      {t(locale, `status.${stage.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Article({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
    </section>
  )
}

function ArticleList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <ul className="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-slate-600">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}
