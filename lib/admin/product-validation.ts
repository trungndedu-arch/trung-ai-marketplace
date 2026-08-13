import type { AccessType, ProductType, PublicationStatus, SalesStatus } from "@/lib/catalog/types";
import { parseYouTubeVideoUrl } from "@/lib/youtube";

export type EditableProductField =
  | "productType"
  | "title"
  | "slug"
  | "categoryId"
  | "shortDescription"
  | "fullDescription"
  | "seoTitle"
  | "seoDescription"
  | "accessType"
  | "salesStatus"
  | "publicationStatus"
  | "sellable"
  | "price"
  | "originalPrice"
  | "badge"
  | "affiliateUrl"
  | "externalUrl"
  | "detailUrl"
  | "demoVideoUrl"
  | "displayOrder"
  | "isFeatured"
  | "tags";

export type ProductMutationState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<EditableProductField, string>>;
};

export type ProductMutationValues = {
  categoryId: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  seoTitle: string;
  seoDescription: string;
  price: number | null;
  originalPrice: number | null;
  accessType: AccessType | null;
  salesStatus: SalesStatus | null;
  publicationStatus: PublicationStatus | null;
  sellable: boolean;
  affiliateUrl: string;
  externalUrl: string;
  detailUrl: string;
  demoVideoId: string | null;
  badge: string;
  tags: string[];
  isFeatured: boolean;
  displayOrder: number | null;
};

export type ProductDatabaseFields = {
  category_id: string | null;
  slug: string;
  title: string;
  short_description: string;
  full_description: string | null;
  seo_title: string | null;
  seo_description: string | null;
  price: number | null;
  original_price: number | null;
  access_type: AccessType;
  sales_status: SalesStatus;
  publication_status: PublicationStatus;
  sellable: boolean;
  affiliate_url: string | null;
  external_url: string | null;
  detail_url: string | null;
  demo_video_provider: "youtube" | null;
  demo_video_id: string | null;
  badge: string | null;
  tags: string[];
  is_featured: boolean;
  display_order: number;
};

export const PRODUCT_TYPES: ProductType[] = ["chatbot", "ai_app", "ai_tool", "course"];
const ACCESS_TYPES: AccessType[] = ["paid", "free"];
const SALES_STATUSES: SalesStatus[] = ["coming_soon", "on_sale", "paused"];
const PUBLICATION_STATUSES: PublicationStatus[] = ["draft", "published", "hidden"];

export function stringField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function parseProductType(value: string) {
  return PRODUCT_TYPES.includes(value as ProductType) ? value as ProductType : null;
}

function optionalString(value: string) {
  return value || null;
}

function enumField<T extends string>(value: string, allowed: readonly T[]) {
  return allowed.includes(value as T) ? value as T : null;
}

function parseMoney(value: string) {
  if (!value) return { value: null, error: "" };
  if (!/^\d+$/.test(value)) return { value: null, error: "Giá phải là số nguyên không âm." };
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number > 999_999_999_999) return { value: null, error: "Giá vượt quá giới hạn cho phép." };
  return { value: number, error: "" };
}

function parseDisplayOrder(value: string) {
  if (!/^-?\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= -999_999 && number <= 999_999 ? number : null;
}

function isHttpUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isSafeDetailUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/") && !value.startsWith("//") && !/[\u0000-\u001F]/.test(value)) return true;
  return isHttpUrl(value);
}

