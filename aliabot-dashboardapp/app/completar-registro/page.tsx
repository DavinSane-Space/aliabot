'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { AuthShell } from '@/components/auth/auth-shell'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function CompletarRegistroPage() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()

    if (businessName.trim().length === 0) {
      setStatus('error')
      setErrorMessage('Ingresa el nombre de tu negocio.')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.replace('/iniciar-sesion')
      return
    }

    const { error } = await supabase.from('businesses').insert({
      user_id: user.id,
      name: businessName.trim(),
    })

    if (error) {
      setStatus('error')
      setErrorMessage('No pudimos guardar tu negocio. Intenta de nuevo.')
      return
    }

    router.replace('/')
  }

  return (
    <AuthShell
      title="Completa tu registro"
      subtitle="Un último paso: cuéntanos el nombre de tu negocio."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {status === 'error' && <p className="text-sm text-error">{errorMessage}</p>}

        <Button type="submit" size="lg" disabled={status === 'loading'} className="w-full">
          {status === 'loading' ? 'Guardando...' : 'Continuar'}
        </Button>
      </form>
    </AuthShell>
  )
}
