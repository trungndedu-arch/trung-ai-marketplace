import { createPublicCatalogClient } from "@/lib/supabase/public";
import { getCatalogProductState } from "@/lib/catalog/product-state";
import { normalizeYouTubeDemoVideo } from "@/lib/youtube";
import type { CatalogCategory, CatalogFlashSale, CatalogProduct, FlashSaleStatus, ProductType } from "@/lib/catalog/types";

type ProductImageRow = {
  public_url: string | null;
  storage_path: string | null;
  alt_text: string | null;
  image_type: string;
  is_primary: boolean;
  sort_order: number;
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
  access_type: CatalogProduct["accessType"];
  sales_status: CatalogProduct["salesStatus"];
  publication_status: CatalogProduct["publicationStatus"];
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
  categories: {
    id: string;
    slug: string;
    name: string;
    product_type: ProductType | null;
    display_order: number;
  } | {
    id: string;
    slug: string;
    name: string;
    product_type: ProductType | null;
    display_order: number;
  }[] | null;
  product_images: ProductImageRow[] | null;
  flash_sales: {
    id: string;
    product_id: string;
    sale_price: number | string;
    status: FlashSaleStatus;
    start_at: string;
    end_at: string;
  }[] | null;
};

const productSelect = `
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
  categories:category_id (
    id,
    slug,
    name,
    product_type,
    display_order
  ),
  product_images (
    public_url,
    storage_path,
    alt_text,
    image_type,
    is_primary,
    sort_order
  ),
  flash_sales (
    id,
    product_id,
    sale_price,
    status,
    start_at,
    end_at
  )
`;

function toNumber(value: number | string | null) {
  if (value === null) return null;
  if (typeof value === "number") return value;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeCategory(category: ProductRow["categories"]): CatalogCategory | null {
  const categoryRow = Array.isArray(category) ? category[0] : category;

  if (!categoryRow) return null;

  return {
    id: categoryRow.id,
    slug: categoryRow.slug,
    name: categoryRow.name,
    productType: categoryRow.product_type,
    displayOrder: categoryRow.display_order,
  };
}

function findCoverImage(product: ProductRow) {
  const images = [...(product.product_images ?? [])].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  const cover = images.find((image) => image.image_type === "cover") ?? images[0];

  return {
    url: cover?.public_url || cover?.storage_path || "",
    alt: cover?.alt_text || product.title,
  };
}

function normalizeFlashSales(rows: ProductRow["flash_sales"]): CatalogFlashSale[] {
  return (rows ?? []).flatMap((row) => {
    const salePrice = toNumber(row.sale_price);
    if (salePrice === null) return [];

    return [{
      id: row.id,
      productId: row.product_id,
      salePrice,
      status: row.status,
      startAt: row.start_at,
      endAt: row.end_at,
    }];
  });
}

function normalizeProduct(product: ProductRow): CatalogProduct {
  const cover = findCoverImage(product);

  return {
    id: product.legacy_id ?? product.id,
    databaseId: product.id,
    legacyId: product.legacy_id ?? product.id,
    category: normalizeCategory(product.categories),
    slug: product.slug,
    productType: product.product_type,
    title: product.title,
    shortDescription: product.short_description,
    fullDescription: product.full_description ?? product.short_description,
    seoTitle: product.seo_title ?? `${product.title} | Trung AI Media`,
    seoDescription: product.seo_description ?? product.short_description,
    price: toNumber(product.price),
    originalPrice: toNumber(product.original_price),
    accessType: product.access_type,
    salesStatus: product.sales_status,
    publicationStatus: product.publication_status,
    sellable: product.sellable,
    affiliateUrl: product.affiliate_url ?? "",
    externalUrl: product.external_url ?? "",
    detailUrl: product.detail_url ?? "",
    badge: product.badge ?? "",
    tags: product.tags ?? [],
    metadata: product.metadata ?? {},
    coverImage: cover.url,
    coverImageAlt: cover.alt,
    demoVideo: normalizeYouTubeDemoVideo(product.demo_video_provider, product.demo_video_id),
    isFeatured: product.is_featured,
    displayOrder: product.display_order,
    createdAt: product.created_at,
    flashSales: normalizeFlashSales(product.flash_sales),
  };
}

function sortCatalogProducts(products: CatalogProduct[]) {
  return [...products].sort((a, b) => a.displayOrder - b.displayOrder || a.title.localeCompare(b.title, "vi"));
}

export async function getPublishedProducts(productTypes?: ProductType[]) {
  const supabase = createPublicCatalogClient();
  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("publication_status", "published")
    .order("display_order", { ascending: true })
    .order("title", { ascending: true });

  if (productTypes?.length) {
    query = query.in("product_type", productTypes);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Unable to load catalog products from Supabase:", error.message);
    return [];
  }

  const products = ((data ?? []) as unknown as ProductRow[]).map(normalizeProduct);
  return sortCatalogProducts(products.filter((product) => getCatalogProductState(product).isPublic));
}

export async function getPublishedProductBySlug(slug: string, productTypes?: ProductType[]) {
  const products = await getPublishedProducts(productTypes);
  return products.find((product) => product.slug === slug || product.detailUrl.endsWith(`/${slug}`));
}

export async function getRelatedPublishedProducts(product: CatalogProduct, limit = 4) {
  const products = await getPublishedProducts([product.productType]);

  return products
    .filter((item) => item.id !== product.id && item.category?.name === product.category?.name)
    .slice(0, limit);
}
