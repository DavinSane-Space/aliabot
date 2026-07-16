import type { NextRequest } from 'next/server'
import { corsJson, corsOptions, isValidUuid } from '@/lib/widget-cors'
import { getPublicWidgetData } from '@/lib/widget-public'

export async function OPTIONS() {
  return corsOptions()
}

export async function GET(request: NextRequest) {
  const agentId = request.nextUrl.searchParams.get('agentId')

  if (!isValidUuid(agentId)) {
    return corsJson({ error: 'agentId inválido' }, { status: 400 })
  }

  const widget = await getPublicWidgetData(agentId)

  if (!widget) {
    return corsJson({ available: false, error: 'Este asistente no está disponible' }, { status: 404 })
  }

  return corsJson({ available: true, ...widget })
}
