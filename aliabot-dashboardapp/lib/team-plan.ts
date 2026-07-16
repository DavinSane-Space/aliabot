const PLAN_MEMBER_LIMITS: Record<string, number> = {
  basico: 1,
  pro: 3,
  admin: Number.POSITIVE_INFINITY,
}

const DEFAULT_LIMIT = PLAN_MEMBER_LIMITS.basico

export function getPlanMemberLimit(plan: string | null): number {
  if (!plan) return DEFAULT_LIMIT
  return PLAN_MEMBER_LIMITS[plan] ?? DEFAULT_LIMIT
}
