import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { MagicLinkForm } from '@/components/auth/magic-link-form'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Aliabot',
}

export default async function IniciarSesionPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <AuthShell
      title="Iniciar sesión"
      subtitle="Te enviamos un link de acceso, sin contraseña."
    >
      {error === 'auth_callback_failed' && (
        <p className="mb-4 text-center text-sm text-error">
          El link expiró o no es válido. Solicita uno nuevo.
        </p>
      )}
      <MagicLinkForm mode="signin" />
    </AuthShell>
  )
}
