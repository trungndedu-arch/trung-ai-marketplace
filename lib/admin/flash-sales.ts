import { requireAdminAccess } from "@/lib/auth/admin";
import { isFlashSaleId } from "@/lib/admin/flash-sale-validation";
import { isFlashSaleEligibleProduct } from "@/lib/catalog/product-state";
import type { AccessType, FlashSaleStatus, ProductType, PublicationStatus, SalesStatus } from "@/lib/catalog/types";
import { createClient } from "@/lib/supabase/server";

export type FlashSaleRuntimeState = "scheduled" | "active" | "expired" | "inactive";

export type AdminFlashSaleProduct = {
  id: string;
  title: string;
  slug: string;
  productType: ProductType;
  price: number;
  currency: string;
  accessType: AccessType;
  salesStatus: SalesStatus;
  publicationStatus: PublicationStatus;
  sellable: boolean;
  detailUrl: string;
  coverImage: { url: string; alt: string } | null;
};

export type AdminFlashSale = {
  id: string;
  productId: string;
  salePrice: number;
  status: FlashSaleStatus;
  runtimeState: FlashSaleRuntimeState;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  product: AdminFlashSaleProduct;
};

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
  title: string;
  slug: string;
  product_type: ProductType;
  price: number | string | null;
  currency: string;
  access_type: AccessType;
  sales_status: SalesStatus;
  publication_status: PublicationStatus;
  sellable: boolean;
  detail_url: string | null;
  product_images?: ProductImageRow[] | null;
};

type FlashSaleRow = {
  id: string;
  product_id: string;
  sale_price: number | string;
  status: FlashSaleStatus;
  start_at: string;
  end_at: string;
  created_at: string;
  updated_at: string;
  products: ProductRow | ProductRow[] | null;
};

const flashSaleSelect = `
  id,
  product_id,
  sale_price,
  status,
  start_at,
  end_at,
  created_at,
  updated_at,
  products:product_id (
    id,
    title,
    slug,
    product_type,
    price,
    currency,
    access_type,
    sales_status,
    publication_status,
    sellable,
    detail_url,
    product_images (
      public_url,
      storage_path,
      alt_text,
      image_type,
      is_primary,
      sort_order
    )
  )
`;

function toNumber(value: number | string | null) {
  if (value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeProduct(row: ProductRow): AdminFlashSaleProduct | null {
  const price = toNumber(row.price);
  if (price === null) return null;
  const images = [...(row.product_images ?? [])].sort((a, b) => {
    const aPreferred = a.image_type === "cover" && a.is_primary;
    const bPreferred = b.image_type === "cover" && b.is_primary;
    if (aPreferred !== bPreferred) return aPreferred ? -1 : 1;
    if (a.image_type !== b.image_type) return a.image_type === "cover" ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  const cover = images[0];
  const coverUrl = cover?.public_url || cover?.storage_path || "";
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    productType: row.product_type,
    price,
    currency: row.currency,
    accessType: row.access_type,
    salesStatus: row.sales_status,
    publicationStatus: row.publication_status,
    sellable: row.sellable,
    detailUrl: row.detail_url ?? "",
    coverImage: coverUrl ? { url: coverUrl, alt: cover?.alt_text || row.title } : null,
  };
}

export function getFlashSaleRuntimeState(
  sale: Pick<AdminFlashSale, "status" | "startAt" | "endAt">,
  productEligible = true,
  now = new Date(),
): FlashSaleRuntimeState {
  const currentTime = now.getTime();
  const startTime = Date.parse(sale.startAt);
  const endTime = Date.parse(sale.endAt);
  if (sale.status === "ended") return "expired";
  if (sale.status === "paused") return "inactive";
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime <= startTime) return "inactive";
  if (!productEligible) return "inactive";
  if (endTime <= currentTime) return "expired";
  if (startTime > currentTime) return "scheduled";
  return "active";
}

function normalizeFlashSale(row: FlashSaleRow): AdminFlashSale | null {
  const productRow = Array.isArray(row.products) ? row.products[0] : row.products;
  const product = productRow ? normalizeProduct(productRow) : null;
  const salePrice = toNumber(row.sale_price);
  if (!product || salePrice === null) return null;
  const sale: AdminFlashSale = {
    id: row.id,
    productId: row.product_id,
    salePrice,
    status: row.status,
    runtimeState: "inactive",
    startAt: row.start_at,
    endAt: row.end_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    product,
  };
  sale.runtimeState = getFlashSaleRuntimeState(sale, isFlashSaleEligibleProduct(product));
  return sale;
}

export async function getAdminFlashSales() {
  await requireAdminAccess("/admin/flash-sales");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flash_sales")
    .select(flashSaleSelect)
    .order("start_at", { ascending: false })
    .order("id", { ascending: true });

  if (error) {
    console.error("[admin/flash-sales] Unable to load Flash Sales:", error);
    return { flashSales: [] as AdminFlashSale[], error: "Không thể tải danh sách Flash Sale lúc này." };
  }
  return {
    flashSales: ((data ?? []) as unknown as FlashSaleRow[]).flatMap((row) => {
      const sale = normalizeFlashSale(row);
      return sale ? [sale] : [];
    }),
    error: null,
  };
}

export async function getAdminFlashSaleById(id: string) {
  await requireAdminAccess(`/admin/flash-sales/${id}/edit`);
  if (!isFlashSaleId(id)) return { flashSale: null, error: null };
  const supabase = await createClient();
  const { data, error } = await supabase.from("flash_sales").select(flashSaleSelect).eq("id", id).maybeSingle();
  if (error) {
    console.error("[admin/flash-sales] Unable to load Flash Sale:", error);
    return { flashSale: null, error: "Không thể tải thông tin Flash Sale lúc này." };
  }
  return { flashSale: data ? normalizeFlashSale(data as unknown as FlashSaleRow) : null, error: null };
}

export async function getEligibleFlashSaleProducts() {
  await requireAdminAccess("/admin/flash-sales/new");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, title, slug, product_type, price, currency, access_type, sales_status, publication_status, sellable, detail_url")
    .in("product_type", ["chatbot", "ai_app"])
    .eq("access_type", "paid")
    .eq("sales_status", "on_sale")
    .eq("publication_status", "published")
    .eq("sellable", true)
    .gt("price", 0)
    .order("title", { ascending: true });

  if (error) {
    console.error("[admin/flash-sales] Unable to load eligible products:", error);
    return { products: [] as AdminFlashSaleProduct[], error: "Không thể tải sản phẩm đủ điều kiện lúc này." };
  }

  const products = ((data ?? []) as ProductRow[])
    .map(normalizeProduct)
    .filter((product): product is AdminFlashSaleProduct => Boolean(product))
    .filter(isFlashSaleEligibleProduct);
  return { products, error: null };
}
