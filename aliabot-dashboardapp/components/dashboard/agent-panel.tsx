"use client"

import { useRef, useState } from "react"
import {
  Settings2,
  MoreHorizontal,
  Upload,
  Globe,
  MessageSquarePlus,
  FlaskConical,
  Rocket,
  MessageSquare,
  Library,
  Star,
  Clock,
  ArrowUp,
  ArrowDown,
  Eraser,
  Send,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  metrics,
  statusMeta,
  initialChat,
  type Agent,
  type ChatMessage,
  type Metric,
} from "@/lib/dashboard-data"
import { BotAvatar } from "./brand"

const metricIcons: Record<Metric["icon"], LucideIcon> = {
  message: MessageSquare,
  sources: Library,
  satisfaction: Star,
  latency: Clock,
}

const quickActions: { label: string; sub: string; icon: LucideIcon }[] = [
  { label: "Upload Files", sub: "Add docs or PDFs", icon: Upload },
  { label: "Add Website", sub: "Sync a website", icon: Globe },
  { label: "Add Q&A", sub: "Add question/answer", icon: MessageSquarePlus },
  { label: "Test Agent", sub: "Open playground", icon: FlaskConical },
  { label: "Deploy Agent", sub: "Make it live", icon: Rocket },
]

function MetricCard({ metric, index }: { metric: Metric; index: number }) {
  const Icon = metricIcons[metric.icon]
  const TrendIcon = metric.trend === "up" ? ArrowUp : ArrowDown
  return (
    <div
      className="animate-fade-up card-surface group rounded-2xl p-4 transition-colors hover:border-brand/40"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs text-white/50">{metric.label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-white/[0.05] text-brand-soft transition-colors group-hover:bg-brand/15">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
        {metric.value}
      </p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 text-xs",
          metric.trend === "up" ? "text-[#4ade80]" : "text-[#4ade80]",
        )}
      >
        <TrendIcon className="size-3" />
        <span className="text-white/45">{metric.delta}</span>
      </p>
    </div>
  )
}

export function AgentPanel({ agent }: { agent: Agent }) {
  const meta = statusMeta[agent.status]
  const [messages, setMessages] = useState<ChatMessage[]>(initialChat)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      time,
    }
    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "bot",
      text: `Thanks for reaching out! I'm ${agent.name} and I'd be happy to help with "${text}". Based on your knowledge base, here's what I found...`,
      time,
    }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTimeout(() => {
      setMessages((prev) => [...prev, botMsg])
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        })
      })
    }, 500)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-5">
      {/* Agent header card */}
      <div className="card-surface rounded-2xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <BotAvatar className="size-14" color={agent.color} />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-semibold text-white">
                  {agent.name}
                </h1>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{
                    background: `${meta.dot}1f`,
                    color: meta.text,
                  }}
                >
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: meta.dot }}
                  />
                  {meta.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-white/50">{agent.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3.5 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.06]">
              <Settings2 className="size-4" />
              Agent Settings
            </button>
            <button
              aria-label="More options"
              className="grid size-9 place-items-center rounded-xl border border-border bg-white/[0.03] text-white/60 transition-colors hover:bg-white/[0.06]"
            >
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} metric={m} index={i} />
          ))}
        </div>

        {/* Quick actions */}
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.label}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-white/[0.02] p-3 text-left transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-white/[0.05]"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand-soft transition-colors group-hover:grad-primary group-hover:text-white">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium leading-tight text-white">
                    {action.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-white/40">
                    {action.sub}
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Playground */}
      <div className="card-surface flex flex-col rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Playground</h2>
            <p className="text-sm text-white/45">
              Test your agent and see how it responds.
            </p>
          </div>
          <button
            onClick={() => setMessages(initialChat)}
            className="flex items-center gap-2 rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/[0.06]"
          >
            <Eraser className="size-3.5" />
            Clear chat
          </button>
        </div>

        <div
          ref={scrollRef}
          className="scroll-slim mt-4 flex max-h-[340px] flex-col gap-4 overflow-y-auto pr-1"
        >
          {messages.map((msg) =>
            msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-br-md grad-primary px-4 py-3 text-sm text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)]">
                  <p className="mb-0.5 text-[11px] font-medium text-white/70">
                    You
                  </p>
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className="mt-1 text-right text-[10px] text-white/60">
                    {msg.time}
                  </p>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex items-start gap-3">
                <BotAvatar className="size-9 shrink-0" color={agent.color} />
                <div className="max-w-[75%] rounded-2xl rounded-tl-md border border-border bg-white/[0.04] px-4 py-3 text-sm text-white/85">
                  <p className="mb-0.5 text-[11px] font-medium text-brand-soft">
                    {agent.name}
                  </p>
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className="mt-1 text-[10px] text-white/40">{msg.time}</p>
                </div>
              </div>
            ),
          )}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-white/[0.03] p-1.5 pl-4 focus-within:border-brand/50">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.nativeEvent.isComposing &&
                e.keyCode !== 229
              ) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder="Ask something to your agent..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
          <button
            onClick={sendMessage}
            aria-label="Send message"
            className="grid size-9 shrink-0 place-items-center rounded-lg grad-primary text-white transition-transform hover:scale-105"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
