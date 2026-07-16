"use client"

import { useState, useTransition, type FormEvent } from "react"
import Link from "next/link"
import { Mail, Trash2, Crown, Info } from "lucide-react"
import { inviteMember, removeMember } from "@/lib/actions/team-actions"
import { getPlanMemberLimit } from "@/lib/team-plan"
import type { BusinessMember } from "@/lib/supabase/team"

function MemberRow({ member }: { member: BusinessMember }) {
  const [isPending, startTransition] = useTransition()

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div>
        <p className="text-sm font-medium text-[#11143A]">{member.email}</p>
        <p className="text-xs text-[#4A5080]">
          {member.status === "active" ? "Activo" : "Invitación pendiente"}
        </p>
      </div>
      <button
        onClick={() =>
          startTransition(async () => {
            await removeMember(member.id)
          })
        }
        disabled={isPending}
        aria-label="Quitar miembro"
        className="grid size-7 place-items-center rounded-lg text-[#9CA3C0] transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444] disabled:opacity-40"
      >
        <Trash2 className="size-3.5" />
      </button>
    </li>
  )
}

export function TeamManager({
  businessId,
  ownerEmail,
  members,
  plan,
}: {
  businessId: string
  ownerEmail: string
  members: BusinessMember[]
  plan: string | null
}) {
  const [email, setEmail] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const limit = getPlanMemberLimit(plan)
  const currentSize = members.length + 1
  const limitReached = currentSize >= limit
  const isUpgradeable = plan !== "pro" && plan !== "admin"
  const pct = Number.isFinite(limit) ? Math.min(100, (currentSize / limit) * 100) : 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await inviteMember(businessId, email)
      if (result?.error) setError(result.error)
      else setEmail("")
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="card-surface rounded-2xl p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[#4A5080]">Miembros de tu equipo</span>
          <span className="font-medium text-[#11143A]">
            {currentSize} / {Number.isFinite(limit) ? limit : "∞"}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E2E5F0]">
          <div className="h-full rounded-full grad-primary" style={{ width: `${pct}%` }} />
        </div>
        {limitReached && isUpgradeable && (
          <p className="mt-2 text-xs text-[#B45309]">
            Alcanzaste el límite de tu plan.{" "}
            <Link href="/planes" className="font-medium text-[#2563EB] hover:underline">
              Mejora a Pro
            </Link>{" "}
            para invitar hasta 3 miembros.
          </p>
        )}
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-[#2563EB]/20 bg-[#2563EB]/[0.05] px-4 py-3 text-sm text-[#4A5080]">
        <Info className="mt-0.5 size-4 shrink-0 text-[#2563EB]" />
        Las invitaciones se guardan como pendientes — el envío de correos y el flujo de aceptación
        se conectarán próximamente.
      </div>

      <form
        onSubmit={handleSubmit}
        className="card-surface flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@tunegocio.com"
          disabled={limitReached}
          className="h-10 flex-1 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none focus:border-[#2563EB] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isPending || limitReached || !email.trim()}
          className="flex items-center justify-center gap-2 rounded-lg grad-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:pointer-events-none disabled:opacity-40"
        >
          <Mail className="size-4" />
          {isPending ? "Invitando..." : "Invitar"}
        </button>
      </form>
      {error && <p className="text-sm text-[#EF4444]">{error}</p>}
      {limitReached && (
        <p className="text-sm text-[#B45309]">
          Alcanzaste el límite de miembros de tu plan, no puedes invitar a más.
        </p>
      )}

      <div className="card-surface rounded-2xl p-5">
        <ul className="divide-y divide-[#E2E5F0]">
          <li className="flex items-center gap-2.5 py-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full grad-primary text-white">
              <Crown className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-[#11143A]">{ownerEmail}</p>
              <p className="text-xs text-[#4A5080]">Propietario</p>
            </div>
          </li>
          {members.map((m) => (
            <MemberRow key={m.id} member={m} />
          ))}
        </ul>
      </div>
    </div>
  )
}
