import { conversationStatusMeta } from "@/lib/conversation-status"
import { timeAgo } from "@/lib/time"
import type { ConversationPreview } from "@/lib/supabase/overview"

export function RecentConversations({ conversations }: { conversations: ConversationPreview[] }) {
  if (conversations.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-6 text-center">
        <p className="text-sm text-[#4A5080]">
          Aquí verás las conversaciones de tus visitantes en cuanto publiques tu agente.
        </p>
      </div>
    )
  }

  return (
    <div className="card-surface rounded-2xl p-5">
      <h2 className="mb-1 text-sm font-semibold text-[#11143A]">Conversaciones recientes</h2>
      <ul className="divide-y divide-[#E2E5F0]">
        {conversations.map((c) => {
          const meta = conversationStatusMeta[c.status]
          return (
            <li key={c.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#11143A]">
                  Visitante {c.visitorId.slice(0, 8)}
                </p>
                <p className="truncate text-xs text-[#4A5080]">
                  {c.lastMessagePreview ?? "Sin mensajes todavía"}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: meta.bg, color: meta.text }}
                >
                  {meta.label}
                </span>
                <span className="text-[11px] text-[#9CA3C0]">{timeAgo(c.lastMessageAt)}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
