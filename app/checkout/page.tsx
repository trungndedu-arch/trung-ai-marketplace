import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutPageClient } from "@/components/checkout/CheckoutPageClient";
import { CommerceHeader } from "@/components/commerce/CommerceHeader";
import { getPublishedProducts } from "@/lib/catalog/repository";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Thanh toán" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/checkout");

  const products = await getPublishedProducts(["chatbot", "ai_app"]);
  const userSummary = user.email ? { email: user.email } : null;
  return <div className="min-h-screen bg-ink text-slate-100"><CommerceHeader user={userSummary} /><CheckoutPageClient products={products} /></div>;
}
