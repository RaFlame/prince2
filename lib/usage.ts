export const USAGE_EVENT_TYPES = [
  "login",
  "session",
  "heartbeat",
  "section",
] as const

export type UsageEventType = (typeof USAGE_EVENT_TYPES)[number]

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
