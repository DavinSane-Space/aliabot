import { createClient } from "@/lib/supabase/server"
import { getBusinessAccess } from "@/lib/supabase/access"
import { PlanesView } from "@/components/dashboard/planes-view"

export default async function PlanesPage() {
  const supabase = await createClient()
  const access = await getBusinessAccess(supabase)

  return <PlanesView hasAccess={access.hasAccess} />
}
