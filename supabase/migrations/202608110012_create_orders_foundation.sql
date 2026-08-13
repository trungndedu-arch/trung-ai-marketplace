-- Proposal only: review before applying to any Supabase environment.

create type public.order_status as enum (
  'pending',
  'completed',
  'cancelled'
);

create type public.payment_status as enum (
  'unpaid',
  'pending_confirmation',
  'paid',
  'refunded'
);

create type public.payment_method as enum (
  'bank_transfer'
);

create type public.entitlement_status as enum (
  'active',
  'revoked'
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique default (
    'TAI-'
    || to_char(timezone('UTC', clock_timestamp()), 'YYYYMMDD')
    || '-'
    || upper(
      left(replace(gen_random_uuid()::text, '-', ''), 8)
      || right(replace(gen_random_uuid()::text, '-', ''), 8)
    )
  ),
  payment_reference text generated always as (order_code) stored,
  user_id uuid not null references public.profiles(id) on delete restrict,
  status public.order_status not null default 'pending',
  payment_status public.payment_status not null default 'unpaid',
  payment_method public.payment_method not null default 'bank_transfer',
  subtotal numeric(14, 0) not null,
  discount_total numeric(14, 0) not null default 0,
  total numeric(14, 0) not null,
  currency text not null default 'VND',
  customer_email_snapshot text not null,
  customer_name_snapshot text,
  customer_phone_snapshot text,
  bank_name_snapshot text not null,
  bank_account_number_snapshot text not null,
  bank_account_holder_snapshot text not null,
  payment_instructions_snapshot text not null,
  payment_note text,
  expires_at timestamptz not null default (now() + interval '24 hours'),
  paid_at timestamptz,
  confirmed_at timestamptz,
  confirmed_by uuid references public.profiles(id) on delete restrict,
  refunded_at timestamptz,
  refunded_by uuid references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_order_code_format check (
    order_code ~ '^TAI-[0-9]{8}-[0-9A-F]{16}$'
  ),
  constraint orders_amounts_nonnegative check (
    subtotal >= 0
    and discount_total >= 0
    and total >= 0
  ),
  constraint orders_paid_amounts_positive check (
    subtotal > 0
    and total > 0
  ),
  constraint orders_discount_not_above_subtotal check (
    discount_total <= subtotal
  ),
  constraint orders_total_matches_components check (
    total = subtotal - discount_total
  ),
  constraint orders_currency_format check (
    currency ~ '^[A-Z]{3}$'
  ),
  constraint orders_customer_email_not_blank check (
    nullif(trim(customer_email_snapshot), '') is not null
    and length(customer_email_snapshot) <= 320
  ),
  constraint orders_customer_name_length check (
    customer_name_snapshot is null
    or length(customer_name_snapshot) <= 160
  ),
  constraint orders_customer_phone_length check (
    customer_phone_snapshot is null
    or length(customer_phone_snapshot) <= 50
  ),
  constraint orders_bank_snapshot_complete check (
    nullif(trim(bank_name_snapshot), '') is not null
    and nullif(trim(bank_account_number_snapshot), '') is not null
    and nullif(trim(bank_account_holder_snapshot), '') is not null
    and nullif(trim(payment_instructions_snapshot), '') is not null
  ),
  constraint orders_payment_note_length check (
    payment_note is null
    or length(payment_note) <= 2000
  ),
  constraint orders_expiry_after_creation check (
    expires_at > created_at
  ),
  constraint orders_status_payment_state_valid check (
    (status = 'pending' and payment_status in ('unpaid', 'pending_confirmation'))
    or (status = 'completed' and payment_status in ('paid', 'refunded'))
    or (status = 'cancelled' and payment_status in ('unpaid', 'pending_confirmation'))
  ),
  constraint orders_payment_audit_valid check (
    (
      payment_status in ('unpaid', 'pending_confirmation')
      and paid_at is null
      and confirmed_at is null
      and confirmed_by is null
      and refunded_at is null
      and refunded_by is null
    )
    or (
      payment_status = 'paid'
      and paid_at is not null
      and confirmed_at is not null
      and confirmed_by is not null
      and refunded_at is null
      and refunded_by is null
    )
    or (
      payment_status = 'refunded'
      and paid_at is not null
      and confirmed_at is not null
      and confirmed_by is not null
      and refunded_at is not null
      and refunded_by is not null
    )
  ),
  constraint orders_confirmation_chronology check (
    confirmed_at is null
    or paid_at is null
    or confirmed_at >= paid_at
  ),
  constraint orders_refund_chronology check (
    refunded_at is null
    or paid_at is null
    or refunded_at >= paid_at
  )
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  flash_sale_id uuid references public.flash_sales(id) on delete set null,
  product_title_snapshot text not null,
  product_slug_snapshot text not null,
  product_type_snapshot public.product_type not null,
  quantity smallint not null default 1,
  base_price numeric(14, 0) not null,
  unit_price numeric(14, 0) not null,
  discount_amount numeric(14, 0) generated always as (
    base_price - unit_price
  ) stored,
  line_total numeric(14, 0) generated always as (
    unit_price * quantity
  ) stored,
  currency text not null,
  created_at timestamptz not null default now(),
  constraint order_items_order_product_key unique (order_id, product_id),
  constraint order_items_title_not_blank check (
    nullif(trim(product_title_snapshot), '') is not null
  ),
  constraint order_items_slug_not_blank check (
    nullif(trim(product_slug_snapshot), '') is not null
  ),
  constraint order_items_marketplace_product_type check (
    product_type_snapshot in ('chatbot', 'ai_app')
  ),
  constraint order_items_quantity_is_one check (
    quantity = 1
  ),
  constraint order_items_price_valid check (
    base_price > 0
    and unit_price > 0
    and unit_price <= base_price
  ),
  constraint order_items_currency_format check (
    currency ~ '^[A-Z]{3}$'
  )
);

