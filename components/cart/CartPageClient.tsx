"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { formatCatalogPrice, getCatalogProductState } from "@/lib/catalog/product-state";
import type { CatalogProduct } from "@/lib/catalog/types";

export function CartPageClient({ products, isAuthenticated }: { products: CatalogProduct[]; isAuthenticated: boolean }) {
  const { productIds, isReady, removeProduct } = useCart();
  const productMap = new Map(products.map((product) => [product.databaseId, product]));
  const cartProducts = productIds.flatMap((id) => {
    const product = productMap.get(id);
    return product ? [product] : [];
  });
  const invalidIds = productIds.filter((id) => !productMap.has(id));
  const hasInvalidProduct = invalidIds.length > 0 || cartProducts.some((product) => !getCatalogProductState(product).isPurchasable);
  const estimatedTotal = cartProducts.reduce((sum, product) => {
    const price = getCatalogProductState(product).pricing.currentPrice;
    return sum + (price ?? 0);
  }, 0);

  if (!isReady) {
    return <div className="grid min-h-[360px] place-items-center text-sm font-semibold text-slate-400">Đang tải giỏ hàng...</div>;
  }

  if (productIds.length === 0) {
    return (
      <section className="mx-auto grid min-h-[520px] max-w-2xl place-items-center px-4 py-12 text-center">
        <div>
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><ShoppingCart className="h-7 w-7" /></span>
          <h1 className="mt-6 text-2xl font-extrabold text-white sm:text-3xl">Giỏ hàng của bạn đang trống.</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">Khám phá Chatbot và AI App đang bán để thêm sản phẩm phù hợp vào giỏ hàng.</p>
          <Link href="/workflow" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-5 text-sm font-extrabold text-white shadow-glow">
            Xem sản phẩm <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    );
  }

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link href="/workflow" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Tiếp tục mua sắm</Link>
      <div className="mt-4 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section>
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Giỏ hàng</p>
            <h1 className="mt-2 text-3xl font-extrabold text-white">Sản phẩm đã chọn</h1>
            <p className="mt-2 text-sm text-slate-400">{productIds.length} sản phẩm, mỗi sản phẩm có số lượng 1.</p>
          </div>
          <div className="space-y-4">
            {cartProducts.map((product) => {
              const state = getCatalogProductState(product);
              return (
                <article key={product.databaseId} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-[#0F1F33] p-4 sm:gap-5">
                  <div className="relative aspect-[9/16] w-20 shrink-0 overflow-hidden rounded-xl bg-[#07111F] sm:w-24">
                    {product.coverImage ? <Image src={product.coverImage} alt={product.coverImageAlt} fill sizes="96px" className="object-cover object-center" /> : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-sky-400">{product.category?.name ?? (product.productType === "chatbot" ? "Chatbot" : "AI App")}</p>
                    <h2 className="mt-1 line-clamp-2 text-base font-extrabold text-white sm:text-lg">{product.title}</h2>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400 sm:text-sm">{product.shortDescription}</p>
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                      <div>
                        <p className="text-sm font-black text-white">{state.pricing.currentPrice !== null ? formatCatalogPrice(state.pricing.currentPrice) : "Chưa có giá"}</p>
                        {state.hasActiveFlashSale && state.pricing.basePrice !== null ? <p className="mt-1 text-xs text-slate-500 line-through">{formatCatalogPrice(state.pricing.basePrice)}</p> : null}
                        {!state.isPurchasable ? <p className="mt-1 text-xs font-bold text-amber-300">Sản phẩm không còn đủ điều kiện thanh toán.</p> : null}
                      </div>
                      <button type="button" onClick={() => removeProduct(product.databaseId)} aria-label={`Xóa ${product.title} khỏi giỏ hàng`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs font-bold text-slate-300 transition hover:border-red-300/30 hover:bg-red-500/10 hover:text-red-200"><Trash2 className="h-4 w-4" />Xóa</button>
                    </div>
                  </div>
                </article>
              );
            })}
            {invalidIds.map((id) => (
              <article key={id} className="flex items-center justify-between gap-4 rounded-2xl border border-amber-300/20 bg-amber-500/[0.06] p-4">
                <div><h2 className="font-extrabold text-amber-100">Sản phẩm không còn khả dụng</h2><p className="mt-1 text-xs text-amber-200/70">Mã: {id}</p></div>
                <button type="button" onClick={() => removeProduct(id)} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-200/20 text-amber-100" aria-label="Xóa sản phẩm không khả dụng"><Trash2 className="h-4 w-4" /></button>
              </article>
            ))}
          </div>
        </section>

        <aside className="rounded-2xl border border-sky-300/15 bg-[#0B1728] p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold text-white">Tóm tắt giỏ hàng</h2>
          <div className="mt-5 flex items-center justify-between border-b border-white/[0.08] pb-4 text-sm"><span className="text-slate-400">Tạm tính</span><strong className="text-lg text-white">{formatCatalogPrice(estimatedTotal)}</strong></div>
          <p className="mt-4 text-xs leading-5 text-slate-400">Tổng cuối cùng sẽ được database xác nhận lại khi tạo đơn hàng. Giá hiển thị tại đây chỉ để tham khảo.</p>
          {hasInvalidProduct ? <p className="mt-4 rounded-xl border border-amber-300/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold leading-5 text-amber-100">Hãy xóa sản phẩm không còn khả dụng trước khi thanh toán.</p> : null}
          {hasInvalidProduct ? (
            <span aria-disabled="true" className="mt-5 flex min-h-12 cursor-not-allowed items-center justify-center rounded-xl bg-white/[0.06] text-sm font-extrabold text-slate-500">Tiến hành thanh toán</span>
          ) : (
            <Link href={isAuthenticated ? "/checkout" : "/login?next=/checkout"} className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110">Tiến hành thanh toán <ArrowRight className="h-4 w-4" /></Link>
          )}
        </aside>
      </div>
    </main>
  );
}
