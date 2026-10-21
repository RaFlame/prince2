export const CARD_FONTS = [
  { id: "sans", label: "Sans", css: "var(--font-card-sans), system-ui, sans-serif" },
  { id: "serif", label: "Serif", css: "var(--font-card-serif), Georgia, serif" },
  { id: "display", label: "Display", css: "var(--font-card-display), Georgia, serif" },
  { id: "mono", label: "Mono", css: "var(--font-card-mono), ui-monospace, monospace" },
  { id: "rounded", label: "Rounded", css: "var(--font-card-rounded), system-ui, sans-serif" },
] as const

export const CARD_SIZES = [
  { id: "sm", label: "S", className: "text-xs leading-relaxed" },
  { id: "md", label: "M", className: "text-sm leading-relaxed" },
  { id: "lg", label: "L", className: "text-base leading-relaxed" },
  { id: "xl", label: "XL", className: "text-lg leading-relaxed" },
] as const

export const CARD_COLORS = [
  { id: "slate", label: "Slate", className: "text-slate-700" },
  { id: "zinc", label: "Zinc", className: "text-zinc-700" },
  { id: "blue", label: "Blue", className: "text-blue-800" },
  { id: "indigo", label: "Indigo", className: "text-indigo-800" },
  { id: "emerald", label: "Emerald", className: "text-emerald-800" },
  { id: "amber", label: "Amber", className: "text-amber-800" },
  { id: "rose", label: "Rose", className: "text-rose-800" },
  { id: "purple", label: "Purple", className: "text-purple-800" },
  { id: "cyan", label: "Cyan", className: "text-cyan-800" },
  { id: "orange", label: "Orange", className: "text-orange-800" },
] as const

export type CardFontId = (typeof CARD_FONTS)[number]["id"]
export type CardSizeId = (typeof CARD_SIZES)[number]["id"]
export type CardColorId = (typeof CARD_COLORS)[number]["id"]

export type CardRecord = {
  card_key: string
  content_is: string
  content_en: string
  font: CardFontId
  size: CardSizeId
  color: CardColorId
  bold: boolean
  italic: boolean
  updated_at?: string
}

export const DEFAULT_CARD_STYLE = {
  font: "sans" as CardFontId,
  size: "md" as CardSizeId,
  color: "slate" as CardColorId,
  bold: false,
  italic: false,
}

export function fontCss(id: CardFontId): string {
  return CARD_FONTS.find((f) => f.id === id)?.css ?? CARD_FONTS[0].css
}

export function sizeClass(id: CardSizeId): string {
  return CARD_SIZES.find((s) => s.id === id)?.className ?? CARD_SIZES[1].className
}

export function colorClass(id: CardColorId): string {
  return CARD_COLORS.find((c) => c.id === id)?.className ?? CARD_COLORS[0].className
}
