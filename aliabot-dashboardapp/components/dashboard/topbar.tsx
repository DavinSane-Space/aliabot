import Link from "next/link"
import type { Agent } from "@/lib/supabase/agent"
import { agentStatusMeta } from "@/lib/agent-status"
import { BotAvatar } from "./brand"

export function Topbar({
  agent,
  businessName,
}: {
  agent: Agent | null
  businessName: string | null
}) {
  const meta = agent ? agentStatusMeta[agent.status] : null

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/70 px-5 backdrop-blur-xl">
      {agent ? (
        <div className="flex items-center gap-3">
          <BotAvatar className="size-9" color="#2563EB" />
          <div>
            <p className="text-sm font-semibold leading-tight text-[#11143A]">{agent.name}</p>
            {meta && (
              <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: meta.text }}>
                <span className="size-1.5 rounded-full" style={{ background: meta.dot }} />
                {meta.label}
              </span>
            )}
          </div>
        </div>
      ) : (
        <p className="text-sm text-[#4A5080]">Sin agente asociado</p>
      )}

      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/configuracion"
          aria-label="Ir a configuración"
          className="grid size-10 place-items-center rounded-full grad-primary text-sm font-semibold text-white"
        >
          {(businessName ?? "?").slice(0, 2).toUpperCase()}
        </Link>
      </div>
    </header>
  )
}
