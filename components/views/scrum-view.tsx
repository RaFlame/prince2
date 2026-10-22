"use client"

import { useCallback, useEffect, useId, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import { Plus, Trash2 } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { t } from "@/lib/i18n"
import { useProject } from "@/lib/project-context"
import { pick, type ScrumColumnId } from "@/lib/project-types"
import {
  nextScrumTaskId,
  readScrumBoardState,
  scrumColumnForStage,
  storeScrumBoardState,
  type ScrumPrepColumn,
  type ScrumTask,
} from "@/lib/scrum-board"
import {
  stageStatusBadgeClass,
  type StageStatus,
} from "@/lib/stage-status"
import { useStageStatuses } from "@/lib/stage-status-context"
import { cn } from "@/lib/utils"

type BoardCard =
  | {
      kind: "stage"
      id: string
      stageId: string
      title: { is: string; en: string }
      detail: { is: string; en: string }
      status: StageStatus
    }
  | {
      kind: "task"
      id: string
      taskId: string
      title: { is: string; en: string }
      detail: { is: string; en: string }
    }

const COLUMN_IDS: ScrumColumnId[] = ["backlog", "todo", "doing", "done"]

export function ScrumView({ locale }: { locale: Locale }) {
  const { project, projectId } = useProject()
  const { getStatus, setStatus, ready: statusReady } = useStageStatuses()
  const { scrumMeta, scrumColumns, stages } = project

  const [tasks, setTasks] = useState<ScrumTask[]>([])
  const [prep, setPrep] = useState<Record<string, ScrumPrepColumn>>({})
  const [dragId, setDragId] = useState<string | null>(null)
  const [overColumn, setOverColumn] = useState<ScrumColumnId | null>(null)
  const [boardReady, setBoardReady] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const editTitleId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const state = readScrumBoardState(projectId, scrumColumns)
    setTasks(state.tasks)
    setPrep(state.stagePrep)
    setBoardReady(true)
  }, [projectId, scrumColumns])

  const persist = useCallback(
    (
      nextTasks: ScrumTask[],
      nextPrep: Record<string, ScrumPrepColumn>,
    ) => {
      storeScrumBoardState(projectId, {
        tasks: nextTasks,
        stagePrep: nextPrep,
      })
    },
    [projectId],
  )

  const updatePrep = useCallback(
    (stageId: string, column: ScrumPrepColumn) => {
      setPrep((prev) => {
        const next = { ...prev, [stageId]: column }
        persist(tasks, next)
        return next
      })
    },
    [persist, tasks],
  )

  const moveTask = useCallback(
    (taskId: string, column: ScrumColumnId) => {
      setTasks((prev) => {
        const next = prev.map((task) =>
          task.id === taskId ? { ...task, column } : task,
        )
        persist(next, prep)
        return next
      })
    },
    [persist, prep],
  )

  const addTask = useCallback(
    (column: ScrumColumnId) => {
      setTasks((prev) => {
        const id = nextScrumTaskId(prev)
        const next: ScrumTask[] = [
          ...prev,
          {
            id,
            column,
            title: {
              is: t("is", "scrum.newTaskTitle"),
              en: t("en", "scrum.newTaskTitle"),
            },
            detail: {
              is: t("is", "scrum.newTaskDetail"),
              en: t("en", "scrum.newTaskDetail"),
            },
          },
        ]
        persist(next, prep)
        return next
      })
    },
    [persist, prep],
  )

  const deleteTask = useCallback(
    (taskId: string) => {
      setTasks((prev) => {
        const next = prev.filter((task) => task.id !== taskId)
        persist(next, prep)
        return next
      })
      if (editingTaskId === taskId) setEditingTaskId(null)
    },
    [persist, prep, editingTaskId],
  )

  const saveTaskEdit = useCallback(
    (taskId: string, title: string, detail: string) => {
      const trimmedTitle = title.trim() || t(locale, "scrum.newTaskTitle")
      const trimmedDetail = detail.trim()
      setTasks((prev) => {
        const synced = prev.map((task) => {
          if (task.id !== taskId) return task
          return {
            ...task,
            title: {
              is:
                locale === "is"
                  ? trimmedTitle
                  : task.title.is === t("is", "scrum.newTaskTitle")
                    ? trimmedTitle
                    : task.title.is,
              en:
                locale === "en"
                  ? trimmedTitle
                  : task.title.en === t("en", "scrum.newTaskTitle")
                    ? trimmedTitle
                    : task.title.en,
            },
            detail: {
              is:
                locale === "is"
                  ? trimmedDetail
                  : task.detail.is === t("is", "scrum.newTaskDetail")
                    ? trimmedDetail
                    : task.detail.is,
              en:
                locale === "en"
                  ? trimmedDetail
                  : task.detail.en === t("en", "scrum.newTaskDetail")
                    ? trimmedDetail
                    : task.detail.en,
            },
          }
        })
        persist(synced, prep)
        return synced
      })
      setEditingTaskId(null)
    },
    [locale, persist, prep],
  )

  const stageCards: BoardCard[] = useMemo(() => {
    return stages.map((stage) => {
      const status = getStatus(stage.id)
      return {
        kind: "stage" as const,
        id: `stage:${stage.id}`,
        stageId: stage.id,
        title: stage.name,
        detail: stage.owner,
        status,
      }
    })
  }, [stages, getStatus])

  const cardsByColumn = useMemo(() => {
    const map: Record<ScrumColumnId, BoardCard[]> = {
      backlog: [],
      todo: [],
      doing: [],
      done: [],
    }

    for (const card of stageCards) {
      if (card.kind !== "stage") continue
      const col = scrumColumnForStage(card.status, prep[card.stageId])
      map[col].push(card)
    }

    for (const task of tasks) {
      map[task.column].push({
        kind: "task",
        id: `task:${task.id}`,
        taskId: task.id,
        title: task.title,
        detail: task.detail,
      })
    }

    return map
  }, [stageCards, prep, tasks])

  function handleDrop(columnId: ScrumColumnId) {
    if (!dragId) {
      setOverColumn(null)
      return
    }

    if (dragId.startsWith("stage:")) {
      const stageId = dragId.slice("stage:".length)
      const status = getStatus(stageId)
      if (columnId === "backlog" || columnId === "todo") {
        if (status !== "notStarted") setStatus(stageId, "notStarted")
        updatePrep(stageId, columnId)
      } else if (columnId === "doing") {
        setStatus(stageId, "inProgress")
      } else if (columnId === "done") {
        setStatus(stageId, "done")
      }
    } else if (dragId.startsWith("task:")) {
      moveTask(dragId.slice("task:".length), columnId)
    }

    setDragId(null)
    setOverColumn(null)
  }

  const columnTitle = (id: ScrumColumnId) => {
    const col = scrumColumns.find((c) => c.id === id)
    return col ? pick(locale, col.title) : id
  }

  const editingTask = editingTaskId
    ? tasks.find((task) => task.id === editingTaskId)
    : undefined

  if (!statusReady || !boardReady) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "scrum.title")}
        </h1>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
            {pick(locale, scrumMeta.sprintLabel)}
          </span>
          <span className="text-xs text-slate-500">
            {pick(locale, scrumMeta.sprintWindow)}
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-950">
          {t(locale, "scrum.title")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {t(locale, "scrum.subtitle")}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {t(locale, "scrum.dragHint")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUMN_IDS.map((columnId) => {
          const cards = cardsByColumn[columnId]
          const isOver = overColumn === columnId && dragId !== null
          return (
            <section
              key={columnId}
              className={cn(
                "rounded border bg-white p-3 transition-colors",
                isOver
                  ? "border-[var(--signal)] bg-[var(--signal-soft)]"
                  : "border-slate-200",
              )}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = "move"
                setOverColumn(columnId)
              }}
              onDragLeave={() => {
                setOverColumn((cur) => (cur === columnId ? null : cur))
              }}
              onDrop={(e) => {
                e.preventDefault()
                handleDrop(columnId)
              }}
            >
              <header className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  {columnTitle(columnId)}
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                    {cards.length}
                  </span>
                  <button
                    type="button"
                    className="neo-theme-btn"
                    title={t(locale, "scrum.addTask")}
                    aria-label={t(locale, "scrum.addTask")}
                    onClick={() => addTask(columnId)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </header>
              <ul className="min-h-[4.5rem] space-y-2">
                {cards.length === 0 && (
                  <li className="rounded border border-dashed border-slate-200 px-3 py-6 text-center text-[11px] text-slate-400">
                    {t(locale, "scrum.dropHere")}
                  </li>
                )}
                {cards.map((card) => {
                  const isStage = card.kind === "stage"
                  return (
                    <li
                      key={card.id}
                      draggable
                      onDragStart={(e) => {
                        setDragId(card.id)
                        e.dataTransfer.setData("text/plain", card.id)
                        e.dataTransfer.effectAllowed = "move"
                      }}
                      onDragEnd={() => {
                        setDragId(null)
                        setOverColumn(null)
                      }}
                      className={cn(
                        "group relative rounded border border-slate-100 bg-slate-50 p-3 cursor-grab active:cursor-grabbing hover:border-slate-300",
                        dragId === card.id && "opacity-50",
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-1.5 pr-6">
                        <p className="font-mono text-[10px] text-slate-400">
                          {isStage ? card.stageId : card.taskId}
                        </p>
                        {isStage ? (
                          <>
                            <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-600">
                              {t(locale, "scrum.stageCard")}
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-1.5 py-0.5 text-[9px] font-medium",
                                stageStatusBadgeClass[card.status],
                              )}
                            >
                              {t(locale, `status.${card.status}`)}
                            </span>
                          </>
                        ) : (
                          <span className="rounded bg-slate-200/80 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-600">
                            {t(locale, "scrum.taskCard")}
                          </span>
                        )}
                      </div>
                      {!isStage && (
                        <button
                          type="button"
                          className="absolute right-2 top-2 rounded p-1 text-slate-400 opacity-0 transition hover:bg-rose-50 hover:text-rose-700 group-hover:opacity-100"
                          title={t(locale, "scrum.deleteTask")}
                          aria-label={t(locale, "scrum.deleteTask")}
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteTask(card.taskId)
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      <button
                        type="button"
                        className="mt-1 w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (card.kind === "task") setEditingTaskId(card.taskId)
                        }}
                        onMouseDown={(e) => {
                          // Allow click-to-edit without starting a drag awkwardly
                          if (card.kind === "task") e.stopPropagation()
                        }}
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {pick(locale, card.title)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {isStage
                            ? `${t(locale, "stages.manager")}: ${pick(locale, card.detail)}`
                            : pick(locale, card.detail)}
                        </p>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      {mounted &&
        editingTask &&
        createPortal(
          <TaskEditDialog
            locale={locale}
            titleId={editTitleId}
            task={editingTask}
            onClose={() => setEditingTaskId(null)}
            onSave={(title, detail) =>
              saveTaskEdit(editingTask.id, title, detail)
            }
            onDelete={() => deleteTask(editingTask.id)}
          />,
          document.body,
        )}
    </div>
  )
}

function TaskEditDialog({
  locale,
  titleId,
  task,
  onClose,
  onSave,
  onDelete,
}: {
  locale: Locale
  titleId: string
  task: ScrumTask
  onClose: () => void
  onSave: (title: string, detail: string) => void
  onDelete: () => void
}) {
  const [title, setTitle] = useState(pick(locale, task.title))
  const [detail, setDetail] = useState(pick(locale, task.detail))

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form
        className="w-full max-w-md rounded-[var(--radius-md)] border border-[var(--hairline)] bg-[var(--deck)] p-5 shadow-[var(--shadow-raised-sm)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={(e) => {
          e.preventDefault()
          onSave(title, detail)
        }}
      >
        <h2
          id={titleId}
          className="text-sm font-semibold text-[var(--ink)]"
        >
          {t(locale, "scrum.editTask")} · {task.id}
        </h2>
        <label className="mt-4 block text-xs font-medium text-[var(--ink)]">
          {t(locale, "scrum.taskTitle")}
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="neo-recessed mt-1 w-full px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block text-xs font-medium text-[var(--ink)]">
          {t(locale, "scrum.taskDetail")}
          <textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            rows={3}
            className="neo-recessed mt-1 w-full resize-y px-3 py-2 text-sm"
          />
        </label>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-2 py-1.5 text-xs text-rose-700 hover:bg-rose-50"
            onClick={onDelete}
          >
            <Trash2 size={13} />
            {t(locale, "scrum.deleteTask")}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              className="neo-theme-btn w-auto px-3 text-xs"
              onClick={onClose}
            >
              {t(locale, "cards.cancel")}
            </button>
            <button
              type="submit"
              className="rounded-[var(--radius-sm)] bg-[var(--ink)] px-3 py-1.5 text-xs font-medium text-[var(--deck)]"
            >
              {t(locale, "cards.save")}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
