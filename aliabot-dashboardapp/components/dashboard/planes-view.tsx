"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"
import { AliabotLogo } from "@/components/dashboard/brand"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Plan = {
  id: string
  name: string
  price: string
  highlight?: boolean
  features: string[]
}

const PLANS: Plan[] = [
  {
    id: "basico",
    name: "Básico",
    price: "$49.900 COP/mes",
    features: [
      "1 chatbot",
      "Hasta 300 páginas",
      "2.000 mensajes/mes",
      "1 miembro",
      "Solo widget web",
      "Reentrenamiento manual",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99.900 COP/mes",
    highlight: true,
    features: [
      "1 chatbot",
      "Hasta 1.500 páginas",
      "8.000 mensajes/mes",
      "3 miembros",
      "Widget web + WhatsApp Business con escalamiento a humano",
      "Reentrenamiento automático semanal",
    ],
  },
]

export function PlanesView({ hasAccess }: { hasAccess: boolean }) {
  const [pendingPlan, setPendingPlan] = useState<string | null>(null)

  function handleChoosePlan(planId: string) {
    setPendingPlan(planId)
  }

  return (
    <div className="flex min-h-dvh flex-col items-center bg-background px-4 py-16">
      {hasAccess && (
        <Link
          href="/"
          className="mb-6 flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
        >
          <ArrowLeft className="size-4" />
          Volver al dashboard
        </Link>
      )}

      <div className="mb-4 flex justify-center">
        <AliabotLogo />
      </div>

      <div className="mb-12 max-w-lg text-center">
        <h1 className="mb-2 text-2xl font-semibold text-white">Elige tu plan</h1>
        <p className="text-sm text-white/50">
          Tu prueba gratis terminó o tu plan no está activo. Elige un plan para
          seguir usando Aliabot.
        </p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border border-white/10 bg-card p-8",
              plan.highlight && "border-brand/60 shadow-[0_4px_30px_rgba(37,99,235,0.25)]",
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full grad-primary px-3 py-1 text-xs font-semibold text-white shadow-[0_4px_20px_rgba(37,99,235,0.35)]">
                MÁS POPULAR
              </span>
            )}

            <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
            <p className="mt-1 mb-6 text-2xl font-bold grad-text">{plan.price}</p>

            <ul className="mb-8 flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              onClick={() => handleChoosePlan(plan.id)}
              className={cn(
                "w-full",
                plan.highlight
                  ? "grad-primary text-white hover:opacity-95"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              )}
            >
              Elegir plan
            </Button>

            {pendingPlan === plan.id && (
              <p className="mt-3 text-center text-xs text-white/50">
                Próximamente. Los pagos se habilitarán pronto.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
