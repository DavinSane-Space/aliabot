"use client"

import { useState, useTransition, type FormEvent } from "react"

export function InlineNameForm({
  label,
  initialValue,
  placeholder,
  onSave,
}: {
  label: string
  initialValue: string
  placeholder?: string
  onSave: (value: string) => Promise<{ error?: string; success?: true }>
}) {
  const [value, setValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await onSave(value)
      if (result?.error) setError(result.error)
      else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label className="text-sm font-medium text-[#11143A]">{label}</label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-10 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none focus:border-[#2563EB]"
        />
      </div>
      <button
        type="submit"
        disabled={isPending || !value.trim()}
        className="flex h-10 w-fit items-center gap-2 rounded-lg grad-primary px-4 text-sm font-medium text-white transition-opacity disabled:opacity-40"
      >
        {isPending ? "Guardando..." : saved ? "Guardado ✓" : "Guardar"}
      </button>
      {error && <p className="text-sm text-[#EF4444]">{error}</p>}
    </form>
  )
}
