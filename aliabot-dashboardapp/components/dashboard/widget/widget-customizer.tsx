"use client"

import { useState, useTransition } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateWidgetConfig } from "@/lib/actions/widget-actions"
import type { WidgetConfig, WidgetPosition } from "@/lib/supabase/widget"
import { WidgetPreview } from "./widget-preview"

const COLOR_OPTIONS = [
  { id: "primary", label: "Azul + Morado", value: "linear-gradient(135deg, #2563EB, #7C3AED)" },
  { id: "blue", label: "Azul", value: "#2563EB" },
  { id: "violet", label: "Morado", value: "#7C3AED" },
  {
    id: "aurora",
    label: "Aurora",
    value: "linear-gradient(135deg, #6B9BFC, #A78BFA, #C084FC)",
  },
]

const POSITIONS: { id: WidgetPosition; label: string }[] = [
  { id: "bottom-right", label: "Abajo a la derecha" },
  { id: "bottom-left", label: "Abajo a la izquierda" },
]

export function WidgetCustomizer({ agentId, config }: { agentId: string; config: WidgetConfig }) {
  const [primaryColor, setPrimaryColor] = useState(config.primary_color)
  const [position, setPosition] = useState<WidgetPosition>(config.position)
  const [welcomeMessage, setWelcomeMessage] = useState(config.welcome_message)
  const [botDisplayName, setBotDisplayName] = useState(config.bot_display_name ?? "")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await updateWidgetConfig(agentId, {
        primaryColor,
        position,
        welcomeMessage,
        botDisplayName,
      })
      if (result?.error) setError(result.error)
      else {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <div className="card-surface flex flex-col gap-4 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-[#11143A]">Personalización</h2>

        <div>
          <p className="mb-2 text-sm font-medium text-[#11143A]">Color</p>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setPrimaryColor(c.value)}
                title={c.label}
                aria-label={c.label}
                className={cn(
                  "grid size-9 place-items-center rounded-full transition-all",
                  primaryColor === c.value
                    ? "ring-2 ring-[#2563EB] ring-offset-2"
                    : "hover:scale-105",
                )}
                style={{ background: c.value }}
              >
                {primaryColor === c.value && <Check className="size-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[#11143A]">Posición</p>
          <div className="flex gap-2">
            {POSITIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPosition(p.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                  position === p.id
                    ? "border-[#2563EB] bg-[#2563EB]/10 text-[#2563EB]"
                    : "border-[#E2E5F0] text-[#4A5080] hover:bg-[#F1F3FC]",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#11143A]">Nombre visible del bot</label>
          <input
            value={botDisplayName}
            onChange={(e) => setBotDisplayName(e.target.value)}
            placeholder="Asistente de tu negocio"
            className="h-10 rounded-lg border border-[#E2E5F0] bg-white px-3 text-sm text-[#11143A] placeholder:text-[#9CA3C0] outline-none focus:border-[#2563EB]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#11143A]">Mensaje de bienvenida</label>
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            rows={3}
            className="rounded-lg border border-[#E2E5F0] bg-white px-3 py-2 text-sm text-[#11143A] outline-none focus:border-[#2563EB]"
          />
        </div>

        {error && <p className="text-sm text-[#EF4444]">{error}</p>}

        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex w-fit items-center gap-2 rounded-lg grad-primary px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
        >
          {isPending ? "Guardando..." : saved ? "Guardado ✓" : "Guardar cambios"}
        </button>
      </div>

      <WidgetPreview
        primaryColor={primaryColor}
        position={position}
        welcomeMessage={welcomeMessage}
        botDisplayName={botDisplayName}
      />
    </div>
  )
}
