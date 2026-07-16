import type { SupabaseClient } from '@supabase/supabase-js'
import type { ConversationStatus } from '@/lib/conversation-status'

export type ConversationListItem = {
  id: string
  visitorId: string
  status: ConversationStatus
  startedAt: string
  lastMessageAt: string
}

export type MessageRole = 'visitor' | 'bot' | 'human_agent'

export type MessageItem = {
  id: string
  role: MessageRole
  content: string
  createdAt: string
}

export async function getConversations(
  supabase: SupabaseClient,
  agentId: string,
): Promise<ConversationListItem[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('id, visitor_id, status, started_at, last_message_at')
    .eq('agent_id', agentId)
    .order('last_message_at', { ascending: false })

  if (error) {
    console.error('getConversations: failed to load', error)
    return []
  }

  return (data ?? []).map((c) => ({
    id: c.id,
    visitorId: c.visitor_id,
    status: c.status,
    startedAt: c.started_at,
    lastMessageAt: c.last_message_at,
  }))
}
