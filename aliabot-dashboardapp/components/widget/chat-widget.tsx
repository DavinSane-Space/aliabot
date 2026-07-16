"use client"

import { useEffect, useRef, useState } from "react"
import type { PublicWidgetData } from "@/lib/widget-public"

type ChatMessage = {
  id: string
  role: "visitor" | "bot"
  content: string
  isError?: boolean
}

export function ChatWidget({
  widget,
  visitorId,
}: {
  widget: PublicWidgetData
  visitorId: string | null
}) {
  const storageKey = `aliabot_conversation_${widget.agentId}_${visitorId ?? "anon"}`
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem(storageKey)
      if (stored) setConversationId(stored)
    } catch {
      // sessionStorage puede no estar disponible (modo privado); no es crítico.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  async function ensureConversation(): Promise<string> {
    if (conversationId) return conversationId

    const res = await fetch("/api/widget/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId: widget.agentId, visitorId }),
    })

    if (!res.ok) throw new Error("No se pudo crear la conversación")

    const data = (await res.json()) as { conversationId: string }
    setConversationId(data.conversationId)
    try {
      window.sessionStorage.setItem(storageKey, data.conversationId)
    } catch {
      // no-op
    }
    return data.conversationId
  }

  async function handleSend() {
    const content = input.trim()
    if (!content || sending) return

    setInput("")
    setSending(true)
    setMessages((prev) => [...prev, { id: `local-${Date.now()}`, role: "visitor", content }])

    try {
      const convId = await ensureConversation()

      const res = await fetch("/api/widget/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convId, content }),
      })

      if (!res.ok) throw new Error("No se pudo enviar el mensaje")

      const data = (await res.json()) as {
        botMessage: { id: string; content: string }
      }

      setMessages((prev) => [...prev, { id: data.botMessage.id, role: "bot", content: data.botMessage.content }])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "bot",
          content: "No se pudo enviar tu mensaje. Intenta de nuevo.",
          isError: true,
        },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-dvh w-full flex-col bg-white">
      <div
        className="flex items-center gap-2.5 px-4 py-3.5 text-sm font-semibold text-white"
        style={{ background: widget.primaryColor }}
      >
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs"
          aria-hidden
        >
          {widget.displayName.trim().charAt(0).toUpperCase() || "A"}
        </span>
        {widget.displayName}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto px-3.5 py-4">
        <div className="flex justify-start">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#F1F3FC] px-3.5 py-2.5 text-sm text-[#11143A]">
            {widget.welcomeMessage}
          </div>
        </div>

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "visitor" ? "justify-end" : "justify-start"}`}>
            <div
              className={
                message.role === "visitor"
                  ? "max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white"
                  : `max-w-[85%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm ${
                      message.isError ? "bg-red-50 text-red-600" : "bg-[#F1F3FC] text-[#11143A]"
                    }`
              }
              style={message.role === "visitor" ? { background: widget.primaryColor } : undefined}
            >
              {message.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-tl-sm bg-[#F1F3FC] px-3.5 py-2.5 text-sm text-[#8A8FB8]">
              Escribiendo…
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-[#E2E5F0] px-3 py-3">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu mensaje…"
          disabled={sending}
          className="flex-1 rounded-full border border-[#E2E5F0] bg-[#F8F9FF] px-4 py-2 text-sm text-[#11143A] outline-none placeholder:text-[#8A8FB8] focus:border-[#2563EB]"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-white disabled:opacity-40"
          style={{ background: widget.primaryColor }}
          aria-label="Enviar mensaje"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4 12L20 4L13 20L11 13L4 12Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
