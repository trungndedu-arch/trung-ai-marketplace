export type ProductType = "chatbot" | "ai_app" | "ai_tool" | "course";
export type AccessType = "paid" | "free";
export type SalesStatus = "coming_soon" | "on_sale" | "paused";
export type PublicationStatus = "draft" | "published" | "hidden";
export type FlashSaleStatus = "scheduled" | "active" | "paused" | "ended";

export type CatalogFlashSale = {
  id: string;
  productId: string;
  salePrice: number;
  status: FlashSaleStatus;
  startAt: string;
  endAt: string;
};

export type CatalogCategory = {
  id: string;
  slug: string;
  name: string;
  productType: ProductType | null;
  displayOrder: number;
};

export type CatalogDemoVideo = {
  provider: "youtube";
  id: string;
};

export type CatalogProduct = {
  id: string;
  databaseId: string;
  legacyId: string;
  category: CatalogCategory | null;
  slug: string;
  productType: ProductType;
  title: string;
  shortDescription: string;
  fullDescription: string;
  seoTitle: string;
  seoDescription: string;
  price: number | null;
  originalPrice: number | null;
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
  coverImage: string;
  coverImageAlt: string;
  demoVideo: CatalogDemoVideo | null;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  flashSales: CatalogFlashSale[];
};
