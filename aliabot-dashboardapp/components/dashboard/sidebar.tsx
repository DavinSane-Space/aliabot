"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  Database,
  FlaskConical,
  Palette,
  Inbox,
  BarChart3,
  UsersRound,
  Settings,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AliabotLogo } from "./brand"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: "Resumen", href: "/", icon: LayoutGrid },
  { label: "Conocimiento", href: "/conocimiento", icon: Database },
  { label: "Playground", href: "/playground", icon: FlaskConical },
  { label: "Widget", href: "/widget", icon: Palette },
  { label: "Conversaciones", href: "/conversaciones", icon: Inbox },
  { label: "Analíticas", href: "/analiticas", icon: BarChart3 },
  { label: "Equipo", href: "/equipo", icon: UsersRound },
  { label: "Configuración", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center px-5">
        <AliabotLogo />
      </div>

      <nav className="scroll-slim flex-1 overflow-y-auto px-3 pb-4 pt-2">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "grad-primary text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)]"
                      : "text-[#4A5080] hover:bg-[#2563EB]/[0.06] hover:text-[#11143A]",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0 transition-transform group-hover:scale-110",
                      isActive ? "text-white" : "text-[#6B7399]",
                    )}
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
