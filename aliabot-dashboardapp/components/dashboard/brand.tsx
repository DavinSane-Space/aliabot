import { cn } from "@/lib/utils"

export function AliabotLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid size-9 place-items-center rounded-xl grad-primary shadow-[0_4px_20px_rgba(37,99,235,0.35)]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-5 text-white"
          aria-hidden="true"
        >
          <path
            d="M12 3 4.5 19.5h3.2l1.4-3.3h5.8l1.4 3.3h3.2L12 3Zm-1.9 10.6L12 9l1.9 4.6h-3.8Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">
        aliabot
      </span>
    </div>
  )
}

export function BotAvatar({
  className,
  color = "#2563eb",
}: {
  className?: string
  color?: string
}) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-xl border border-white/10",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${color}33, ${color}14)`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-1/2">
        <rect
          x="4"
          y="8"
          width="16"
          height="11"
          rx="4"
          stroke={color}
          strokeWidth="1.6"
          fill={`${color}22`}
        />
        <circle cx="9.5" cy="13.5" r="1.4" fill={color} />
        <circle cx="14.5" cy="13.5" r="1.4" fill={color} />
        <path
          d="M12 4v4M12 4l-1.6.9M12 4l1.6.9"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="12" cy="3.2" r="1.1" fill={color} />
      </svg>
    </span>
  )
}
