import type { SupabaseClient } from '@supabase/supabase-js'

export type AgentStatus = 'draft' | 'live' | 'paused'

export type Agent = {
  id: string
  business_id: string
  name: string
  status: AgentStatus
  avatar_color: string
  created_at: string
  updated_at: string
}

/**
 * Every business has exactly one agent. Creates it lazily on first visit
 * so existing businesses (created before this table existed) get one too.
 */
export async function getOrCreateAgent(
  supabase: SupabaseClient,
  businessId: string,
  businessName: string,
): Promise<Agent | null> {
  const { data: existing, error } = await supabase
    .from('agents')
    .select('*')
    .eq('business_id', businessId)
    .maybeSingle()

  if (error) {
    console.error('getOrCreateAgent: failed to load agent', error)
    return null
  }

  if (existing) return existing

  const { data: created, error: insertError } = await supabase
    .from('agents')
    .insert({ business_id: businessId, name: `Asistente de ${businessName}` })
    .select('*')
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      const { data: fallback, error: fallbackError } = await supabase
        .from('agents')
        .select('*')
        .eq('business_id', businessId)
        .maybeSingle()

      if (fallback) return fallback

      console.error('getOrCreateAgent: fallback select after duplicate key failed', {
        message: fallbackError?.message,
        code: fallbackError?.code,
        details: fallbackError?.details,
      })
      return null
    }

    console.error('getOrCreateAgent: failed to create agent', {
      message: insertError.message,
      code: insertError.code,
      details: insertError.details,
    })
    return null
  }

  return created
}
