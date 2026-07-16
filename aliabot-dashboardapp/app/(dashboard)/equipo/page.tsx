import { Database } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getBusinessMembers } from "@/lib/supabase/team"
import { PagePlaceholder } from "@/components/dashboard/page-placeholder"
import { TeamManager } from "@/components/dashboard/team/team-manager"

export default async function EquipoPage() {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)

  if (!business) {
    return (
      <PagePlaceholder
        icon={Database}
        title="Sin negocio asociado"
        description="Esta cuenta no tiene un negocio en Supabase todavía, así que no hay equipo que gestionar."
      />
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const members = await getBusinessMembers(supabase, business.id)

  return (
    <TeamManager
      businessId={business.id}
      ownerEmail={user?.email ?? business.name}
      members={members}
      plan={business.plan}
    />
  )
}
