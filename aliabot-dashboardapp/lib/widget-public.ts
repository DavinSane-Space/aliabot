import { createAdminClient } from '@/lib/supabase/admin'
import type { WidgetPosition } from '@/lib/supabase/widget'

export type PublicWidgetData = {
  agentId: string
  displayName: string
  avatarColor: string
  primaryColor: string
  position: WidgetPosition
  welcomeMessage: string
}

/**
 * Shared by /api/widget/config and the /widget/chat page: an agent is only
 * reachable by anonymous visitors once it's status='live' AND its widget
 * config is is_published — both must hold, so this is the single place
 * that decides visibility.
 */
export async function getPublicWidgetData(agentId: string): Promise<PublicWidgetData | null> {
  const supabase = createAdminClient()

  const { data: agent, error: agentError } = await supabase
    .from('agents')
    .select('id, name, status, avatar_color')
    .eq('id', agentId)
    .maybeSingle()

  if (agentError) {
    console.error('getPublicWidgetData: failed to load agent', agentError)
    return null
  }

  if (!agent || agent.status !== 'live') return null

  const { data: widgetConfig, error: widgetError } = await supabase
    .from('widget_config')
    .select('primary_color, position, welcome_message, bot_display_name, is_published')
    .eq('agent_id', agentId)
    .maybeSingle()

  if (widgetError) {
    console.error('getPublicWidgetData: failed to load widget config', widgetError)
    return null
  }

  if (!widgetConfig || !widgetConfig.is_published) return null

  return {
    agentId: agent.id,
    displayName: widgetConfig.bot_display_name || agent.name,
    avatarColor: agent.avatar_color,
    primaryColor: widgetConfig.primary_color,
    position: widgetConfig.position,
    welcomeMessage: widgetConfig.welcome_message,
  }
}
