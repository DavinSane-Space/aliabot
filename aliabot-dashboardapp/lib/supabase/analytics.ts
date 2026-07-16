import type { SupabaseClient } from '@supabase/supabase-js'

export type DailyMessageCount = { date: string; count: number }
export type FrequentQuestion = { text: string; count: number }

export type AnalyticsData = {
  totalMessages: number
  dailyMessages: DailyMessageCount[]
  topQuestions: FrequentQuestion[]
}

const DAYS = 14

function buildEmptyDays(): DailyMessageCount[] {
  const days: DailyMessageCount[] = []
  for (let i = DAYS - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({ date: d.toISOString().slice(0, 10), count: 0 })
  }
  return days
}

export async function getAnalyticsData(
  supabase: SupabaseClient,
  agentId: string,
): Promise<AnalyticsData> {
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id')
    .eq('agent_id', agentId)

  const conversationIds = (conversations ?? []).map((c) => c.id)

  if (conversationIds.length === 0) {
    return { totalMessages: 0, dailyMessages: buildEmptyDays(), topQuestions: [] }
  }

  const since = new Date()
  since.setDate(since.getDate() - (DAYS - 1))
  since.setHours(0, 0, 0, 0)

  const [{ data: recentMessages }, { count: totalMessages }] = await Promise.all([
    supabase
      .from('messages')
      .select('role, content, created_at')
      .in('conversation_id', conversationIds)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true }),
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .in('conversation_id', conversationIds),
  ])

  const all = recentMessages ?? []

  const dailyMap = new Map<string, number>()
  for (const day of buildEmptyDays()) dailyMap.set(day.date, 0)
  for (const m of all) {
    const day = (m.created_at as string).slice(0, 10)
    if (dailyMap.has(day)) dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1)
  }

  const questionCounts = new Map<string, number>()
  for (const m of all) {
    if (m.role !== 'visitor') continue
    const text = (m.content as string).trim()
    if (!text) continue
    questionCounts.set(text, (questionCounts.get(text) ?? 0) + 1)
  }

  const topQuestions = Array.from(questionCounts.entries())
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    totalMessages: totalMessages ?? 0,
    dailyMessages: Array.from(dailyMap.entries()).map(([date, count]) => ({ date, count })),
    topQuestions,
  }
}
