import type { Locale } from "@/lib/i18n"
import { loc, t } from "@/lib/i18n"
import { glossaryTerms } from "@/lib/glossary"

export function WikiView({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "wiki.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "wiki.subtitle")}
        </p>
      </div>

      <section className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            {t(locale, "wiki.glossaryTitle")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {t(locale, "wiki.glossarySubtitle")}
          </p>
        </div>

        <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t(locale, "wiki.abbreviations")}
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "wiki.abbr")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "wiki.expansion")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "wiki.definition")}
                </th>
              </tr>
            </thead>
            <tbody>
              {glossaryTerms.map((term) => (
                <tr
                  className="border-t border-slate-100 align-top"
                  key={term.abbr}
                >
                  <td className="px-5 py-3 font-mono text-sm font-semibold text-blue-800">
                    {term.abbr}
                  </td>
                  <td className="px-5 py-3 font-medium text-slate-800">
                    {loc(locale, term.expansion)}
                  </td>
                  <td className="px-5 py-3 leading-relaxed text-slate-600">
                    {loc(locale, term.definition)}
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
