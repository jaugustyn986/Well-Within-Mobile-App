begin;

alter table public.profiles
  add column if not exists chart_data_deleted_at timestamptz null;

drop policy if exists "daily_entries_delete_own" on public.daily_entries;
create policy "daily_entries_delete_own" on public.daily_entries
  for delete using (auth.uid() = user_id);

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

alter table public.user_feedback
  drop constraint if exists user_feedback_user_id_fkey;
alter table public.user_feedback
  add constraint user_feedback_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

commit;
