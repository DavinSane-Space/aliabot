"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Topbar } from "@/components/dashboard/topbar"
import { AgentList } from "@/components/dashboard/agent-list"
import { AgentPanel } from "@/components/dashboard/agent-panel"
import { RightPanel } from "@/components/dashboard/right-panel"
import {
  MessagesChart,
  KnowledgeGrowthChart,
  TopQuestions,
} from "@/components/dashboard/charts"
import { agents, type Agent } from "@/lib/dashboard-data"

export default function DashboardPage() {
  const [selected, setSelected] = useState<Agent>(agents[0])

  return (
    <div className="flex h-dvh overflow-hidden bg-background text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="scroll-slim flex-1 overflow-y-auto p-5">
          <div className="flex gap-5">
            <AgentList selectedId={selected.id} onSelect={setSelected} />

            <div className="flex min-w-0 flex-1 flex-col gap-5">
              <AgentPanel agent={selected} />

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <MessagesChart />
                <KnowledgeGrowthChart />
                <TopQuestions />
              </div>
            </div>

            <RightPanel />
          </div>
        </main>
      </div>
    </div>
  )
}
