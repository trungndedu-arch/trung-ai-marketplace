alter table public.products
  add column if not exists demo_video_provider text,
  add column if not exists demo_video_id text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.products'::regclass
      and conname = 'products_demo_video_is_canonical'
  ) then
    alter table public.products
      add constraint products_demo_video_is_canonical check (
        (demo_video_provider is null and demo_video_id is null)
        or (
          demo_video_provider is not null
          and demo_video_id is not null
          and demo_video_provider = 'youtube'
          and demo_video_id ~ '^[A-Za-z0-9_-]{11}$'
        )
      );
  end if;
end
$$;

comment on column public.products.demo_video_provider is
  'Canonical demo video provider. Phase A supports youtube.';

comment on column public.products.demo_video_id is
  'Canonical provider video identifier. YouTube IDs are exactly 11 URL-safe characters.';
