"use client"

import { useState, useTransition, type FormEvent } from "react"
import { Globe, Info } from "lucide-react"
import { addWebsiteSource } from "@/lib/actions/knowledge-actions"
import { KnowledgeSourceList } from "./source-list"
import type { KnowledgeSource } from "@/lib/supabase/knowledge"

export function WebsiteSection({
  agentId,
  sources,
  limitReached,
}: {
  agentId: string
  sources: KnowledgeSource[]
  limitReached: boolean
}) {
  const [url, setUrl] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await addWebsiteSource(agentId, url)
      if (result?.error) setError(result.error)
      else setUrl("")
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2.5 rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/[0.05] px-4 py-3 text-sm text-[#4A5080]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#2563EB]" />
        El escaneo se activará cuando conectemos el motor de entrenamiento — por ahora se guarda
        en cola.
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-surface flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center"
      >
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://tusitio.com"
          disabled={limitReached}
          className="h-10 flex-1 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none focus:border-[#2563EB] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending || limitReached || !url.trim()}
          className="flex items-center justify-center gap-2 rounded-lg grad-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:pointer-events-none disabled:opacity-40"
        >
          <Globe className="size-4" />
          {isPending ? "Agregando..." : "Escanear sitio"}
        </button>
      </form>
      {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      {limitReached && (
        <p className="text-sm text-[#B45309]">
          Alcanzaste el límite de páginas de tu plan, no puedes agregar más sitios.
        </p>
      )}

      <KnowledgeSourceList
        sources={sources}
        emptyMessage="Todavía no has agregado ningún sitio web."
        subtitle={(s) => s.source_url ?? ""}
      />
    </div>
  )
}
