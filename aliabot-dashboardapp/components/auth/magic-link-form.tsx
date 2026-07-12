'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const OTP_RE = /^\d{6}$/

type Mode = 'signin' | 'signup'
type Step = 'request' | 'verify'
type Status = 'idle' | 'loading' | 'error'

export function MagicLinkForm({ mode }: { mode: Mode }) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleRequestCode(event: FormEvent) {
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

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: mode === 'signup',
        ...(mode === 'signup' ? { data: { business_name: businessName.trim() } } : {}),
      },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(
        mode === 'signin' && /signup/i.test(error.message)
          ? 'No encontramos una cuenta con ese correo. Crea una cuenta gratis.'
          : error.message || 'No pudimos enviar el código. Intenta de nuevo.',
      )
      return
    }

    setStatus('idle')
    setStep('verify')
  }

  async function handleVerifyCode(event: FormEvent) {
    event.preventDefault()

    if (!OTP_RE.test(code)) {
      setStatus('error')
      setErrorMessage('Ingresa el código de 6 dígitos que te enviamos.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    const supabase = createClient()

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message || 'El código no es válido o expiró.')
      return
    }

    if (mode === 'signup' && data.user) {
      const { data: business } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', data.user.id)
        .maybeSingle()

      if (!business) {
        const name =
          businessName.trim() ||
          (data.user.user_metadata as { business_name?: string } | null)?.business_name ||
          ''

        if (name) {
          const { error: insertError } = await supabase.from('businesses').insert({
            user_id: data.user.id,
            name,
          })

          if (insertError) {
            console.error('MagicLinkForm: failed to create business', insertError)
          }
        }
      }
    }

    router.push('/')
    router.refresh()
  }

  async function handleResend() {
    setStatus('loading')
    setErrorMessage('')

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: mode === 'signup',
        ...(mode === 'signup' ? { data: { business_name: businessName.trim() } } : {}),
      },
    })

    if (error) {
      setStatus('error')
      setErrorMessage(error.message || 'No pudimos reenviar el código. Intenta de nuevo.')
      return
    }

    setStatus('idle')
  }

  if (step === 'verify') {
    return (
      <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-sm text-white/90">
            Te enviamos un código de 6 dígitos a <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium text-white/80">
            Código de acceso
          </label>
          <input
            id="code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            className="h-12 rounded-lg border border-white/10 bg-white/5 px-3 text-center text-lg tracking-[0.5em] text-white placeholder:text-white/40 outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-brand/30"
            disabled={status === 'loading'}
          />
        </div>

        {status === 'error' && <p className="text-sm text-error">{errorMessage}</p>}

        <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? 'Verificando...' : 'Confirmar código'}
        </Button>

        <p className="text-center text-sm text-white/50">
          ¿No te llegó?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={status === 'loading'}
            className="text-brand-soft hover:underline disabled:opacity-50"
          >
            Reenviar código
          </button>
        </p>

        <button
          type="button"
          onClick={() => {
            setStep('request')
            setCode('')
            setStatus('idle')
            setErrorMessage('')
          }}
          className="text-center text-sm text-white/50 hover:underline"
        >
          Usar otro correo
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
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
        {status === 'loading' ? 'Enviando...' : 'Enviar código de acceso'}
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
