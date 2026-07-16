import type { KnowledgeSourceStatus } from '@/lib/supabase/knowledge'

export const knowledgeStatusMeta: Record<
  KnowledgeSourceStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: 'En cola', bg: 'rgba(107,115,153,0.12)', text: '#4A5080' },
  processing: { label: 'Procesando', bg: 'rgba(37,99,235,0.12)', text: '#1D4ED8' },
  ready: { label: 'Listo', bg: 'rgba(34,197,94,0.12)', text: '#15803D' },
  error: { label: 'Error', bg: 'rgba(239,68,68,0.12)', text: '#B91C1C' },
}
