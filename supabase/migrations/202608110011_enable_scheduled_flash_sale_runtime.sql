-- Scheduled and active Flash Sales are both controlled by their time window.
drop policy if exists "flash sales: public can read active" on public.flash_sales;
drop policy if exists "flash sales: public can read effective" on public.flash_sales;

create policy "flash sales: public can read effective" on public.flash_sales
  for select to anon, authenticated using (
    status in ('scheduled', 'active')
    and start_at <= now()
    and end_at > now()
    and exists (
      select 1
      from public.products
      where products.id = flash_sales.product_id
        and products.publication_status = 'published'
        and products.product_type in ('chatbot', 'ai_app')
        and products.access_type = 'paid'
        and products.sales_status = 'on_sale'
        and products.sellable
        and products.price is not null
        and products.price > 0
        and flash_sales.sale_price >= 0
        and flash_sales.sale_price < products.price
    )
  );

drop index if exists public.flash_sales_public_schedule_idx;
create index flash_sales_public_schedule_idx
  on public.flash_sales (product_id, start_at, end_at)
  where status in ('scheduled', 'active');
