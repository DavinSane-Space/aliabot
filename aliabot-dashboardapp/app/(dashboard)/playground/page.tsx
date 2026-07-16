import Link from "next/link"
import { FlaskConical, Database } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getOrCreateAgent } from "@/lib/supabase/agent"
import { PagePlaceholder } from "@/components/dashboard/page-placeholder"
import { PlaygroundChat } from "@/components/dashboard/playground/playground-chat"

export default async function PlaygroundPage() {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)

  if (!business) {
    return (
      <PagePlaceholder
        icon={Database}
        title="Sin negocio asociado"
        description="Esta cuenta no tiene un negocio en Supabase todavía, así que no hay un agente que probar."
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

  const { count: readyCount } = await supabase
    .from("knowledge_sources")
    .select("id", { count: "exact", head: true })
    .eq("agent_id", agent.id)
    .eq("status", "ready")

  if (!readyCount) {
    return (
      <PagePlaceholder
        icon={FlaskConical}
        title="Sin contenido para probar"
        description="Agrega contenido en Conocimiento antes de probar tu agente."
        action={
          <Link
            href="/conocimiento"
            className="rounded-lg grad-primary px-4 py-2 text-sm font-medium text-white"
          >
            Ir a Conocimiento
          </Link>
        }
      />
    )
  }

  const aiConnected = Boolean(process.env.OPENAI_API_KEY)

  return <PlaygroundChat agent={agent} aiConnected={aiConnected} />
}
