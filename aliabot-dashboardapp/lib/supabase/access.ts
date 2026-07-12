import type { SupabaseClient } from '@supabase/supabase-js'

export type BusinessAccess = {
  hasAccess: boolean
  status: string | null
  plan: string | null
  isTrial: boolean
  trialDaysLeft: number | null
}

const NO_ACCESS: BusinessAccess = {
  hasAccess: false,
  status: null,
  plan: null,
  isTrial: false,
  trialDaysLeft: null,
}

const ADMIN_EMAILS = ['santiago.op7.morales@gmail.com']

export async function getBusinessAccess(supabase: SupabaseClient): Promise<BusinessAccess> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NO_ACCESS
  }

  if (user.email && ADMIN_EMAILS.includes(user.email)) {
    return { hasAccess: true, status: 'active', plan: 'admin', isTrial: false, trialDaysLeft: null }
  }

  const { data: business, error } = await supabase
    .from('businesses')
    .select('subscription_status, plan, trial_ends_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) {
    console.error('getBusinessAccess: failed to load business', error)
    return NO_ACCESS
  }

  if (!business) {
    return NO_ACCESS
  }

  const { subscription_status, plan, trial_ends_at } = business

  if (subscription_status === 'active') {
    return { hasAccess: true, status: subscription_status, plan, isTrial: false, trialDaysLeft: null }
  }

  if (subscription_status === 'trial' && trial_ends_at) {
    const msLeft = new Date(trial_ends_at).getTime() - Date.now()
    if (msLeft > 0) {
      const trialDaysLeft = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))
      return { hasAccess: true, status: subscription_status, plan, isTrial: true, trialDaysLeft }
    }
  }

  return { hasAccess: false, status: subscription_status, plan, isTrial: false, trialDaysLeft: null }
}
