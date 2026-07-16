import Link from "next/link"

const PLAN_LABELS: Record<string, string> = {
  basico: "Básico",
  pro: "Pro",
  admin: "Administrador",
}

export function PlanCard({
  plan,
  subscriptionStatus,
  trialEndsAt,
}: {
  plan: string | null
  subscriptionStatus: string
  trialEndsAt: string | null
}) {
  const label = plan ? (PLAN_LABELS[plan] ?? plan) : "Sin plan"

  return (
    <div className="card-surface flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
      <div>
        <h2 className="text-sm font-semibold text-[#11143A]">Plan actual</h2>
        <p className="mt-1 text-sm text-[#4A5080]">
          {label}
          {subscriptionStatus === "trial" && trialEndsAt && (
            <>
              {" "}
              · prueba gratis hasta{" "}
              {new Date(trialEndsAt).toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </>
          )}
        </p>
      </div>
      <Link
        href="/planes"
        className="rounded-lg border border-[#E2E5F0] bg-white px-4 py-2 text-sm font-medium text-[#2563EB] transition-colors hover:bg-[#F1F3FC]"
      >
        Ver planes
      </Link>
    </div>
  )
}
