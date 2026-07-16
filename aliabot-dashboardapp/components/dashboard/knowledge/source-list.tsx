"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteKnowledgeSource } from "@/lib/actions/knowledge-actions"
import { knowledgeStatusMeta } from "@/lib/knowledge-status"
import type { KnowledgeSource } from "@/lib/supabase/knowledge"

function SourceRow({ source, subtitle }: { source: KnowledgeSource; subtitle: string }) {
  const [isPending, startTransition] = useTransition()
  const meta = knowledgeStatusMeta[source.status]

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#11143A]">{source.title}</p>
        <p className="truncate text-xs text-[#4A5080]">{subtitle}</p>
        {source.status === "error" && source.error_message && (
          <p className="mt-0.5 text-xs text-[#B91C1C]">{source.error_message}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{ background: meta.bg, color: meta.text }}
        >
          {meta.label}
        </span>
        <button
          onClick={() => startTransition(async () => { await deleteKnowledgeSource(source.id) })}
          disabled={isPending}
          aria-label="Eliminar"
          className="grid size-7 place-items-center rounded-lg text-[#9CA3C0] transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444] disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  )
}

export function KnowledgeSourceList({
  sources,
  emptyMessage,
  subtitle,
}: {
  sources: KnowledgeSource[]
  emptyMessage: string
  subtitle: (source: KnowledgeSource) => string
}) {
  if (sources.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-6 text-center">
        <p className="text-sm text-[#4A5080]">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="card-surface rounded-2xl p-5">
      <ul className="divide-y divide-[#E2E5F0]">
        {sources.map((s) => (
          <SourceRow key={s.id} source={s} subtitle={subtitle(s)} />
        ))}
      </ul>
    </div>
  )
}
