import { BarChart3, Database } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getOrCreateAgent } from "@/lib/supabase/agent"
import { getAnalyticsData } from "@/lib/supabase/analytics"
import { PagePlaceholder } from "@/components/dashboard/page-placeholder"
import { MessagesChart } from "@/components/dashboard/analytics/messages-chart"
import { TopQuestions } from "@/components/dashboard/analytics/top-questions"

export default async function AnaliticasPage() {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)

  if (!business) {
    return (
      <PagePlaceholder
        icon={Database}
        title="Sin negocio asociado"
        description="Esta cuenta no tiene un negocio en Supabase todavía, así que no hay estadísticas que mostrar."
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

  const analytics = await getAnalyticsData(supabase, agent.id)

  if (analytics.totalMessages === 0) {
    return (
      <PagePlaceholder
        icon={BarChart3}
        title="Todavía no hay datos"
        description="Publica tu agente para empezar a ver estadísticas reales de mensajes y preguntas frecuentes."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      <MessagesChart data={analytics.dailyMessages} />
      <TopQuestions questions={analytics.topQuestions} />
    </div>
  )
}
