-- Proposal only: review and apply manually before enabling Banner Admin uploads.

do $$
begin
  if exists (
    select 1
    from public.banners
    where (
      desktop_image_path is not null
      and desktop_image_path !~ (
        '^banners/' || id::text || '/desktop/'
        || '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
      )
    ) or (
      mobile_image_path is not null
      and mobile_image_path !~ (
        '^banners/' || id::text || '/mobile/'
        || '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
      )
    ) or (
      status = 'published'
      and nullif(trim(desktop_image_path), '') is null
    )
  ) then
    raise exception 'Existing banner rows do not satisfy the canonical banner asset contract';
  end if;
end
$$;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'banner-assets',
  'banner-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "banner assets: catalog managers can read" on storage.objects;
create policy "banner assets: catalog managers can read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'banner-assets'
  and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 3
  and (storage.foldername(name))[1] = 'banners'
  and (storage.foldername(name))[2] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (storage.foldername(name))[3] in ('desktop', 'mobile')
  and storage.filename(name) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
  and exists (
    select 1
    from public.banners
    where banners.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "banner assets: catalog managers can upload" on storage.objects;
create policy "banner assets: catalog managers can upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'banner-assets'
  and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 3
  and (storage.foldername(name))[1] = 'banners'
  and (storage.foldername(name))[2] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (storage.foldername(name))[3] in ('desktop', 'mobile')
  and storage.filename(name) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
  and exists (
    select 1
    from public.banners
    where banners.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "banner assets: catalog managers can update" on storage.objects;
-- Banner replacement uses upload-new, database-switch, then delete-old.
-- Deliberately omit UPDATE so objects cannot be moved, renamed, or overwritten.

drop policy if exists "banner assets: catalog managers can delete" on storage.objects;
create policy "banner assets: catalog managers can delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'banner-assets'
  and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 3
  and (storage.foldername(name))[1] = 'banners'
  and (storage.foldername(name))[2] ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (storage.foldername(name))[3] in ('desktop', 'mobile')
  and storage.filename(name) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
  and exists (
    select 1
    from public.banners
    where banners.id::text = (storage.foldername(name))[2]
  )
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.banners'::regclass
      and conname = 'banners_desktop_image_path_is_canonical'
  ) then
    alter table public.banners
      add constraint banners_desktop_image_path_is_canonical check (
        desktop_image_path is null
        or desktop_image_path ~ (
          '^banners/' || id::text || '/desktop/'
          || '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.banners'::regclass
      and conname = 'banners_mobile_image_path_is_canonical'
  ) then
    alter table public.banners
      add constraint banners_mobile_image_path_is_canonical check (
        mobile_image_path is null
        or mobile_image_path ~ (
          '^banners/' || id::text || '/mobile/'
          || '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[.](jpg|png|webp)$'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.banners'::regclass
      and conname = 'banners_published_requires_desktop_image'
  ) then
    alter table public.banners
      add constraint banners_published_requires_desktop_image check (
        status <> 'published'
        or nullif(trim(desktop_image_path), '') is not null
      );
  end if;
end
$$;

comment on column public.banners.desktop_image_path is
  'Canonical object path in banner-assets: banners/{banner_id}/desktop/{generated_filename}.';

comment on column public.banners.mobile_image_path is
  'Canonical object path in banner-assets: banners/{banner_id}/mobile/{generated_filename}.';
