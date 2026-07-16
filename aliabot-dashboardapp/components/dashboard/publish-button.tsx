"use client"

import { useState, useTransition } from "react"
import { Rocket } from "lucide-react"
import { publishAgent } from "@/lib/actions/agent-actions"

export function PublishButton({ agentId, disabled }: { agentId: string; disabled: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handlePublish() {
    setError(null)
    startTransition(async () => {
      const result = await publishAgent(agentId)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handlePublish}
        disabled={disabled || isPending}
        title={disabled ? "Agrega una fuente de conocimiento lista antes de publicar" : undefined}
        className="flex items-center gap-2 rounded-xl grad-primary px-4 py-2 text-sm font-medium text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-0.5 hover:opacity-95 disabled:pointer-events-none disabled:opacity-40"
      >
        <Rocket className="size-4" />
        {isPending ? "Publicando..." : "Publicar agente"}
      </button>
      {error && <p className="max-w-[220px] text-right text-xs text-[#EF4444]">{error}</p>}
    </div>
  )
}
