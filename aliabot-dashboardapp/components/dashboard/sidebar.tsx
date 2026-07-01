"use client"

import { useState } from "react"
import {
  LayoutGrid,
  Bot,
  Users,
  UserSquare2,
  Globe,
  FileText,
  MessageCircleQuestion,
  Database,
  Workflow,
  Blocks,
  FunctionSquare,
  Inbox,
  BarChart3,
  MessageSquareHeart,
  Palette,
  UsersRound,
  Shield,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AliabotLogo } from "./brand"

type NavItem = {
  label: string
  icon: LucideIcon
  badge?: number
}

type NavSection = {
  heading?: string
  items: NavItem[]
}

const sections: NavSection[] = [
  { items: [{ label: "Overview", icon: LayoutGrid }] },
  {
    heading: "Agents",
    items: [
      { label: "AI Agents", icon: Bot },
      { label: "Teams", icon: Users },
      { label: "Personas", icon: UserSquare2 },
    ],
  },
  {
    heading: "Knowledge",
    items: [
      { label: "Websites", icon: Globe },
      { label: "Documents", icon: FileText },
      { label: "Q&A", icon: MessageCircleQuestion },
      { label: "Knowledge Base", icon: Database },
    ],
  },
  {
    heading: "Automation",
    items: [
      { label: "Workflows", icon: Workflow },
      { label: "Integrations", icon: Blocks },
      { label: "Functions", icon: FunctionSquare },
    ],
  },
  {
    heading: "Conversations",
    items: [
      { label: "Inbox", icon: Inbox, badge: 12 },
      { label: "Analytics", icon: BarChart3 },
      { label: "Feedback", icon: MessageSquareHeart },
    ],
  },
  {
    heading: "Settings",
    items: [
      { label: "Appearance", icon: Palette },
      { label: "Members", icon: UsersRound },
      { label: "Security", icon: Shield },
      { label: "Settings", icon: Settings },
    ],
  },
]

export function Sidebar() {
  const [active, setActive] = useState("AI Agents")

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center px-5">
        <AliabotLogo />
      </div>

      <nav className="scroll-slim flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section, i) => (
          <div key={i} className="mb-1">
            {section.heading && (
              <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-white/35">
                {section.heading}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = active === item.label
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <button
                      onClick={() => setActive(item.label)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "grad-primary text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)]"
                          : "text-white/60 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-[18px] shrink-0 transition-transform group-hover:scale-110",
                          isActive ? "text-white" : "text-white/50",
                        )}
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span
                          className={cn(
                            "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-semibold",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-brand/20 text-brand-soft",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="m-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Enterprise Plan</p>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-white/50">
          <span>Usage</span>
          <span className="font-medium text-white/80">53%</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="animate-width h-full rounded-full grad-primary"
            style={{ width: "53%" }}
          />
        </div>
      </div>
    </aside>
  )
}
