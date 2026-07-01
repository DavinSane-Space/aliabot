"use client"

import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { agents, statusMeta, type Agent } from "@/lib/dashboard-data"
import { BotAvatar } from "./brand"

export function AgentList({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (agent: Agent) => void
}) {
  return (
    <div className="flex w-[300px] shrink-0 flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
          AI Agents
        </h2>
        <button
          aria-label="Add agent"
          className="grid size-7 place-items-center rounded-lg border border-border bg-white/[0.03] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {agents.map((agent, i) => {
          const meta = statusMeta[agent.status]
          const isActive = agent.id === selectedId
          return (
            <button
              key={agent.id}
              onClick={() => onSelect(agent)}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                "animate-fade-up group relative flex flex-col gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                isActive
                  ? "border-brand/50 bg-brand/[0.08] shadow-[0_4px_20px_rgba(37,99,235,0.18)]"
                  : "border-border bg-card/60 hover:-translate-y-0.5 hover:border-white/15 hover:bg-card",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-4 h-8 w-1 rounded-r-full grad-primary" />
              )}
              <div className="flex items-start gap-3">
                <BotAvatar className="size-11" color={agent.color} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {agent.name}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1.5 text-xs">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        agent.status === "live" && "animate-pulse-ring",
                      )}
                      style={{ background: meta.dot }}
                    />
                    <span style={{ color: meta.text }}>{meta.label}</span>
                  </span>
                  <p className="mt-1 text-xs text-white/45">{agent.model}</p>
                </div>
              </div>
              <p className="text-xs text-white/45">
                {agent.messagesToday} msgs today
              </p>
            </button>
          )
        })}
      </div>

      <button className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-brand/40 bg-brand/[0.04] py-3 text-sm font-medium text-brand-soft transition-colors hover:bg-brand/[0.08]">
        <Plus className="size-4" />
        Create Agent
      </button>
    </div>
  )
}
