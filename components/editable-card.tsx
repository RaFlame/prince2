"use client"

import { useEffect, useRef, useState } from "react"
import { Bold, Check, Italic, Loader2, X } from "lucide-react"
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
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<CardRecord>(stored)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!editing) setDraft(getCard(cardKey, { is: defaultIs, en: defaultEn }))
  }, [
    cardKey,
    defaultIs,
    defaultEn,
    getCard,
    editing,
    stored.content_is,
    stored.content_en,
    stored.font,
    stored.size,
    stored.color,
    stored.bold,
    stored.italic,
  ])

  useEffect(() => {
    if (!editing) return
    const el = textareaRef.current
    if (!el) return
    el.focus()
    const len = el.value.length
    el.setSelectionRange(len, len)
  }, [editing])

  const body = locale === "is" ? draft.content_is : draft.content_en

  function startEdit() {
    if (!ready || editing) return
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
        "p-5 transition-[box-shadow,background,border-color] duration-150",
        editing
          ? "neo-recessed cursor-default"
          : cn(
              "cursor-pointer rounded border border-slate-200 bg-white hover:border-slate-300",
              className,
            ),
      )}
      onClick={startEdit}
      onKeyDown={(e) => {
        if (editing) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          startEdit()
        }
      }}
      role={editing ? undefined : "button"}
      tabIndex={editing || !ready ? undefined : 0}
      aria-label={editing ? undefined : `${t(locale, "cards.edit")}: ${title}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <div
          className="flex shrink-0 items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {message && (
            <span className="mr-1 text-[10px] text-emerald-700">{message}</span>
          )}
          {editing && (
            <>
              <button
                type="button"
                onClick={() => void save()}
                disabled={saving}
                className="neo-icon-btn-save p-1.5 disabled:opacity-50"
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
                className="neo-icon-btn p-1.5 disabled:opacity-50"
                title={t(locale, "cards.cancel")}
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div
          className="neo-recessed-sm mt-3 flex flex-wrap items-center gap-2 p-2"
          onClick={(e) => e.stopPropagation()}
        >
          <label className="flex items-center gap-1 text-[10px] text-slate-500">
            {t(locale, "cards.font")}
            <select
              className="neo-select px-1.5 py-1 text-xs text-slate-800"
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
              className="neo-select px-1.5 py-1 text-xs text-slate-800"
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
              className="neo-select px-1.5 py-1 text-xs text-slate-800"
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
              "p-1.5",
              draft.bold ? "neo-pressed" : "neo-icon-btn",
            )}
            aria-pressed={draft.bold}
            title={t(locale, "cards.bold")}
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={() => setDraft((d) => ({ ...d, italic: !d.italic }))}
            className={cn(
              "p-1.5",
              draft.italic ? "neo-pressed" : "neo-icon-btn",
            )}
            aria-pressed={draft.italic}
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
          ref={textareaRef}
          className={cn(
            "neo-field mt-3 min-h-28 w-full resize-y p-3",
            textClass,
          )}
          style={{ fontFamily: fontCss(draft.font) }}
          value={body}
          onClick={(e) => e.stopPropagation()}
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
