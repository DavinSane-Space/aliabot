"use client"

import { useState, useTransition, type FormEvent } from "react"
import { Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { addQASource, updateQASource, deleteKnowledgeSource } from "@/lib/actions/knowledge-actions"
import type { KnowledgeSource } from "@/lib/supabase/knowledge"

function QAItem({ source }: { source: KnowledgeSource }) {
  const [editing, setEditing] = useState(false)
  const [question, setQuestion] = useState(source.question ?? "")
  const [answer, setAnswer] = useState(source.answer ?? "")
  const [isPending, startTransition] = useTransition()
  const [isDeleting, startDelete] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateQASource(source.id, question, answer)
      if (result?.error) setError(result.error)
      else setEditing(false)
    })
  }

  if (editing) {
    return (
      <li className="card-surface flex flex-col gap-2 rounded-2xl p-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="h-9 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] outline-none focus:border-[#2563EB]"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={2}
          className="rounded-lg border border-[#E2E5F0] bg-white px-3 py-2 text-sm text-[#11143A] outline-none focus:border-[#2563EB]"
        />
        {error && <p className="text-xs text-[#EF4444]">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
          >
            <Check className="size-3.5" /> Guardar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E2E5F0] px-3 py-1.5 text-xs font-medium text-[#4A5080]"
          >
            <X className="size-3.5" /> Cancelar
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="card-surface flex items-start justify-between gap-3 rounded-2xl p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#11143A]">{source.question}</p>
        <p className="mt-1 text-sm text-[#4A5080]">{source.answer}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={() => setEditing(true)}
          aria-label="Editar"
          className="grid size-7 place-items-center rounded-lg text-[#9CA3C0] transition-colors hover:bg-[#2563EB]/10 hover:text-[#2563EB]"
        >
          <Pencil className="size-3.5" />
        </button>
        <button
          onClick={() => startDelete(async () => { await deleteKnowledgeSource(source.id) })}
          disabled={isDeleting}
          aria-label="Eliminar"
          className="grid size-7 place-items-center rounded-lg text-[#9CA3C0] transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444] disabled:opacity-40"
        >
          <Trash2 className="size-3.5" />
        </button>
      </div>
    </li>
  )
}

export function QASection({ agentId, sources }: { agentId: string; sources: KnowledgeSource[] }) {
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await addQASource(agentId, question, answer)
      if (result?.error) setError(result.error)
      else {
        setQuestion("")
        setAnswer("")
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="card-surface flex flex-col gap-3 rounded-2xl p-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#11143A]">Pregunta</label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="¿Cuál es el horario de atención?"
            className="h-10 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none focus:border-[#2563EB]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#11143A]">Respuesta</label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Atendemos de lunes a viernes de 8am a 6pm."
            rows={3}
            className="rounded-lg border border-[#E2E5F0] bg-white px-3 py-2 text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none focus:border-[#2563EB]"
          />
        </div>
        {error && <p className="text-sm text-[#EF4444]">{error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="flex w-fit items-center gap-2 rounded-lg grad-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          <Plus className="size-4" />
          {isPending ? "Agregando..." : "Agregar"}
        </button>
      </form>

      {sources.length === 0 ? (
        <div className="card-surface rounded-2xl p-6 text-center">
          <p className="text-sm text-[#4A5080]">
            Todavía no has agregado preguntas y respuestas.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {sources.map((s) => (
            <QAItem key={s.id} source={s} />
          ))}
        </ul>
      )}
    </div>
  )
}
