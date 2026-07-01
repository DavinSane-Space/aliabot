"use client"

import { Search, ChevronDown, Plus, Bell } from "lucide-react"

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/60 px-5 backdrop-blur-xl">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Search anything..."
          aria-label="Search"
          className="h-10 w-full rounded-xl border border-border bg-white/[0.03] pl-10 pr-16 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-brand/60 focus:bg-white/[0.05]"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-white/40">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Workspace selector */}
        <button className="hidden items-center gap-2 rounded-xl border border-border bg-white/[0.03] px-3 py-2 text-sm text-white/80 transition-colors hover:bg-white/[0.06] sm:flex">
          <span className="grid size-5 place-items-center rounded-md grad-aurora text-[10px] font-bold text-white">
            A
          </span>
          Alia Workspace
          <ChevronDown className="size-4 text-white/40" />
        </button>

        {/* New Agent */}
        <button className="flex items-center gap-2 rounded-xl grad-primary px-4 py-2 text-sm font-medium text-white shadow-[0_4px_20px_rgba(37,99,235,0.35)] transition-all hover:-translate-y-0.5 hover:opacity-95">
          <Plus className="size-4" />
          New Agent
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-border bg-white/[0.03] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-brand" />
        </button>

        {/* Avatar */}
        <button className="relative" aria-label="Account">
          <span className="grid size-10 place-items-center rounded-full grad-primary text-sm font-semibold text-white">
            AR
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background bg-[#22c55e]" />
        </button>
      </div>
    </header>
  )
}
