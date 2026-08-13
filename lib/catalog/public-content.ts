import { createPublicCatalogClient } from "@/lib/supabase/public";
import { BANNER_ASSETS_BUCKET, isCanonicalBannerAssetPath } from "@/lib/banner-assets";
import { isFlashSaleEffectiveNow } from "@/lib/catalog/product-state";
import type { CatalogFlashSale, FlashSaleStatus, PublicationStatus } from "@/lib/catalog/types";

export type CatalogBanner = {
  id: string;
  position: string;
  desktopImagePath: string;
  desktopImageUrl: string;
  mobileImagePath: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  status: PublicationStatus;
  startAt: string | null;
  endAt: string | null;
  sortOrder: number;
};

export type PublicSiteSetting = {
  key: string;
  value: unknown;
  visibility: "public";
  description: string;
  updatedAt: string;
};

type BannerRow = {
  id: string;
  position: string;
  desktop_image_path: string | null;
  mobile_image_path: string | null;
  title: string | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_url: string | null;
  status: PublicationStatus;
  start_at: string | null;
  end_at: string | null;
  sort_order: number;
};

type FlashSaleRow = {
  id: string;
  product_id: string;
  sale_price: number | string;
  status: FlashSaleStatus;
  start_at: string;
  end_at: string;
};

type SiteSettingRow = {
  key: string;
  value: unknown;
  visibility: "public" | "private";
  description: string | null;
  updated_at: string;
};

function toTimestamp(value: string | null) {
  if (value === null) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function isBannerPublicNow(banner: CatalogBanner, now = new Date()) {
  const startAt = toTimestamp(banner.startAt);
  const endAt = toTimestamp(banner.endAt);
  const currentTime = now.getTime();

  return banner.status === "published"
    && (banner.startAt === null || (startAt !== null && startAt <= currentTime))
    && (banner.endAt === null || (endAt !== null && endAt > currentTime));
}

export async function getPublicBanners(position?: string) {
  const supabase = createPublicCatalogClient();
  let query = supabase
    .from("banners")
    .select("id, position, desktop_image_path, mobile_image_path, title, subtitle, cta_label, cta_url, status, start_at, end_at, sort_order")
    .eq("status", "published")
    .order("position", { ascending: true })
    .order("sort_order", { ascending: true });

  if (position) query = query.eq("position", position);

  const { data, error } = await query;
  if (error) {
    console.error("Unable to load public banners from Supabase:", error.message);
    return [];
  }

  const bannerStorage = supabase.storage.from(BANNER_ASSETS_BUCKET);

  return ((data ?? []) as BannerRow[])
    .map((row): CatalogBanner => {
      const desktopImagePath = row.desktop_image_path ?? "";
      const mobileImagePath = row.mobile_image_path ?? "";
      const desktopImageUrl = isCanonicalBannerAssetPath(desktopImagePath, row.id, "desktop")
        ? bannerStorage.getPublicUrl(desktopImagePath).data.publicUrl
        : "";
      const mobileImageUrl = isCanonicalBannerAssetPath(mobileImagePath, row.id, "mobile")
        ? bannerStorage.getPublicUrl(mobileImagePath).data.publicUrl
        : "";

      return {
        id: row.id,
        position: row.position,
        desktopImagePath,
        desktopImageUrl,
        mobileImagePath,
        mobileImageUrl,
        title: row.title ?? "",
        subtitle: row.subtitle ?? "",
        ctaLabel: row.cta_label ?? "",
        ctaUrl: row.cta_url ?? "",
        status: row.status,
        startAt: row.start_at,
        endAt: row.end_at,
        sortOrder: row.sort_order,
      };
    })
    .filter((banner) => isBannerPublicNow(banner));
}

export async function getPublicFlashSales(productIds?: string[]) {
  const supabase = createPublicCatalogClient();
  let query = supabase
    .from("flash_sales")
    .select("id, product_id, sale_price, status, start_at, end_at")
    .in("status", ["scheduled", "active"])
    .order("start_at", { ascending: false });

  if (productIds?.length) query = query.in("product_id", productIds);

  const { data, error } = await query;
  if (error) {
    console.error("Unable to load public flash sales from Supabase:", error.message);
    return [];
  }

  return ((data ?? []) as FlashSaleRow[]).flatMap((row) => {
    const salePrice = Number(row.sale_price);
    if (!Number.isFinite(salePrice)) return [];

    const flashSale: CatalogFlashSale = {
      id: row.id,
      productId: row.product_id,
      salePrice,
      status: row.status,
      startAt: row.start_at,
      endAt: row.end_at,
    };
    return isFlashSaleEffectiveNow(flashSale) ? [flashSale] : [];
  });
}

export async function getPublicSiteSettings(keys?: string[]) {
  const supabase = createPublicCatalogClient();
  let query = supabase
    .from("site_settings")
    .select("key, value, visibility, description, updated_at")
    .eq("visibility", "public")
    .order("key", { ascending: true });

  if (keys?.length) query = query.in("key", keys);

  const { data, error } = await query;
  if (error) {
    console.error("Unable to load public site settings from Supabase:", error.message);
    return [];
  }

  return ((data ?? []) as SiteSettingRow[]).flatMap((row): PublicSiteSetting[] => row.visibility === "public" ? [{
    key: row.key,
    value: row.value,
    visibility: "public",
    description: row.description ?? "",
    updatedAt: row.updated_at,
  }] : []);
}
