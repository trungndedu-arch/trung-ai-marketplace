-- Proposal only: review before applying to any Supabase environment.

alter table public.orders
  add column bank_bin_snapshot text,
  add column support_zalo_phone_snapshot text;

-- There is no trustworthy BIN snapshot for an order created before this
-- migration. Fail closed instead of assigning the current bank BIN to history.
do $$
begin
  if exists (select 1 from public.orders) then
    raise exception using
      errcode = 'P0001',
      message = 'TAI_BANK_BIN_BACKFILL_REQUIRES_HISTORICAL_MAPPING';
  end if;
end;
$$;

alter table public.orders
  alter column bank_bin_snapshot set not null,
  add constraint orders_bank_bin_snapshot_format check (
    bank_bin_snapshot ~ '^[0-9]{6}$'
  ),
  add constraint orders_support_zalo_phone_snapshot_format check (
    support_zalo_phone_snapshot is null
    or (
      pg_catalog.length(support_zalo_phone_snapshot) <= 50
      and support_zalo_phone_snapshot ~ '^[+0-9 .()-]+$'
      and pg_catalog.length(
        pg_catalog.regexp_replace(support_zalo_phone_snapshot, '[^0-9]', '', 'g')
      ) between 8 and 15
    )
  );

create function public.snapshot_order_payment_extensions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_bank_name text;
  v_bank_bin text;
  v_bank_account_number text;
  v_bank_account_holder text;
  v_payment_instructions text;
  v_zalo_phone text;
begin
  -- Lock the complete allowlist so an Admin update cannot split one Order
  -- across two versions of the payment configuration.
  perform 1
  from public.site_settings as setting
  where setting.key in (
    'payment.bank_name',
    'payment.bank_bin',
    'payment.bank_account_number',
    'payment.bank_account_holder',
    'payment.instructions',
    'support.zalo_phone'
  )
  order by setting.key
  for share;

  select
    pg_catalog.max(case
      when setting.key = 'payment.bank_name' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'payment.bank_bin' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'payment.bank_account_number' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'payment.bank_account_holder' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'payment.instructions' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'support.zalo_phone' then setting.value #>> '{}'::text[]
    end)
  into
    v_bank_name,
    v_bank_bin,
    v_bank_account_number,
    v_bank_account_holder,
    v_payment_instructions,
    v_zalo_phone
  from public.site_settings as setting
  where setting.key in (
    'payment.bank_name',
    'payment.bank_bin',
    'payment.bank_account_number',
    'payment.bank_account_holder',
    'payment.instructions',
    'support.zalo_phone'
  )
    and setting.visibility = 'private'
    and pg_catalog.jsonb_typeof(setting.value) = 'string';

  v_bank_name := nullif(pg_catalog.btrim(v_bank_name), '');
  v_bank_bin := nullif(pg_catalog.btrim(v_bank_bin), '');
  v_bank_account_number := nullif(pg_catalog.btrim(v_bank_account_number), '');
  v_bank_account_holder := nullif(pg_catalog.btrim(v_bank_account_holder), '');
  v_payment_instructions := nullif(pg_catalog.btrim(v_payment_instructions), '');
  v_zalo_phone := nullif(pg_catalog.btrim(v_zalo_phone), '');

  if v_bank_name is null
    or v_bank_bin is null
    or v_bank_bin !~ '^[0-9]{6}$'
    or v_bank_account_number is null
    or v_bank_account_holder is null
    or v_payment_instructions is null
    or pg_catalog.length(v_bank_name) > 120
    or pg_catalog.length(v_bank_account_number) > 50
    or pg_catalog.length(v_bank_account_holder) > 120
    or pg_catalog.length(v_payment_instructions) > 2000 then
    raise exception using
      errcode = 'P1007',
      message = 'TAI_CREATE_ORDER_PAYMENT_SETTINGS_INVALID';
  end if;

  if v_zalo_phone is not null
    and (
      pg_catalog.length(v_zalo_phone) > 50
      or v_zalo_phone !~ '^[+0-9 .()-]+$'
      or pg_catalog.length(
        pg_catalog.regexp_replace(v_zalo_phone, '[^0-9]', '', 'g')
      ) not between 8 and 15
    ) then
    v_zalo_phone := null;
  end if;

  -- Migration 013 already snapshots these four critical values. Requiring an
  -- exact match makes a concurrent settings change fail safely and atomically.
  if new.bank_name_snapshot is distinct from v_bank_name
    or new.bank_account_number_snapshot is distinct from v_bank_account_number
    or new.bank_account_holder_snapshot is distinct from v_bank_account_holder
    or new.payment_instructions_snapshot is distinct from v_payment_instructions then
    raise exception using
      errcode = 'P1007',
      message = 'TAI_CREATE_ORDER_PAYMENT_SETTINGS_INVALID';
  end if;

  new.bank_bin_snapshot := v_bank_bin;
  new.support_zalo_phone_snapshot := v_zalo_phone;

  return new;
end;
$$;

revoke all on function public.snapshot_order_payment_extensions()
from public, anon, authenticated;

create trigger orders_snapshot_payment_extensions
  before insert on public.orders
  for each row execute procedure public.snapshot_order_payment_extensions();

comment on column public.orders.bank_bin_snapshot is
  'Immutable bank BIN captured with the other payment settings when the order is created.';

comment on column public.orders.support_zalo_phone_snapshot is
  'Optional Zalo support number captured when the order is created.';

comment on function public.snapshot_order_payment_extensions() is
  'Extends create_order with an atomic server-side bank BIN and optional Zalo snapshot without changing the public RPC contract.';