create table public.user_product_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  product_id uuid not null references public.products(id) on delete restrict,
  source_order_id uuid not null references public.orders(id) on delete restrict,
  status public.entitlement_status not null default 'active',
  granted_at timestamptz not null default now(),
  granted_by uuid references public.profiles(id) on delete restrict,
  revoked_at timestamptz,
  revoked_by uuid references public.profiles(id) on delete restrict,
  revoke_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_product_entitlements_order_product_key unique (
    source_order_id,
    product_id
  ),
  constraint user_product_entitlements_revoke_reason_length check (
    revoke_reason is null
    or length(revoke_reason) <= 1000
  ),
  constraint user_product_entitlements_revocation_state_valid check (
    (
      status = 'active'
      and revoked_at is null
      and revoked_by is null
      and revoke_reason is null
    )
    or (
      status = 'revoked'
      and revoked_at is not null
      and revoked_by is not null
    )
  )
);

create index orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

create index orders_payment_status_status_created_at_idx
  on public.orders (payment_status, status, created_at desc);

create unique index user_product_entitlements_active_user_product_idx
  on public.user_product_entitlements (user_id, product_id)
  where status = 'active';

create index user_product_entitlements_user_status_granted_at_idx
  on public.user_product_entitlements (user_id, status, granted_at desc);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

create trigger user_product_entitlements_set_updated_at
  before update on public.user_product_entitlements
  for each row execute procedure public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.user_product_entitlements enable row level security;

create policy "orders: account owner can read" on public.orders
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "orders: admin can read" on public.orders
  for select to authenticated
  using (public.has_role('admin'));

create policy "order items: account owner can read" on public.order_items
  for select to authenticated
  using (
    exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = (select auth.uid())
    )
  );

create policy "order items: admin can read" on public.order_items
  for select to authenticated
  using (public.has_role('admin'));

create policy "entitlements: account owner can read" on public.user_product_entitlements
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "entitlements: admin can read" on public.user_product_entitlements
  for select to authenticated
  using (public.has_role('admin'));

revoke all on table
  public.orders,
  public.order_items,
  public.user_product_entitlements
from public, anon, authenticated;

grant select on table
  public.orders,
  public.order_items,
  public.user_product_entitlements
to authenticated;

comment on table public.orders is
  'Immutable commercial order totals plus manual bank-transfer and customer snapshots.';

comment on column public.orders.payment_reference is
  'Server-generated transfer content. It is always identical to the unique order_code.';

comment on column public.orders.expires_at is
  'Runtime deadline. A pending unpaid order at or after this time is expired without mutating status; any confirmation after the deadline requires an explicit Admin override.';

comment on column public.orders.payment_status is
  'Refunded orders remain completed; a future refund transaction must revoke every active entitlement sourced from the order.';

comment on table public.order_items is
  'Price and product identity snapshots captured when an authenticated checkout creates an order.';

comment on table public.user_product_entitlements is
  'Customer ownership records granted transactionally after payment confirmation.';
