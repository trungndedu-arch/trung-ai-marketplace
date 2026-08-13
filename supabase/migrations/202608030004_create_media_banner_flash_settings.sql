create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  position text not null,
  desktop_image_path text,
  mobile_image_path text,
  title text,
  subtitle text,
  cta_label text,
  cta_url text,
  status public.publication_status not null default 'draft',
  start_at timestamptz,
  end_at timestamptz,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint banners_valid_schedule check (
    start_at is null or end_at is null or end_at > start_at
  )
);

create table if not exists public.flash_sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sale_price numeric(12, 0) not null,
  status public.flash_sale_status not null default 'scheduled',
  start_at timestamptz not null,
  end_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint flash_sales_sale_price_nonnegative check (sale_price >= 0),
  constraint flash_sales_valid_schedule check (end_at > start_at)
);

create or replace function public.validate_flash_sale()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  product_is_sellable boolean;
  product_price numeric(12, 0);
begin
  if new.status = 'ended' then
    return new;
  end if;

  select sellable, price
  into product_is_sellable, product_price
  from public.products
  where id = new.product_id;

  if not coalesce(product_is_sellable, false) then
    raise exception 'Flash sales are only allowed for sellable products';
  end if;

  if product_price is null or new.sale_price >= product_price then
    raise exception 'Flash sale price must be lower than the current product price';
  end if;

  return new;
end;
$$;

create or replace function public.validate_product_flash_sales()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1
    from public.flash_sales
    where product_id = new.id
      and status <> 'ended'
      and (
        not new.sellable
        or new.price is null
        or sale_price >= new.price
      )
  ) then
    raise exception 'Product price and sellable status would invalidate an existing flash sale';
  end if;

  return new;
end;
$$;

drop trigger if exists flash_sales_validate_product on public.flash_sales;
create trigger flash_sales_validate_product
  before insert or update on public.flash_sales
  for each row execute procedure public.validate_flash_sale();

drop trigger if exists products_validate_flash_sales on public.products;
create trigger products_validate_flash_sales
  before update of price, sellable on public.products
  for each row execute procedure public.validate_product_flash_sales();

alter table public.flash_sales
  add constraint flash_sales_no_overlapping_schedules
  exclude using gist (
    product_id with =,
    tstzrange(start_at, end_at, '[)') with &&
  ) where (status in ('scheduled', 'active'));

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  visibility public.setting_visibility not null default 'public',
  description text,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.affiliate_clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  source_page text,
  referrer text,
  user_agent text,
  ip_hash text,
  clicked_at timestamptz not null default now()
);
