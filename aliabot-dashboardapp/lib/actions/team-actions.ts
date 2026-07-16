'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getPlanMemberLimit } from '@/lib/team-plan'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ActionResult = { error?: string; success?: true }

export async function inviteMember(businessId: string, email: string): Promise<ActionResult> {
  const trimmed = email.trim().toLowerCase()
  if (!EMAIL_RE.test(trimmed)) return { error: 'Ingresa un correo electrónico válido.' }

  const supabase = await createClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('plan')
    .eq('id', businessId)
    .maybeSingle()

  const limit = getPlanMemberLimit(business?.plan ?? null)

  const { count } = await supabase
    .from('business_members')
    .select('id', { count: 'exact', head: true })
    .eq('business_id', businessId)

  // +1 to account for the owner, who is always a member but has no row here.
  const currentSize = (count ?? 0) + 1

  if (currentSize >= limit) {
    return {
      error: `Alcanzaste el límite de ${limit} miembro${limit === 1 ? '' : 's'} de tu plan. Mejora a Pro para invitar más.`,
    }
  }

  const { error } = await supabase
    .from('business_members')
    .insert({ business_id: businessId, email: trimmed })

  if (error) {
    if (error.code === '23505') return { error: 'Ese correo ya fue invitado.' }
    console.error('inviteMember: insert failed', error)
    return { error: 'No pudimos enviar la invitación. Intenta de nuevo.' }
  }

  revalidatePath('/equipo')
  return { success: true }
}

export async function removeMember(memberId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase.from('business_members').delete().eq('id', memberId)

  if (error) {
    console.error('removeMember: delete failed', error)
    return { error: 'No pudimos quitar al miembro.' }
  }

  revalidatePath('/equipo')
  return { success: true }
}
