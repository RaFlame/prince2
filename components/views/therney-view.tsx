"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { pick } from "@/lib/project-types"
import {
  therneyPhotos,
  therneyVessel,
  therneyVoyage,
} from "@/lib/vessel-therney"

const TherneyVoyageMap = dynamic(
  () =>
    import("@/components/therney-voyage-map").then((m) => m.TherneyVoyageMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[200px] items-center justify-center bg-slate-100 text-xs text-slate-500">
        …
      </div>
    ),
  },
)

export function TherneyView({ locale }: { locale: Locale }) {
  const dep = therneyVoyage.departure
  const arr = therneyVoyage.arrival

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "therney.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "therney.subtitle")}
        </p>
      </div>

      <section className="overflow-hidden rounded border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">
            {t(locale, "therney.photos")}
          </h2>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-2">
          {therneyPhotos.map((photo) => (
            <figure key={photo.id} className="overflow-hidden rounded-sm">
              <div className="relative aspect-[16/10] bg-slate-100">
                <Image
                  src={photo.src}
                  alt={t(locale, photo.altKey)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                  priority={photo.id === "exterior"}
                />
              </div>
              <figcaption className="mt-2 text-xs text-slate-500">
                {t(locale, photo.altKey)}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="overflow-hidden rounded border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              {t(locale, "therney.currentVoyage")}
            </h2>
          </div>
          <div className="flex flex-col">
            <div className="relative h-[200px] border-b border-slate-100">
              <TherneyVoyageMap />
            </div>
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {t(locale, "therney.departure")}
                  </p>
                  <p className="mt-0.5 font-medium text-slate-900">
                    {pick(locale, dep.place)} {pick(locale, dep.country)}{" "}
                    <span className="font-mono text-xs text-slate-500">
                      {dep.code}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {t(locale, "therney.arrival")}
                  </p>
                  <p className="mt-0.5 font-medium text-slate-900">
                    {pick(locale, arr.place)} {pick(locale, arr.country)}{" "}
                    <span className="font-mono text-xs text-slate-500">
                      {arr.code}
                    </span>
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {t(locale, "therney.actualDeparture")}
                  </p>
                  <p className="mt-0.5 font-medium text-slate-900">
                    {pick(locale, therneyVoyage.actualDeparture)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    {t(locale, "therney.reportedEta")}
                  </p>
                  <p className="mt-0.5 font-medium text-slate-900">
                    {pick(locale, therneyVoyage.reportedEta)}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-1 text-[11px]">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span
                    className="inline-block h-0.5 w-4 bg-[var(--signal)]"
                    aria-hidden
                  />
                  {t(locale, "therney.pastTrack")}
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span
                    className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[var(--seafoam)]"
                    aria-hidden
                  />
                  {t(locale, "therney.routeForecast")}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              {t(locale, "therney.general")}
            </h2>
          </div>
          <dl className="divide-y divide-slate-100">
            {therneyVessel.fields.map((field) => (
              <div
                key={field.id}
                className="grid grid-cols-[minmax(8rem,10rem)_1fr] gap-3 px-5 py-3 text-sm"
              >
                <dt className="text-xs font-medium text-slate-500">
                  {t(locale, `therney.${field.id}`)}
                </dt>
                <dd className="font-medium text-slate-900">
                  {pick(locale, field.value)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}
