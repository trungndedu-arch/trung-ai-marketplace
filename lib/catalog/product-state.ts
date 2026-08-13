import type { CatalogFlashSale, CatalogProduct } from "@/lib/catalog/types";

export type CatalogStatusBadge = "Miễn phí" | "Đang bán" | "Sắp ra mắt" | "Tạm dừng" | null;

export type CatalogProductState = {
  isPublic: boolean;
  isMarketplaceProduct: boolean;
  isFree: boolean;
  isPaid: boolean;
  isOnSale: boolean;
  isComingSoon: boolean;
  isPaused: boolean;
  isPurchasable: boolean;
  isAffiliate: boolean;
  canAccessFree: boolean;
  canVisitAffiliate: boolean;
  statusBadge: CatalogStatusBadge;
  hasActiveFlashSale: boolean;
  activeFlashSale: CatalogFlashSale | null;
  pricing: {
    basePrice: number | null;
    currentPrice: number | null;
    salePrice: number | null;
    compareAtPrice: number | null;
  };
};

export type CatalogCardAction = {
  label: string;
  href?: string;
  external?: boolean;
  variant?: "primary" | "secondary" | "muted";
  disabled?: boolean;
  kind?: "add-to-cart" | "buy-now";
  productId?: string;
};

function isHttpUrl(value: string) {
  if (!value.trim()) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function toTimestamp(value: string) {
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

type FlashSaleEligibilityInput = Pick<CatalogProduct, "publicationStatus" | "productType" | "accessType" | "salesStatus" | "sellable" | "price">;

export function isFlashSaleEligibleProduct(
  product: FlashSaleEligibilityInput,
): product is FlashSaleEligibilityInput & { price: number } {
  return product.publicationStatus === "published"
    && (product.productType === "chatbot" || product.productType === "ai_app")
    && product.accessType === "paid"
    && product.salesStatus === "on_sale"
    && product.sellable
    && product.price !== null
    && product.price > 0;
}

export function isFlashSaleEffectiveNow(flashSale: CatalogFlashSale, now = new Date()) {
  const startAt = toTimestamp(flashSale.startAt);
  const endAt = toTimestamp(flashSale.endAt);
  const currentTime = now.getTime();

  return (flashSale.status === "scheduled" || flashSale.status === "active")
    && startAt !== null
    && endAt !== null
    && startAt <= currentTime
    && endAt > currentTime;
}

export function isFlashSaleEffective(product: CatalogProduct, flashSale: CatalogFlashSale, now = new Date()) {
  return isFlashSaleEligibleProduct(product)
    && flashSale.productId === product.databaseId
    && flashSale.salePrice >= 0
    && flashSale.salePrice < product.price
    && isFlashSaleEffectiveNow(flashSale, now);
}

export function getCatalogProductState(product: CatalogProduct, now = new Date()): CatalogProductState {
  const isPublic = product.publicationStatus === "published";
  const isMarketplaceProduct = product.productType === "chatbot" || product.productType === "ai_app";
  const isFree = product.accessType === "free";
  const isPaid = product.accessType === "paid";
  const isOnSale = product.salesStatus === "on_sale";
  const isComingSoon = product.salesStatus === "coming_soon";
  const isPaused = product.salesStatus === "paused";
  const isAffiliate = product.productType === "ai_tool";
  const activeFlashSale = [...product.flashSales]
    .filter((flashSale) => isFlashSaleEffective(product, flashSale, now))
    .sort((a, b) => toTimestamp(b.startAt)! - toTimestamp(a.startAt)!)[0] ?? null;
  const currentPrice = activeFlashSale?.salePrice ?? product.price;
  const compareAtPrice = activeFlashSale ? product.price : product.originalPrice;
  const isPurchasable = Boolean(
    isPublic
      && isMarketplaceProduct
      && isPaid
      && isOnSale
      && product.sellable
      && product.price !== null
      && product.price > 0,
  );
  const canAccessFree = isPublic
    && isMarketplaceProduct
    && isFree
    && isOnSale
    && isHttpUrl(product.externalUrl);
  const canVisitAffiliate = isPublic && isAffiliate && isOnSale && isHttpUrl(product.affiliateUrl);

  let statusBadge: CatalogStatusBadge = null;
  if (isComingSoon) statusBadge = "Sắp ra mắt";
  else if (isPaused) statusBadge = "Tạm dừng";
  else if (isMarketplaceProduct && isFree) statusBadge = "Miễn phí";
  else if (isPurchasable) statusBadge = "Đang bán";

  return {
    isPublic,
    isMarketplaceProduct,
    isFree,
    isPaid,
    isOnSale,
    isComingSoon,
    isPaused,
    isPurchasable,
    isAffiliate,
    canAccessFree,
    canVisitAffiliate,
    statusBadge,
    hasActiveFlashSale: activeFlashSale !== null,
    activeFlashSale,
    pricing: {
      basePrice: product.price,
      currentPrice,
      salePrice: activeFlashSale?.salePrice ?? null,
      compareAtPrice,
    },
  };
}

export function getCatalogVisualBadge(state: CatalogProductState, customBadge?: string) {
  if (state.statusBadge && state.statusBadge !== "Đang bán") return state.statusBadge;
  return customBadge?.trim() || state.statusBadge || undefined;
}

export function formatCatalogPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export function getMarketplacePriceLabel(state: CatalogProductState) {
  if (state.isComingSoon) return "Sắp ra mắt";
  if (state.isPaused) return "Tạm dừng";
  if (state.isMarketplaceProduct && state.isFree) return "Miễn phí";
  if (state.pricing.currentPrice !== null && state.pricing.currentPrice >= 0) return formatCatalogPrice(state.pricing.currentPrice);
  return undefined;
}

export function getMarketplaceCompareAtPriceLabel(state: CatalogProductState) {
  const { compareAtPrice, currentPrice } = state.pricing;
  if (!state.isPurchasable || compareAtPrice === null || currentPrice === null || compareAtPrice <= currentPrice) return undefined;
  return formatCatalogPrice(compareAtPrice);
}

export function getMarketplaceCardActions(
  state: CatalogProductState,
  detailHref: string,
  freeAccessUrl?: string,
  productId?: string,
): CatalogCardAction[] {
  const detailAction: CatalogCardAction = { label: "Xem chi tiết", href: detailHref };

  if (state.canAccessFree && freeAccessUrl) {
    return [
      detailAction,
      { label: "Sử dụng miễn phí", href: freeAccessUrl, external: true, variant: "primary" },
    ];
  }

  if (state.isPurchasable) {
    return [
      detailAction,
      { label: "Thêm vào giỏ", kind: "add-to-cart", productId, variant: "primary", disabled: !productId },
    ];
  }

  return [detailAction];
}
