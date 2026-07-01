"use client"

import { ChevronDown } from "lucide-react"
import {
  messagesChart,
  knowledgeGrowth,
  knowledgeGrowthLabels,
  topQuestions,
} from "@/lib/dashboard-data"

function PanelHeader({
  title,
  range,
}: {
  title: string
  range: string
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <button className="flex items-center gap-1 rounded-lg border border-border bg-white/[0.03] px-2.5 py-1 text-xs text-white/60 transition-colors hover:bg-white/[0.06]">
        {range}
        <ChevronDown className="size-3.5" />
      </button>
    </div>
  )
}

export function MessagesChart() {
  const max = Math.max(...messagesChart.map((d) => d.value))
  return (
    <div className="card-surface rounded-2xl p-5">
      <PanelHeader title="Messages" range="7 Days" />
      <div className="mt-6 flex h-44 items-end gap-2.5">
        {messagesChart.map((d, i) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className="animate-bar w-full max-w-9 rounded-md grad-primary"
                style={{
                  height: `${(d.value / max) * 100}%`,
                  animationDelay: `${i * 70}ms`,
                }}
                title={`${d.value} messages`}
              />
            </div>
            <span className="text-[10px] text-white/40">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function KnowledgeGrowthChart() {
  const w = 300
  const h = 150
  const max = Math.max(...knowledgeGrowth)
  const min = Math.min(...knowledgeGrowth)
  const points = knowledgeGrowth.map((v, i) => {
    const x = (i / (knowledgeGrowth.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * (h - 12) - 6
    return [x, y] as const
  })
  const line = points.map(([x, y]) => `${x},${y}`).join(" ")
  const area = `0,${h} ${line} ${w},${h}`

  return (
    <div className="card-surface rounded-2xl p-5">
      <PanelHeader title="Knowledge Growth" range="30 Days" />
      <div className="mt-6">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-40 w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="kg-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="kg-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={area} fill="url(#kg-area)" />
          <polyline
            points={line}
            fill="none"
            stroke="url(#kg-line)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              animation: "draw-line 1.6s ease-out forwards",
            }}
          />
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-white/40">
          {knowledgeGrowthLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TopQuestions() {
  return (
    <div className="card-surface rounded-2xl p-5">
      <PanelHeader title="Top Questions" range="7 Days" />
      <ul className="mt-4 space-y-3.5">
        {topQuestions.map((item) => (
          <li
            key={item.q}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <span className="truncate text-white/70">{item.q}</span>
            <span className="shrink-0 font-medium text-white/90">
              {item.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
