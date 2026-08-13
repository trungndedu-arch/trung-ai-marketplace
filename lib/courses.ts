import { getPublishedProductBySlug, getPublishedProducts } from "@/lib/catalog/repository";
import { getCatalogProductState, getCatalogVisualBadge, type CatalogProductState } from "@/lib/catalog/product-state";
import type { CatalogDemoVideo, CatalogProduct } from "@/lib/catalog/types";

export type Course = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  category: string;
  badge: string;
  status: string;
  price?: string;
  originalPrice?: string;
  landingPageUrl?: string;
  demoVideo: CatalogDemoVideo | null;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  state: CatalogProductState;
};

function metadataString(product: CatalogProduct, key: string, fallback = "") {
  const value = product.metadata[key];
  return typeof value === "string" ? value : fallback;
}

function formatCoursePrice(price: number | null) {
  return price === null ? undefined : new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

function statusLabel(product: CatalogProduct, state: CatalogProductState) {
  if (state.isComingSoon) return "Sắp ra mắt";
  if (state.isPaused) return "Tạm dừng";
  return metadataString(product, "status_label", "Đang mở đăng ký");
}

function mapProductToCourse(product: CatalogProduct): Course {
  const state = getCatalogProductState(product);
  const status = statusLabel(product, state);

  return {
    id: product.legacyId,
    name: product.title,
    slug: product.slug,
    shortDescription: product.shortDescription,
    coverImage: product.coverImage,
    category: product.category?.name ?? "Khóa Học Video AI",
    badge: getCatalogVisualBadge(state, product.badge) ?? status,
    status,
    price: formatCoursePrice(product.price),
    originalPrice: formatCoursePrice(product.originalPrice),
    landingPageUrl: product.detailUrl || undefined,
    demoVideo: product.demoVideo,
    isFeatured: product.isFeatured,
    isActive: state.isPublic,
    displayOrder: product.displayOrder,
    state,
  };
}

export async function getActiveCourses() {
  const products = await getPublishedProducts(["course"]);
  return products.map(mapProductToCourse);
}

export async function getFeaturedCourses() {
  const courses = await getActiveCourses();
  return courses.filter((course) => course.isFeatured);
}

export async function getCourseBySlug(slug: string) {
  const product = await getPublishedProductBySlug(slug, ["course"]);
  return product ? mapProductToCourse(product) : undefined;
}
