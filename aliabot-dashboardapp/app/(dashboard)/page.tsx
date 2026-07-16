import { Building2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getOrCreateAgent } from "@/lib/supabase/agent"
import { getOverviewData } from "@/lib/supabase/overview"
import { PagePlaceholder } from "@/components/dashboard/page-placeholder"
import { AgentStatusCard } from "@/components/dashboard/overview/agent-status-card"
import { StatsGrid } from "@/components/dashboard/overview/stats-grid"
import { RecentConversations } from "@/components/dashboard/overview/recent-conversations"
import { DraftGuideBanner } from "@/components/dashboard/overview/draft-guide-banner"

export default async function ResumenPage() {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)

  if (!business) {
    return (
      <PagePlaceholder
        icon={Building2}
        title="Sin negocio asociado"
        description="Esta cuenta no tiene un negocio en Supabase todavía, así que no hay un agente que mostrar."
      />
    )
  }

  const agent = await getOrCreateAgent(supabase, business.id, business.name)

  if (!agent) {
    return (
      <PagePlaceholder
        icon={Building2}
        title="No pudimos cargar tu agente"
        description="Ocurrió un error al leer o crear el agente de tu negocio. Intenta recargar la página."
      />
    )
  }

  const overview = await getOverviewData(supabase, agent.id)

  return (
    <div className="flex flex-col gap-5">
      {agent.status === "draft" && overview.readyKnowledgeCount === 0 && <DraftGuideBanner />}

      <AgentStatusCard agent={agent} hasReadyKnowledge={overview.readyKnowledgeCount > 0} />

      <StatsGrid
        conversationsCount={overview.conversationsCount}
        messagesToday={overview.messagesToday}
        readyKnowledgeCount={overview.readyKnowledgeCount}
      />

      <RecentConversations conversations={overview.recentConversations} />
    </div>
  )
}
