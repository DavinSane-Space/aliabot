"use client"

import {
  Activity,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Gauge,
  Zap,
  Globe,
  FileText,
  MessageCircleQuestion,
  Rocket,
  CheckCircle2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react"
import {
  agentHealth,
  recentActivity,
  topIntents,
} from "@/lib/dashboard-data"

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <div className="card-surface rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        <Icon className="size-4 text-white/40" />
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function HealthBar({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: number
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-white/70">
          <Icon className="size-4 text-brand-soft" />
          {label}
        </span>
        <span className="font-medium text-white">{value}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="animate-width h-full rounded-full grad-primary"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function OverallScore({ score }: { score: number }) {
  const r = 22
  const c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  return (
    <div className="flex items-center gap-2">
      <div className="relative size-14">
        <svg viewBox="0 0 56 56" className="size-14 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="5"
          />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="url(#score-grad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
          <defs>
            <linearGradient id="score-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-white">
          {score}%
        </span>
      </div>
    </div>
  )
}

const activityIcons: Record<string, LucideIcon> = {
  website: Globe,
  files: FileText,
  qa: MessageCircleQuestion,
  deploy: Rocket,
}

export function RightPanel() {
  const maxIntent = Math.max(...topIntents.map((t) => t.value))

  return (
    <aside className="flex w-[300px] shrink-0 flex-col gap-5">
      {/* Agent Health */}
      <Card title="Agent Health" icon={Activity}>
        <div className="space-y-4">
          <HealthBar
            icon={BookOpen}
            label="Knowledge"
            value={agentHealth.knowledge}
          />
          <HealthBar
            icon={Sparkles}
            label="Response Quality"
            value={agentHealth.responseQuality}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-white/70">
              <ShieldCheck className="size-4 text-[#4ade80]" />
              Hallucination Risk
            </span>
            <span className="rounded-full bg-[#22c55e]/15 px-2.5 py-0.5 text-xs font-medium text-[#4ade80]">
              {agentHealth.hallucinationRisk}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-white/70">
              <Gauge className="size-4 text-brand-soft" />
              Latency
            </span>
            <span className="font-medium text-white">{agentHealth.latency}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="flex items-center gap-2 text-sm text-white/70">
              <Zap className="size-4 text-brand-soft" />
              Overall Score
            </span>
            <OverallScore score={agentHealth.overall} />
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity" icon={Activity}>
        <ul className="space-y-4">
          {recentActivity.map((item, i) => {
            const Icon = activityIcons[item.type] ?? Globe
            return (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-white/[0.05] text-brand-soft">
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {item.title}
                    </p>
                    {item.meta ? (
                      <span className="flex items-center gap-1 text-xs text-[#4ade80]">
                        <CheckCircle2 className="size-3" />
                        {item.meta}
                      </span>
                    ) : (
                      <span className="text-xs text-white/35">{item.time}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-white/45">
                      {item.detail}
                    </p>
                    {item.meta && (
                      <span className="shrink-0 text-xs text-white/35">
                        {item.time}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </Card>

      {/* Top Intents */}
      <Card title="Top Intents" icon={TrendingUp}>
        <ul className="space-y-3.5">
          {topIntents.map((intent, i) => (
            <li key={intent.label}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-white/75">
                  <span className="grid size-5 place-items-center rounded-md bg-white/[0.06] text-[11px] font-semibold text-white/50">
                    {i + 1}
                  </span>
                  {intent.label}
                </span>
                <span className="font-medium text-white">{intent.value}%</span>
              </div>
              <div className="ml-7 mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="animate-width h-full rounded-full grad-primary"
                  style={{ width: `${(intent.value / maxIntent) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  )
}
