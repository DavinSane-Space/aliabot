import type { AgentStatus } from '@/lib/supabase/agent'

export const agentStatusMeta: Record<
  AgentStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  draft: { label: 'Borrador', dot: '#F59E0B', bg: 'rgba(245,158,11,0.12)', text: '#B45309' },
  live: { label: 'Live', dot: '#22C55E', bg: 'rgba(34,197,94,0.12)', text: '#15803D' },
  paused: { label: 'Pausado', dot: '#6B7399', bg: 'rgba(107,115,153,0.14)', text: '#4A5080' },
}
