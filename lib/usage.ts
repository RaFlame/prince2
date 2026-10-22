export const USAGE_EVENT_TYPES = [
  "login",
  "session",
  "heartbeat",
  "section",
] as const

export type UsageEventType = (typeof USAGE_EVENT_TYPES)[number]

export type UsageEvent = {
  id: string
  user_id: string
  user_email: string | null
  event_type: UsageEventType | string
  meta: Record<string, unknown>
  created_at: string
}

export function isUsageEventType(value: string): value is UsageEventType {
  return (USAGE_EVENT_TYPES as readonly string[]).includes(value)
}

/** Fire-and-forget usage log (safe to ignore failures). */
export async function logUsageEvent(
  eventType: UsageEventType,
  meta: Record<string, unknown> = {},
): Promise<void> {
  try {
    await fetch("/api/usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventType, meta }),
      keepalive: true,
    })
  } catch {
    /* ignore offline / unconfigured */
  }
}

export async function fetchUsageEvents(limit = 80): Promise<{
  configured: boolean
  events: UsageEvent[]
  error?: string
}> {
  try {
    const res = await fetch(`/api/usage?limit=${limit}`, { cache: "no-store" })
    if (res.status === 401) {
      return { configured: false, events: [] }
    }
    const json = (await res.json()) as {
      configured?: boolean
      events?: UsageEvent[]
      error?: string
    }
    return {
      configured: Boolean(json.configured),
      events: Array.isArray(json.events) ? json.events : [],
      error: json.error,
    }
  } catch {
    return { configured: false, events: [] }
  }
}
