"use client"

import { useRef, useState, useTransition } from "react"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { addDocumentSource } from "@/lib/actions/knowledge-actions"
import { KnowledgeSourceList } from "./source-list"
import type { KnowledgeSource } from "@/lib/supabase/knowledge"

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentSection({
  agentId,
  sources,
  fileSizes,
  limitReached,
}: {
  agentId: string
  sources: KnowledgeSource[]
  fileSizes: Record<string, number>
  limitReached: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  function uploadFile(file: File) {
    setError(null)
    const formData = new FormData()
    formData.set("file", file)
    startTransition(async () => {
      const result = await addDocumentSource(agentId, formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          const file = e.dataTransfer.files?.[0]
          if (file) uploadFile(file)
        }}
        className={cn(
          "card-surface flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
          dragOver ? "border-[#2563EB] bg-[#2563EB]/[0.06]" : "border-[#C7D9FE]",
          limitReached && "pointer-events-none opacity-50",
        )}
      >
        <Upload className="size-6 text-[#2563EB]" />
        <p className="text-sm text-[#11143A]">Arrastra un PDF aquí o</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending || limitReached}
          className="rounded-lg border border-[#2563EB] px-3.5 py-1.5 text-sm font-medium text-[#2563EB] transition-colors hover:bg-[#2563EB]/5 disabled:opacity-40"
        >
          {isPending ? "Subiendo..." : "Elegir archivo"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) uploadFile(file)
            e.target.value = ""
          }}
        />
      </div>
      {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      {limitReached && (
        <p className="text-sm text-[#B45309]">Alcanzaste el límite de páginas de tu plan.</p>
      )}

      <KnowledgeSourceList
        sources={sources}
        emptyMessage="Todavía no has subido ningún documento."
        subtitle={(s) => {
          const size = fileSizes[`${s.id}-${s.file_name}`]
          return size ? `${s.file_name} · ${formatBytes(size)}` : (s.file_name ?? "")
        }}
      />
    </div>
  )
}
