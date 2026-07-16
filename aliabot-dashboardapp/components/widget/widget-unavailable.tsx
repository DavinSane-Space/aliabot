export function WidgetUnavailable() {
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center gap-2 bg-white p-6 text-center">
      <p className="text-sm font-medium text-[#11143A]">Este asistente no está disponible</p>
      <p className="text-xs text-[#4A5080]">Vuelve a intentarlo más tarde.</p>
    </div>
  )
}
