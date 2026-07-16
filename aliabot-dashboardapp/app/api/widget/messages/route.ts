import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { corsJson, corsOptions, isValidUuid } from '@/lib/widget-cors'
import { WIDGET_PLACEHOLDER_REPLY } from '@/lib/widget-bot-reply'

const MAX_CONTENT_LENGTH = 4000

export async function OPTIONS() {
  return corsOptions()
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return corsJson({ error: 'JSON inválido' }, { status: 400 })
  }

  const { conversationId, content } = (body ?? {}) as { conversationId?: unknown; content?: unknown }

  if (!isValidUuid(conversationId)) {
    return corsJson({ error: 'conversationId inválido' }, { status: 400 })
  }

  if (typeof content !== 'string' || content.trim().length === 0) {
    return corsJson({ error: 'El mensaje no puede estar vacío' }, { status: 400 })
  }

  const trimmedContent = content.trim().slice(0, MAX_CONTENT_LENGTH)

  const supabase = createAdminClient()

  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .select('id, agent_id')
    .eq('id', conversationId)
    .maybeSingle()

  if (conversationError) {
    console.error('POST /api/widget/messages: failed to load conversation', conversationError)
    return corsJson({ error: 'No se pudo verificar la conversación' }, { status: 500 })
  }

  if (!conversation) {
    return corsJson({ error: 'Conversación no encontrada' }, { status: 404 })
  }

  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('status')
    .eq('id', conversation.agent_id)
    .maybeSingle()

  if (agentError) {
    console.error('POST /api/widget/messages: failed to load agent', agentError)
    return corsJson({ error: 'No se pudo verificar el agente' }, { status: 500 })
  }

  if (!agent || agent.status !== 'live') {
    return corsJson({ error: 'Este asistente no está disponible' }, { status: 404 })
  }

  const { data: visitorMessage, error: visitorInsertError } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role: 'visitor', content: trimmedContent })
    .select('id, role, content, created_at')
    .single()

  if (visitorInsertError) {
    console.error('POST /api/widget/messages: failed to save visitor message', visitorInsertError)
    return corsJson({ error: 'No se pudo guardar el mensaje' }, { status: 500 })
  }

  const { data: botMessage, error: botInsertError } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, role: 'bot', content: WIDGET_PLACEHOLDER_REPLY })
    .select('id, role, content, created_at')
    .single()

  if (botInsertError) {
    console.error('POST /api/widget/messages: failed to save bot reply', botInsertError)
    return corsJson({ error: 'No se pudo generar la respuesta' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('conversations')
    .update({ last_message_at: botMessage.created_at })
    .eq('id', conversationId)

  if (updateError) {
    console.error('POST /api/widget/messages: failed to update conversation timestamp', updateError)
  }

  return corsJson({
    visitorMessage: {
      id: visitorMessage.id,
      role: visitorMessage.role,
      content: visitorMessage.content,
      createdAt: visitorMessage.created_at,
    },
    botMessage: {
      id: botMessage.id,
      role: botMessage.role,
      content: botMessage.content,
      createdAt: botMessage.created_at,
    },
  })
}
