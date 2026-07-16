'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ConversationStatus } from '@/lib/conversation-status'
import type { MessageItem } from '@/lib/supabase/conversations'

export async function getConversationMessages(
  conversationId: string,
): Promise<{ messages?: MessageItem[]; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('getConversationMessages: failed', error)
    return { error: 'No pudimos cargar los mensajes.' }
  }

  return {
    messages: (data ?? []).map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      createdAt: m.created_at,
    })),
  }
}

export async function updateConversationStatus(
  conversationId: string,
  status: ConversationStatus,
): Promise<{ error?: string; success?: true }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('conversations')
    .update({ status })
    .eq('id', conversationId)

  if (error) {
    console.error('updateConversationStatus: failed', error)
    return { error: 'No pudimos actualizar el estado.' }
  }

  revalidatePath('/conversaciones')
  return { success: true }
}
