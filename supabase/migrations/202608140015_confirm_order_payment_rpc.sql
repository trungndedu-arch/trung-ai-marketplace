-- Proposal only: review before applying to any Supabase environment.

create function public.confirm_order_payment(p_order_id uuid)
returns table (
  order_id uuid,
  order_code text,
  order_status public.order_status,
  payment_status public.payment_status,
  confirmed_at timestamptz,
  entitlement_count bigint,
  already_confirmed boolean
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_admin_id uuid;
  v_order public.orders%rowtype;
  v_customer_status public.profile_status;
  v_confirmation_time timestamptz;
  v_item_count bigint;
  v_product_count bigint;
  v_source_entitlement_count bigint;
  v_matching_entitlement_count bigint;
  v_inserted_entitlement_count bigint;
begin
  v_admin_id := auth.uid();

  if v_admin_id is null then
    raise exception using
      errcode = 'P2001',
      message = 'TAI_CONFIRM_ORDER_AUTH_REQUIRED';
  end if;

  if not public.has_role('admin'::public.app_role) then
    raise exception using
      errcode = 'P2002',
      message = 'TAI_CONFIRM_ORDER_ADMIN_REQUIRED';
  end if;

  if p_order_id is null then
    raise exception using
      errcode = 'P2003',
      message = 'TAI_CONFIRM_ORDER_NOT_FOUND';
  end if;

  select existing_order.*
  into v_order
  from public.orders as existing_order
  where existing_order.id = p_order_id
  for update;

  if not found then
    raise exception using
      errcode = 'P2003',
      message = 'TAI_CONFIRM_ORDER_NOT_FOUND';
  end if;

  if v_order.status = 'cancelled' then
    raise exception using
      errcode = 'P2004',
      message = 'TAI_CONFIRM_ORDER_CANCELLED';
  end if;

  if v_order.payment_status = 'refunded' then
    raise exception using
      errcode = 'P2005',
      message = 'TAI_CONFIRM_ORDER_REFUNDED';
  end if;

  if not (
    (
      v_order.status = 'pending'
      and v_order.payment_status in ('unpaid', 'pending_confirmation')
    )
    or (
      v_order.status = 'completed'
      and v_order.payment_status = 'paid'
    )
  ) then
    raise exception using
      errcode = 'P2011',
      message = 'TAI_CONFIRM_ORDER_STATE_INVALID';
  end if;

  -- Lock the customer profile to serialize confirmations for different Orders
  -- belonging to the same customer.
  select profile.status
  into v_customer_status
  from public.profiles as profile
  where profile.id = v_order.user_id
  for update;

  if not found then
    raise exception using
      errcode = 'P2009',
      message = 'TAI_CONFIRM_ORDER_CUSTOMER_INVALID';
  end if;

  select pg_catalog.count(*)
  into v_item_count
  from public.order_items as item
  where item.order_id = v_order.id;

  if v_item_count = 0 then
    raise exception using
      errcode = 'P2007',
      message = 'TAI_CONFIRM_ORDER_ITEMS_REQUIRED';
  end if;

  if exists (
    select 1
    from public.order_items as item
    where item.order_id = v_order.id
      and item.product_id is null
  ) then
    raise exception using
      errcode = 'P2008',
      message = 'TAI_CONFIRM_ORDER_PRODUCT_UNAVAILABLE';
  end if;

  -- Keep referenced Products from being deleted between validation and the
  -- entitlement inserts. Current price/publication/sales state is irrelevant
  -- because the Order already contains immutable commercial snapshots.
  perform product.id
  from public.products as product
  inner join public.order_items as item
    on item.product_id = product.id
  where item.order_id = v_order.id
  order by product.id
  for key share of product;

  select pg_catalog.count(*)
  into v_product_count
  from public.order_items as item
  inner join public.products as product
    on product.id = item.product_id
  where item.order_id = v_order.id;

  if v_product_count <> v_item_count then
    raise exception using
      errcode = 'P2008',
      message = 'TAI_CONFIRM_ORDER_PRODUCT_UNAVAILABLE';
  end if;

  -- Lock every relevant existing entitlement before consistency checks.
  perform entitlement.id
  from public.user_product_entitlements as entitlement
  where entitlement.source_order_id = v_order.id
    or (
      entitlement.user_id = v_order.user_id
      and exists (
        select 1
        from public.order_items as item
        where item.order_id = v_order.id
          and item.product_id = entitlement.product_id
      )
    )
  order by entitlement.id
  for update;

  if v_order.status = 'completed' and v_order.payment_status = 'paid' then
    select pg_catalog.count(*)
    into v_source_entitlement_count
    from public.user_product_entitlements as entitlement
    where entitlement.source_order_id = v_order.id;

    select pg_catalog.count(*)
    into v_matching_entitlement_count
    from public.user_product_entitlements as entitlement
    inner join public.order_items as item
      on item.order_id = v_order.id
      and item.product_id = entitlement.product_id
    where entitlement.source_order_id = v_order.id
      and entitlement.user_id = v_order.user_id
      and entitlement.status = 'active';

    if v_source_entitlement_count <> v_item_count
      or v_matching_entitlement_count <> v_item_count then
      raise exception using
        errcode = 'P2010',
        message = 'TAI_CONFIRM_ORDER_ENTITLEMENT_CONFLICT';
    end if;

    return query
    select
      v_order.id,
      v_order.order_code,
      v_order.status,
      v_order.payment_status,
      v_order.confirmed_at,
      v_matching_entitlement_count,
      true;
    return;
  end if;

  -- Only an unpaid Order is expired by the current commerce contract.
  -- pending_confirmation means the transfer was reported and remains
  -- reviewable even when the original payment window has elapsed.
  v_confirmation_time := pg_catalog.clock_timestamp();

  if v_order.payment_status = 'unpaid'
    and v_order.expires_at <= v_confirmation_time then
    raise exception using
      errcode = 'P2006',
      message = 'TAI_CONFIRM_ORDER_EXPIRED';
  end if;

  if v_customer_status <> 'active' then
    raise exception using
      errcode = 'P2009',
      message = 'TAI_CONFIRM_ORDER_CUSTOMER_INVALID';
  end if;

  if exists (
    select 1
    from public.user_product_entitlements as entitlement
    where entitlement.source_order_id = v_order.id
  ) then
    raise exception using
      errcode = 'P2010',
      message = 'TAI_CONFIRM_ORDER_ENTITLEMENT_CONFLICT';
  end if;

  if exists (
    select 1
    from public.user_product_entitlements as entitlement
    inner join public.order_items as item
      on item.order_id = v_order.id
      and item.product_id = entitlement.product_id
    where entitlement.user_id = v_order.user_id
      and entitlement.status = 'active'
  ) then
    raise exception using
      errcode = 'P2010',
      message = 'TAI_CONFIRM_ORDER_ENTITLEMENT_CONFLICT';
  end if;

  update public.orders as confirmed_order
  set
    status = 'completed',
    payment_status = 'paid',
    paid_at = v_confirmation_time,
    confirmed_at = v_confirmation_time,
    confirmed_by = v_admin_id
  where confirmed_order.id = v_order.id;

  insert into public.user_product_entitlements (
    user_id,
    product_id,
    source_order_id,
    status,
    granted_at,
    granted_by
  )
  select
    v_order.user_id,
    item.product_id,
    v_order.id,
    'active'::public.entitlement_status,
    v_confirmation_time,
    v_admin_id
  from public.order_items as item
  where item.order_id = v_order.id
  order by item.product_id;

  get diagnostics v_inserted_entitlement_count = row_count;

  if v_inserted_entitlement_count <> v_item_count then
    raise exception using
      errcode = 'P2010',
      message = 'TAI_CONFIRM_ORDER_ENTITLEMENT_CONFLICT';
  end if;

  return query
  select
    v_order.id,
    v_order.order_code,
    'completed'::public.order_status,
    'paid'::public.payment_status,
    v_confirmation_time,
    v_inserted_entitlement_count,
    false;
exception
  when unique_violation then
    raise exception using
      errcode = 'P2010',
      message = 'TAI_CONFIRM_ORDER_ENTITLEMENT_CONFLICT';
  when others then
    if sqlstate like 'P2%' then
      raise;
    end if;

    raise exception using
      errcode = 'P2099',
      message = 'TAI_CONFIRM_ORDER_DATABASE_ERROR';
end;
$$;

revoke all on function public.confirm_order_payment(uuid)
from public, anon, authenticated;

grant execute on function public.confirm_order_payment(uuid)
to authenticated;

comment on function public.confirm_order_payment(uuid) is
  'Atomically confirms an eligible bank-transfer Order and grants one active entitlement per historical Order Item. Admin only; retry-safe for consistent completed Orders.';
