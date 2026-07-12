-- Phase 1 schema for Well Within. Replace any existing schema with this.
-- Apply in Supabase Dashboard → SQL Editor.

-- Profiles (one row per auth user)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  chart_data_deleted_at timestamptz null
);

alter table public.profiles
  add column if not exists chart_data_deleted_at timestamptz null;

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Daily entries (one row per user per calendar date; payload in jsonb)
create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  entry_payload jsonb not null,
  client_updated_at timestamptz not null,
  server_updated_at timestamptz not null default now(),
  deleted_at timestamptz null,
  unique (user_id, entry_date)
);

create index if not exists daily_entries_user_updated on public.daily_entries (user_id, server_updated_at desc);

alter table public.daily_entries enable row level security;

create policy "daily_entries_select_own" on public.daily_entries for select using (auth.uid() = user_id);
create policy "daily_entries_insert_own" on public.daily_entries for insert with check (auth.uid() = user_id);
create policy "daily_entries_update_own" on public.daily_entries for update using (auth.uid() = user_id);
create policy "daily_entries_delete_own" on public.daily_entries for delete using (auth.uid() = user_id);

-- Permanently remove the caller's backed-up chart data. The reset timestamp is
-- checked by every device before it pushes, preventing a stale device from
-- restoring entries that the user intentionally deleted everywhere.
create or replace function public.delete_my_chart_data()
returns timestamptz
language plpgsql
security invoker
set search_path = public
as $$
declare
  caller_id uuid := auth.uid();
  reset_at timestamptz := now();
begin
  if caller_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  insert into public.profiles (id, updated_at, chart_data_deleted_at)
  values (caller_id, reset_at, reset_at)
  on conflict (id) do update
    set updated_at = excluded.updated_at,
        chart_data_deleted_at = excluded.chart_data_deleted_at;

  delete from public.daily_entries where user_id = caller_id;
  return reset_at;
end;
$$;

revoke all on function public.delete_my_chart_data() from public, anon;
grant execute on function public.delete_my_chart_data() to authenticated;

-- Trigger: server_updated_at maintained by database only; client must not write it
create or replace function update_server_timestamp()
returns trigger as $$
begin
  new.server_updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_server_timestamp on public.daily_entries;
create trigger set_server_timestamp
  before insert or update on public.daily_entries
  for each row
  execute procedure update_server_timestamp();

-- In-app product feedback (Phase 1). No read/update/delete for client roles.
create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid null references auth.users(id) on delete cascade,
  source_screen text not null,
  feedback_type text not null,
  category text not null,
  confidence text null,
  message text null,
  contact_email text null,
  contact_permission boolean null,
  include_cycle_context boolean not null default false,
  cycle_context jsonb null,
  app_version text null,
  platform text null,
  schema_version smallint not null default 1
);

-- Earlier schema versions anonymized feedback when an account was removed.
-- Account deletion now removes associated feedback too because it may contain
-- contact information or optional cycle context.
alter table public.user_feedback
  drop constraint if exists user_feedback_user_id_fkey;
alter table public.user_feedback
  add constraint user_feedback_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.user_feedback
  add column if not exists contact_email text null,
  add column if not exists contact_permission boolean null;

create index if not exists user_feedback_created_at on public.user_feedback (created_at desc);
create index if not exists user_feedback_type_cat on public.user_feedback (feedback_type, category);

alter table public.user_feedback enable row level security;

create policy "user_feedback_insert_auth" on public.user_feedback
  for insert to authenticated
  with check (user_id = auth.uid());

create policy "user_feedback_insert_anon" on public.user_feedback
  for insert to anon
  with check (user_id is null);

grant insert on table public.user_feedback to anon, authenticated;
