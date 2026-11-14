-- REVIEW ONLY — requires explicit production approval.
-- Isolated least-privilege correction for existing site_settings.
-- Production ACL snapshot (2026-11-14) showed direct postgres grants for
-- TRUNCATE and TRIGGER to anon and authenticated.
-- Do not modify SELECT/INSERT/UPDATE/DELETE, service_role or default ACLs.

revoke truncate, trigger on table public.site_settings from anon, authenticated;

-- If any effective privilege survives through PUBLIC or role inheritance,
-- fail this migration; Supabase migration transaction must roll back.
do $$
begin
  if has_table_privilege('anon', 'public.site_settings', 'TRUNCATE')
     or has_table_privilege('anon', 'public.site_settings', 'TRIGGER')
     or has_table_privilege('authenticated', 'public.site_settings', 'TRUNCATE')
     or has_table_privilege('authenticated', 'public.site_settings', 'TRIGGER')
  then
    raise exception 'site_settings: effective TRUNCATE/TRIGGER privileges remain; review ACL before applying';
  end if;
end $$;
