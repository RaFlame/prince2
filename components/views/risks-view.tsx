import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { pick, risks } from "@/lib/project-data"
import { cn } from "@/lib/utils"

const severityClass = {
  high: "border-red-200 bg-red-50 text-red-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-slate-200 bg-slate-50 text-slate-700",
} as const

export function RisksView({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "risks.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "risks.subtitle")}
        </p>
      </div>

      <section className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">{t(locale, "risks.ref")}</th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "risks.description")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "risks.owner")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "risks.category")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "risks.severity")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "risks.status")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "risks.target")}
                </th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk) => (
                <tr className="border-t border-slate-100 align-top" key={risk.ref}>
                  <td className="px-5 py-3 font-mono font-medium">{risk.ref}</td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-slate-900">
                      {pick(locale, risk.description)}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                      <span className="font-medium text-slate-600">
                        {t(locale, "risks.mitigation")}:{" "}
                      </span>
                      {pick(locale, risk.mitigation)}
                    </p>
                  </td>
                  <td className="px-5 py-3">{pick(locale, risk.owner)}</td>
                  <td className="px-5 py-3">{pick(locale, risk.category)}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "rounded border px-2 py-1",
                        severityClass[risk.severity],
                      )}
                    >
                      {t(locale, `severity.${risk.severity}`)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {t(locale, `status.${risk.status}`)}
                  </td>
                  <td className="px-5 py-3">{pick(locale, risk.target)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
