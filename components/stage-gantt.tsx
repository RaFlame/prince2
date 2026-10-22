"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { pick, type ProjectStage } from "@/lib/project-types"
import {
  addDays,
  computeGanttRange,
  daysBetween,
  formatScheduleDate,
  isoWeekParts,
  scheduleProgressPercent,
  toIsoDate,
  weekTicks,
  type StageSchedule,
} from "@/lib/stage-schedule"
import {
  stageStatusBadgeClass,
  type StageStatus,
} from "@/lib/stage-status"
import { cn } from "@/lib/utils"

type DragMode = "move" | "start" | "end"

type DragState = {
  stageId: string
  mode: DragMode
  originX: number
  originStart: string
  originEnd: string
}

/** Solid instrument bars — readable on mist deck, status-coded. */
const barTone: Record<
  StageStatus,
  { bar: string; fill: string; rail: string; label: string }
> = {
  notStarted: {
    bar: "bg-slate-400",
    fill: "bg-slate-600/55",
    rail: "border-l-[3px] border-slate-400",
    label: "text-white",
  },
  inProgress: {
    bar: "bg-[var(--seafoam)]",
    fill: "bg-emerald-950/35",
    rail: "border-l-[3px] border-[var(--seafoam)]",
    label: "text-white",
  },
  stopped: {
    bar: "bg-amber-600",
    fill: "bg-amber-950/35",
    rail: "border-l-[3px] border-amber-600",
    label: "text-white",
  },
  done: {
    bar: "bg-[var(--signal)]",
    fill: "bg-blue-950/35",
    rail: "border-l-[3px] border-[var(--signal)]",
    label: "text-white",
  },
}

const LABEL_W = 248
const ROW_H = 72
const AXIS_H = 36
const PX_PER_DAY_MIN = 5

function localeTag(locale: Locale) {
  return locale === "is" ? "is-IS" : "en-GB"
}

function pctAlong(iso: string, rangeStart: string, totalDays: number) {
  if (totalDays <= 0) return 0
  return (daysBetween(rangeStart, iso) / totalDays) * 100
}

function shortStageName(name: string, id: string) {
  const stripped = name.replace(new RegExp(`^${id}\\s*[—–-]\\s*`, "i"), "")
  return stripped.length > 0 ? stripped : name
}

