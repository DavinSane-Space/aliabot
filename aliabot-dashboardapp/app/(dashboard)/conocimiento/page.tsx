import { Database } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getOrCreateAgent } from "@/lib/supabase/agent"
import { getKnowledgeSources, sumPagesUsed } from "@/lib/supabase/knowledge"
import { getPlanPageLimit } from "@/lib/knowledge-plan"
import { PagePlaceholder } from "@/components/dashboard/page-placeholder"
import { KnowledgeTabs } from "@/components/dashboard/knowledge/knowledge-tabs"

export default async function ConocimientoPage() {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)

  if (!business) {
    return (
      <PagePlaceholder
        icon={Database}
        title="Sin negocio asociado"
        description="Esta cuenta no tiene un negocio en Supabase todavía, así que no hay un agente que entrenar."
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

  const sources = await getKnowledgeSources(supabase, agent.id)
  const pagesUsed = sumPagesUsed(sources)
  const pagesLimit = getPlanPageLimit(business.plan)

  const documentSources = sources.filter((s) => s.type === "document")
  const fileSizes: Record<string, number> = {}

  if (documentSources.length > 0) {
    const { data: objects } = await supabase.storage.from("knowledge-documents").list(business.id)
    for (const obj of objects ?? []) {
      if (obj.metadata?.size) fileSizes[obj.name] = obj.metadata.size
    }
  }

  return (
    <KnowledgeTabs
      agentId={agent.id}
      sources={sources}
      fileSizes={fileSizes}
      pagesUsed={pagesUsed}
      pagesLimit={pagesLimit}
      plan={business.plan}
    />
  )
}
