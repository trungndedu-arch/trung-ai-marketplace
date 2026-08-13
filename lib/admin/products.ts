import { requireAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizeYouTubeDemoVideo } from "@/lib/youtube";
import type { AccessType, CatalogDemoVideo, ProductType, PublicationStatus, SalesStatus } from "@/lib/catalog/types";

export const ADMIN_PRODUCTS_PAGE_SIZE = 20;

export type AdminProductSort = "display_order" | "title" | "created_at" | "updated_at";

export type AdminProductFilters = {
  search: string;
  productType: ProductType | "all";
  publicationStatus: PublicationStatus | "all";
  salesStatus: SalesStatus | "all";
  accessType: AccessType | "all";
  sort: AdminProductSort;
  page: number;
};

export type AdminProduct = {
  id: string;
  legacyId: string;
  slug: string;
  productType: ProductType;
  title: string;
  shortDescription: string;
  fullDescription: string;
  seoTitle: string;
  seoDescription: string;
  price: number | null;
  originalPrice: number | null;
  currency: string;
  accessType: AccessType;
  salesStatus: SalesStatus;
  publicationStatus: PublicationStatus;
  sellable: boolean;
  affiliateUrl: string;
  externalUrl: string;
  detailUrl: string;
  badge: string;
  tags: string[];
  metadata: Record<string, unknown>;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string } | null;
  coverImage: { url: string; alt: string } | null;
  demoVideo: CatalogDemoVideo | null;
};

export type AdminProductListResult = {
  products: AdminProduct[];
  total: number;
  page: number;
  totalPages: number;
  error: string | null;
};

export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  productType: ProductType | null;
  isActive: boolean;
  displayOrder: number;
};

type ProductRow = {
  id: string;
  legacy_id: string | null;
  slug: string;
  product_type: ProductType;
  title: string;
  short_description: string;
  full_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  price: number | string | null;
  original_price: number | string | null;
  currency: string;
  access_type: AccessType;
  sales_status: SalesStatus;
  publication_status: PublicationStatus;
  sellable: boolean;
  affiliate_url: string | null;
  external_url: string | null;
  detail_url: string | null;
  badge: string | null;
  tags: string[] | null;
  metadata: Record<string, unknown> | null;
  demo_video_provider: string | null;
  demo_video_id: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  categories: { id: string; name: string; slug: string } | { id: string; name: string; slug: string }[] | null;
  product_images: {
    public_url: string | null;
    storage_path: string | null;
    alt_text: string | null;
    image_type: "cover" | "gallery" | "logo";
    is_primary: boolean;
    sort_order: number;
  }[] | null;
};

const adminProductSelect = `
  id,
  legacy_id,
  slug,
  product_type,
  title,
  short_description,
  full_description,
  seo_title,
  seo_description,
  price,
  original_price,
  currency,
  access_type,
  sales_status,
  publication_status,
  sellable,
  affiliate_url,
  external_url,
  detail_url,
  badge,
  tags,
  metadata,
  demo_video_provider,
  demo_video_id,
  is_featured,
  display_order,
  created_at,
  updated_at,
  categories:category_id (
    id,
    name,
    slug
  ),
  product_images (
    public_url,
    storage_path,
    alt_text,
    image_type,
    is_primary,
    sort_order
  )
`;

function toNumber(value: number | string | null) {
  if (value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeProduct(row: ProductRow): AdminProduct {
  const category = Array.isArray(row.categories) ? row.categories[0] : row.categories;
  const images = [...(row.product_images ?? [])].sort((a, b) => {
    const aIsPreferred = a.image_type === "cover" && a.is_primary;
    const bIsPreferred = b.image_type === "cover" && b.is_primary;
    if (aIsPreferred !== bIsPreferred) return aIsPreferred ? -1 : 1;
    if (a.image_type !== b.image_type) return a.image_type === "cover" ? -1 : 1;
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  const cover = images[0];
  const coverUrl = cover?.public_url || cover?.storage_path || "";

  return {
    id: row.id,
    legacyId: row.legacy_id ?? "",
    slug: row.slug,
    productType: row.product_type,
    title: row.title,
    shortDescription: row.short_description,
    fullDescription: row.full_description ?? "",
    seoTitle: row.seo_title ?? "",
    seoDescription: row.seo_description ?? "",
    price: toNumber(row.price),
    originalPrice: toNumber(row.original_price),
    currency: row.currency,
    accessType: row.access_type,
    salesStatus: row.sales_status,
    publicationStatus: row.publication_status,
    sellable: row.sellable,
    affiliateUrl: row.affiliate_url ?? "",
    externalUrl: row.external_url ?? "",
    detailUrl: row.detail_url ?? "",
    badge: row.badge ?? "",
    tags: row.tags ?? [],
    metadata: row.metadata ?? {},
    isFeatured: row.is_featured,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
    coverImage: coverUrl ? { url: coverUrl, alt: cover?.alt_text || row.title } : null,
    demoVideo: normalizeYouTubeDemoVideo(row.demo_video_provider, row.demo_video_id),
  };
}

function sanitizeSearch(value: string) {
  return value.replace(/[^\p{L}\p{N}\s_-]/gu, " ").replace(/\s+/g, " ").trim().slice(0, 100);
}

export async function getAdminProducts(filters: AdminProductFilters): Promise<AdminProductListResult> {
  await requireAdminAccess("/admin/products");

  const supabase = await createClient();
  const requestedPage = Math.max(1, filters.page);
  const from = (requestedPage - 1) * ADMIN_PRODUCTS_PAGE_SIZE;
  const to = from + ADMIN_PRODUCTS_PAGE_SIZE - 1;
  let query = supabase.from("products").select(adminProductSelect, { count: "exact" });
  const search = sanitizeSearch(filters.search);

  if (search) query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,legacy_id.ilike.%${search}%`);
  if (filters.productType !== "all") query = query.eq("product_type", filters.productType);
  if (filters.publicationStatus !== "all") query = query.eq("publication_status", filters.publicationStatus);
  if (filters.salesStatus !== "all") query = query.eq("sales_status", filters.salesStatus);
  if (filters.accessType !== "all") query = query.eq("access_type", filters.accessType);

  const { data, error, count } = await query
    .order(filters.sort, { ascending: true })
    .order("title", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("[admin/products] Unable to load product list:", error);
    return { products: [], total: 0, page: requestedPage, totalPages: 0, error: "Không thể tải danh sách sản phẩm lúc này." };
  }

  const total = count ?? 0;
  const totalPages = Math.ceil(total / ADMIN_PRODUCTS_PAGE_SIZE);

  return {
    products: ((data ?? []) as unknown as ProductRow[]).map(normalizeProduct),
    total,
    page: requestedPage,
    totalPages,
    error: null,
  };
}

export async function getAdminProductById(id: string) {
  await requireAdminAccess(`/admin/products/${id}`);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(adminProductSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/products] Unable to load product detail:", error);
    return { product: null, error: "Không thể tải chi tiết sản phẩm lúc này." };
  }

  return { product: data ? normalizeProduct(data as unknown as ProductRow) : null, error: null };
}

export async function getAdminCategories() {
  await requireAdminAccess("/admin/products");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, product_type, is_active, display_order")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[admin/products] Unable to load categories:", error);
    return { categories: [] as AdminCategory[], error: "Không thể tải danh mục lúc này." };
  }

  return {
    categories: (data ?? []).map((category): AdminCategory => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      productType: category.product_type,
      isActive: category.is_active,
      displayOrder: category.display_order,
    })),
    error: null,
  };
}
