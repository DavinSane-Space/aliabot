import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase/server"
import { getCurrentBusiness } from "@/lib/supabase/business"
import { getOrCreateAgent } from "@/lib/supabase/agent"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const business = await getCurrentBusiness(supabase)
  const agent = business ? await getOrCreateAgent(supabase, business.id, business.name) : null

  let trialDaysLeft: number | null = null
  if (business?.subscription_status === "trial" && business.trial_ends_at) {
    const msLeft = new Date(business.trial_ends_at).getTime() - Date.now()
    if (msLeft > 0) {
      trialDaysLeft = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
    }
  }

  return (
    <DashboardShell agent={agent} businessName={business?.name ?? null} trialDaysLeft={trialDaysLeft}>
      {children}
    </DashboardShell>
  )
}
