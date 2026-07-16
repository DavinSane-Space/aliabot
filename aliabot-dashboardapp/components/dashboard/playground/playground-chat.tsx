"use client"

import { useRef, useState, type FormEvent } from "react"
import { Send, Eraser, Sparkles } from "lucide-react"
import { BotAvatar } from "@/components/dashboard/brand"
import type { Agent } from "@/lib/supabase/agent"

type ChatMessage = {
  id: string
  role: "user" | "bot"
  text: string
}

export function PlaygroundChat({ agent, aiConnected }: { agent: Agent; aiConnected: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || !aiConnected) return

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text }
    setMessages((prev) => [...prev, userMsg])
    setInput("")

    // TODO: once OPENAI_API_KEY is connected, call the real playground endpoint:
    // const res = await fetch(`/api/agents/${agent.id}/playground`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message: text }),
    // })
    // const { reply } = await res.json()
    // setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", text: reply }])
  }

  return (
    <div className="card-surface flex h-[calc(100dvh-140px)] flex-col rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-[#11143A]">Playground</h1>
          <p className="text-sm text-[#4A5080]">Prueba a {agent.name} y mira cómo responde.</p>
        </div>
        <button
          onClick={() => setMessages([])}
          className="flex items-center gap-2 rounded-lg border border-[#E2E5F0] bg-white px-3 py-1.5 text-xs text-[#4A5080] transition-colors hover:bg-[#F1F3FC]"
        >
          <Eraser className="size-3.5" />
          Limpiar chat
        </button>
      </div>

      {!aiConnected && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#F59E0B]/30 bg-[#F59E0B]/[0.08] px-4 py-3 text-sm text-[#B45309]">
          <Sparkles className="mt-0.5 size-4 shrink-0" />
          El motor de IA aún no está conectado — esta función se activará pronto.
        </div>
      )}

      <div
        ref={scrollRef}
        className="scroll-slim mt-4 flex flex-1 flex-col gap-4 overflow-y-auto pr-1"
      >
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-center">
            <p className="max-w-xs text-sm text-[#9CA3C0]">
              Escribe un mensaje para empezar a probar a {agent.name}.
            </p>
          </div>
        ) : (
          messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-br-md grad-primary px-4 py-3 text-sm text-white">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex items-start gap-3">
                <BotAvatar className="size-9 shrink-0" color="#2563EB" />
                <div className="max-w-[75%] rounded-2xl rounded-tl-md border border-[#E2E5F0] bg-white px-4 py-3 text-sm text-[#11143A]">
                  {msg.text}
                </div>
              </div>
            ),
          )
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 rounded-xl border border-[#E2E5F0] bg-white p-1.5 pl-4 focus-within:border-[#2563EB]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={!aiConnected}
          placeholder={
            aiConnected ? "Escribe un mensaje..." : "El motor de IA aún no está conectado"
          }
          className="flex-1 bg-transparent text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!aiConnected || !input.trim()}
          aria-label="Enviar mensaje"
          className="grid size-9 shrink-0 place-items-center rounded-lg grad-primary text-white transition-transform hover:scale-105 disabled:pointer-events-none disabled:opacity-40"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}
