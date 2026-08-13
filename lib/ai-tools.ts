import { getPublishedProductBySlug, getPublishedProducts, getRelatedPublishedProducts } from "@/lib/catalog/repository";
import { getCatalogProductState, getCatalogVisualBadge, type CatalogProductState } from "@/lib/catalog/product-state";
import type { CatalogDemoVideo, CatalogProduct } from "@/lib/catalog/types";

export type AiTool = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  logo: string;
  category: string;
  badge: string;
  toolType: string;
  affiliateUrl: string;
  officialWebsite: string;
  tutorialUrl: string;
  demoVideo: CatalogDemoVideo | null;
  demoVideoUrl: string;
  features: string[];
  targetUsers: string[];
  useCases: string[];
  benefits: string[];
  tags: string[];
  galleryImages: string[];
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  detailUrl?: string;
  state: CatalogProductState;
};

function metadataString(product: CatalogProduct, key: string, fallback = "") {
  const value = product.metadata[key];
  return typeof value === "string" ? value : fallback;
}

function metadataStringArray(product: CatalogProduct, key: string) {
  const value = product.metadata[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function mapProductToAiTool(product: CatalogProduct): AiTool {
  const state = getCatalogProductState(product);

  return {
    id: product.legacyId,
    name: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    coverImage: product.coverImage,
    logo: metadataString(product, "logo"),
    category: product.category?.name ?? "AI Tool",
    badge: getCatalogVisualBadge(state, product.badge) ?? "",
    toolType: metadataString(product, "tool_type", "Freemium"),
    affiliateUrl: product.affiliateUrl,
    officialWebsite: metadataString(product, "official_website"),
    tutorialUrl: metadataString(product, "tutorial_url"),
    demoVideo: product.demoVideo,
    demoVideoUrl: metadataString(product, "demo_video_url"),
    features: metadataStringArray(product, "features"),
    targetUsers: metadataStringArray(product, "target_users"),
    useCases: metadataStringArray(product, "use_cases"),
    benefits: metadataStringArray(product, "benefits"),
    tags: product.tags,
    galleryImages: metadataStringArray(product, "gallery_images"),
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    isFeatured: product.isFeatured,
    isActive: state.isPublic,
    displayOrder: product.displayOrder,
    createdAt: metadataString(product, "source_created_at", product.createdAt),
    detailUrl: product.detailUrl || undefined,
    state,
  };
}

export async function getActiveAiTools() {
  const products = await getPublishedProducts(["ai_tool"]);
  return products.map(mapProductToAiTool);
}

export async function getFeaturedAiTools() {
  const tools = await getActiveAiTools();
  return tools.filter((tool) => tool.isFeatured);
}

export async function getAiToolBySlug(slug: string) {
  const product = await getPublishedProductBySlug(slug, ["ai_tool"]);
  return product ? mapProductToAiTool(product) : undefined;
}

export async function getRelatedAiTools(tool: AiTool, limit = 4) {
  const product = await getPublishedProductBySlug(tool.slug, ["ai_tool"]);
  if (!product) return [];

  const related = await getRelatedPublishedProducts(product, limit);
  return related.map(mapProductToAiTool);
}
