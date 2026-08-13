"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function ProductPurchaseActions({ productId, className = "" }: { productId: string; className?: string }) {
  const router = useRouter();
  const { addProduct } = useCart();
  const [message, setMessage] = useState("");
  const buttonClass = "inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60";

  function addToCart() {
    const result = addProduct(productId);
    setMessage(result === "added" ? "Đã thêm sản phẩm vào giỏ hàng." : result === "duplicate" ? "Sản phẩm đã có trong giỏ hàng." : result === "full" ? "Giỏ hàng đã đạt giới hạn 20 sản phẩm." : "Không thể thêm sản phẩm này vào giỏ hàng.");
  }

  function buyNow() {
    const result = addProduct(productId);
    if (result === "full" || result === "invalid") {
      setMessage(result === "full" ? "Giỏ hàng đã đạt giới hạn 20 sản phẩm." : "Không thể mua sản phẩm này lúc này.");
      return;
    }
    router.push("/checkout");
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={addToCart} className={`${buttonClass} border border-sky-300/30 bg-sky-500/10 text-sky-100 hover:border-sky-300/55 hover:bg-sky-500/20`}>
          <ShoppingCart className="h-4 w-4" /> Thêm vào giỏ
        </button>
        <button type="button" onClick={buyNow} className={`${buttonClass} bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_26px_rgba(59,130,246,.26)] hover:brightness-110`}>
          Mua ngay <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      {message ? <p aria-live="polite" className="mt-2 text-xs font-semibold text-sky-200">{message}</p> : null}
    </div>
  );
}
