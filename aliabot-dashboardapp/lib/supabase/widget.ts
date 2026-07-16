import type { SupabaseClient } from '@supabase/supabase-js'

export type WidgetPosition = 'bottom-right' | 'bottom-left'

export type WidgetConfig = {
  id: string
  agent_id: string
  primary_color: string
  position: WidgetPosition
  welcome_message: string
  bot_display_name: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export async function getOrCreateWidgetConfig(
  supabase: SupabaseClient,
  agentId: string,
): Promise<WidgetConfig | null> {
  const { data: existing, error } = await supabase
    .from('widget_config')
    .select('*')
    .eq('agent_id', agentId)
    .maybeSingle()

  if (error) {
    console.error('getOrCreateWidgetConfig: failed to load', error)
    return null
  }

  if (existing) return existing

  const { data: created, error: insertError } = await supabase
    .from('widget_config')
    .insert({ agent_id: agentId })
    .select('*')
    .single()

  if (insertError) {
    console.error('getOrCreateWidgetConfig: failed to create', insertError)
    return null
  }

  return created
}
