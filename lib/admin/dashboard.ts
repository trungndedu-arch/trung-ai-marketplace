import { requireAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

type DashboardProductRow = {
  product_type: "chatbot" | "ai_app" | "ai_tool" | "course";
  access_type: "paid" | "free";
  sales_status: "coming_soon" | "on_sale" | "paused";
  sellable: boolean;
};

export type AdminDashboardStats = {
  total: number;
  chatbot: number;
  aiApp: number;
  aiTool: number;
  course: number;
  onSale: number;
  comingSoon: number;
  free: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  await requireAdminAccess();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("product_type, access_type, sales_status, sellable");

  if (error) {
    throw new Error(`Không thể tải số liệu quản trị: ${error.message}`);
  }

  const products = (data ?? []) as DashboardProductRow[];

  return {
    total: products.length,
    chatbot: products.filter((product) => product.product_type === "chatbot").length,
    aiApp: products.filter((product) => product.product_type === "ai_app").length,
    aiTool: products.filter((product) => product.product_type === "ai_tool").length,
    course: products.filter((product) => product.product_type === "course").length,
    onSale: products.filter((product) => product.sales_status === "on_sale" && product.sellable).length,
    comingSoon: products.filter((product) => product.sales_status === "coming_soon").length,
    free: products.filter((product) => product.access_type === "free").length,
  };
}
