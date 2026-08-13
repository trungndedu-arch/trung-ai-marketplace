grant usage on schema public to anon, authenticated;

grant select on table
  public.categories,
  public.products,
  public.product_images,
  public.banners,
  public.flash_sales,
  public.site_settings
to anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, avatar_url, phone) on table public.profiles to authenticated;

grant select on table public.user_roles to authenticated;

grant insert, update, delete on table
  public.categories,
  public.products,
  public.product_images,
  public.banners,
  public.flash_sales,
  public.site_settings
to authenticated;

grant select, insert, update, delete on table public.product_access_links to authenticated;

grant select on table public.affiliate_clicks to authenticated;
