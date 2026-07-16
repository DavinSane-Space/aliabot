import type { SupabaseClient } from '@supabase/supabase-js'
import type { ConversationStatus } from '@/lib/conversation-status'

export type ConversationPreview = {
  id: string
  visitorId: string
  status: ConversationStatus
  lastMessageAt: string
  lastMessagePreview: string | null
}

export type OverviewData = {
  readyKnowledgeCount: number
  conversationsCount: number
  messagesToday: number
  recentConversations: ConversationPreview[]
}

export async function getOverviewData(
  supabase: SupabaseClient,
  agentId: string,
): Promise<OverviewData> {
  const [{ count: readyKnowledgeCount }, { data: conversations }] = await Promise.all([
    supabase
      .from('knowledge_sources')
      .select('id', { count: 'exact', head: true })
      .eq('agent_id', agentId)
      .eq('status', 'ready'),
    supabase
      .from('conversations')
      .select('id, visitor_id, status, last_message_at')
      .eq('agent_id', agentId)
      .order('last_message_at', { ascending: false }),
  ])

  const allConversations = conversations ?? []
  const recentConversations: ConversationPreview[] = []
  let messagesToday = 0

  if (allConversations.length > 0) {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const ids = allConversations.map((c) => c.id)

    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', ids)
      .gte('created_at', startOfDay.toISOString())
    messagesToday = count ?? 0

    for (const c of allConversations.slice(0, 3)) {
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('content')
        .eq('conversation_id', c.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      recentConversations.push({
        id: c.id,
        visitorId: c.visitor_id,
        status: c.status,
        lastMessageAt: c.last_message_at,
        lastMessagePreview: lastMessage?.content ?? null,
      })
    }
  }

  return {
    readyKnowledgeCount: readyKnowledgeCount ?? 0,
    conversationsCount: allConversations.length,
    messagesToday,
    recentConversations,
  }
}
