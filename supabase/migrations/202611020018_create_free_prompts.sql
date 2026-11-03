-- REVIEW ONLY — do not apply without a separate approval and a legacy-data import plan.
create table public.free_prompts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null,
  prompt_content text not null,
  cover_image_url text,
  model text not null default 'Khác',
  category text not null default 'Khác',
  tags text[] not null default '{}',
  usage_instructions text,
  seo_title text,
  seo_description text,
  presentation_metadata jsonb not null default '{}'::jsonb,
  status public.publication_status not null default 'draft',
  display_order integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint free_prompts_display_order_nonnegative check (display_order >= 0)
);
create index free_prompts_public_idx on public.free_prompts (status, display_order, created_at desc) where deleted_at is null;
alter table public.free_prompts enable row level security;
create policy "free prompts public read published" on public.free_prompts for select to anon, authenticated using (status = 'published' and deleted_at is null);
create policy "free prompts editor admin manage" on public.free_prompts for all to authenticated using (public.has_role('editor') or public.has_role('admin')) with check (public.has_role('editor') or public.has_role('admin'));
create trigger free_prompts_set_updated_at before update on public.free_prompts for each row execute procedure public.set_updated_at();
grant select on public.free_prompts to anon, authenticated;
grant insert, update, delete on public.free_prompts to authenticated;
-- REVIEW ONLY: this import function is deliberately not granted to app roles.
-- A separately approved, privileged migration session may call it with the
-- generated payload from scripts/free-prompts-import.ts. Existing slugs are
-- always skipped, preserving every Admin edit/status/deletion on re-runs.
create function public.import_legacy_free_prompts(p_rows jsonb, p_dry_run boolean default true)
returns table(slug text, action text)
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  row_payload jsonb;
  row_slug text;
begin
  if jsonb_typeof(p_rows) <> 'array' then
    raise exception 'Legacy Prompt import payload must be a JSON array';
  end if;
  for row_payload in select value from jsonb_array_elements(p_rows) loop
    row_slug := row_payload->>'slug';
    if row_slug is null or row_slug = '' then
      raise exception 'Legacy Prompt import payload contains an empty slug';
    end if;
    if exists (select 1 from public.free_prompts where free_prompts.slug = row_slug) then
      return query select row_slug, 'skipped_existing'::text;
    elsif p_dry_run then
      return query select row_slug, 'would_insert'::text;
    else
      insert into public.free_prompts (
        slug, title, short_description, prompt_content, cover_image_url,
        model, category, tags, usage_instructions, seo_title, seo_description,
        status, display_order, presentation_metadata
      ) values (
        row_slug, row_payload->>'title', coalesce(row_payload->>'short_description', ''), row_payload->>'prompt_content',
        nullif(row_payload->>'cover_image_url', ''), coalesce(row_payload->>'model', 'Khác'), coalesce(row_payload->>'category', 'Khác'),
        array(select jsonb_array_elements_text(coalesce(row_payload->'tags', '[]'::jsonb))),
        nullif(row_payload->>'usage_instructions', ''), nullif(row_payload->>'seo_title', ''), nullif(row_payload->>'seo_description', ''),
        coalesce(row_payload->>'status', 'published')::public.publication_status,
        coalesce((row_payload->>'display_order')::integer, 0), coalesce(row_payload->'presentation_metadata', '{}'::jsonb)
      ) on conflict (slug) do nothing;
      if found then
        return query select row_slug, 'inserted'::text;
      else
        return query select row_slug, 'skipped_existing'::text;
      end if;
    end if;
  end loop;
end;
$$;
revoke all on function public.import_legacy_free_prompts(jsonb, boolean) from public, anon, authenticated;

-- Public RLS deliberately cannot reveal Draft/Hidden rows. This function only
-- exposes whether one of the fixed legacy URLs has a DB override, never its
-- content or status. It prevents a suppressed legacy Prompt reappearing during
-- the transitional fallback period.
create function public.free_prompt_legacy_overrides()
returns table(slug text)
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select free_prompts.slug
  from public.free_prompts
  where free_prompts.slug = any (array[
    'mini-food-world', 'quang-cao-do-uong-splash-sieu-thuc', 'poster-quang-cao-dong-ho-cao-cap', 'minh-hoa-lich-su-cong-cu-co-dai', 'thoi-trang-the-thao-nike-sieu-thuc',
    'doodle-tuong-tac-anh-goc', 'tap-chi-thoi-trang-orbit', 'nhan-vat-3d-cuong-dieu-hoa', 'nhan-vat-cho-streetwear-3d-thoi-trang', 'bia-tap-chi-beauty-pop-art',
    'anh-san-pham-doodle-toi-gian', 'poster-quang-cao-my-pham-phong-cach-mem-mai', 'tao-kol-thoi-trang-tre-trung-sang-trong', 'storyboard-skincare', 'poster-quang-cao-thoi-trang-cao-cap',
    'quang-cao-nuoc-hoa-dien-anh-cao-cap', 'prompt-video-suc-khoe-hoat-hinh-3d', 'tao-anh-quang-cao-do-lot', 'character-sheet-dong-nhat-nhan-vat', 'op-dien-thoai-xinh',
    'thoi-trang-ao-dai-trung-nien', 'thoi-trang-bong-ro-nam', 'lam-net-anh', 'doanh-nhan-nu-studio', 'mau-nu-ngoi-o-to'
  ]::text[]);
$$;
revoke all on function public.free_prompt_legacy_overrides() from public;
grant execute on function public.free_prompt_legacy_overrides() to anon, authenticated;
-- REVIEW ONLY: reuse the existing public product-assets bucket; apply these
-- policies only together with this table migration.
create policy "free prompts managers upload covers" on storage.objects for insert to authenticated with check (
  bucket_id='product-assets' and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 4
  and (storage.foldername(name))[1]='free-prompts'
  and (storage.foldername(name))[3]='cover'
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp')
  and exists (select 1 from public.free_prompts where free_prompts.id::text = (storage.foldername(name))[2])
);
create policy "free prompts managers delete covers" on storage.objects for delete to authenticated using (
  bucket_id='product-assets' and (public.has_role('editor') or public.has_role('admin'))
  and array_length(storage.foldername(name), 1) = 4
  and (storage.foldername(name))[1]='free-prompts'
  and (storage.foldername(name))[3]='cover'
  and lower(storage.extension(name)) in ('jpg','jpeg','png','webp')
  and exists (select 1 from public.free_prompts where free_prompts.id::text = (storage.foldername(name))[2])
);
