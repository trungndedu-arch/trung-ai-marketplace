create index if not exists categories_product_type_active_display_order_idx
  on public.categories (product_type, is_active, display_order);

create index if not exists categories_parent_id_idx on public.categories (parent_id);
create index if not exists user_roles_user_id_idx on public.user_roles (user_id);

create index if not exists products_product_type_display_order_idx
  on public.products (product_type, display_order);

create index if not exists products_category_id_display_order_idx
  on public.products (category_id, display_order);

create index if not exists products_public_catalog_idx
  on public.products (product_type, is_featured desc, display_order)
  where publication_status = 'published';

create index if not exists products_sales_status_idx on public.products (sales_status);

create index if not exists product_images_product_id_sort_order_idx
  on public.product_images (product_id, sort_order);

create unique index if not exists product_images_primary_per_type_idx
  on public.product_images (product_id, image_type)
  where is_primary;

create index if not exists product_access_links_product_id_sort_order_idx
  on public.product_access_links (product_id, sort_order);

create index if not exists banners_public_schedule_idx
  on public.banners (position, sort_order, start_at, end_at)
  where status = 'published';

create index if not exists flash_sales_public_schedule_idx
  on public.flash_sales (product_id, start_at, end_at)
  where status = 'active';

create index if not exists affiliate_clicks_product_id_clicked_at_idx
  on public.affiliate_clicks (product_id, clicked_at desc);

create index if not exists affiliate_clicks_user_id_clicked_at_idx
  on public.affiliate_clicks (user_id, clicked_at desc)
  where user_id is not null;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.guard_profile_self_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() = old.id
    and (
      new.email is distinct from old.email
      or new.status is distinct from old.status
      or new.created_at is distinct from old.created_at
    ) then
    raise exception 'Profile email, status, and creation time cannot be changed by the account owner';
  end if;

  return new;
end;
$$;

create or replace function public.has_role(required_role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = auth.uid()
      and role = required_role
  );
$$;

revoke all on function public.has_role(public.app_role) from public;
grant execute on function public.has_role(public.app_role) to authenticated;

drop trigger if exists profiles_guard_self_update on public.profiles;
create trigger profiles_guard_self_update
  before update on public.profiles
  for each row execute procedure public.guard_profile_self_update();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists user_roles_set_updated_at on public.user_roles;
create trigger user_roles_set_updated_at
  before update on public.user_roles
  for each row execute procedure public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
  before update on public.categories
  for each row execute procedure public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

drop trigger if exists product_images_set_updated_at on public.product_images;
create trigger product_images_set_updated_at
  before update on public.product_images
  for each row execute procedure public.set_updated_at();

drop trigger if exists product_access_links_set_updated_at on public.product_access_links;
create trigger product_access_links_set_updated_at
  before update on public.product_access_links
  for each row execute procedure public.set_updated_at();

drop trigger if exists banners_set_updated_at on public.banners;
create trigger banners_set_updated_at
  before update on public.banners
  for each row execute procedure public.set_updated_at();

drop trigger if exists flash_sales_set_updated_at on public.flash_sales;
create trigger flash_sales_set_updated_at
  before update on public.flash_sales
  for each row execute procedure public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_access_links enable row level security;
alter table public.banners enable row level security;
alter table public.flash_sales enable row level security;
alter table public.site_settings enable row level security;
alter table public.affiliate_clicks enable row level security;

create policy "profiles: account owner can read" on public.profiles
  for select to authenticated using (id = auth.uid());

create policy "profiles: account owner can update safe fields" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: admin can read" on public.profiles
  for select to authenticated using (public.has_role('admin'));

create policy "roles: account owner can read" on public.user_roles
  for select to authenticated using (user_id = auth.uid());

create policy "roles: admin can read" on public.user_roles
  for select to authenticated using (public.has_role('admin'));

create policy "categories: public can read active" on public.categories
  for select to anon, authenticated using (is_active);

create policy "categories: editor and admin can manage" on public.categories
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));

create policy "products: public can read published" on public.products
  for select to anon, authenticated using (publication_status = 'published');

create policy "products: editor and admin can manage" on public.products
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));

create policy "product images: public can read published product media" on public.product_images
  for select to anon, authenticated using (
    exists (
      select 1 from public.products
      where products.id = product_images.product_id
        and products.publication_status = 'published'
    )
  );

create policy "product images: editor and admin can manage" on public.product_images
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));

create policy "product access links: editor and admin can manage" on public.product_access_links
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));

create policy "banners: public can read active published" on public.banners
  for select to anon, authenticated using (
    status = 'published'
    and (start_at is null or start_at <= now())
    and (end_at is null or end_at > now())
  );

create policy "banners: editor and admin can manage" on public.banners
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));

create policy "flash sales: public can read active" on public.flash_sales
  for select to anon, authenticated using (
    status = 'active'
    and start_at <= now()
    and end_at > now()
    and exists (
      select 1 from public.products
      where products.id = flash_sales.product_id
        and products.publication_status = 'published'
    )
  );

create policy "flash sales: editor and admin can manage" on public.flash_sales
  for all to authenticated
  using (public.has_role('editor') or public.has_role('admin'))
  with check (public.has_role('editor') or public.has_role('admin'));

create policy "site settings: public can read public settings" on public.site_settings
  for select to anon, authenticated using (visibility = 'public');

create policy "site settings: editor can manage public settings" on public.site_settings
  for all to authenticated
  using (
    visibility = 'public'
    and (public.has_role('editor') or public.has_role('admin'))
  )
  with check (
    visibility = 'public'
    and (public.has_role('editor') or public.has_role('admin'))
  );

create policy "site settings: admin can manage all settings" on public.site_settings
  for all to authenticated
  using (public.has_role('admin'))
  with check (public.has_role('admin'));

create policy "affiliate clicks: admin can read" on public.affiliate_clicks
  for select to authenticated using (public.has_role('admin'));
