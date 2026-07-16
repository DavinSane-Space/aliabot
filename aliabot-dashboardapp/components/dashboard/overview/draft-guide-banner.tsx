import Link from "next/link"
import { Sparkles, ArrowRight } from "lucide-react"

export function DraftGuideBanner() {
  return (
    <Link
      href="/conocimiento"
      className="flex items-center justify-between gap-3 rounded-xl border border-[#2563EB]/25 bg-[#2563EB]/[0.06] px-5 py-3.5 text-sm transition-colors hover:bg-[#2563EB]/[0.1]"
    >
      <span className="flex items-center gap-2.5 text-[#11143A]">
        <Sparkles className="size-4 shrink-0 text-[#2563EB]" />
        Tu agente aún no tiene contenido. Ve a <strong>Conocimiento</strong> para empezar a
        entrenarlo.
      </span>
      <ArrowRight className="size-4 shrink-0 text-[#2563EB]" />
    </Link>
  )
}