export function StageGantt({
  locale,
  stages,
  getSchedule,
  getStatus,
  setSchedule,
  setStartDate,
}: {
  locale: Locale
  stages: ProjectStage[]
  getSchedule: (stageId: string) => StageSchedule
  getStatus: (stageId: string) => StageStatus
  setSchedule: (
    stageId: string,
    schedule: { startDate: string | null; endDate: string | null },
  ) => void
  setStartDate: (stageId: string, startDate: string | null) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<DragState | null>(null)
  const [preview, setPreview] = useState<Record<string, StageSchedule>>({})

  const schedules = useMemo(
    () => stages.map((s) => preview[s.id] ?? getSchedule(s.id)),
    [stages, getSchedule, preview],
  )

  const { rangeStart, rangeEnd } = useMemo(
    () => computeGanttRange(schedules),
    [schedules],
  )
  const totalDays = Math.max(1, daysBetween(rangeStart, rangeEnd))
  const chartWidth = Math.max(720, totalDays * PX_PER_DAY_MIN)
  const ticks = useMemo(
    () => weekTicks(rangeStart, rangeEnd),
    [rangeStart, rangeEnd],
  )
  const todayIso = toIsoDate(new Date())
  const todayPct = pctAlong(todayIso, rangeStart, totalDays)
  const tag = localeTag(locale)

  const pxToDays = useCallback(
    (dx: number) => {
      const el = trackRef.current
      if (!el) return 0
      const width = el.clientWidth || chartWidth
      return Math.round((dx / width) * totalDays)
    },
    [chartWidth, totalDays],
  )

  const beginDrag = useCallback(
    (
      event: React.PointerEvent,
      stageId: string,
      mode: DragMode,
      startDate: string,
      endDate: string,
    ) => {
      event.preventDefault()
      event.stopPropagation()
      ;(event.target as HTMLElement).setPointerCapture?.(event.pointerId)
      setDrag({
        stageId,
        mode,
        originX: event.clientX,
        originStart: startDate,
        originEnd: endDate,
      })
      setPreview((prev) => ({
        ...prev,
        [stageId]: { startDate, endDate },
      }))
    },
    [],
  )

  const onPointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!drag) return
      const delta = pxToDays(event.clientX - drag.originX)
      let startDate = drag.originStart
      let endDate = drag.originEnd
      const span = daysBetween(drag.originStart, drag.originEnd)

      if (drag.mode === "move") {
        startDate = addDays(drag.originStart, delta)
        endDate = addDays(startDate, span)
      } else if (drag.mode === "start") {
        startDate = addDays(drag.originStart, delta)
        if (startDate > endDate) startDate = endDate
      } else {
        endDate = addDays(drag.originEnd, delta)
        if (endDate < startDate) endDate = startDate
      }

      setPreview((prev) => ({
        ...prev,
        [drag.stageId]: { startDate, endDate },
      }))
    },
    [drag, pxToDays],
  )

  const endDrag = useCallback(() => {
    if (!drag) return
    const next = preview[drag.stageId]
    if (next?.startDate && next?.endDate) {
      setSchedule(drag.stageId, next)
    }
    setDrag(null)
    setPreview({})
  }, [drag, preview, setSchedule])

  return (
    <div className="neo-recessed overflow-hidden rounded-[var(--radius-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] bg-[var(--deck)] px-4 py-2.5">
        <p className="text-xs text-[var(--mute-slate)]">
          {t(locale, "timeline.dragHint")}
        </p>
        <div className="flex flex-wrap gap-1.5" aria-label={t(locale, "stages.status")}>
          {(
            ["notStarted", "inProgress", "stopped", "done"] as StageStatus[]
          ).map((status) => (
            <span
              key={status}
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                stageStatusBadgeClass[status],
              )}
            >
              {t(locale, `status.${status}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto bg-[var(--deck)]">
        <div
          className="relative select-none"
          style={{ minWidth: LABEL_W + chartWidth }}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <div
            className="sticky top-0 z-10 flex border-b border-[var(--hairline)] bg-[var(--deck)]"
            style={{ height: AXIS_H }}
          >
            <div
              className="sticky left-0 z-20 flex shrink-0 items-end border-r border-[var(--hairline)] bg-[var(--deck)] px-3 pb-2"
              style={{ width: LABEL_W }}
            >
              <span className="text-[10px] font-medium text-[var(--mute-slate)]">
                {t(locale, "stages.status")}
              </span>
            </div>
            <div
              ref={trackRef}
              className="relative flex-1"
              style={{ width: chartWidth, minWidth: chartWidth }}
            >
              {ticks.map((tick) => {
                const left = pctAlong(tick, rangeStart, totalDays)
                return (
                  <div
                    key={tick}
                    className="absolute top-0 bottom-0 border-l border-[var(--hairline)]"
                    style={{ left: `${left}%` }}
                  >
                    <span className="absolute left-1.5 top-2 whitespace-nowrap text-[10px] font-medium tabular-nums text-[var(--mute-slate)]">
                      {formatWeekAxisLabel(tick, locale)}
                    </span>
                  </div>
                )
              })}
              {todayPct >= 0 && todayPct <= 100 && (
                <div
                  className="pointer-events-none absolute top-0 bottom-0 z-[5] w-px bg-[var(--signal)]"
                  style={{ left: `${todayPct}%` }}
                  title={t(locale, "timeline.today")}
                >
                  <span className="absolute left-1.5 top-1.5 rounded-[var(--radius-sm)] bg-[var(--signal)] px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-[var(--shadow-raised-sm)]">
                    {t(locale, "timeline.today")}
                  </span>
                </div>
              )}
            </div>
          </div>

          {stages.map((stage, index) => {
            const schedule = preview[stage.id] ?? getSchedule(stage.id)
            const status = getStatus(stage.id)
            const tone = barTone[status]
            const hasDates = Boolean(schedule.startDate && schedule.endDate)
            const progress = scheduleProgressPercent(
              schedule.startDate,
              schedule.endDate,
            )
            const left = hasDates
              ? pctAlong(schedule.startDate!, rangeStart, totalDays)
              : 0
            const width = hasDates
              ? Math.max(
                  1.5,
                  pctAlong(schedule.endDate!, rangeStart, totalDays) - left,
                )
              : 0
            const statusLabel = t(locale, `status.${status}`)
            const name = shortStageName(pick(locale, stage.name), stage.id)
            const startLabel = formatScheduleDate(schedule.startDate, tag)
            const endLabel = formatScheduleDate(schedule.endDate, tag)

            return (
              <div
                key={stage.id}
                className={cn(
                  "flex border-b border-[var(--hairline)] last:border-b-0",
                  index % 2 === 0
                    ? "bg-[var(--panel)]"
                    : "bg-[color-mix(in_srgb,var(--deck)_70%,var(--panel))]",
                )}
                style={{ height: ROW_H }}
              >
                <div
                  className={cn(
                    "sticky left-0 z-[8] flex shrink-0 flex-col justify-center gap-1.5 border-r border-[var(--hairline)] bg-inherit px-3",
                    tone.rail,
                  )}
                  style={{ width: LABEL_W }}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-xs font-semibold tabular-nums",
                        stageStatusBadgeClass[status],
                      )}
                    >
                      {stage.id}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
                        stageStatusBadgeClass[status],
                      )}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="truncate text-xs font-semibold leading-snug text-[var(--ink)]">
                    {name}
                  </p>
                  {hasDates && (
                    <p className="truncate text-[10px] tabular-nums text-[var(--mute-slate)]">
                      {startLabel} → {endLabel}
                    </p>
                  )}
                </div>

                <div
                  className="relative flex-1"
                  style={{ width: chartWidth, minWidth: chartWidth }}
                >
                  {ticks.map((tick) => (
                    <div
                      key={`${stage.id}-${tick}`}
                      className="absolute top-0 bottom-0 border-l border-[var(--hairline)]/70"
                      style={{
                        left: `${pctAlong(tick, rangeStart, totalDays)}%`,
                      }}
                    />
                  ))}
                  {todayPct >= 0 && todayPct <= 100 && (
                    <div
                      className="pointer-events-none absolute top-0 bottom-0 w-px bg-[var(--signal)]/50"
                      style={{ left: `${todayPct}%` }}
                    />
                  )}

                  {hasDates ? (
                    <div
                      className={cn(
                        "absolute top-1/2 h-8 -translate-y-1/2 overflow-hidden rounded-[var(--radius-sm)] shadow-[var(--shadow-raised-sm)] transition-[filter,transform] duration-150",
                        tone.bar,
                        drag?.stageId === stage.id &&
                          "z-[6] scale-[1.02] brightness-110",
                      )}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-y-0 left-0",
                          tone.fill,
                        )}
                        style={{ width: `${progress}%` }}
                      />
                      <span
                        className={cn(
                          "pointer-events-none absolute inset-y-0 left-2.5 right-2.5 z-[1] flex items-center gap-1.5 truncate text-[10px] font-semibold tracking-wide",
                          tone.label,
                        )}
                      >
                        <span className="font-mono tabular-nums">{stage.id}</span>
                        <span className="opacity-80">·</span>
                        <span>{progress}%</span>
                      </span>
                      <button
                        type="button"
                        aria-label={`${t(locale, "stages.startDate")} ${stage.id}`}
                        className="absolute inset-y-0 left-0 z-[2] w-2.5 cursor-ew-resize bg-white/0 hover:bg-white/25 focus-visible:bg-white/30"
                        onPointerDown={(e) =>
                          beginDrag(
                            e,
                            stage.id,
                            "start",
                            schedule.startDate!,
                            schedule.endDate!,
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label={`${stage.id} move`}
                        className="absolute inset-y-0 left-2.5 right-2.5 z-[1] cursor-grab active:cursor-grabbing"
                        onPointerDown={(e) =>
                          beginDrag(
                            e,
                            stage.id,
                            "move",
                            schedule.startDate!,
                            schedule.endDate!,
                          )
                        }
                      />
                      <button
                        type="button"
                        aria-label={`${t(locale, "stages.endDate")} ${stage.id}`}
                        className="absolute inset-y-0 right-0 z-[2] w-2.5 cursor-ew-resize bg-white/0 hover:bg-white/25 focus-visible:bg-white/30"
                        onPointerDown={(e) =>
                          beginDrag(
                            e,
                            stage.id,
                            "end",
                            schedule.startDate!,
                            schedule.endDate!,
                          )
                        }
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 items-center gap-3">
                      <div className="h-8 flex-1 rounded-[var(--radius-sm)] border border-dashed border-[var(--hairline)] bg-[color-mix(in_srgb,var(--deck)_80%,transparent)]" />
                      <button
                        type="button"
                        className="neo-raised-sm shrink-0 px-2.5 py-1.5 text-[10px] font-medium text-[var(--body-slate)] transition hover:text-[var(--signal)]"
                        onClick={() => {
                          setStartDate(stage.id, toIsoDate(new Date()))
                        }}
                      >
                        {t(locale, "timeline.setDefaultRange")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="border-t border-[var(--hairline)] bg-[var(--panel)] px-4 py-3">
        <div className="grid gap-2 sm:grid-cols-2">
          {stages.map((stage) => {
            const schedule = preview[stage.id] ?? getSchedule(stage.id)
            const status = getStatus(stage.id)
            return (
              <div
                key={`edit-${stage.id}`}
                className="flex flex-wrap items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--hairline)] bg-[var(--deck)] px-2.5 py-2"
              >
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold",
                    stageStatusBadgeClass[status],
                  )}
                >
                  {stage.id}
                </span>
                <label className="inline-flex items-center gap-1.5 text-[10px] text-[var(--mute-slate)]">
                  <span>{t(locale, "stages.startDate")}</span>
                  <input
                    type="date"
                    className="neo-field px-1.5 py-1 text-xs tabular-nums text-[var(--ink)]"
                    value={schedule.startDate ?? ""}
                    onChange={(e) => {
                      const startDate = e.target.value || null
                      const endDate =
                        schedule.endDate &&
                        startDate &&
                        schedule.endDate < startDate
                          ? startDate
                          : schedule.endDate
                      if (startDate && !endDate) {
                        setStartDate(stage.id, startDate)
                      } else {
                        setSchedule(stage.id, { startDate, endDate })
                      }
                    }}
                  />
                </label>
                <label className="inline-flex items-center gap-1.5 text-[10px] text-[var(--mute-slate)]">
                  <span>{t(locale, "stages.endDate")}</span>
                  <input
                    type="date"
                    className="neo-field px-1.5 py-1 text-xs tabular-nums text-[var(--ink)]"
                    value={schedule.endDate ?? ""}
                    min={schedule.startDate ?? undefined}
                    onChange={(e) => {
                      setSchedule(stage.id, {
                        startDate: schedule.startDate,
                        endDate: e.target.value || null,
                      })
                    }}
                  />
                </label>
                {schedule.startDate && schedule.endDate && (
                  <span className="ml-auto text-[10px] tabular-nums text-[var(--mute-slate)]">
                    {daysBetween(schedule.startDate, schedule.endDate)}{" "}
                    {locale === "is" ? "d." : "d"}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** e.g. IS "V42 2026", EN "W42 2026" */
function formatWeekAxisLabel(iso: string, locale: Locale) {
  const { week, year } = isoWeekParts(iso)
  const prefix = locale === "is" ? "V" : "W"
  return `${prefix}${week} ${year}`
}
