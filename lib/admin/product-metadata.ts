import type { ProductType } from "@/lib/catalog/types";

export type EditableProductMetadata = Record<string, string | string[] | boolean>;

export const PRODUCT_METADATA_KEYS: Record<ProductType, readonly string[]> = {
  chatbot: ["creator", "rating", "sales_label", "color", "icon", "cover_aspect", "transfer_content"],
  ai_app: ["features", "steps", "suitable_for", "tools", "cta_title", "cta_description", "cta_label", "license", "transfer_content", "hide_price"],
  ai_tool: ["logo", "tool_type", "official_website", "tutorial_url", "features", "target_users", "use_cases", "benefits", "gallery_images", "demo_video_url"],
  course: ["status_label"],
};

export const PRODUCT_METADATA_LIST_KEYS = new Set([
  "features",
  "steps",
  "suitable_for",
  "tools",
  "target_users",
  "use_cases",
  "benefits",
  "gallery_images",
]);

const BOOLEAN_KEYS = new Set(["hide_price"]);
const URL_KEYS = new Set(["logo", "official_website", "tutorial_url", "demo_video_url"]);
const URL_LIST_KEYS = new Set(["gallery_images"]);

function isSafeUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function metadataString(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return typeof value === "string" ? value : "";
}

export function metadataBoolean(metadata: Record<string, unknown>, key: string) {
  return metadata[key] === true;
}

export function metadataStringList(metadata: Record<string, unknown>, key: string) {
  const value = metadata[key];
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export function parseEditableProductMetadata(formData: FormData, productType: ProductType) {
  const values: EditableProductMetadata = {};
  const errors: Record<string, string> = {};

  for (const key of PRODUCT_METADATA_KEYS[productType]) {
    if (BOOLEAN_KEYS.has(key)) {
      values[key] = formData.get(`metadata.${key}`) === "on";
      continue;
    }

    if (PRODUCT_METADATA_LIST_KEYS.has(key)) {
      const items = formData.getAll(`metadata.${key}`)
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
      values[key] = items;
      if (items.length > 30) errors.metadata = "Mỗi danh sách metadata chỉ được có tối đa 30 mục.";
      else if (items.some((item) => item.length > 500)) errors.metadata = "Mỗi mục metadata không được vượt quá 500 ký tự.";
      else if (URL_LIST_KEYS.has(key) && items.some((item) => !isSafeUrl(item))) errors.metadata = "Danh sách hình ảnh chỉ chấp nhận đường dẫn nội bộ hoặc URL HTTP(S).";
      continue;
    }

    const raw = formData.get(`metadata.${key}`);
    const value = typeof raw === "string" ? raw.trim() : "";
    values[key] = value;
    if (value.length > 2_000) errors.metadata = "Mỗi trường metadata không được vượt quá 2.000 ký tự.";
    else if (value && URL_KEYS.has(key) && !isSafeUrl(value)) errors.metadata = "Liên kết metadata phải là đường dẫn nội bộ hoặc URL HTTP(S) hợp lệ.";
  }

  return { values, errors };
}

export function mergeEditableProductMetadata(
  existing: Record<string, unknown>,
  productType: ProductType,
  editable: EditableProductMetadata,
) {
  const merged: Record<string, unknown> = { ...existing };

  for (const key of PRODUCT_METADATA_KEYS[productType]) {
    const value = editable[key];
    if (value === true) merged[key] = true;
    else if (value === false) delete merged[key];
    else if (Array.isArray(value)) {
      const unsupportedItems = Array.isArray(existing[key])
        ? (existing[key] as unknown[]).filter((item) => typeof item !== "string")
        : [];
      if (value.length || unsupportedItems.length) merged[key] = [...value, ...unsupportedItems];
      else delete merged[key];
    } else if (typeof value === "string" && value) merged[key] = value;
    else delete merged[key];
  }

  return merged;
}
