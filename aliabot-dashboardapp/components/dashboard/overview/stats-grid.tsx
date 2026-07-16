import { MessagesSquare, MessageCircle, Library, type LucideIcon } from "lucide-react"

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: number
}) {
  return (
    <div className="card-surface rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs text-[#4A5080]">{label}</p>
        <span className="grid size-8 place-items-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-[#11143A]">{value}</p>
    </div>
  )
}

export function StatsGrid({
  conversationsCount,
  messagesToday,
  readyKnowledgeCount,
}: {
  conversationsCount: number
  messagesToday: number
  readyKnowledgeCount: number
}) {
  if (conversationsCount === 0 && messagesToday === 0) {
    return (
      <div className="card-surface rounded-2xl p-6 text-center">
        <p className="text-sm text-[#4A5080]">
          Aún no tienes conversaciones — publica tu agente para empezar a recibir mensajes.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard icon={MessagesSquare} label="Conversaciones totales" value={conversationsCount} />
      <StatCard icon={MessageCircle} label="Mensajes hoy" value={messagesToday} />
      <StatCard icon={Library} label="Fuentes de conocimiento listas" value={readyKnowledgeCount} />
    </div>
  )
}
