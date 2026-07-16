'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function publishAgent(agentId: string): Promise<{ error?: string; success?: true }> {
  const supabase = await createClient()

  const { count } = await supabase
    .from('knowledge_sources')
    .select('id', { count: 'exact', head: true })
    .eq('agent_id', agentId)
    .eq('status', 'ready')

  if (!count) {
    return { error: 'Agrega al menos una fuente de conocimiento lista antes de publicar.' }
  }

  const { error: agentError } = await supabase
    .from('agents')
    .update({ status: 'live' })
    .eq('id', agentId)

  if (agentError) {
    console.error('publishAgent: failed to update agent status', agentError)
    return { error: 'No pudimos publicar el agente. Intenta de nuevo.' }
  }

  const { error: widgetError } = await supabase
    .from('widget_config')
    .upsert({ agent_id: agentId, is_published: true }, { onConflict: 'agent_id' })

  if (widgetError) {
    console.error('publishAgent: failed to publish widget', widgetError)
    return { error: 'El agente quedó activo, pero no pudimos publicar el widget.' }
  }

  revalidatePath('/')
  revalidatePath('/widget')

  return { success: true }
}

export async function updateAgentName(
  agentId: string,
  name: string,
): Promise<{ error?: string; success?: true }> {
  const trimmed = name.trim()
  if (!trimmed) return { error: 'El nombre del agente no puede estar vacío.' }

  const supabase = await createClient()

  const { error } = await supabase.from('agents').update({ name: trimmed }).eq('id', agentId)

  if (error) {
    console.error('updateAgentName: failed', error)
    return { error: 'No pudimos actualizar el nombre. Intenta de nuevo.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
