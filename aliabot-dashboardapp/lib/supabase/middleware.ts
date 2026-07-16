import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getBusinessAccess } from '@/lib/supabase/access'

const PUBLIC_PATHS = [
  '/iniciar-sesion',
  '/crear-cuenta',
  '/auth/callback',
  '/auth/auth-code-error',
  // Nota: NO agregar '/widget' a secas — esa es /widget/page.tsx, la página
  // privada de configuración del widget en el dashboard. Solo estas rutas
  // públicas del widget embebible (chat del visitante y loader.js).
  '/widget/chat',
  '/widget/loader.js',
  '/api/widget',
]
const GATE_EXEMPT_PATHS = ['/planes', '/completar-registro']

function matchesPath(paths: string[], pathname: string) {
  return paths.some((path) => pathname === path || pathname.startsWith(`${path}/`))
}

function isPublicPath(pathname: string) {
  return matchesPath(PUBLIC_PATHS, pathname)
}

function isGateExemptPath(pathname: string) {
  return matchesPath(GATE_EXEMPT_PATHS, pathname)
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if (!user) {
    if (!isPublicPath(pathname)) {
      if (getUserError) {
        console.error(
          `updateSession: getUser() failed for ${request.method} ${pathname} — redirecting to login.`,
          getUserError,
        )
      }
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/iniciar-sesion'
      redirectUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return response
  }

  if (!isPublicPath(pathname) && !isGateExemptPath(pathname)) {
    const access = await getBusinessAccess(supabase)
    if (!access.hasAccess) {
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/planes'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}
