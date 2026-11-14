# ACL hardening review — Supabase (2026-11-14)

Status: **proposal only**. **Do not apply to production without explicit approval and fresh metadata checks.**

## Evidence from production READ-ONLY checks
- `public.site_settings`: RLS enabled; Editor policy requires public visibility and Editor/Admin role.
- `anon` and `authenticated` both have effective TRUNCATE/TRIGGER and direct grants from `postgres` in snapshot CSV; no membership rows returned for either role in the checked query.
- Default ACLs on schema `public` may give future tables broad rights; actual resulting ACL depends on the **object-creating role**.
- `public.free_ai_learning_videos` has not been created in production, and the Free AI Learning settings have not been seeded.

## Changes in this branch
1. Existing `202611130019_create_free_ai_learning.sql`: explicitly REVOKE TRUNCATE/TRIGGER from PUBLIC, anon, authenticated on the newly created table; assert the **effective** privileges are absent. Does not change global default privileges.
2. New `202611140020_harden_site_settings_acl.sql`: revoke only TRUNCATE/TRIGGER from anon/authenticated on the existing settings table and assert effective absence. Keeps existing DML, policies, triggers, service_role and global default ACLs unchanged.

## Preflight (read-only, export results before applying)
```sql
select c.relacl, c.relowner::regrole, c.relrowsecurity
from pg_class c where c.oid='public.site_settings'::regclass;

select coalesce(grantee.rolname,'PUBLIC') as grantee,
       coalesce(grantor.rolname,'UNKNOWN') as grantor,
       a.privilege_type, a.is_grantable
from pg_class c
cross join lateral aclexplode(coalesce(c.relacl,acldefault('r',c.relowner))) a
left join pg_roles grantee on grantee.oid=a.grantee
left join pg_roles grantor on grantor.oid=a.grantor
where c.oid='public.site_settings'::regclass
order by 1,3;

select defaclrole::regrole,defaclnamespace::regnamespace,defaclobjtype,defaclacl
from pg_default_acl where defaclnamespace='public'::regnamespace;

select member.rolname as member_role,parent.rolname as inherited_from
from pg_auth_members x join pg_roles member on member.oid=x.member
join pg_roles parent on parent.oid=x.roleid
where member.rolname in ('anon','authenticated');
```
Verify schema migration history before applying; **never re-run a migration that has already been applied**. Compare Editor policy full expressions with source. Check `pg_proc` for unexpected runtime dependencies. Preserve ACL CSV and database backup. Review whether `MAINTAIN` and `REFERENCES` should be separately hardened later.

## Post-apply validation
```sql
select rolname,
 has_table_privilege(rolname,'public.site_settings','TRUNCATE') as truncate_allowed,
 has_table_privilege(rolname,'public.site_settings','TRIGGER') as trigger_allowed
from pg_roles where rolname in ('anon','authenticated');

select rolname,
 has_table_privilege(rolname,'public.free_ai_learning_videos','TRUNCATE') as truncate_allowed,
 has_table_privilege(rolname,'public.free_ai_learning_videos','TRIGGER') as trigger_allowed
from pg_roles where rolname in ('anon','authenticated');
```
Expect `false` in all rows. Verify Admin Contact Links and payment settings UPSERT, existing updated_at trigger, read-only public settings, Free AI Learning admin CRUD, and non-admin denial. Enable the homepage section **only after tests**.

## Scoped rollback, if new migration changed only direct grants
```sql
grant truncate, trigger on table public.site_settings to anon, authenticated;
```
This restores the two grants documented in production snapshot, **not** all ACLs. Do **not** rollback by re-granting privileges on `free_ai_learning_videos`: they were not intentional app privileges. For table creation migration rollback, use a reviewed, database-backup-aware plan rather than blind DROP. No rollback SQL should run automatically.

## Limitations
No live migration, integration test, production write, permission change, merge or deployment was performed by this GitHub review. Local PostgreSQL migration testing and actual Admin/non-Admin E2E must be completed before approval. Ensure the migration runner wraps statements in a transaction; the DO assertions do not themselves guarantee rollback in a nontransactional runner.
