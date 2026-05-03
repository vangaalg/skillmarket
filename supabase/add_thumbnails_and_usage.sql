-- ============================================================
-- Skillorbit.ai — thumbnails + usage tracking
-- Run AFTER schema.sql and add_category.sql.
-- ============================================================

-- ---------- 1. thumbnail_url column ----------

alter table public.skills
  add column if not exists thumbnail_url text;

-- ---------- 2. Storage bucket for thumbnails ----------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'thumbnails',
  'thumbnails',
  true,
  1048576,                                          -- 1 MB
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies: anyone can view, anyone can upload (Phase 1 open).
-- Tighten to authed users once Supabase Auth is wired up.

drop policy if exists "thumbnails_public_read" on storage.objects;
create policy "thumbnails_public_read"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

drop policy if exists "thumbnails_public_insert" on storage.objects;
create policy "thumbnails_public_insert"
  on storage.objects for insert
  with check (bucket_id = 'thumbnails');

-- ---------- 3. Atomic usage increment ----------
-- Called by /api/skills/run on every successful turn. Upserts into
-- the analytics row so trending/popularity ranking is cheap to query.

create or replace function public.increment_skill_usage(skill_id_param uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.analytics (skill_id, usage_count, updated_at)
  values (skill_id_param, 1, now())
  on conflict (skill_id)
  do update set
    usage_count = public.analytics.usage_count + 1,
    updated_at = now();
end;
$$;

grant execute on function public.increment_skill_usage(uuid) to anon, authenticated, service_role;

-- ---------- 4. Convenience view for trending ----------
-- Joins skills with their analytics row so the landing page can fetch
-- "most used" with a single query.

create or replace view public.skills_with_usage as
  select
    s.*,
    coalesce(a.usage_count, 0) as usage_count,
    a.updated_at as last_used_at
  from public.skills s
  left join public.analytics a on a.skill_id = s.id
  where s.is_published = true;
