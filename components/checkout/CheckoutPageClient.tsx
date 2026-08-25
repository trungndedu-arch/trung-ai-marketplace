"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, LockKeyhole, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { createCheckoutOrder } from "@/lib/checkout/actions";
import { formatCatalogPrice, getCatalogProductState } from "@/lib/catalog/product-state";
import type { CatalogProduct } from "@/lib/catalog/types";

export function CheckoutPageClient({ products }: { products: CatalogProduct[] }) {
  const router = useRouter();
  const { productIds, isReady, removeProducts } = useCart();
  const [errorMessage, setErrorMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const submittingRef = useRef(false);
  const productMap = new Map(products.map((product) => [product.databaseId, product]));
  const checkoutProducts = productIds.flatMap((id) => {
    const product = productMap.get(id);
    return product ? [product] : [];
  });
  const hasInvalidProduct = checkoutProducts.length !== productIds.length || checkoutProducts.some((product) => !getCatalogProductState(product).isPurchasable);
  const estimatedTotal = checkoutProducts.reduce((sum, product) => sum + (getCatalogProductState(product).pricing.currentPrice ?? 0), 0);

  function submitOrder() {
    if (submittingRef.current || isPending || isRedirecting || productIds.length === 0 || hasInvalidProduct) return;
    submittingRef.current = true;
    setErrorMessage("");
    const checkedOutIds = [...productIds];

    startTransition(async () => {
      try {
        const result = await createCheckoutOrder(checkedOutIds);
        if (result.status === "error") {
          submittingRef.current = false;
          setErrorMessage(result.message);
          return;
        }

        setIsRedirecting(true);
        if (result.status === "success") removeProducts(checkedOutIds);
        router.replace(`/checkout/order/${result.orderId}`);
      } catch {
        submittingRef.current = false;
        setIsRedirecting(false);
        setErrorMessage("Không thể kết nối để tạo đơn hàng. Vui lòng thử lại.");
      }
    });
  }

  if (isRedirecting) return <div className="grid min-h-[520px] place-items-center px-4 text-center"><div><Loader2 className="mx-auto h-8 w-8 animate-spin text-sky-300" /><p className="mt-4 text-sm font-extrabold text-white">Đang mở đơn hàng...</p><p className="mt-2 text-xs text-slate-500">Vui lòng giữ nguyên trang trong giây lát.</p></div></div>;

  if (!isReady) return <div className="grid min-h-[420px] place-items-center text-sm font-semibold text-slate-400">Đang chuẩn bị thanh toán...</div>;

  if (productIds.length === 0) {
    return (
      <section className="mx-auto grid min-h-[520px] max-w-2xl place-items-center px-4 py-12 text-center">
        <div><ShoppingCart className="mx-auto h-10 w-10 text-slate-500" /><h1 className="mt-5 text-2xl font-extrabold text-white">Không có sản phẩm để thanh toán</h1><p className="mt-3 text-sm text-slate-400">Hãy thêm sản phẩm vào giỏ hàng trước khi tạo đơn.</p><Link href="/cart" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-5 text-sm font-extrabold text-white">Quay lại giỏ hàng</Link></div>
      </section>
    );
  }

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <Link href="/cart" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Quay lại giỏ hàng</Link>
      <div className="mt-4 grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <section>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Checkout bảo mật</p>
          <h1 className="mt-2 text-3xl font-extrabold text-white">Xác nhận đơn hàng</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Giá và điều kiện bán sẽ được Supabase xác nhận lại tại thời điểm bạn đặt hàng.</p>
          <div className="mt-6 space-y-3">
            {checkoutProducts.map((product) => {
              const state = getCatalogProductState(product);
              return <article key={product.databaseId} className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#0F1F33] p-4"><div className="relative aspect-[9/16] w-14 shrink-0 overflow-hidden rounded-lg bg-[#07111F]">{product.coverImage ? <Image src={product.coverImage} alt={product.coverImageAlt} fill sizes="56px" className="object-cover" /> : null}</div><div className="min-w-0 flex-1"><p className="line-clamp-2 text-sm font-extrabold text-white">{product.title}</p><p className="mt-1 text-xs text-slate-500">Số lượng: 1</p></div><strong className="shrink-0 text-sm text-white">{state.pricing.currentPrice !== null ? formatCatalogPrice(state.pricing.currentPrice) : "-"}</strong></article>;
            })}
          </div>
          {hasInvalidProduct ? <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-500/10 px-4 py-3 text-sm font-semibold leading-6 text-amber-100">Giỏ hàng có sản phẩm không còn khả dụng. Vui lòng quay lại giỏ hàng để cập nhật.</p> : null}
        </section>

        <aside className="rounded-2xl border border-sky-300/15 bg-[#0B1728] p-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 text-sm font-extrabold text-white"><LockKeyhole className="h-4 w-4 text-sky-300" />Đơn hàng được tạo phía server</div>
          <div className="mt-5 flex items-center justify-between border-y border-white/[0.08] py-4"><span className="text-sm text-slate-400">Tổng tham khảo</span><strong className="text-xl text-white">{formatCatalogPrice(estimatedTotal)}</strong></div>
          <p className="mt-4 text-xs leading-5 text-slate-400">Số tiền chuyển khoản chính xác chỉ hiển thị sau khi database tạo order và lưu snapshot.</p>
          {errorMessage ? <p role="alert" className="mt-4 rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-sm leading-6 text-red-100">{errorMessage}</p> : null}
          <button type="button" onClick={submitOrder} disabled={isPending || isRedirecting || hasInvalidProduct} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55">{isPending || isRedirecting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{isRedirecting ? "Đang mở đơn hàng..." : isPending ? "Đang tạo đơn hàng..." : "Đặt hàng"}</button>
        </aside>
      </div>
    </main>
  );
}
