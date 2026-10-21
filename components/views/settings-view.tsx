import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function SettingsView({
  locale,
  onLocaleChange,
}: {
  locale: Locale
  onLocaleChange: (locale: Locale) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "settings.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "settings.subtitle")}
        </p>
      </div>

      <section className="max-w-xl rounded border border-slate-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-slate-900">
          {t(locale, "settings.language")}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {t(locale, "settings.languageHint")}
        </p>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onLocaleChange("is")}
            className={cn(
              "rounded border px-4 py-2 text-sm font-medium transition",
              locale === "is"
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            {t(locale, "settings.icelandic")}
          </button>
          <button
            type="button"
            onClick={() => onLocaleChange("en")}
            className={cn(
              "rounded border px-4 py-2 text-sm font-medium transition",
              locale === "en"
                ? "border-blue-700 bg-blue-700 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            )}
          >
            {t(locale, "settings.english")}
          </button>
        </div>
      </section>
    </div>
  )
}
