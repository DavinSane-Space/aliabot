import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { MagicLinkForm } from '@/components/auth/magic-link-form'

export const metadata: Metadata = {
  title: 'Crear cuenta — Aliabot',
}

export default function CrearCuentaPage() {
  return (
    <AuthShell
      title="Crea tu cuenta"
      subtitle="Sin contraseña: te enviamos un código de acceso a tu correo."
    >
      <MagicLinkForm mode="signup" />
    </AuthShell>
  )
}
