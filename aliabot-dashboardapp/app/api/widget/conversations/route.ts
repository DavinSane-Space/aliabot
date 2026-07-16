import type { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { corsJson, corsOptions, isValidUuid } from '@/lib/widget-cors'

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

  const { agentId, visitorId } = (body ?? {}) as { agentId?: unknown; visitorId?: unknown }

  if (!isValidUuid(agentId)) {
    return corsJson({ error: 'agentId inválido' }, { status: 400 })
  }

  if (!isValidUuid(visitorId)) {
    return corsJson({ error: 'visitorId inválido' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('id, status')
    .eq('id', agentId)
    .maybeSingle()

  if (agentError) {
    console.error('POST /api/widget/conversations: failed to load agent', agentError)
    return corsJson({ error: 'No se pudo verificar el agente' }, { status: 500 })
  }

  if (!agent || agent.status !== 'live') {
    return corsJson({ error: 'Este asistente no está disponible' }, { status: 404 })
  }

  const { data: conversation, error: insertError } = await supabase
    .from('conversations')
    .insert({ agent_id: agentId, visitor_id: visitorId })
    .select('id, started_at, last_message_at')
    .single()

  if (insertError) {
    console.error('POST /api/widget/conversations: failed to create conversation', insertError)
    return corsJson({ error: 'No se pudo crear la conversación' }, { status: 500 })
  }

  return corsJson(
    {
      conversationId: conversation.id,
      startedAt: conversation.started_at,
    },
    { status: 201 },
  )
}
