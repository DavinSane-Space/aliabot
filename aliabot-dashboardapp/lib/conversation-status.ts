export type ConversationStatus = 'active' | 'resolved' | 'escalated'

export const conversationStatusMeta: Record<
  ConversationStatus,
  { label: string; bg: string; text: string }
> = {
  active: { label: 'Activa', bg: 'rgba(34,197,94,0.12)', text: '#15803D' },
  resolved: { label: 'Resuelta', bg: 'rgba(37,99,235,0.1)', text: '#1D4ED8' },
  escalated: { label: 'Escalada', bg: 'rgba(245,158,11,0.12)', text: '#B45309' },
}
