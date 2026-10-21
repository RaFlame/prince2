import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { documents, pick } from "@/lib/project-data"

export function DocumentsView({ locale }: { locale: Locale }) {
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

      <section className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "documents.name")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "documents.type")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "documents.stage")}
                </th>
                <th className="px-5 py-3 font-medium">
                  {t(locale, "documents.status")}
                </th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  className="border-t border-slate-100"
                  key={pick(locale, doc.name)}
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {pick(locale, doc.name)}
                  </td>
                  <td className="px-5 py-3">{pick(locale, doc.type)}</td>
                  <td className="px-5 py-3 font-mono text-slate-600">
                    {doc.stage}
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px]">
                      {t(locale, `status.${doc.status}`)}
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
