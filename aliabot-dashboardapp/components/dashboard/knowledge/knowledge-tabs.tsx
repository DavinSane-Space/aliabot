"use client"

import { useState } from "react"
import { Globe, FileText, MessageCircleQuestion, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { KnowledgeSource } from "@/lib/supabase/knowledge"
import { PlanUsageBar } from "./plan-usage-bar"
import { WebsiteSection } from "./website-section"
import { DocumentSection } from "./document-section"
import { QASection } from "./qa-section"

type Tab = "website" | "document" | "qa"

const tabs: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "website", label: "Sitio Web", icon: Globe },
  { id: "document", label: "Documentos", icon: FileText },
  { id: "qa", label: "Q&A", icon: MessageCircleQuestion },
]

export function KnowledgeTabs({
  agentId,
  sources,
  fileSizes,
  pagesUsed,
  pagesLimit,
  plan,
}: {
  agentId: string
  sources: KnowledgeSource[]
  fileSizes: Record<string, number>
  pagesUsed: number
  pagesLimit: number
  plan: string | null
}) {
  const [tab, setTab] = useState<Tab>("website")
  const limitReached = pagesUsed >= pagesLimit

  const websiteSources = sources.filter((s) => s.type === "website")
  const documentSources = sources.filter((s) => s.type === "document")
  const qaSources = sources.filter((s) => s.type === "qa")

  return (
    <div className="flex flex-col gap-5">
      <PlanUsageBar pagesUsed={pagesUsed} pagesLimit={pagesLimit} plan={plan} />

      <div className="flex gap-2 border-b border-[#E2E5F0]">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-[#4A5080] hover:text-[#11143A]",
              )}
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          )
        })}
      </div>

      {tab === "website" && (
        <WebsiteSection agentId={agentId} sources={websiteSources} limitReached={limitReached} />
      )}
      {tab === "document" && (
        <DocumentSection
          agentId={agentId}
          sources={documentSources}
          fileSizes={fileSizes}
          limitReached={limitReached}
        />
      )}
      {tab === "qa" && <QASection agentId={agentId} sources={qaSources} />}
    </div>
  )
}
