import type { L } from "@/lib/project-types"

export type VesselFieldId =
  | "name"
  | "flag"
  | "imo"
  | "mmsi"
  | "callSign"
  | "aisClass"
  | "generalType"
  | "detailedType"

export type LatLng = { lat: number; lng: number }

export const therneyVessel: {
  id: string
  fields: { id: VesselFieldId; value: L }[]
} = {
  id: "therney",
  fields: [
    {
      id: "name",
      value: { is: "Þerney (THERNEY)", en: "THERNEY (Þerney)" },
    },
    {
      id: "flag",
      value: { is: "Ísland", en: "Iceland" },
    },
    {
      id: "imo",
      value: { is: "9830434", en: "9830434" },
    },
    {
      id: "mmsi",
      value: { is: "251765000", en: "251765000" },
    },
    {
      id: "callSign",
      value: { is: "TFFW", en: "TFFW" },
    },
    {
      id: "aisClass",
      value: { is: "Flokkur A", en: "Class A" },
    },
    {
      id: "generalType",
      value: { is: "Fiskiskip", en: "Fishing" },
    },
    {
      id: "detailedType",
      value: { is: "Verksmiðjutogari", en: "Factory Trawler" },
    },
  ],
}

export const therneyPhotos = [
  {
    id: "exterior",
    src: "/vessels/therney/exterior.jpg",
    altKey: "therney.photoExterior" as const,
  },
  {
    id: "processing",
    src: "/vessels/therney/processing-deck.jpg",
    altKey: "therney.photoProcessing" as const,
  },
]

/** Snapshot from MarineTraffic-style voyage panel (not live AIS). */
export const therneyVoyage = {
  departure: {
    place: { is: "Frederikshavn", en: "Frederikshavn" },
    country: { is: "DK", en: "DK" },
    code: "FDH",
    coords: { lat: 57.4408, lng: 10.5367 } satisfies LatLng,
  },
  arrival: {
    place: { is: "Eskifjörður", en: "Eskifjordur" },
    country: { is: "IS", en: "IS" },
    code: "ESK",
    coords: { lat: 65.0731, lng: -14.0156 } satisfies LatLng,
  },
  actualDeparture: {
    is: "2026-10-13 22:31 (UTC+2)",
    en: "2026-10-13 22:31 (UTC+2)",
  } satisfies L,
  reportedEta: {
    is: "2026-09-17 21:00 (UTC+0)",
    en: "2026-09-17 21:00 (UTC+0)",
  } satisfies L,
  /** Approximate great-circle sample for past track (departure → mid North Sea). */
  pastTrack: [
    { lat: 57.4408, lng: 10.5367 },
    { lat: 57.9, lng: 8.5 },
    { lat: 58.8, lng: 5.2 },
    { lat: 60.2, lng: 1.0 },
    { lat: 61.5, lng: -2.5 },
  ] satisfies LatLng[],
  /** Approximate forecast toward Eskifjörður. */
  routeForecast: [
    { lat: 61.5, lng: -2.5 },
    { lat: 62.8, lng: -6.0 },
    { lat: 63.8, lng: -10.0 },
    { lat: 65.0731, lng: -14.0156 },
  ] satisfies LatLng[],
}
