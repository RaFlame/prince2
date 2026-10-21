import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { glossaryTerms } from "@/lib/glossary"
import { EditableCard } from "@/components/editable-card"

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

      <section className="rounded border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          {t(locale, "wiki.glossaryTitle")}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {t(locale, "wiki.glossarySubtitle")}
        </p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {t(locale, "wiki.abbreviations")}
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {glossaryTerms.map((term) => (
          <EditableCard
            key={term.abbr}
            cardKey={`glossary.${term.abbr}`}
            title={`${term.abbr} — ${term.expansion[locale]}`}
            locale={locale}
            defaultIs={term.definition.is}
            defaultEn={term.definition.en}
          />
        ))}
      </div>
    </div>
  )
}
