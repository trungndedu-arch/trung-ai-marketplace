import type { ProductType } from "@/lib/catalog/types";

export type ProductCatalogDestination = {
  label: string;
  href: string | null;
  description: string;
};

const destinations: Record<ProductType, ProductCatalogDestination> = {
  chatbot: {
    label: "Chatbot & AI App · tab Chatbot",
    href: "/workflow?tab=chatbot",
    description: "Hiển thị trong khu vực Chatbot của catalog Workflow.",
  },
  ai_app: {
    label: "Chatbot & AI App · tab AI App",
    href: "/workflow?tab=ai-app",
    description: "Hiển thị trong khu vực AI App của catalog Workflow.",
  },
  ai_tool: {
    label: "Công Cụ AI",
    href: "/cong-cu-ai",
    description: "Hiển thị trong catalog công cụ AI và liên kết affiliate.",
  },
  course: {
    label: "Khóa học · trang chủ/landing page",
    href: null,
    description: "Khóa học được giới thiệu trên trang chủ hoặc landing page đã cấu hình.",
  },
};

export function getProductCatalogDestination(productType: ProductType) {
  return destinations[productType];
}

export function getSuggestedDetailUrl(productType: ProductType, slug: string) {
  if (!slug) return "";
  if (productType === "chatbot") return `/workflow/chatbot/${slug}`;
  if (productType === "ai_app") return `/workflow/${slug}`;
  if (productType === "ai_tool") return `/cong-cu-ai/${slug}`;
  return "";
}
