import { getPublishedProductBySlug, getPublishedProducts } from "@/lib/catalog/repository";
import { getCatalogProductState, getCatalogVisualBadge, type CatalogProductState } from "@/lib/catalog/product-state";
import type { CatalogDemoVideo, CatalogProduct } from "@/lib/catalog/types";

export type Chatbot = {
  id: string;
  databaseId: string;
  name: string;
  slug: string;
  creator: string;
  category: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  rating: string;
  sales: string;
  color: string;
  coverImage?: string;
  coverAspect?: "portrait" | "landscape";
  icon: "bot" | "shield";
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  detailUrl?: string;
  appUrl?: string;
  demoVideo: CatalogDemoVideo | null;
  transferContent?: string;
  state: CatalogProductState;
};

function metadataString(product: CatalogProduct, key: string, fallback = "") {
  const value = product.metadata[key];
  return typeof value === "string" ? value : fallback;
}

function salesLabel(product: CatalogProduct) {
  if (product.salesStatus === "coming_soon") return "Sắp ra mắt";
  if (product.salesStatus === "paused") return "Tạm dừng";
  return "Đang bán";
}

function safeRatingLabel(value: string, state: CatalogProductState) {
  const normalized = value.trim().toLocaleLowerCase("vi");
  const isComingSoonLabel = normalized === "coming soon" || normalized === "sắp ra mắt";

  return !state.isComingSoon && isComingSoonLabel ? "" : value;
}

function mapProductToChatbot(product: CatalogProduct): Chatbot {
  const coverAspect = metadataString(product, "cover_aspect");
  const icon = metadataString(product, "icon", "bot");
  const state = getCatalogProductState(product);

  return {
    id: product.legacyId,
    databaseId: product.databaseId,
    name: product.title,
    slug: product.slug,
    creator: metadataString(product, "creator", "Trung AI Media"),
    category: product.category?.name ?? "Chatbot",
    badge: getCatalogVisualBadge(state, product.badge) ?? "",
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    price: product.price ?? 0,
    originalPrice: product.originalPrice ?? undefined,
    rating: safeRatingLabel(
      metadataString(product, "rating", state.isComingSoon ? "Coming soon" : ""),
      state,
    ),
    sales: state.statusBadge ?? salesLabel(product),
    color: metadataString(product, "color", "from-blue-900 via-sky-700 to-cyan-500"),
    coverImage: product.coverImage || undefined,
    coverAspect: coverAspect === "portrait" || coverAspect === "landscape" ? coverAspect : undefined,
    icon: icon === "shield" ? "shield" : "bot",
    isFeatured: product.isFeatured,
    isActive: state.isPublic,
    displayOrder: product.displayOrder,
    detailUrl: product.detailUrl || undefined,
    appUrl: product.externalUrl || undefined,
    demoVideo: product.demoVideo,
    transferContent: metadataString(product, "transfer_content") || undefined,
    state,
  };
}

export async function getActiveChatbots() {
  const products = await getPublishedProducts(["chatbot"]);
  return products.map(mapProductToChatbot);
}

export async function getFeaturedChatbots() {
  const chatbots = await getActiveChatbots();
  return chatbots.filter((chatbot) => chatbot.isFeatured);
}

export async function getChatbotBySlug(slug: string) {
  const product = await getPublishedProductBySlug(slug, ["chatbot", "ai_app"]);

  if (!product) return undefined;
  if (product.productType === "ai_app" && !product.detailUrl.includes("/workflow/chatbot/")) return undefined;

  return mapProductToChatbot(product);
}
