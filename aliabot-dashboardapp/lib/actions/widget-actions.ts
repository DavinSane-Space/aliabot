'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { WidgetPosition } from '@/lib/supabase/widget'

type UpdateWidgetInput = {
  primaryColor: string
  position: WidgetPosition
  welcomeMessage: string
  botDisplayName: string
}

export async function updateWidgetConfig(
  agentId: string,
  input: UpdateWidgetInput,
): Promise<{ error?: string; success?: true }> {
  if (!input.welcomeMessage.trim()) {
    return { error: 'El mensaje de bienvenida no puede estar vacío.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('widget_config').upsert(
    {
      agent_id: agentId,
      primary_color: input.primaryColor,
      position: input.position,
      welcome_message: input.welcomeMessage.trim(),
      bot_display_name: input.botDisplayName.trim() || null,
    },
    { onConflict: 'agent_id' },
  )

  if (error) {
    console.error('updateWidgetConfig: failed', error)
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' }
  }

  revalidatePath('/widget')
  return { success: true }
}