function normalizeTags(value: string) {
  const seen = new Set<string>();
  return value.split(",").map((tag) => tag.trim()).filter((tag) => {
    const key = tag.toLocaleLowerCase("vi");
    if (!tag || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function validateProductFormData(formData: FormData, productType: ProductType, forcedPublicationStatus?: PublicationStatus) {
  const title = stringField(formData, "title");
  const slug = stringField(formData, "slug").toLowerCase();
  const categoryId = stringField(formData, "categoryId");
  const shortDescription = stringField(formData, "shortDescription");
  const fullDescription = stringField(formData, "fullDescription");
  const seoTitle = stringField(formData, "seoTitle");
  const seoDescription = stringField(formData, "seoDescription");
  const accessType = enumField(stringField(formData, "accessType"), ACCESS_TYPES);
  const salesStatus = enumField(stringField(formData, "salesStatus"), SALES_STATUSES);
  const publicationStatus = forcedPublicationStatus ?? enumField(stringField(formData, "publicationStatus"), PUBLICATION_STATUSES);
  const sellable = formData.get("sellable") === "on";
  const price = parseMoney(stringField(formData, "price"));
  const originalPrice = parseMoney(stringField(formData, "originalPrice"));
  const badge = stringField(formData, "badge");
  const affiliateUrl = stringField(formData, "affiliateUrl");
  const externalUrl = stringField(formData, "externalUrl");
  const detailUrl = stringField(formData, "detailUrl");
  const demoVideoUrl = stringField(formData, "demoVideoUrl");
  const demoVideoId = demoVideoUrl ? parseYouTubeVideoUrl(demoVideoUrl) : null;
  const displayOrder = parseDisplayOrder(stringField(formData, "displayOrder"));
  const isFeatured = formData.get("isFeatured") === "on";
  const tags = normalizeTags(stringField(formData, "tags"));
  const fieldErrors: ProductMutationState["fieldErrors"] = {};

  if (!title) fieldErrors.title = "Tên sản phẩm không được để trống.";
  else if (title.length > 160) fieldErrors.title = "Tên sản phẩm không được vượt quá 160 ký tự.";
  if (!slug) fieldErrors.slug = "Slug không được để trống.";
  else if (slug.length > 160 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fieldErrors.slug = "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";
  if (!shortDescription) fieldErrors.shortDescription = "Mô tả ngắn không được để trống.";
  else if (shortDescription.length > 500) fieldErrors.shortDescription = "Mô tả ngắn không được vượt quá 500 ký tự.";
  if (fullDescription.length > 20_000) fieldErrors.fullDescription = "Mô tả đầy đủ không được vượt quá 20.000 ký tự.";
  if (seoTitle.length > 160) fieldErrors.seoTitle = "SEO title không được vượt quá 160 ký tự.";
  if (seoDescription.length > 320) fieldErrors.seoDescription = "SEO description không được vượt quá 320 ký tự.";
  if (!accessType) fieldErrors.accessType = "Loại truy cập không hợp lệ.";
  if (!salesStatus) fieldErrors.salesStatus = "Trạng thái bán không hợp lệ.";
  if (!publicationStatus) fieldErrors.publicationStatus = "Trạng thái xuất bản không hợp lệ.";
  if (price.error) fieldErrors.price = price.error;
  if (originalPrice.error) fieldErrors.originalPrice = originalPrice.error;
  if (badge.length > 60) fieldErrors.badge = "Badge không được vượt quá 60 ký tự.";
  if (affiliateUrl.length > 2048 || !isHttpUrl(affiliateUrl)) fieldErrors.affiliateUrl = "Affiliate URL phải là địa chỉ HTTP(S) hợp lệ, tối đa 2.048 ký tự.";
  if (externalUrl.length > 2048 || !isHttpUrl(externalUrl)) fieldErrors.externalUrl = "External URL phải là địa chỉ HTTP(S) hợp lệ, tối đa 2.048 ký tự.";
  if (detailUrl.length > 2048 || !isSafeDetailUrl(detailUrl)) fieldErrors.detailUrl = "Detail URL phải là đường dẫn nội bộ hoặc HTTP(S) hợp lệ, tối đa 2.048 ký tự.";
  if (demoVideoUrl && !demoVideoId) fieldErrors.demoVideoUrl = "Link YouTube không hợp lệ.";
  if (displayOrder === null) fieldErrors.displayOrder = "Thứ tự hiển thị phải là số nguyên hợp lệ.";
  if (tags.length > 30 || tags.some((tag) => tag.length > 60)) fieldErrors.tags = "Tối đa 30 tag, mỗi tag không quá 60 ký tự.";

  if (accessType && salesStatus && !price.error && !originalPrice.error) {
    if (accessType === "free") {
      if (price.value !== null && price.value !== 0) fieldErrors.price = "Sản phẩm miễn phí chỉ được để trống giá hoặc đặt giá bằng 0.";
      if (originalPrice.value !== null && originalPrice.value !== 0) fieldErrors.originalPrice = "Sản phẩm miễn phí không nên có giá gốc lớn hơn 0.";
      if (sellable) fieldErrors.sellable = "Sản phẩm miễn phí không được bật bán trực tiếp.";
    }
    if ((productType === "chatbot" || productType === "ai_app") && accessType === "paid" && salesStatus === "on_sale" && sellable && (!price.value || price.value <= 0)) {
      fieldErrors.price = "Sản phẩm trả phí đang bán cần có giá lớn hơn 0.";
    }
    if ((productType === "chatbot" || productType === "ai_app") && accessType === "free" && salesStatus === "on_sale" && !externalUrl) {
      fieldErrors.externalUrl = "Chatbot/AI App miễn phí đang hoạt động cần có external URL để truy cập.";
    }
    if (price.value !== null && originalPrice.value !== null && originalPrice.value < price.value) {
      fieldErrors.originalPrice = "Giá gốc không được thấp hơn giá bán.";
    }
  }

  if (productType === "ai_tool") {
    if (sellable) fieldErrors.sellable = "AI Tool affiliate không được bán trực tiếp trên Marketplace.";
    if (!affiliateUrl) fieldErrors.affiliateUrl = "AI Tool bắt buộc phải có affiliate URL.";
  }
  if (productType === "course" && sellable) fieldErrors.sellable = "Khóa học chưa được phép bán trực tiếp trong giai đoạn này.";

  const values: ProductMutationValues = {
    categoryId,
    slug,
    title,
    shortDescription,
    fullDescription,
    seoTitle,
    seoDescription,
    price: price.value,
    originalPrice: originalPrice.value,
    accessType,
    salesStatus,
    publicationStatus,
    sellable,
    affiliateUrl,
    externalUrl,
    detailUrl,
    demoVideoId,
    badge,
    tags,
    isFeatured,
    displayOrder,
  };

  return { values, fieldErrors, isValid: Object.keys(fieldErrors).length === 0 && accessType !== null && salesStatus !== null && publicationStatus !== null && displayOrder !== null };
}

export function toProductDatabaseFields(values: ProductMutationValues): ProductDatabaseFields | null {
  if (!values.accessType || !values.salesStatus || !values.publicationStatus || values.displayOrder === null) return null;
  return {
    category_id: values.categoryId || null,
    slug: values.slug,
    title: values.title,
    short_description: values.shortDescription,
    full_description: optionalString(values.fullDescription),
    seo_title: optionalString(values.seoTitle),
    seo_description: optionalString(values.seoDescription),
    price: values.price,
    original_price: values.originalPrice,
    access_type: values.accessType,
    sales_status: values.salesStatus,
    publication_status: values.publicationStatus,
    sellable: values.sellable,
    affiliate_url: optionalString(values.affiliateUrl),
    external_url: optionalString(values.externalUrl),
    detail_url: optionalString(values.detailUrl),
    demo_video_provider: values.demoVideoId ? "youtube" : null,
    demo_video_id: values.demoVideoId,
    badge: optionalString(values.badge),
    tags: values.tags,
    is_featured: values.isFeatured,
    display_order: values.displayOrder,
  };
}

export function productDatabaseErrorMessage(error: { code?: string; message?: string }, operation: "create" | "update") {
  const message = error.message?.toLowerCase() ?? "";
  if (error.code === "23505" || message.includes("products_slug_key")) return "Slug này đã được sử dụng.";
  if (message.includes("invalidate an existing flash sale") || message.includes("flash sale")) return "Không thể cập nhật giá hoặc trạng thái bán vì sản phẩm đang có Flash Sale không tương thích.";
  if (error.code === "42501" || message.includes("permission denied") || message.includes("row-level security")) return operation === "create" ? "Bạn không có quyền tạo sản phẩm." : "Bạn không có quyền cập nhật sản phẩm này.";
  if (error.code === "23514" || message.includes("violates check constraint")) return "Dữ liệu chưa đáp ứng quy tắc của sản phẩm. Vui lòng kiểm tra lại.";
  return operation === "create" ? "Không thể tạo sản phẩm lúc này. Vui lòng thử lại." : "Không thể cập nhật sản phẩm lúc này. Vui lòng thử lại.";
}
