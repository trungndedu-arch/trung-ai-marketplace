create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  slug text not null unique,
  name text not null,
  description text,
  product_type public.product_type,
  parent_id uuid references public.categories(id) on delete set null,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  category_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  product_type public.product_type not null,
  title text not null,
  short_description text not null,
  full_description text,
  seo_title text,
  seo_description text,
  price numeric(12, 0),
  original_price numeric(12, 0),
  currency text not null default 'VND',
  access_type public.access_type not null,
  sales_status public.sales_status not null,
  publication_status public.publication_status not null,
  sellable boolean not null default false,
  affiliate_url text,
  external_url text,
  detail_url text,
  badge text,
  tags text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_nonnegative check (price is null or price >= 0),
  constraint products_original_price_nonnegative check (original_price is null or original_price >= 0),
  constraint products_original_price_not_less_than_price check (
    original_price is null or price is null or original_price >= price
  ),
  constraint products_ai_tool_requires_affiliate_url check (
    product_type <> 'ai_tool' or nullif(trim(affiliate_url), '') is not null
  ),
  constraint products_sellable_product_type check (
    not sellable or product_type in ('chatbot', 'ai_app')
  ),
  constraint products_free_access_has_no_paid_price check (
    access_type <> 'free' or price is null or price = 0
  ),
  constraint products_course_is_not_sellable check (
    product_type <> 'course' or not sellable
  )
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_type public.product_image_type not null,
  storage_path text,
  public_url text,
  alt_text text,
  aspect_ratio text not null default '9:16',
  is_primary boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_images_has_source check (
    nullif(trim(coalesce(storage_path, '')), '') is not null
    or nullif(trim(coalesce(public_url, '')), '') is not null
  )
);

create table if not exists public.product_access_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  url text not null,
  link_type public.access_link_type not null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_access_links_label_not_blank check (nullif(trim(label), '') is not null),
  constraint product_access_links_url_not_blank check (nullif(trim(url), '') is not null)
);

create or replace function public.validate_product_access_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  parent_product_type public.product_type;
begin
  select product_type into parent_product_type
  from public.products
  where id = new.product_id;

  if parent_product_type is null then
    raise exception 'Product % does not exist', new.product_id;
  end if;

  if parent_product_type not in ('chatbot', 'ai_app') then
    raise exception 'Access links are only allowed for chatbot or ai_app products';
  end if;

  return new;
end;
$$;

create or replace function public.validate_product_type_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.product_type not in ('chatbot', 'ai_app')
    and exists (
      select 1 from public.product_access_links where product_id = new.id
    ) then
    raise exception 'A product with access links must remain chatbot or ai_app';
  end if;

  return new;
end;
$$;

drop trigger if exists product_access_links_validate_product_type on public.product_access_links;
create trigger product_access_links_validate_product_type
  before insert or update of product_id on public.product_access_links
  for each row execute procedure public.validate_product_access_link();

drop trigger if exists products_validate_access_link_type on public.products;
create trigger products_validate_access_link_type
  before update of product_type on public.products
  for each row execute procedure public.validate_product_type_change();
