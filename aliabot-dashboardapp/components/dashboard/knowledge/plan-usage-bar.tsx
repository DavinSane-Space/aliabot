import Link from "next/link"

export function PlanUsageBar({
  pagesUsed,
  pagesLimit,
  plan,
}: {
  pagesUsed: number
  pagesLimit: number
  plan: string | null
}) {
  const pct = Number.isFinite(pagesLimit) ? Math.min(100, (pagesUsed / pagesLimit) * 100) : 0
  const isUpgradeable = plan !== "pro" && plan !== "admin"
  const limitReached = pagesUsed >= pagesLimit

  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#4A5080]">Uso de páginas de conocimiento</span>
        <span className="font-medium text-[#11143A]">
          {pagesUsed} / {Number.isFinite(pagesLimit) ? pagesLimit : "∞"} páginas usadas
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
          para agregar hasta 1.500 páginas.
        </p>
      )}
    </div>
  )
}
