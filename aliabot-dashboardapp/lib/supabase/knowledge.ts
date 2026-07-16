import type { SupabaseClient } from '@supabase/supabase-js'

export type KnowledgeSourceType = 'website' | 'document' | 'qa'
export type KnowledgeSourceStatus = 'pending' | 'processing' | 'ready' | 'error'

export type KnowledgeSource = {
  id: string
  agent_id: string
  type: KnowledgeSourceType
  status: KnowledgeSourceStatus
  title: string | null
  source_url: string | null
  file_name: string | null
  question: string | null
  answer: string | null
  pages_count: number | null
  error_message: string | null
  created_at: string
  updated_at: string
}

export async function getKnowledgeSources(
  supabase: SupabaseClient,
  agentId: string,
): Promise<KnowledgeSource[]> {
  const { data, error } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getKnowledgeSources: failed to load', error)
    return []
  }

  return data ?? []
}

export function sumPagesUsed(sources: KnowledgeSource[]): number {
  return sources.reduce((total, s) => total + (s.pages_count ?? 0), 0)
}
