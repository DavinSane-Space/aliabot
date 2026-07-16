import type { SupabaseClient } from '@supabase/supabase-js'

export type Business = {
  id: string
  name: string
  subscription_status: string
  plan: string | null
  trial_ends_at: string | null
}

export async function getCurrentBusiness(supabase: SupabaseClient): Promise<Business | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('businesses')
    .select('id, name, subscription_status, plan, trial_ends_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('getCurrentBusiness: failed to load business', error)
    return null
  }

  return data
}
