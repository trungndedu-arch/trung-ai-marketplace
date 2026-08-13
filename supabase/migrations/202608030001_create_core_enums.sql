create extension if not exists pgcrypto;
create extension if not exists btree_gist;

do $$
begin
  create type public.product_type as enum ('chatbot', 'ai_app', 'ai_tool', 'course');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.access_type as enum ('paid', 'free');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.sales_status as enum ('coming_soon', 'on_sale', 'paused');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.publication_status as enum ('draft', 'published', 'hidden');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.app_role as enum ('customer', 'editor', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.profile_status as enum ('active', 'suspended', 'deleted');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.product_image_type as enum ('cover', 'gallery', 'logo');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.access_link_type as enum ('app', 'chatbot', 'guide', 'docs', 'external');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.setting_visibility as enum ('public', 'private');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.flash_sale_status as enum ('scheduled', 'active', 'paused', 'ended');
exception
  when duplicate_object then null;
end $$;
