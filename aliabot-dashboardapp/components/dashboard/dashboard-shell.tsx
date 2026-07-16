import type { ReactNode } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { TrialBanner } from "@/components/dashboard/trial-banner"
import type { Agent } from "@/lib/supabase/agent"

export function DashboardShell({
  agent,
  businessName,
  trialDaysLeft,
  children,
}: {
  agent: Agent | null
  businessName: string | null
  trialDaysLeft: number | null
  children: ReactNode
}) {
  return (
    <div
      data-dashboard-theme
      className="flex h-dvh overflow-hidden bg-background text-foreground"
    >
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar agent={agent} businessName={businessName} />

        <main className="scroll-slim flex-1 overflow-y-auto p-5">
          {trialDaysLeft !== null && (
            <div className="mb-5">
              <TrialBanner daysLeft={trialDaysLeft} />
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  )
}
