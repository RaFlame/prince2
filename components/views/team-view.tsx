import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { pick, team } from "@/lib/project-data"
import { cn } from "@/lib/utils"

const raciClass = {
  R: "bg-blue-50 text-blue-800 border-blue-200",
  A: "bg-emerald-50 text-emerald-800 border-emerald-200",
  C: "bg-amber-50 text-amber-800 border-amber-200",
  I: "bg-slate-50 text-slate-700 border-slate-200",
} as const

export function TeamView({ locale }: { locale: Locale }) {
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

      <section className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">{t(locale, "team.role")}</th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "team.responsibility")}
                </th>
                <th className="px-5 py-3 font-medium">{t(locale, "team.raci")}</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member) => (
                <tr
                  className="border-t border-slate-100 align-top"
                  key={pick(locale, member.role)}
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {pick(locale, member.role)}
                  </td>
                  <td className="px-5 py-3 leading-relaxed text-slate-600">
                    {pick(locale, member.responsibility)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex size-8 items-center justify-center rounded border text-sm font-semibold",
                        raciClass[member.raci],
                      )}
                      title={member.raci}
                    >
                      {member.raci}
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
