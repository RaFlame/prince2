"use client"

import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
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
  const titleId = useId()

  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<CardRecord>(stored)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  useEffect(() => {
    if (!editing) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) cancel()
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener("keydown", onKey)
    }
  }, [editing, saving])

  const display = getCard(cardKey, { is: defaultIs, en: defaultEn })
  const displayBody =
    locale === "is" ? display.content_is : display.content_en
  const draftBody = locale === "is" ? draft.content_is : draft.content_en

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

  const displayTextClass = cn(
    sizeClass(display.size),
    colorClass(display.color),
    display.bold && "font-bold",
    display.italic && "italic",
  )

  const draftTextClass = cn(
    sizeClass(draft.size),
    colorClass(draft.color),
    draft.bold && "font-bold",
    draft.italic && "italic",
  )

  const editor =
    mounted &&
    editing &&
    createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-950/45 backdrop-blur-[2px]"
          aria-label={t(locale, "cards.cancel")}
          disabled={saving}
          onClick={() => {
            if (!saving) cancel()
          }}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="neo-recessed relative z-10 flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-[var(--hairline)] px-5 py-4">
            <h2
              id={titleId}
              className="text-sm font-semibold text-[var(--ink)]"
            >
              {title}
            </h2>
            <div className="flex shrink-0 items-center gap-1">
              {message && (
                <span className="mr-1 text-[10px] text-emerald-700">
                  {message}
                </span>
              )}
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
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-[var(--hairline)] px-5 py-3">
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

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <textarea
              ref={textareaRef}
              className={cn(
                "neo-field min-h-[min(50vh,320px)] w-full resize-y p-3",
                draftTextClass,
              )}
              style={{ fontFamily: fontCss(draft.font) }}
              value={draftBody}
              onChange={(e) =>
                setDraft((d) =>
                  locale === "is"
                    ? { ...d, content_is: e.target.value }
                    : { ...d, content_en: e.target.value },
                )
              }
            />
          </div>
        </div>
      </div>,
      document.body,
    )

  return (
    <>
      <section
        className={cn(
          "cursor-pointer rounded border border-slate-200 bg-white p-5 transition hover:border-slate-300",
          className,
        )}
        onClick={startEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            startEdit()
          }
        }}
        role="button"
        tabIndex={ready ? 0 : undefined}
        aria-label={`${t(locale, "cards.edit")}: ${title}`}
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {message && (
            <span className="text-[10px] text-emerald-700">{message}</span>
          )}
        </div>

        {asList ? (
          <ul
            className={cn("mt-2 list-disc space-y-1.5 pl-4", displayTextClass)}
            style={{ fontFamily: fontCss(display.font) }}
          >
            {displayBody
              .split("\n")
              .map((line) => line.trim())
              .filter(Boolean)
              .map((line) => (
                <li key={line}>{line.replace(/^[-•*]\s*/, "")}</li>
              ))}
          </ul>
        ) : (
          <p
            className={cn("mt-2 whitespace-pre-wrap", displayTextClass)}
            style={{ fontFamily: fontCss(display.font) }}
          >
            {displayBody}
          </p>
        )}
      </section>
      {editor}
    </>
  )
}
