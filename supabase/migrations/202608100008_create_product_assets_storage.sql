-- Proposal only: apply after reviewing the bucket and Storage policies.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-assets',
  'product-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "product assets: catalog managers can read" on storage.objects;
create policy "product assets: catalog managers can read"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'product-assets'
  and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 3
  and (storage.foldername(name))[1] = 'products'
  and (storage.foldername(name))[3] = 'cover'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  and exists (
    select 1
    from public.products
    where products.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "product assets: catalog managers can upload covers" on storage.objects;
create policy "product assets: catalog managers can upload covers"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-assets'
  and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 3
  and (storage.foldername(name))[1] = 'products'
  and (storage.foldername(name))[3] = 'cover'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  and exists (
    select 1
    from public.products
    where products.id::text = (storage.foldername(name))[2]
  )
);

drop policy if exists "product assets: catalog managers can update covers" on storage.objects;
-- Cover replacement uses upload-new, database-switch, then delete-old.
-- Deliberately omit UPDATE so objects cannot be moved, renamed, or overwritten.

drop policy if exists "product assets: catalog managers can delete covers" on storage.objects;
create policy "product assets: catalog managers can delete covers"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-assets'
  and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 3
  and (storage.foldername(name))[1] = 'products'
  and (storage.foldername(name))[3] = 'cover'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
  and exists (
    select 1
    from public.products
    where products.id::text = (storage.foldername(name))[2]
  )
);
