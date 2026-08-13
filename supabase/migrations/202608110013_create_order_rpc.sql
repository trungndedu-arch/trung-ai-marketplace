-- Proposal only: review before applying to any Supabase environment.

create or replace function public.create_order(p_product_ids uuid[])
returns table (
  order_id uuid,
  order_code text,
  payment_reference text,
  total numeric(14, 0),
  currency text,
  expires_at timestamptz,
  bank_name text,
  bank_account_number text,
  bank_account_holder text,
  payment_instructions text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_profile public.profiles%rowtype;
  v_customer_email text;
  v_customer_name text;
  v_customer_phone text;
  v_bank_name text;
  v_bank_account_number text;
  v_bank_account_holder text;
  v_payment_instructions text;
  v_now timestamptz := pg_catalog.statement_timestamp();
  v_request_count integer;
  v_product_id uuid;
  v_product public.products%rowtype;
  v_flash_sale_id uuid;
  v_flash_sale_price numeric(12, 0);
  v_unit_price numeric(12, 0);
  v_currency text;
  v_subtotal numeric(14, 0) := 0;
  v_discount_total numeric(14, 0) := 0;
  v_total numeric(14, 0) := 0;
  v_item_product_ids uuid[] := array[]::uuid[];
  v_item_flash_sale_ids uuid[] := array[]::uuid[];
  v_item_titles text[] := array[]::text[];
  v_item_slugs text[] := array[]::text[];
  v_item_product_types public.product_type[] := array[]::public.product_type[];
  v_item_base_prices numeric[] := array[]::numeric[];
  v_item_unit_prices numeric[] := array[]::numeric[];
  v_item_currencies text[] := array[]::text[];
  v_created_order_id uuid;
  v_created_order_code text;
  v_created_payment_reference text;
  v_created_expires_at timestamptz;
  v_attempt integer;
  v_constraint_name text;
  v_item_index integer;
  v_inserted_item_count bigint;
  v_check_subtotal numeric(14, 0);
  v_check_discount_total numeric(14, 0);
  v_check_total numeric(14, 0);
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception using
      errcode = 'P1001',
      message = 'TAI_CREATE_ORDER_AUTH_REQUIRED';
  end if;

  v_request_count := pg_catalog.cardinality(p_product_ids);

  if p_product_ids is null or v_request_count is null or v_request_count = 0 then
    raise exception using
      errcode = 'P1003',
      message = 'TAI_CREATE_ORDER_PRODUCT_IDS_REQUIRED';
  end if;

  if pg_catalog.array_ndims(p_product_ids) <> 1 then
    raise exception using
      errcode = 'P1003',
      message = 'TAI_CREATE_ORDER_PRODUCT_IDS_INVALID';
  end if;

  if v_request_count > 20 then
    raise exception using
      errcode = 'P1004',
      message = 'TAI_CREATE_ORDER_PRODUCT_LIMIT_EXCEEDED';
  end if;

  if pg_catalog.array_position(p_product_ids, null::uuid) is not null then
    raise exception using
      errcode = 'P1005',
      message = 'TAI_CREATE_ORDER_PRODUCT_ID_INVALID';
  end if;

  if exists (
    select 1
    from pg_catalog.unnest(p_product_ids) as requested(product_id)
    group by requested.product_id
    having pg_catalog.count(*) > 1
  ) then
    raise exception using
      errcode = 'P1006',
      message = 'TAI_CREATE_ORDER_DUPLICATE_PRODUCT';
  end if;

  select profile.*
  into v_profile
  from public.profiles as profile
  where profile.id = v_user_id
  for update;

  if not found
    or v_profile.status <> 'active'
    or nullif(pg_catalog.btrim(v_profile.email), '') is null
    or pg_catalog.length(v_profile.email) > 320 then
    raise exception using
      errcode = 'P1002',
      message = 'TAI_CREATE_ORDER_PROFILE_INVALID';
  end if;

  v_customer_email := pg_catalog.btrim(v_profile.email);
  v_customer_name := nullif(pg_catalog.btrim(v_profile.full_name), '');
  v_customer_phone := nullif(pg_catalog.btrim(v_profile.phone), '');

  if (v_customer_name is not null and pg_catalog.length(v_customer_name) > 160)
    or (v_customer_phone is not null and pg_catalog.length(v_customer_phone) > 50) then
    raise exception using
      errcode = 'P1002',
      message = 'TAI_CREATE_ORDER_PROFILE_INVALID';
  end if;

  select
    pg_catalog.max(case
      when setting.key = 'payment.bank_name' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'payment.bank_account_number' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'payment.bank_account_holder' then setting.value #>> '{}'::text[]
    end),
    pg_catalog.max(case
      when setting.key = 'payment.instructions' then setting.value #>> '{}'::text[]
    end)
  into
    v_bank_name,
    v_bank_account_number,
    v_bank_account_holder,
    v_payment_instructions
  from public.site_settings as setting
  where setting.key in (
    'payment.bank_name',
    'payment.bank_account_number',
    'payment.bank_account_holder',
    'payment.instructions'
  )
    and setting.visibility = 'private'
    and pg_catalog.jsonb_typeof(setting.value) = 'string';

  v_bank_name := nullif(pg_catalog.btrim(v_bank_name), '');
  v_bank_account_number := nullif(pg_catalog.btrim(v_bank_account_number), '');
  v_bank_account_holder := nullif(pg_catalog.btrim(v_bank_account_holder), '');
  v_payment_instructions := nullif(pg_catalog.btrim(v_payment_instructions), '');

  if v_bank_name is null
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

  foreach v_product_id in array p_product_ids
  loop
    select product.*
    into v_product
    from public.products as product
    where product.id = v_product_id
    for share;

    if not found then
      raise exception using
        errcode = 'P1008',
        message = 'TAI_CREATE_ORDER_PRODUCT_NOT_FOUND';
    end if;

    if v_product.publication_status <> 'published'
      or v_product.product_type not in ('chatbot', 'ai_app')
      or v_product.access_type <> 'paid'
      or v_product.sales_status <> 'on_sale'
      or not v_product.sellable
      or v_product.price is null
      or v_product.price <= 0
      or nullif(pg_catalog.btrim(v_product.title), '') is null
      or nullif(pg_catalog.btrim(v_product.slug), '') is null
      or v_product.currency !~ '^[A-Z]{3}$' then
      raise exception using
        errcode = 'P1009',
        message = 'TAI_CREATE_ORDER_PRODUCT_NOT_SELLABLE';
    end if;

    perform 1
    from public.user_product_entitlements as entitlement
    where entitlement.user_id = v_user_id
      and entitlement.product_id = v_product.id
      and entitlement.status = 'active'
    for share;

    if found then
      raise exception using
        errcode = 'P1010',
        message = 'TAI_CREATE_ORDER_PRODUCT_ALREADY_OWNED';
    end if;

    if exists (
      select 1
      from public.orders as existing_order
      inner join public.order_items as existing_item
        on existing_item.order_id = existing_order.id
      where existing_order.user_id = v_user_id
        and existing_item.product_id = v_product.id
        and existing_order.status = 'pending'
        and (
          existing_order.payment_status = 'pending_confirmation'
          or (
            existing_order.payment_status = 'unpaid'
            and existing_order.expires_at > v_now
          )
        )
    ) then
      raise exception using
        errcode = 'P1011',
        message = 'TAI_CREATE_ORDER_PENDING_ORDER_EXISTS';
    end if;

    v_flash_sale_id := null;
    v_flash_sale_price := null;

    select flash_sale.id, flash_sale.sale_price
    into v_flash_sale_id, v_flash_sale_price
    from public.flash_sales as flash_sale
    where flash_sale.product_id = v_product.id
      and flash_sale.status in ('scheduled', 'active')
      and flash_sale.start_at <= v_now
      and flash_sale.end_at > v_now
    order by flash_sale.start_at desc, flash_sale.id
    limit 1
    for share;

    if found then
      if v_flash_sale_price is null
        or v_flash_sale_price <= 0
        or v_flash_sale_price >= v_product.price then
        raise exception using
          errcode = 'P1012',
          message = 'TAI_CREATE_ORDER_FLASH_SALE_PRICE_INVALID';
      end if;

      v_unit_price := v_flash_sale_price;
    else
      v_flash_sale_id := null;
      v_unit_price := v_product.price;
    end if;

    if v_currency is null then
      v_currency := v_product.currency;
    elsif v_currency <> v_product.currency then
      raise exception using
        errcode = 'P1013',
        message = 'TAI_CREATE_ORDER_MIXED_CURRENCY';
    end if;

    v_subtotal := v_subtotal + v_product.price;
    v_discount_total := v_discount_total + (v_product.price - v_unit_price);
    v_total := v_total + v_unit_price;

    v_item_product_ids := pg_catalog.array_append(v_item_product_ids, v_product.id);
    v_item_flash_sale_ids := pg_catalog.array_append(v_item_flash_sale_ids, v_flash_sale_id);
    v_item_titles := pg_catalog.array_append(v_item_titles, v_product.title);
    v_item_slugs := pg_catalog.array_append(v_item_slugs, v_product.slug);
    v_item_product_types := pg_catalog.array_append(v_item_product_types, v_product.product_type);
    v_item_base_prices := pg_catalog.array_append(v_item_base_prices, v_product.price);
    v_item_unit_prices := pg_catalog.array_append(v_item_unit_prices, v_unit_price);
    v_item_currencies := pg_catalog.array_append(v_item_currencies, v_product.currency);
  end loop;

  if v_subtotal <= 0
    or v_total <= 0
    or v_discount_total < 0
    or v_discount_total > v_subtotal
    or v_total <> v_subtotal - v_discount_total then
    raise exception using
      errcode = 'P1014',
      message = 'TAI_CREATE_ORDER_TOTAL_INVALID';
  end if;

  v_created_order_id := null;

  for v_attempt in 1..3
  loop
    begin
      insert into public.orders as created_order (
        user_id,
        status,
        payment_status,
        payment_method,
        subtotal,
        discount_total,
        total,
        currency,
        customer_email_snapshot,
        customer_name_snapshot,
        customer_phone_snapshot,
        bank_name_snapshot,
        bank_account_number_snapshot,
        bank_account_holder_snapshot,
        payment_instructions_snapshot,
        expires_at
      ) values (
        v_user_id,
        'pending',
        'unpaid',
        'bank_transfer',
        v_subtotal,
        v_discount_total,
        v_total,
        v_currency,
        v_customer_email,
        v_customer_name,
        v_customer_phone,
        v_bank_name,
        v_bank_account_number,
        v_bank_account_holder,
        v_payment_instructions,
        v_now + interval '24 hours'
      )
      returning
        created_order.id,
        created_order.order_code,
        created_order.payment_reference,
        created_order.expires_at
      into
        v_created_order_id,
        v_created_order_code,
        v_created_payment_reference,
        v_created_expires_at;

      exit;
    exception
      when unique_violation then
        get stacked diagnostics v_constraint_name = constraint_name;

        if v_constraint_name is distinct from 'orders_order_code_key' then
          raise;
        end if;

        if v_attempt = 3 then
          raise exception using
            errcode = 'P1015',
            message = 'TAI_CREATE_ORDER_CODE_COLLISION';
        end if;
    end;
  end loop;

  if v_created_order_id is null then
    raise exception using
      errcode = 'P1015',
      message = 'TAI_CREATE_ORDER_CODE_COLLISION';
  end if;

  for v_item_index in 1..v_request_count
  loop
    insert into public.order_items (
      order_id,
      product_id,
      flash_sale_id,
      product_title_snapshot,
      product_slug_snapshot,
      product_type_snapshot,
      quantity,
      base_price,
      unit_price,
      currency
    ) values (
      v_created_order_id,
      v_item_product_ids[v_item_index],
      v_item_flash_sale_ids[v_item_index],
      v_item_titles[v_item_index],
      v_item_slugs[v_item_index],
      v_item_product_types[v_item_index],
      1,
      v_item_base_prices[v_item_index],
      v_item_unit_prices[v_item_index],
      v_item_currencies[v_item_index]
    );
  end loop;

  select
    pg_catalog.count(*),
    coalesce(pg_catalog.sum(item.base_price * item.quantity), 0),
    coalesce(pg_catalog.sum(item.discount_amount * item.quantity), 0),
    coalesce(pg_catalog.sum(item.line_total), 0)
  into
    v_inserted_item_count,
    v_check_subtotal,
    v_check_discount_total,
    v_check_total
  from public.order_items as item
  where item.order_id = v_created_order_id;

  if v_inserted_item_count <> v_request_count
    or v_check_subtotal <> v_subtotal
    or v_check_discount_total <> v_discount_total
    or v_check_total <> v_total then
    raise exception using
      errcode = 'P1014',
      message = 'TAI_CREATE_ORDER_TOTAL_INVALID';
  end if;

  return query
  select
    v_created_order_id,
    v_created_order_code,
    v_created_payment_reference,
    v_total,
    v_currency,
    v_created_expires_at,
    v_bank_name,
    v_bank_account_number,
    v_bank_account_holder,
    v_payment_instructions;
exception
  when others then
    if sqlstate like 'P1%' then
      raise;
    end if;

    raise exception using
      errcode = 'P1099',
      message = 'TAI_CREATE_ORDER_DATABASE_ERROR';
end;
$$;

revoke all on function public.create_order(uuid[]) from public, anon, authenticated;
grant execute on function public.create_order(uuid[]) to authenticated;

comment on function public.create_order(uuid[]) is
  'Creates one authenticated paid Marketplace order from product IDs, using database prices, effective Flash Sales, private payment settings, and immutable snapshots.';
