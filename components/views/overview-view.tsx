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
} from "@/lib/project-data"
import { EditableCard } from "@/components/editable-card"

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
        <EditableCard
          className="mt-4 max-w-3xl border-blue-100 bg-blue-50/60"
          cardKey="overview.thesis"
          title={pick(locale, projectMeta.roleFocus)}
          locale={locale}
          defaultIs={thesis.is}
          defaultEn={thesis.en}
        />
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
          {tolerances.map((item) => (
            <EditableCard
              key={item.id}
              cardKey={`overview.tolerance.${item.id}`}
              title={t(locale, `tolerance.${item.id}`)}
              locale={locale}
              defaultIs={`${item.value.is}\n${item.detail.is}`}
              defaultEn={`${item.value.en}\n${item.detail.en}`}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <EditableCard
          cardKey="overview.justification"
          title={t(locale, "overview.justification")}
          locale={locale}
          defaultIs={justification.is}
          defaultEn={justification.en}
        />
        <EditableCard
          cardKey="overview.scope"
          title={t(locale, "overview.scope")}
          locale={locale}
          defaultIs={scope.is}
          defaultEn={scope.en}
        />
        <EditableCard
          cardKey="overview.objectives"
          title={t(locale, "overview.objectives")}
          locale={locale}
          defaultIs={objectives.map((o) => `• ${o.is}`).join("\n")}
          defaultEn={objectives.map((o) => `• ${o.en}`).join("\n")}
          asList
        />
        <EditableCard
          cardKey="overview.benefits"
          title={t(locale, "overview.benefits")}
          locale={locale}
          defaultIs={benefits.map((b) => `• ${b.is}`).join("\n")}
          defaultEn={benefits.map((b) => `• ${b.en}`).join("\n")}
          asList
        />
      </div>

      <EditableCard
        cardKey="overview.products"
        title={t(locale, "overview.products")}
        locale={locale}
        defaultIs={productsSummary.is}
        defaultEn={productsSummary.en}
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
