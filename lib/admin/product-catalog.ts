import type { ProductType } from "@/lib/catalog/types";

export type ProductPlacement = "workflow" | "ai_tools" | "courses";

export type ProductCatalogDestination = {
  label: string;
  href: string | null;
  description: string;
};

export type ProductPlacementOption = {
  id: ProductPlacement;
  label: string;
  description: string;
  href: string | null;
  productTypes: readonly ProductType[];
  defaultProductType: ProductType;
};

const placements: Record<ProductPlacement, ProductPlacementOption> = {
  workflow: {
    id: "workflow",
    label: "Chatbot & AI App",
    description: "Catalog /workflow. Chọn tiếp AI App hoặc Chatbot để xác định tab hiển thị.",
    href: "/workflow",
    productTypes: ["ai_app", "chatbot"],
    defaultProductType: "ai_app",
  },
  ai_tools: {
    id: "ai_tools",
    label: "Công Cụ AI Nên Dùng",
    description: "Catalog /cong-cu-ai dành cho AI Tool có liên kết affiliate.",
    href: "/cong-cu-ai",
    productTypes: ["ai_tool"],
    defaultProductType: "ai_tool",
  },
  courses: {
    id: "courses",
    label: "Khóa học · trang chủ/landing page",
    description: "Sản phẩm khóa học được giới thiệu trên trang chủ hoặc landing page đã cấu hình; không tự gắn vào menu landing cố định.",
    href: null,
    productTypes: ["course"],
    defaultProductType: "course",
  },
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

export function getProductPlacement(productType: ProductType): ProductPlacement {
  if (productType === "chatbot" || productType === "ai_app") return "workflow";
  if (productType === "ai_tool") return "ai_tools";
  return "courses";
}

export function getProductPlacementOptions() {
  return Object.values(placements);
}

export function getPlacementOption(placement: ProductPlacement) {
  return placements[placement];
}

export function getRecommendedCategorySlug(productType: ProductType) {
  if (productType === "ai_app") return "ai-app";
  if (productType === "chatbot") return "chatbot";
  return null;
}

export function getSuggestedDetailUrl(productType: ProductType, slug: string) {
  if (!slug) return "";
  if (productType === "chatbot") return `/workflow/chatbot/${slug}`;
  if (productType === "ai_app") return `/workflow/${slug}`;
  if (productType === "ai_tool") return `/cong-cu-ai/${slug}`;
  return "";
}
