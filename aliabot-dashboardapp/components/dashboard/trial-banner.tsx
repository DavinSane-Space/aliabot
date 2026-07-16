import Link from "next/link"
import { Sparkles } from "lucide-react"

export function TrialBanner({ daysLeft }: { daysLeft: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl grad-primary px-5 py-3.5 shadow-[0_4px_20px_rgba(37,99,235,0.25)]">
      <div className="flex items-center gap-2.5 text-sm font-medium text-white">
        <Sparkles className="size-4 shrink-0" />
        {daysLeft === 1
          ? "Te queda 1 día de prueba gratis."
          : `Te quedan ${daysLeft} días de prueba gratis.`}
      </div>
      <Link
        href="/planes"
        className="rounded-lg bg-white/15 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/25"
      >
        Ver planes
      </Link>
    </div>
  )
}
