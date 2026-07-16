const PLAN_PAGE_LIMITS: Record<string, number> = {
  basico: 300,
  pro: 1500,
  admin: Number.POSITIVE_INFINITY,
}

const DEFAULT_LIMIT = PLAN_PAGE_LIMITS.basico

export function getPlanPageLimit(plan: string | null): number {
  if (!plan) return DEFAULT_LIMIT
  return PLAN_PAGE_LIMITS[plan] ?? DEFAULT_LIMIT
}
