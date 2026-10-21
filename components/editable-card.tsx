"use client"

import { useEffect, useState } from "react"
import { Bold, Check, Italic, Loader2, Pencil, X } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useCards } from "@/lib/cards-context"
import {
  CARD_COLORS,
  CARD_FONTS,
  CARD_SIZES,
  colorClass,
  fontCss,
  sizeClass,
  type CardColorId,
  type CardFontId,
  type CardRecord,
  type CardSizeId,
} from "@/lib/card-style"
import { cn } from "@/lib/utils"

type Props = {
  cardKey: string
  title: string
  locale: Locale
  defaultIs: string
  defaultEn: string
  className?: string
  asList?: boolean
}

export function EditableCard({
  cardKey,
  title,
  locale,
  defaultIs,
  defaultEn,
  className,
  asList,
}: Props) {
  const { getCard, saveCard, configured, ready } = useCards()
  const stored = getCard(cardKey, { is: defaultIs, en: defaultEn })

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<CardRecord>(stored)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!editing) setDraft(getCard(cardKey, { is: defaultIs, en: defaultEn }))
  }, [cardKey, defaultIs, defaultEn, getCard, editing, stored.content_is, stored.content_en, stored.font, stored.size, stored.color, stored.bold, stored.italic])

  const body = locale === "is" ? draft.content_is : draft.content_en

  function startEdit() {
    setDraft(getCard(cardKey, { is: defaultIs, en: defaultEn }))
    setEditing(true)
    setMessage(null)
  }

  function cancel() {
    setDraft(getCard(cardKey, { is: defaultIs, en: defaultEn }))
    setEditing(false)
    setMessage(null)
  }

  async function save() {
    setSaving(true)
    setMessage(null)
    const result = await saveCard({
      ...draft,
      card_key: cardKey,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    if (!result.ok) {
      setMessage(result.error ?? t(locale, "cards.saveError"))
      return
    }
    setEditing(false)
    setMessage(
      configured
        ? t(locale, "cards.savedCloud")
        : t(locale, "cards.savedLocal"),
    )
    window.setTimeout(() => setMessage(null), 2500)
  }

  const textClass = cn(
    sizeClass(draft.size),
    colorClass(draft.color),
    draft.bold && "font-bold",
    draft.italic && "italic",
  )

  return (
    <section
      className={cn(
        "rounded border border-slate-200 bg-white p-5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <div className="flex shrink-0 items-center gap-1">
          {message && (
            <span className="mr-1 text-[10px] text-emerald-700">{message}</span>
          )}
          {!editing ? (
            <button
              type="button"
              onClick={startEdit}
              disabled={!ready}
              className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              title={t(locale, "cards.edit")}
            >
              <Pencil size={14} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="rounded border border-blue-200 bg-blue-50 p-1.5 text-blue-800 hover:bg-blue-100 disabled:opacity-50"
                title={t(locale, "cards.save")}
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
              </button>
              <button
                type="button"
                onClick={cancel}
                disabled={saving}
                className="rounded border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                title={t(locale, "cards.cancel")}
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded border border-slate-100 bg-slate-50 p-2">
          <label className="flex items-center gap-1 text-[10px] text-slate-500">
            {t(locale, "cards.font")}
            <select
              className="rounded border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-800"
              value={draft.font}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  font: e.target.value as CardFontId,
                }))
              }
            >
              {CARD_FONTS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1 text-[10px] text-slate-500">
            {t(locale, "cards.size")}
            <select
              className="rounded border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-800"
              value={draft.size}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  size: e.target.value as CardSizeId,
                }))
              }
            >
              {CARD_SIZES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1 text-[10px] text-slate-500">
            {t(locale, "cards.color")}
            <select
              className="rounded border border-slate-200 bg-white px-1.5 py-1 text-xs text-slate-800"
              value={draft.color}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  color: e.target.value as CardColorId,
                }))
              }
            >
              {CARD_COLORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, bold: !d.bold }))}
            className={cn(
              "rounded border p-1.5",
              draft.bold
                ? "border-slate-800 bg-slate-800 text-white"
                : "border-slate-200 bg-white text-slate-600",
            )}
            title={t(locale, "cards.bold")}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, italic: !d.italic }))}
            className={cn(
              "rounded border p-1.5",
              draft.italic
                ? "border-slate-800 bg-slate-800 text-white"
                : "border-slate-200 bg-white text-slate-600",
            )}
            title={t(locale, "cards.italic")}
          >
            <Italic size={14} />
          </button>

          <span className="ml-auto text-[10px] text-slate-400">
            {locale.toUpperCase()}
          </span>
        </div>
      )}

      {editing ? (
        <textarea
          className={cn(
            "mt-3 min-h-28 w-full resize-y rounded border border-slate-200 bg-white p-3 outline-none focus:border-blue-400",
            textClass,
          )}
          style={{ fontFamily: fontCss(draft.font) }}
          value={body}
          onChange={(e) =>
            setDraft((d) =>
              locale === "is"
                ? { ...d, content_is: e.target.value }
                : { ...d, content_en: e.target.value },
            )
          }
        />
      ) : asList ? (
        <ul
          className={cn("mt-2 list-disc space-y-1.5 pl-4", textClass)}
          style={{ fontFamily: fontCss(draft.font) }}
        >
          {body
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => (
              <li key={line}>{line.replace(/^[-•*]\s*/, "")}</li>
            ))}
        </ul>
      ) : (
        <p
          className={cn("mt-2 whitespace-pre-wrap", textClass)}
          style={{ fontFamily: fontCss(draft.font) }}
        >
          {body}
        </p>
      )}
    </section>
  )
}
