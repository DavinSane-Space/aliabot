import { agentStatusMeta } from "@/lib/agent-status"
import type { Agent } from "@/lib/supabase/agent"
import { BotAvatar } from "@/components/dashboard/brand"
import { PublishButton } from "@/components/dashboard/publish-button"

const statusDescription: Record<Agent["status"], string> = {
  draft: "Tu agente todavía no está publicado.",
  live: "Tu agente está publicado y respondiendo a los visitantes.",
  paused: "Tu agente está pausado y no responde a los visitantes.",
}

export function AgentStatusCard({
  agent,
  hasReadyKnowledge,
}: {
  agent: Agent
  hasReadyKnowledge: boolean
}) {
  const meta = agentStatusMeta[agent.status]

  return (
    <div className="card-surface flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-4">
        <BotAvatar className="size-14" color="#2563EB" />
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold text-[#11143A]">{agent.name}</h1>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ background: meta.bg, color: meta.text }}
            >
              <span className="size-1.5 rounded-full" style={{ background: meta.dot }} />
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#4A5080]">{statusDescription[agent.status]}</p>
        </div>
      </div>

      {agent.status !== "live" && (
        <PublishButton agentId={agent.id} disabled={!hasReadyKnowledge} />
      )}
    </div>
  )
}
