import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente con service_role: bypassa RLS. Nunca importar desde código de cliente
 * ni usarlo para leer/escribir datos en nombre del usuario — solo para
 * operaciones puntuales donde el ownership ya se verificó explícitamente
 * (ver lib/actions/knowledge-actions.ts, workaround para el bug de Storage
 * con llaves JWT asimétricas: supabase/discussions#45812).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en el entorno del servidor.')
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
