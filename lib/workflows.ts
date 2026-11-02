import { getFeaturedPublishedProducts, getPublishedProductBySlug, getPublishedProducts } from "@/lib/catalog/repository";
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
  const products = await getFeaturedPublishedProducts(["ai_app"]);
  return products.map(mapProductToWorkflow);
}

export async function getWorkflowBySlug(slug: string) {
  const product = await getPublishedProductBySlug(slug, ["ai_app"]);
  if (!product || !isWorkflowDetailRoute(product)) return undefined;

  return mapProductToWorkflow(product);
}

const videoAutomationTerms = ["video", "clip", "reel", "short", "tiktok"];
const workflowTopicTerms = ["review", "quang cao", "thoi trang", "pov", "triet ly", "san pham", "ban hang"];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");
}

function normalizedSearchText(workflow: Workflow) {
  return normalizeText([workflow.name, workflow.shortDescription, workflow.category, ...workflow.tags].join(" "));
}

function hasVideoAutomationFocus(workflow: Workflow) {
  const text = normalizedSearchText(workflow);
  return videoAutomationTerms.some((term) => text.includes(term));
}

function sharedTagCount(source: Workflow, candidate: Workflow) {
  const sourceTags = new Set(source.tags.map((tag) => normalizeText(tag.trim())).filter(Boolean));
  return candidate.tags.reduce((count, tag) => count + Number(sourceTags.has(normalizeText(tag.trim()))), 0);
}

function sharedTopicCount(source: Workflow, candidate: Workflow) {
  const sourceText = normalizedSearchText(source);
  const candidateText = normalizedSearchText(candidate);
  return workflowTopicTerms.filter((term) => sourceText.includes(term) && candidateText.includes(term)).length;
}

function workflowTopic(workflow: Workflow) {
  const text = normalizedSearchText(workflow);
  return workflowTopicTerms.find((term) => text.includes(term)) ?? workflow.category.toLocaleLowerCase("vi");
}

function compareRelatedWorkflows(source: Workflow, left: Workflow, right: Workflow) {
  const score = (candidate: Workflow) => {
    const sameCategory = candidate.category === source.category ? 100 : 0;
    return sameCategory + sharedTagCount(source, candidate) * 10 + sharedTopicCount(source, candidate) * 20;
  };

  return score(right) - score(left)
    || left.displayOrder - right.displayOrder
    || left.createdAt.localeCompare(right.createdAt)
    || left.databaseId.localeCompare(right.databaseId);
}

function selectDiverseWorkflows(source: Workflow, candidates: Workflow[], limit: number) {
  const ordered = [...candidates].sort((left, right) => compareRelatedWorkflows(source, left, right));
  const selected: Workflow[] = [];
  const usedTopics = new Set<string>();

  for (const candidate of ordered) {
    const topic = workflowTopic(candidate);
    if (usedTopics.has(topic)) continue;
    selected.push(candidate);
    usedTopics.add(topic);
    if (selected.length === limit) return selected;
  }

  for (const candidate of ordered) {
    if (selected.some((item) => item.databaseId === candidate.databaseId)) continue;
    selected.push(candidate);
    if (selected.length === limit) break;
  }

  return selected;
}

export function getRelatedWorkflowTitle(workflow: Workflow) {
  return hasVideoAutomationFocus(workflow) ? "Các App làm video tự động tương tự" : "AI App tương tự";
}

export async function getRelatedWorkflows(workflow: Workflow, limit = 4) {
  const candidates = (await getPublishedProducts(["ai_app"])).map(mapProductToWorkflow);
  const isVideoWorkflow = hasVideoAutomationFocus(workflow);
  const related = candidates.filter((candidate) => {
    if (candidate.databaseId === workflow.databaseId) return false;
    if (isVideoWorkflow) return hasVideoAutomationFocus(candidate);
    return candidate.category === workflow.category || sharedTagCount(workflow, candidate) > 0;
  });

  return selectDiverseWorkflows(workflow, related, limit);
}
