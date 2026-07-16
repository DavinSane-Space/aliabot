"use client"

import { useState, type FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"

type Status = "idle" | "loading" | "error" | "success"

export function PasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (password.length < 8) {
      setStatus("error")
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.")
      return
    }

    if (password !== confirmPassword) {
      setStatus("error")
      setErrorMessage("Las contraseñas no coinciden.")
      return
    }

    setStatus("loading")
    setErrorMessage("")

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setStatus("error")
      setErrorMessage(error.message || "No pudimos actualizar la contraseña.")
      return
    }

    setPassword("")
    setConfirmPassword("")
    setStatus("success")
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#11143A]">Nueva contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 8 caracteres"
          className="h-10 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none focus:border-[#2563EB]"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#11143A]">Confirmar contraseña</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="h-10 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] outline-none focus:border-[#2563EB]"
        />
      </div>
      {status === "error" && <p className="text-sm text-[#EF4444]">{errorMessage}</p>}
      {status === "success" && (
        <p className="text-sm text-[#15803D]">Contraseña actualizada correctamente.</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex h-10 w-fit items-center gap-2 rounded-lg grad-primary px-4 text-sm font-medium text-white transition-opacity disabled:opacity-40"
      >
        {status === "loading" ? "Guardando..." : "Actualizar contraseña"}
      </button>
    </form>
  )
}
