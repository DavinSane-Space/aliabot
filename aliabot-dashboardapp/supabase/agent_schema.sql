-- Run in the Supabase SQL editor for your project.
-- Adds the single-agent schema: one agent per business, its knowledge
-- sources, widget configuration, conversations and messages.

-- ------------------------------------------------------------------
-- Shared helper: keep updated_at fresh on UPDATE
-- ------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ------------------------------------------------------------------
-- agents (1 business -> 1 agent)
-- ------------------------------------------------------------------
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses (id) on delete cascade,
  name text not null default 'Mi Asistente',
  status text not null default 'draft' check (status in ('draft', 'live', 'paused')),
  avatar_color text not null default '#2563EB',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists agents_business_id_key on public.agents (business_id);

drop trigger if exists set_agents_updated_at on public.agents;
create trigger set_agents_updated_at
  before update on public.agents
  for each row execute function public.set_updated_at();

alter table public.agents enable row level security;

create policy "Users can read their own agent"
  on public.agents for select
  using (exists (
    select 1 from public.businesses b
    where b.id = agents.business_id and b.user_id = auth.uid()
  ));

create policy "Users can insert their own agent"
  on public.agents for insert
  with check (exists (
    select 1 from public.businesses b
    where b.id = agents.business_id and b.user_id = auth.uid()
  ));

create policy "Users can update their own agent"
  on public.agents for update
  using (exists (
    select 1 from public.businesses b
    where b.id = agents.business_id and b.user_id = auth.uid()
  ));

create policy "Users can delete their own agent"
  on public.agents for delete
  using (exists (
    select 1 from public.businesses b
    where b.id = agents.business_id and b.user_id = auth.uid()
  ));

-- ------------------------------------------------------------------
-- knowledge_sources
-- ------------------------------------------------------------------
create table if not exists public.knowledge_sources (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents (id) on delete cascade,
  type text not null check (type in ('website', 'document', 'qa')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'ready', 'error')),
  title text,
  source_url text,
  file_name text,
  question text,
  answer text,
  pages_count integer,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_sources_agent_id_idx on public.knowledge_sources (agent_id);

drop trigger if exists set_knowledge_sources_updated_at on public.knowledge_sources;
create trigger set_knowledge_sources_updated_at
  before update on public.knowledge_sources
  for each row execute function public.set_updated_at();

alter table public.knowledge_sources enable row level security;

create policy "Users can read their own knowledge sources"
  on public.knowledge_sources for select
  using (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = knowledge_sources.agent_id and b.user_id = auth.uid()
  ));

create policy "Users can insert their own knowledge sources"
  on public.knowledge_sources for insert
  with check (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = knowledge_sources.agent_id and b.user_id = auth.uid()
  ));

create policy "Users can update their own knowledge sources"
  on public.knowledge_sources for update
  using (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = knowledge_sources.agent_id and b.user_id = auth.uid()
  ));

create policy "Users can delete their own knowledge sources"
  on public.knowledge_sources for delete
  using (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = knowledge_sources.agent_id and b.user_id = auth.uid()
  ));

-- ------------------------------------------------------------------
-- widget_config (1 agent -> 1 config)
-- ------------------------------------------------------------------
create table if not exists public.widget_config (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents (id) on delete cascade,
  primary_color text not null default 'linear-gradient(135deg, #2563EB, #7C3AED)',
  position text not null default 'bottom-right' check (position in ('bottom-right', 'bottom-left')),
  welcome_message text not null default '¡Hola! ¿En qué puedo ayudarte hoy?',
  bot_display_name text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists widget_config_agent_id_key on public.widget_config (agent_id);

drop trigger if exists set_widget_config_updated_at on public.widget_config;
create trigger set_widget_config_updated_at
  before update on public.widget_config
  for each row execute function public.set_updated_at();

alter table public.widget_config enable row level security;

create policy "Users can read their own widget config"
  on public.widget_config for select
  using (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = widget_config.agent_id and b.user_id = auth.uid()
  ));

create policy "Users can insert their own widget config"
  on public.widget_config for insert
  with check (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = widget_config.agent_id and b.user_id = auth.uid()
  ));

create policy "Users can update their own widget config"
  on public.widget_config for update
  using (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = widget_config.agent_id and b.user_id = auth.uid()
  ));

-- ------------------------------------------------------------------
-- conversations
-- Note: the public chat widget is not connected yet. Once it is, visitor
-- inserts will go through a server route using the service role key, so
-- no anonymous/public RLS policy is added here.
-- ------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents (id) on delete cascade,
  visitor_id text not null,
  status text not null default 'active' check (status in ('active', 'resolved', 'escalated')),
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

create index if not exists conversations_agent_id_idx on public.conversations (agent_id);

alter table public.conversations enable row level security;

create policy "Users can read their own conversations"
  on public.conversations for select
  using (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = conversations.agent_id and b.user_id = auth.uid()
  ));

create policy "Users can update their own conversations"
  on public.conversations for update
  using (exists (
    select 1 from public.agents a
    join public.businesses b on b.id = a.business_id
    where a.id = conversations.agent_id and b.user_id = auth.uid()
  ));

-- ------------------------------------------------------------------
-- messages
-- ------------------------------------------------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('visitor', 'bot', 'human_agent')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_id_idx on public.messages (conversation_id);

alter table public.messages enable row level security;

create policy "Users can read their own messages"
  on public.messages for select
  using (exists (
    select 1 from public.conversations c
    join public.agents a on a.id = c.agent_id
    join public.businesses b on b.id = a.business_id
    where c.id = messages.conversation_id and b.user_id = auth.uid()
  ));

create policy "Users can insert their own messages"
  on public.messages for insert
  with check (exists (
    select 1 from public.conversations c
    join public.agents a on a.id = c.agent_id
    join public.businesses b on b.id = a.business_id
    where c.id = messages.conversation_id and b.user_id = auth.uid()
  ));

-- ------------------------------------------------------------------
-- Storage bucket for uploaded documents (Fase 4 - Documentos)
-- ------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('knowledge-documents', 'knowledge-documents', false)
on conflict (id) do nothing;

drop policy if exists "Users can read their own knowledge documents" on storage.objects;
create policy "Users can read their own knowledge documents"
  on storage.objects for select
  using (
    bucket_id = 'knowledge-documents'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[1] and b.user_id = auth.uid()
    )
  );

drop policy if exists "Users can upload their own knowledge documents" on storage.objects;
create policy "Users can upload their own knowledge documents"
  on storage.objects for insert
  with check (
    bucket_id = 'knowledge-documents'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[1] and b.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update their own knowledge documents" on storage.objects;
create policy "Users can update their own knowledge documents"
  on storage.objects for update
  using (
    bucket_id = 'knowledge-documents'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[1] and b.user_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'knowledge-documents'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[1] and b.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete their own knowledge documents" on storage.objects;
create policy "Users can delete their own knowledge documents"
  on storage.objects for delete
  using (
    bucket_id = 'knowledge-documents'
    and exists (
      select 1 from public.businesses b
      where b.id::text = (storage.foldername(name))[1] and b.user_id = auth.uid()
    )
  );
