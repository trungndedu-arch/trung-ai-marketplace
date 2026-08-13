import { getPublishedProductBySlug, getPublishedProducts, getRelatedPublishedProducts } from "@/lib/catalog/repository";
import { getCatalogProductState, getCatalogVisualBadge, type CatalogProductState } from "@/lib/catalog/product-state";
import type { CatalogDemoVideo, CatalogProduct } from "@/lib/catalog/types";

export type Workflow = {
  id: string;
  databaseId: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  category: string;
  badge: string;
  price: number;
  originalPrice?: number;
  transferContent?: string;
  isFree: boolean;
  appUrl?: string;
  purchaseUrl?: string;
  license?: string;
  hidePrice?: boolean;
  features?: string[];
  suitableFor?: string[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  tools: string[];
  steps: string[];
  demoVideo: CatalogDemoVideo | null;
  demoVideoUrl?: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  salesStatus: string;
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

function metadataBoolean(product: CatalogProduct, key: string, fallback = false) {
  const value = product.metadata[key];
  return typeof value === "boolean" ? value : fallback;
}

function metadataStringArray(product: CatalogProduct, key: string) {
  const value = product.metadata[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function salesLabel(product: CatalogProduct) {
  return metadataString(
    product,
    "sales_label",
    product.salesStatus === "coming_soon" ? "Sắp ra mắt" : product.salesStatus === "paused" ? "Tạm dừng" : "Đang bán",
  );
}

function mapProductToWorkflow(product: CatalogProduct): Workflow {
  const state = getCatalogProductState(product);

  return {
    id: product.legacyId,
    databaseId: product.databaseId,
    name: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    fullDescription: product.fullDescription,
    coverImage: product.coverImage,
    category: product.category?.name ?? "AI App",
    badge: getCatalogVisualBadge(state, product.badge) ?? "",
    price: product.price ?? 0,
    originalPrice: product.originalPrice ?? undefined,
    transferContent: metadataString(product, "transfer_content") || undefined,
    isFree: state.isFree,
    appUrl: product.externalUrl || undefined,
    purchaseUrl: undefined,
    license: metadataString(product, "license") || undefined,
    hidePrice: metadataBoolean(product, "hide_price", false),
    features: metadataStringArray(product, "features"),
    suitableFor: metadataStringArray(product, "suitable_for"),
    ctaTitle: metadataString(product, "cta_title") || undefined,
    ctaDescription: metadataString(product, "cta_description") || undefined,
    ctaLabel: metadataString(product, "cta_label") || undefined,
    tools: metadataStringArray(product, "tools"),
    steps: metadataStringArray(product, "steps"),
    demoVideo: product.demoVideo,
    demoVideoUrl: metadataString(product, "demo_video_url") || undefined,
    tags: product.tags,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
    salesStatus: state.statusBadge ?? salesLabel(product),
    isFeatured: product.isFeatured,
    isActive: state.isPublic,
    displayOrder: product.displayOrder,
    createdAt: metadataString(product, "source_created_at", product.createdAt),
    detailUrl: product.detailUrl || undefined,
    state,
  };
}

function isWorkflowDetailRoute(product: CatalogProduct) {
  return !product.detailUrl || product.detailUrl === `/workflow/${product.slug}`;
}

export async function getActiveWorkflows() {
  const products = await getPublishedProducts(["ai_app"]);
  return products.map(mapProductToWorkflow);
}

export async function getFeaturedWorkflows() {
  const workflows = await getActiveWorkflows();
  return workflows.filter((workflow) => workflow.isFeatured);
}

export async function getWorkflowBySlug(slug: string) {
  const product = await getPublishedProductBySlug(slug, ["ai_app"]);
  if (!product || !isWorkflowDetailRoute(product)) return undefined;

  return mapProductToWorkflow(product);
}

export async function getRelatedWorkflows(workflow: Workflow, limit = 4) {
  const product = await getPublishedProductBySlug(workflow.slug, ["ai_app"]);
  if (!product) return [];

  const related = await getRelatedPublishedProducts(product, limit);
  return related.filter(isWorkflowDetailRoute).map(mapProductToWorkflow);
}
