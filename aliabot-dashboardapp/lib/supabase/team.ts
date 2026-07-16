import type { SupabaseClient } from '@supabase/supabase-js'

export type MemberStatus = 'pending' | 'active'

export type BusinessMember = {
  id: string
  email: string
  status: MemberStatus
  invitedAt: string
  joinedAt: string | null
}

export async function getBusinessMembers(
  supabase: SupabaseClient,
  businessId: string,
): Promise<BusinessMember[]> {
  const { data, error } = await supabase
    .from('business_members')
    .select('id, email, status, invited_at, joined_at')
    .eq('business_id', businessId)
    .order('invited_at', { ascending: true })

  if (error) {
    console.error('getBusinessMembers: failed to load', error)
    return []
  }

  return (data ?? []).map((m) => ({
    id: m.id,
    email: m.email,
    status: m.status,
    invitedAt: m.invited_at,
    joinedAt: m.joined_at,
  }))
}
