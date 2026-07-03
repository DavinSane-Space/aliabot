import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/iniciar-sesion?error=missing_code`)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/iniciar-sesion?error=auth_callback_failed`)
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', data.user.id)
    .maybeSingle()

  if (business) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  const businessName = (data.user.user_metadata as { business_name?: string } | null)
    ?.business_name

  if (businessName) {
    await supabase.from('businesses').insert({
      user_id: data.user.id,
      name: businessName,
    })
    return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/completar-registro`)
}
