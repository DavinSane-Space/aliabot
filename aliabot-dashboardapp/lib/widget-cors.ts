import { NextResponse } from 'next/server'

/**
 * The widget is embedded on arbitrary third-party sites (Maindstar/Davinsane
 * client domains, etc.), so these endpoints must be reachable cross-origin
 * from anywhere. No cookies/credentials are used, so a wildcard is safe.
 */
export const WIDGET_CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export function corsJson(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: WIDGET_CORS_HEADERS,
  })
}

export function corsOptions() {
  return new NextResponse(null, { status: 204, headers: WIDGET_CORS_HEADERS })
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isValidUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_RE.test(value)
}
