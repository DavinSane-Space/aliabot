import { Database } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getOrCreateAgent } from "@/lib/supabase/agent"
import { getOrCreateWidgetConfig } from "@/lib/supabase/widget"
import { PagePlaceholder } from "@/components/dashboard/page-placeholder"
import { PublishButton } from "@/components/dashboard/publish-button"
import { WidgetCustomizer } from "@/components/dashboard/widget/widget-customizer"
import { InstallSnippet } from "@/components/dashboard/widget/install-snippet"

export default async function WidgetPage() {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)

  if (!business) {
    return (
      <PagePlaceholder
        icon={Database}
        title="Sin negocio asociado"
        description="Esta cuenta no tiene un negocio en Supabase todavía, así que no hay un widget que configurar."
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

  const widgetConfig = await getOrCreateWidgetConfig(supabase, agent.id)

  if (!widgetConfig) {
    return (
      <PagePlaceholder
        icon={Database}
        title="No pudimos cargar el widget"
        description="Ocurrió un error al leer la configuración del widget. Intenta recargar la página."
      />
    )
  }

  const { count: readyCount } = await supabase
    .from("knowledge_sources")
    .select("id", { count: "exact", head: true })
    .eq("agent_id", agent.id)
    .eq("status", "ready")

  return (
    <div className="flex flex-col gap-5">
      {!widgetConfig.is_published && (
        <div className="card-surface flex flex-wrap items-center justify-between gap-3 rounded-2xl p-5">
          <div>
            <h1 className="text-base font-semibold text-[#11143A]">
              Tu agente aún no está publicado
            </h1>
            <p className="text-sm text-[#4A5080]">
              Publícalo para que el widget empiece a responder en tu sitio.
            </p>
          </div>
          <PublishButton agentId={agent.id} disabled={!readyCount} />
        </div>
      )}

      <WidgetCustomizer agentId={agent.id} config={widgetConfig} />
      <InstallSnippet agentId={agent.id} />
    </div>
  )
}
