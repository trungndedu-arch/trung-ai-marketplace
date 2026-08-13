# Supabase database foundation

These migrations create the Phase 3A.1 database foundation only. They do not change the Next.js UI, replace local catalog data, create a Storage bucket, or execute any SQL against the hosted Supabase project automatically.

## Migration order

Run the files in lexical order:

1. `202608030001_create_core_enums.sql`
2. `202608030002_create_profiles_and_roles.sql`
3. `202608030003_create_catalog_tables.sql`
4. `202608030004_create_media_banner_flash_settings.sql`
5. `202608030005_create_indexes_triggers_rls.sql`
6. `202608030006_seed_initial_catalog.sql`

The seed mirrors 13 current catalog records. Prompt AI data is intentionally not included because it remains local and free to use without authentication.

## Running through Supabase Dashboard

1. Open the target project in Supabase Dashboard.
2. Open **SQL Editor** and create a new query.
3. Copy and run one migration file at a time, in the order above.
4. Confirm each query succeeds before running the next file.
5. After the seed succeeds, verify the expected counts:

```sql
select product_type, count(*)
from public.products
group by product_type
order by product_type;
```

Expected result: 5 `ai_app`, 1 `ai_tool`, 5 `chatbot`, and 2 `course` records.

## First administrator

Register the account normally so the `auth.users` trigger has created its profile and default `customer` role. Then, in SQL Editor, replace the placeholder email and run:

```sql
insert into public.user_roles (user_id, role)
select id, 'admin'
from public.profiles
where email = 'admin@example.com'
on conflict (user_id, role) do nothing;
```

No migration grants an administrator role automatically. Client-side RLS intentionally allows role reads only; future role changes must use a server-side admin action with audit logging.

## Safe rollback

Do not run broad `drop schema` or `drop owned` commands. Before a migration is applied to production, it can simply be edited locally. After a migration is applied:

1. Take a database backup from Supabase Dashboard.
2. Write a new, reviewed reverse migration that targets only the intended objects or rows.
3. Apply that reverse migration in a non-production environment first.

The seed is upsert-based and may be safely rerun to restore the initial catalog fields. It never seeds bank-transfer details, a service-role key, or other secrets.

## RLS notes

- Public users can read only published catalog records, active categories, currently visible banners/flash sales, and public settings.
- `site_settings` records marked `private` are readable only by an admin policy. Bank-transfer settings belong there and must be read by future server-side checkout/order code, never by a public client query.
- Product access links have no public-read policy. Future entitlement code will expose paid access only after payment confirmation.
- Affiliate-click analytics has no client insert/read policy. A future server-side `/go/[slug]` route will write it without storing a raw IP address.
- Admin/editor policies cannot be exercised until an admin or editor role is assigned manually. The initial role assignment above is the required bootstrap step.
