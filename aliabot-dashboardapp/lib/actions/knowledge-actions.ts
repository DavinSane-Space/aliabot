'use server'

import { revalidatePath } from 'next/cache'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getPlanPageLimit } from '@/lib/knowledge-plan'

type ActionResult = { error?: string; success?: true }

async function assertUnderPageLimit(
  supabase: SupabaseClient,
  agentId: string,
): Promise<ActionResult> {
  const { data: agent } = await supabase
    .from('agents')
    .select('business_id')
    .eq('id', agentId)
    .maybeSingle()

  if (!agent) return { error: 'No encontramos tu agente.' }

  const { data: business } = await supabase
    .from('businesses')
    .select('plan')
    .eq('id', agent.business_id)
    .maybeSingle()

  const limit = getPlanPageLimit(business?.plan ?? null)

  const { data: sources } = await supabase
    .from('knowledge_sources')
    .select('pages_count')
    .eq('agent_id', agentId)

  const used = (sources ?? []).reduce((total, s) => total + (s.pages_count ?? 0), 0)

  if (used >= limit) {
    return {
      error: `Alcanzaste el límite de ${limit} páginas de tu plan. Mejora a Pro para agregar más.`,
    }
  }

  return {}
}

function revalidateKnowledge() {
  revalidatePath('/conocimiento')
  revalidatePath('/')
}

export async function addWebsiteSource(agentId: string, url: string): Promise<ActionResult> {
  const trimmed = url.trim()
  if (!/^https?:\/\/.+/i.test(trimmed)) {
    return { error: 'Ingresa una URL válida (debe empezar con http:// o https://).' }
  }

  const supabase = await createClient()

  const limitCheck = await assertUnderPageLimit(supabase, agentId)
  if (limitCheck.error) return limitCheck

  const { error } = await supabase.from('knowledge_sources').insert({
    agent_id: agentId,
    type: 'website',
    status: 'pending',
    title: trimmed,
    source_url: trimmed,
  })

  if (error) {
    console.error('addWebsiteSource: insert failed', error)
    return { error: 'No pudimos guardar el sitio. Intenta de nuevo.' }
  }

  revalidateKnowledge()
  return { success: true }
}

export async function addDocumentSource(agentId: string, formData: FormData): Promise<ActionResult> {
  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'Selecciona un archivo PDF.' }
  if (file.type !== 'application/pdf') return { error: 'Solo se aceptan archivos PDF.' }

  const supabase = await createClient()

  const limitCheck = await assertUnderPageLimit(supabase, agentId)
  if (limitCheck.error) return limitCheck

  const { data: agent } = await supabase
    .from('agents')
    .select('business_id')
    .eq('id', agentId)
    .maybeSingle()

  if (!agent) return { error: 'No encontramos tu agente.' }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Tu sesión expiró. Vuelve a iniciar sesión.' }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', agent.business_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!business) return { error: 'No tienes acceso a este agente.' }

  const { data: source, error: insertError } = await supabase
    .from('knowledge_sources')
    .insert({ agent_id: agentId, type: 'document', status: 'pending', title: file.name, file_name: file.name })
    .select('id')
    .single()

  if (insertError || !source) {
    console.error('addDocumentSource: insert failed', insertError)
    return { error: 'No pudimos registrar el documento.' }
  }

  const path = `${agent.business_id}/${source.id}-${file.name}`

  // Workaround: Storage con RLS falla tras la migración a llaves JWT asimétricas
  // (supabase/discussions#45812, sin resolver). El ownership de agent.business_id
  // ya se verificó arriba contra el usuario autenticado, así que usamos el
  // cliente service_role solo para este upload puntual.
  const adminSupabase = createAdminClient()
  const { error: uploadError } = await adminSupabase.storage
    .from('knowledge-documents')
    .upload(path, file, { upsert: false })

  if (uploadError) {
    console.error('addDocumentSource: upload failed', uploadError)
    await supabase.from('knowledge_sources').delete().eq('id', source.id)
    return { error: 'No pudimos subir el archivo. Intenta de nuevo.' }
  }

  revalidateKnowledge()
  return { success: true }
}

export async function addQASource(
  agentId: string,
  question: string,
  answer: string,
): Promise<ActionResult> {
  const q = question.trim()
  const a = answer.trim()
  if (!q || !a) return { error: 'Completa la pregunta y la respuesta.' }

  const supabase = await createClient()

  const { error } = await supabase.from('knowledge_sources').insert({
    agent_id: agentId,
    type: 'qa',
    status: 'ready',
    title: q.slice(0, 80),
    question: q,
    answer: a,
  })

  if (error) {
    console.error('addQASource: insert failed', error)
    return { error: 'No pudimos guardar la pregunta. Intenta de nuevo.' }
  }

  revalidateKnowledge()
  return { success: true }
}

export async function updateQASource(
  sourceId: string,
  question: string,
  answer: string,
): Promise<ActionResult> {
  const q = question.trim()
  const a = answer.trim()
  if (!q || !a) return { error: 'Completa la pregunta y la respuesta.' }

  const supabase = await createClient()

  const { error } = await supabase
    .from('knowledge_sources')
    .update({ question: q, answer: a, title: q.slice(0, 80) })
    .eq('id', sourceId)

  if (error) {
    console.error('updateQASource: update failed', error)
    return { error: 'No pudimos actualizar la pregunta.' }
  }

  revalidateKnowledge()
  return { success: true }
}

export async function deleteKnowledgeSource(sourceId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: source } = await supabase
    .from('knowledge_sources')
    .select('id, type, file_name, agent_id')
    .eq('id', sourceId)
    .maybeSingle()

  if (!source) return { error: 'No encontramos la fuente.' }

  if (source.type === 'document' && source.file_name) {
    const { data: agent } = await supabase
      .from('agents')
      .select('business_id')
      .eq('id', source.agent_id)
      .maybeSingle()

    if (agent) {
      const path = `${agent.business_id}/${source.id}-${source.file_name}`
      await supabase.storage.from('knowledge-documents').remove([path])
    }
  }

  const { error } = await supabase.from('knowledge_sources').delete().eq('id', sourceId)

  if (error) {
    console.error('deleteKnowledgeSource: delete failed', error)
    return { error: 'No pudimos eliminar la fuente.' }
  }

  revalidateKnowledge()
  return { success: true }
}
