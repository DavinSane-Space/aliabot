'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateBusinessName(
  businessId: string,
  name: string,
): Promise<{ error?: string; success?: true }> {
  const trimmed = name.trim()
  if (!trimmed) return { error: 'El nombre del negocio no puede estar vacío.' }

  const supabase = await createClient()

  const { error } = await supabase.from('businesses').update({ name: trimmed }).eq('id', businessId)

  if (error) {
    console.error('updateBusinessName: failed', error)
    return { error: 'No pudimos actualizar el negocio. Intenta de nuevo.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
