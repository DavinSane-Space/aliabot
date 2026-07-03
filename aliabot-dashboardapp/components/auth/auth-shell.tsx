import { AliabotLogo } from '@/components/dashboard/brand'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <AliabotLogo />
        </div>
        <div className="rounded-2xl border border-white/10 bg-card p-8">
          <h1 className="mb-1.5 text-center text-xl font-semibold text-white">{title}</h1>
          <p className="mb-6 text-center text-sm text-white/50">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
