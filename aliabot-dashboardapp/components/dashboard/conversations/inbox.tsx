"use client"

import { useState, useTransition } from "react"
import { MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { timeAgo } from "@/lib/time"
import { conversationStatusMeta, type ConversationStatus } from "@/lib/conversation-status"
import { getConversationMessages, updateConversationStatus } from "@/lib/actions/conversation-actions"
import type { ConversationListItem, MessageItem } from "@/lib/supabase/conversations"

const FILTERS: { id: ConversationStatus | "all"; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "active", label: "Activas" },
  { id: "resolved", label: "Resueltas" },
  { id: "escalated", label: "Escaladas" },
]

const STATUS_OPTIONS: ConversationStatus[] = ["active", "resolved", "escalated"]

export function Inbox({ conversations }: { conversations: ConversationListItem[] }) {
  const [filter, setFilter] = useState<ConversationStatus | "all">("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [isLoadingThread, startLoadThread] = useTransition()
  const [isUpdatingStatus, startUpdateStatus] = useTransition()

  const filtered = filter === "all" ? conversations : conversations.filter((c) => c.status === filter)
  const selected = conversations.find((c) => c.id === selectedId) ?? null

  function selectConversation(id: string) {
    setSelectedId(id)
    startLoadThread(async () => {
      const result = await getConversationMessages(id)
      setMessages(result.messages ?? [])
    })
  }

  function handleStatusChange(status: ConversationStatus) {
    if (!selected || selected.status === status) return
    startUpdateStatus(async () => {
      await updateConversationStatus(selected.id, status)
    })
  }

  return (
    <div className="grid h-[calc(100dvh-140px)] grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
      <div className="card-surface flex flex-col overflow-hidden rounded-2xl">
        <div className="flex flex-wrap gap-1.5 border-b border-[#E2E5F0] p-3">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                filter === f.id
                  ? "bg-[#2563EB]/10 text-[#2563EB]"
                  : "text-[#4A5080] hover:bg-[#F1F3FC]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="scroll-slim flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <MessageSquare className="size-8 text-[#C7D9FE]" />
              <p className="text-sm text-[#4A5080]">
                {conversations.length === 0
                  ? "Aquí verás las conversaciones de tus visitantes en cuanto publiques tu agente."
                  : "No hay conversaciones con este estado."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#E2E5F0]">
              {filtered.map((c) => {
                const meta = conversationStatusMeta[c.status]
                const isActive = c.id === selectedId
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => selectConversation(c.id)}
                      className={cn(
                        "flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors",
                        isActive ? "bg-[#2563EB]/[0.06]" : "hover:bg-[#F1F3FC]",
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-medium text-[#11143A]">
                          Visitante {c.visitorId.slice(0, 8)}
                        </p>
                        <span className="shrink-0 text-[11px] text-[#9CA3C0]">
                          {timeAgo(c.lastMessageAt)}
                        </span>
                      </div>
                      <span
                        className="w-fit rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ background: meta.bg, color: meta.text }}
                      >
                        {meta.label}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      <div className="card-surface flex flex-col overflow-hidden rounded-2xl">
        {!selected ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <MessageSquare className="size-8 text-[#C7D9FE]" />
            <p className="text-sm text-[#4A5080]">Selecciona una conversación para ver el detalle.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E5F0] p-4">
              <div>
                <p className="text-sm font-semibold text-[#11143A]">
                  Visitante {selected.visitorId.slice(0, 8)}
                </p>
                <p className="text-xs text-[#4A5080]">Iniciada {timeAgo(selected.startedAt)}</p>
              </div>
              <div className="flex gap-1.5">
                {STATUS_OPTIONS.map((s) => {
                  const meta = conversationStatusMeta[s]
                  const isCurrent = selected.status === s
                  return (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      disabled={isUpdatingStatus || isCurrent}
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-default",
                        isCurrent ? "border-transparent" : "border-[#E2E5F0] text-[#4A5080] hover:bg-[#F1F3FC]",
                      )}
                      style={isCurrent ? { background: meta.bg, color: meta.text } : undefined}
                    >
                      {meta.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="scroll-slim flex-1 overflow-y-auto p-4">
              {isLoadingThread ? (
                <p className="text-sm text-[#9CA3C0]">Cargando mensajes...</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-[#9CA3C0]">Esta conversación todavía no tiene mensajes.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      className={cn("flex", m.role === "visitor" ? "justify-start" : "justify-end")}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm",
                          m.role === "visitor"
                            ? "rounded-tl-md border border-[#E2E5F0] bg-white text-[#11143A]"
                            : m.role === "bot"
                              ? "rounded-tr-md grad-primary text-white"
                              : "rounded-tr-md bg-[#F1F3FC] text-[#11143A]",
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
