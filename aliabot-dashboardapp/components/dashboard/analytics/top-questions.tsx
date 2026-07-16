import type { FrequentQuestion } from "@/lib/supabase/analytics"

export function TopQuestions({ questions }: { questions: FrequentQuestion[] }) {
  if (questions.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-6 text-center">
        <p className="text-sm text-[#4A5080]">Aún no hay preguntas de visitantes para analizar.</p>
      </div>
    )
  }

  const max = Math.max(...questions.map((q) => q.count))

  return (
    <div className="card-surface rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-[#11143A]">Preguntas más frecuentes</h2>
      <p className="text-xs text-[#4A5080]">
        Por coincidencia exacta de texto — mejorará cuando conectemos la IA.
      </p>
      <ul className="mt-4 space-y-3">
        {questions.map((q) => (
          <li key={q.text}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-[#11143A]">{q.text}</span>
              <span className="shrink-0 font-medium text-[#4A5080]">{q.count}</span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-[#E2E5F0]">
              <div
                className="h-full rounded-full grad-primary"
                style={{ width: `${(q.count / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
