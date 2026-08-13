"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function CartNavLink({ showLabel = false }: { showLabel?: boolean }) {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Giỏ hàng, ${count} sản phẩm`}
      className="relative inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-extrabold text-slate-200 transition hover:border-sky-300/35 hover:bg-white/[0.06] hover:text-white"
    >
      <ShoppingCart className="h-4 w-4" />
      {showLabel ? <span>Giỏ hàng</span> : null}
      {count > 0 ? <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-sky-500 px-1 text-[10px] font-black text-white shadow-[0_0_14px_rgba(56,189,248,.65)]">{count}</span> : null}
    </Link>
  );
}
