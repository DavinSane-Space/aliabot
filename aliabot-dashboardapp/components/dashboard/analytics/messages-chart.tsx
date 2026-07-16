import type { DailyMessageCount } from "@/lib/supabase/analytics"

function formatShortDate(iso: string | undefined) {
  if (!iso) return ""
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" })
}

export function MessagesChart({ data }: { data: DailyMessageCount[] }) {
  const max = Math.max(1, ...data.map((d) => d.count))

  return (
    <div className="card-surface rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-[#11143A]">Mensajes por día</h2>
      <p className="text-xs text-[#4A5080]">Últimos 14 días</p>
      <div className="mt-5 flex h-40 items-end gap-1.5">
        {data.map((d) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end justify-center">
              <div
                className="w-full max-w-6 rounded-sm grad-primary"
                style={{
                  height: `${(d.count / max) * 100}%`,
                  minHeight: d.count > 0 ? "4px" : "2px",
                  opacity: d.count > 0 ? 1 : 0.15,
                }}
                title={`${d.count} mensajes el ${d.date}`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-[#9CA3C0]">
        <span>{formatShortDate(data[0]?.date)}</span>
        <span>{formatShortDate(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  )
}
