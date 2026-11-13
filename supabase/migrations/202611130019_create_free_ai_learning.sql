-- REVIEW ONLY — do not apply to Supabase production without separate approval.
-- Adds homepage-only YouTube learning content. No seed videos are included.

create table public.free_ai_learning_videos (
  id uuid primary key default gen_random_uuid(),
  youtube_video_id text not null unique,
  video_url text not null,
  title text not null,
  display_order integer not null default 0,
  is_visible boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint free_ai_learning_video_id_format check (youtube_video_id ~ '^[A-Za-z0-9_-]{11}$'),
  constraint free_ai_learning_video_title_valid check (char_length(btrim(title)) between 1 and 200),
  constraint free_ai_learning_display_order_nonnegative check (display_order >= 0),
  constraint free_ai_learning_video_url_https check (video_url ~ '^https://www[.]youtube[.]com/watch[?]v=[A-Za-z0-9_-]{11}$')
);

create index free_ai_learning_public_order_idx
  on public.free_ai_learning_videos (display_order, created_at, id)
  where is_visible;

create trigger free_ai_learning_videos_set_updated_at
  before update on public.free_ai_learning_videos
  for each row execute procedure public.set_updated_at();

insert into public.site_settings (key, value, visibility, description)
values
  ('free_ai_learning.section_enabled', 'false'::jsonb, 'public', 'Bật khu vực Học AI Miễn Phí trên trang chủ'),
  ('free_ai_learning.youtube_channel_url', '""'::jsonb, 'public', 'URL kênh YouTube cho khu vực Học AI Miễn Phí'),
  ('free_ai_learning.channel_button_enabled', 'false'::jsonb, 'public', 'Bật nút xem thêm video trên YouTube')
on conflict (key) do nothing;

alter table public.free_ai_learning_videos enable row level security;

create policy "free AI learning: public read visible when section enabled"
  on public.free_ai_learning_videos
  for select to anon, authenticated
  using (
    is_visible
    and exists (
      select 1
      from public.site_settings
      where site_settings.key = 'free_ai_learning.section_enabled'
        and site_settings.visibility = 'public'
        and site_settings.value = 'true'::jsonb
    )
  );

create policy "free AI learning: admin manages videos"
  on public.free_ai_learning_videos
  for all to authenticated
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

grant select on public.free_ai_learning_videos to anon, authenticated;
grant insert, update, delete on public.free_ai_learning_videos to authenticated;

-- The existing permissive Editor policy covers every public site_settings key.
-- Replace it so only Admin can mutate the free_ai_learning namespace while
-- preserving Editor access to all other existing public settings.
drop policy if exists "site settings: editor can manage public settings" on public.site_settings;
create policy "site settings: editor can manage public settings"
  on public.site_settings
  for all to authenticated
  using (
    visibility = 'public'
    and key not like 'free_ai_learning.%'
    and (public.has_role('editor') or public.has_role('admin'))
  )
  with check (
    visibility = 'public'
    and key not like 'free_ai_learning.%'
    and (public.has_role('editor') or public.has_role('admin'))
  );

-- The existing "site settings: admin can manage all settings" policy remains
-- authoritative for these keys. No EXECUTE grants or SECURITY DEFINER helpers
-- are added by this migration.
