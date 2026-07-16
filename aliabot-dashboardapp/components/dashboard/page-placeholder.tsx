import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export function PagePlaceholder({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="card-surface flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-2xl p-10 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-[#2563EB]/10 text-[#2563EB]">
        <Icon className="size-6" />
      </span>
      <h1 className="text-lg font-semibold text-[#11143A]">{title}</h1>
      <p className="max-w-sm text-sm text-[#4A5080]">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
