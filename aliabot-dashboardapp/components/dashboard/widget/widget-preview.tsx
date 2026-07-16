import { cn } from "@/lib/utils"
import type { WidgetPosition } from "@/lib/supabase/widget"

export function WidgetPreview({
  primaryColor,
  position,
  welcomeMessage,
  botDisplayName,
}: {
  primaryColor: string
  position: WidgetPosition
  welcomeMessage: string
  botDisplayName: string
}) {
  return (
    <div className="card-surface flex flex-col gap-2 rounded-2xl p-4">
      <p className="text-xs font-medium text-[#4A5080]">Vista previa</p>
      <div className="relative h-[380px] overflow-hidden rounded-xl border border-[#E2E5F0] bg-[#F8F9FF]">
        <div
          className={cn(
            "absolute bottom-4 flex w-64 flex-col overflow-hidden rounded-2xl border border-[#E2E5F0] bg-white shadow-lg",
            position === "bottom-right" ? "right-4" : "left-4",
          )}
        >
          <div
            className="px-4 py-3 text-sm font-medium text-white"
            style={{ background: primaryColor }}
          >
            {botDisplayName || "Asistente"}
          </div>
          <div className="p-3">
            <div className="rounded-xl rounded-tl-sm bg-[#F1F3FC] px-3 py-2 text-xs text-[#11143A]">
              {welcomeMessage || "¡Hola! ¿En qué puedo ayudarte hoy?"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
