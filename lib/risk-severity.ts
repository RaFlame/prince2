import type { RiskSeverity } from "@/lib/project-types"

export const riskCardClass: Record<RiskSeverity, string> = {
  high: "border-rose-300 bg-rose-50 hover:border-rose-400",
  medium: "border-amber-300 bg-amber-50/70 hover:border-amber-400",
  low: "border-sky-200 bg-sky-50/70 hover:border-sky-300",
}

export const riskSeverityBadgeClass: Record<RiskSeverity, string> = {
  high: "bg-rose-100 text-rose-900",
  medium: "bg-amber-100 text-amber-950",
  low: "bg-sky-100 text-sky-900",
}
