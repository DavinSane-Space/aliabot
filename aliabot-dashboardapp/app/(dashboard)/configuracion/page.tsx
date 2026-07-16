import { Database } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getOrCreateAgent } from "@/lib/supabase/agent"
import { updateAgentName } from "@/lib/actions/agent-actions"
import { updateBusinessName } from "@/lib/actions/business-actions"
import { PagePlaceholder } from "@/components/dashboard/page-placeholder"
import { InlineNameForm } from "@/components/dashboard/settings/inline-name-form"
import { PlanCard } from "@/components/dashboard/settings/plan-card"
import { PasswordForm } from "@/components/dashboard/settings/password-form"

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)

  if (!business) {
    return (
      <PagePlaceholder
        icon={Database}
        title="Sin negocio asociado"
        description="Esta cuenta no tiene un negocio en Supabase todavía, así que no hay nada que configurar."
      />
    )
  }

  const agent = await getOrCreateAgent(supabase, business.id, business.name)

  if (!agent) {
    return (
      <PagePlaceholder
        icon={Database}
        title="No pudimos cargar tu agente"
        description="Ocurrió un error al leer o crear el agente de tu negocio. Intenta recargar la página."
      />
    )
  }

  const boundUpdateAgentName = updateAgentName.bind(null, agent.id)
  const boundUpdateBusinessName = updateBusinessName.bind(null, business.id)

  return (
    <div className="flex flex-col gap-5">
      <div className="card-surface rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#11143A]">Agente</h2>
        <InlineNameForm
          label="Nombre del agente"
          initialValue={agent.name}
          placeholder="Asistente de tu negocio"
          onSave={boundUpdateAgentName}
        />
      </div>

      <div className="card-surface rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#11143A]">Negocio</h2>
        <InlineNameForm
          label="Nombre del negocio"
          initialValue={business.name}
          onSave={boundUpdateBusinessName}
        />
      </div>

      <PlanCard
        plan={business.plan}
        subscriptionStatus={business.subscription_status}
        trialEndsAt={business.trial_ends_at}
      />

      <div className="card-surface rounded-2xl p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#11143A]">Seguridad</h2>
        <PasswordForm />
      </div>
    </div>
  )
}
