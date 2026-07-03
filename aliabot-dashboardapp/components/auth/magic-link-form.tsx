'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Mode = 'signin' | 'signup'

export function MagicLinkForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (!EMAIL_RE.test(email)) {
      setStatus('error')
      setErrorMessage('Ingresa un correo electrónico válido.')
      return
    }

    if (mode === 'signup' && businessName.trim().length === 0) {
      setStatus('error')
      setErrorMessage('Ingresa el nombre de tu negocio.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    const supabase = createClient()
    const emailRedirectTo = `${window.location.origin}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo,
        shouldCreateUser: mode === 'signup',
        ...(mode === 'signup' ? { data: { business_name: businessName.trim() } } : {}),
      },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(
        mode === 'signin' && /signup/i.test(error.message)
          ? 'No encontramos una cuenta con ese correo. Crea una cuenta gratis.'
          : error.message || 'No pudimos enviar el link. Intenta de nuevo.',
      )
      return
    }

    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-sm text-white/90">
          Revisa tu correo, te enviamos un link para entrar.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {mode === 'signup' && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="businessName" className="text-sm font-medium text-white/80">
            Nombre del negocio
          </label>
          <input
            id="businessName"
            type="text"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Mi negocio"
            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/30"
            disabled={status === 'loading'}
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-white/80">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@empresa.com"
          className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/40 outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/30"
          disabled={status === 'loading'}
        />
      </div>

      {status === 'error' && (
        <p className="text-sm text-error">{errorMessage}</p>
      )}

      <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full">
        {status === 'loading' ? 'Enviando...' : 'Enviar link de acceso'}
      </Button>

      <p className="text-center text-sm text-white/50">
        {mode === 'signin' ? (
          <>
            ¿No tienes cuenta?{' '}
            <Link href="/crear-cuenta" className="text-brand-soft hover:underline">
              Crea una gratis
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <Link href="/iniciar-sesion" className="text-brand-soft hover:underline">
              Inicia sesión
            </Link>
          </>
        )}
      </p>
    </form>
  )
}
