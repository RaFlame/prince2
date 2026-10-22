import { therneyVessel } from "@/lib/vessel-therney"

export type LiveVoyageSnapshot = {
  actualDeparture: string | null
  reportedEta: string | null
  lastReported: string | null
  departurePlace: string | null
  departureCode: string | null
  arrivalPlace: string | null
  arrivalCode: string | null
  position: { lat: number; lng: number } | null
  source: "marinetraffic-api" | "ais"
  fetchedAt: string
}

const IMO =
  therneyVessel.fields.find((f) => f.id === "imo")?.value.en ?? "9830434"
const MMSI =
  therneyVessel.fields.find((f) => f.id === "mmsi")?.value.en ?? "251765000"

const OPENWATERS_URL = `https://ais.openwaters.io/v1/vessels?mmsi=${MMSI}`

export const THERNEY_VOYAGE_CACHE_KEY = "prince2-therney-voyage-live"

export function formatUtcStamp(raw: string): string {
  const cleaned = raw.replace(/\s+/g, " ").trim()
  if (/\(UTC/i.test(cleaned)) return cleaned
  return `${cleaned} (UTC)`
}

export function parseIsoLike(value: string | null | undefined): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) {
    const m = value.match(
      /(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})(?::\d{2})?/,
    )
    if (m) return formatUtcStamp(`${m[1]} ${m[2]}`)
    return formatUtcStamp(value)
  }
  const iso = d.toISOString()
  const [date, time] = iso.split("T")
  return formatUtcStamp(`${date} ${time.slice(0, 5)}`)
}

/** AIS ETA is MM-DD HH:MM with no year (same encoding MarineTraffic shows). */
export function parseAisEta(
  eta: string | null | undefined,
  now: Date = new Date(),
): string | null {
  if (!eta) return null
  const m = eta.trim().match(/^(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/)
  if (!m) return parseIsoLike(eta)
  const month = Number(m[1]) - 1
  const day = Number(m[2])
  const hour = Number(m[3])
  const minute = Number(m[4])
  let year = now.getUTCFullYear()
  let d = new Date(Date.UTC(year, month, day, hour, minute))
  // Stale month/day → next calendar year (common for fishing voyages).
  if (d.getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000) {
    d = new Date(Date.UTC(year + 1, month, day, hour, minute))
  }
  const iso = d.toISOString()
  const [date, time] = iso.split("T")
  return formatUtcStamp(`${date} ${time.slice(0, 5)}`)
}

/** Official MarineTraffic exportvessel when MARINETRAFFIC_API_KEY is set. */
export async function fetchFromMarineTrafficApi(
  apiKey: string,
): Promise<LiveVoyageSnapshot | null> {
  const url = new URL(
    `https://services.marinetraffic.com/api/exportvessel/${apiKey}`,
  )
  url.searchParams.set("v", "5")
  url.searchParams.set("imo", IMO)
  url.searchParams.set("timespan", "1440")
  url.searchParams.set("protocol", "jsono")

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) return null

  const json = (await res.json()) as
    | { DATA?: Record<string, string>[] }
    | Record<string, string>[]
    | Record<string, string>

  const row = Array.isArray(json)
    ? json[0]
    : Array.isArray((json as { DATA?: Record<string, string>[] }).DATA)
      ? (json as { DATA: Record<string, string>[] }).DATA[0]
      : (json as Record<string, string>)

  if (!row || typeof row !== "object") return null

  const eta =
    parseAisEta(row.ETA_AIS) ??
    parseIsoLike(row.ETA ?? row.ETA_CALC ?? row.NEXT_PORT_ETA)
  const atd = parseIsoLike(row.LAST_PORT_TIME ?? row.ATD)
  const lastReported = parseIsoLike(row.TIMESTAMP ?? row.LAST_POS)
  const lat = Number(row.LAT ?? row.LATITUDE)
  const lng = Number(row.LON ?? row.LONGITUDE ?? row.LNG)

  if (!eta && !atd && !lastReported) return null

  return {
    actualDeparture: atd,
    reportedEta: eta,
    lastReported,
    departurePlace: row.LAST_PORT ?? row.LAST_PORT_NAME ?? null,
    departureCode: row.LAST_PORT_UNLOCODE ?? null,
    arrivalPlace: row.NEXT_PORT_NAME ?? row.DESTINATION ?? null,
    arrivalCode: row.NEXT_PORT_UNLOCODE ?? null,
    position:
      Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null,
    source: "marinetraffic-api",
    fetchedAt: new Date().toISOString(),
  }
}

/**
 * Live AIS via Open Waters / BarentsWatch — same ETA & last-report fields
 * MarineTraffic displays. Used because marinetraffic.com blocks server scrapes.
 */
export async function fetchFromOpenWatersAis(): Promise<LiveVoyageSnapshot | null> {
  const res = await fetch(OPENWATERS_URL, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  })
  if (!res.ok) return null

  const json = (await res.json()) as {
    features?: Array<{
      geometry?: { coordinates?: [number, number] }
      properties?: Record<string, unknown>
    }>
  }
  const feature = json.features?.[0]
  const props = feature?.properties
  if (!props) return null

  const eta = parseAisEta(
    typeof props.eta === "string" ? props.eta : null,
  )
  const lastReported = parseIsoLike(
    typeof props.seen === "string" ? props.seen : null,
  )
  const destination =
    typeof props.destination === "string" ? props.destination : null
  const coords = feature?.geometry?.coordinates
  const lng = coords?.[0]
  const lat = coords?.[1]

  if (!eta && !lastReported) return null

  return {
    actualDeparture: null,
    reportedEta: eta,
    lastReported,
    departurePlace: null,
    departureCode: null,
    arrivalPlace: destination,
    arrivalCode: null,
    position:
      lat != null &&
      lng != null &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
        ? { lat, lng }
        : null,
    source: "ais",
    fetchedAt: new Date().toISOString(),
  }
}

export async function fetchLiveTherneyVoyage(): Promise<LiveVoyageSnapshot> {
  const apiKey = process.env.MARINETRAFFIC_API_KEY?.trim()
  if (apiKey) {
    try {
      const fromApi = await fetchFromMarineTrafficApi(apiKey)
      if (fromApi) return fromApi
    } catch {
      /* fall through to open AIS */
    }
  }

  const fromAis = await fetchFromOpenWatersAis()
  if (fromAis) return fromAis

  throw new Error(
    "Could not load voyage times from AIS. Try again later, or set MARINETRAFFIC_API_KEY for the official MarineTraffic API.",
  )
}
