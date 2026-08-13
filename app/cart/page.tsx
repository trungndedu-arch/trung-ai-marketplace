import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { CommerceHeader } from "@/components/commerce/CommerceHeader";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { getPublishedProducts } from "@/lib/catalog/repository";

export const metadata: Metadata = { title: "Giỏ hàng" };
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const [products, user] = await Promise.all([
    getPublishedProducts(["chatbot", "ai_app"]),
    getCurrentUserSummary(),
  ]);

  return <div className="min-h-screen bg-ink text-slate-100"><CommerceHeader user={user} /><CartPageClient products={products} isAuthenticated={Boolean(user)} /></div>;
}
