"use server";

import { randomUUID } from "node:crypto";
import { requireAdminAccess } from "@/lib/auth/admin";
import { revalidateAdminProductRoutes, revalidatePublicProductRoutes } from "@/lib/admin/product-revalidation";
import { createClient } from "@/lib/supabase/server";
import type { ProductType, PublicationStatus } from "@/lib/catalog/types";

const PRODUCT_ASSETS_BUCKET = "product-assets";
const MAX_COVER_SIZE = 5 * 1024 * 1024;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MIME_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

type CoverMime = keyof typeof MIME_EXTENSIONS;
type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type ProductForCover = {
  id: string;
  title: string;
  slug: string;
  product_type: ProductType;
  publication_status: PublicationStatus;
  detail_url: string | null;
};

type ExistingCover = {
  id: string;
  storage_path: string | null;
  updated_at: string;
};

export type ProductCoverUploadState = {
  status: "idle" | "success" | "error";
  message: string;
  coverUrl?: string;
};

function errorState(message: string): ProductCoverUploadState {
  return { status: "error", message };
}

function isCoverMime(value: string): value is CoverMime {
  return value in MIME_EXTENSIONS;
}

function hasBytes(bytes: Uint8Array, signature: readonly number[], offset = 0) {
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

function detectImageMime(bytes: Uint8Array): CoverMime | null {
  if (hasBytes(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  return null;
}

function isManagedCoverPath(path: string | null, productId: string) {
  if (!path) return false;
  const segments = path.split("/");
  return segments.length === 4
    && segments[0] === "products"
    && segments[1] === productId
    && segments[2] === "cover"
    && /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/i.test(segments[3]);
}

async function removeStorageObject(supabase: ServerSupabaseClient, path: string, context: string) {
  const { error } = await supabase.storage.from(PRODUCT_ASSETS_BUCKET).remove([path]);
  if (error) {
    console.warn(`[admin/product-media] ${context}:`, error);
    return false;
  }
  return true;
}

export async function uploadProductCover(
  _previousState: ProductCoverUploadState,
  formData: FormData,
): Promise<ProductCoverUploadState> {
  const productIdValue = formData.get("productId");
  const productId = typeof productIdValue === "string" ? productIdValue.trim() : "";
  await requireAdminAccess(UUID_PATTERN.test(productId) ? `/admin/products/${productId}/edit` : "/admin/products");

  if (!UUID_PATTERN.test(productId)) return errorState("Không xác định được sản phẩm cần cập nhật ảnh bìa.");

  const coverValue = formData.get("cover");
  if (!(coverValue instanceof File)) return errorState("Vui lòng chọn một ảnh bìa để tải lên.");
  if (coverValue.size === 0) return errorState("File ảnh đang trống. Vui lòng chọn một ảnh khác.");
  if (coverValue.size > MAX_COVER_SIZE) return errorState("Ảnh bìa không được vượt quá 5 MB.");

  const declaredMime = coverValue.type.toLowerCase();
  if (!isCoverMime(declaredMime)) return errorState("Chỉ hỗ trợ ảnh JPG, JPEG, PNG hoặc WEBP.");

  const bytes = new Uint8Array(await coverValue.arrayBuffer());
  const detectedMime = detectImageMime(bytes);
  if (!detectedMime || detectedMime !== declaredMime) {
    return errorState("Nội dung file không khớp với định dạng ảnh được hỗ trợ.");
  }

  const supabase = await createClient();
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select("id, title, slug, product_type, publication_status, detail_url")
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    console.error("[admin/product-media] Unable to verify product:", productError);
    return errorState("Không thể xác minh sản phẩm lúc này.");
  }
  if (!productData) return errorState("Sản phẩm không còn tồn tại hoặc bạn không có quyền cập nhật.");

  const product = productData as ProductForCover;
  const { data: coverRows, error: coverError } = await supabase
    .from("product_images")
    .select("id, storage_path, updated_at")
    .eq("product_id", productId)
    .eq("image_type", "cover")
    .order("is_primary", { ascending: false })
    .order("sort_order", { ascending: true })
    .limit(1);

  if (coverError) {
    console.error("[admin/product-media] Unable to load existing cover:", coverError);
    return errorState("Không thể kiểm tra ảnh bìa hiện tại.");
  }

  const existingCover = (coverRows?.[0] as ExistingCover | undefined) ?? null;
  const extension = MIME_EXTENSIONS[detectedMime];
  const storagePath = `products/${productId}/cover/${randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_ASSETS_BUCKET)
    .upload(storagePath, bytes, {
      cacheControl: "31536000",
      contentType: detectedMime,
      upsert: false,
    });

  if (uploadError) {
    console.error("[admin/product-media] Storage upload rejected:", uploadError);
    return errorState("Không thể tải ảnh lên. Vui lòng kiểm tra quyền hoặc thử lại sau.");
  }

  const { data: publicUrlData } = supabase.storage.from(PRODUCT_ASSETS_BUCKET).getPublicUrl(storagePath);
  const imagePayload = {
    storage_path: storagePath,
    public_url: publicUrlData.publicUrl,
    alt_text: product.title,
    aspect_ratio: "9:16",
    is_primary: true,
    sort_order: 0,
  };

  let switchError: unknown = null;
  let switched = false;

  if (existingCover) {
    const { data, error } = await supabase
      .from("product_images")
      .update(imagePayload)
      .eq("id", existingCover.id)
      .eq("updated_at", existingCover.updated_at)
      .select("id")
      .maybeSingle();
    switchError = error;
    switched = Boolean(data) && !error;
  } else {
    const { data, error } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        image_type: "cover",
        ...imagePayload,
      })
      .select("id")
      .maybeSingle();
    switchError = error;
    switched = Boolean(data) && !error;
  }

  if (!switched) {
    if (switchError) console.error("[admin/product-media] Product cover switch rejected:", switchError);
    await removeStorageObject(supabase, storagePath, "Unable to remove new object after database failure");
    return errorState("Không thể cập nhật ảnh bìa. Dữ liệu có thể vừa được thay đổi, vui lòng tải lại trang và thử lại.");
  }

  let oldCoverCleaned = true;
  if (existingCover && existingCover.storage_path !== storagePath && isManagedCoverPath(existingCover.storage_path, productId)) {
    oldCoverCleaned = await removeStorageObject(supabase, existingCover.storage_path!, "Unable to remove replaced cover");
  }

  revalidateAdminProductRoutes(productId);
  if (product.publication_status === "published") {
    revalidatePublicProductRoutes({
      productType: product.product_type,
      slug: product.slug,
      detailUrl: product.detail_url,
    });
  }

  return {
    status: "success",
    message: oldCoverCleaned
      ? "Đã cập nhật ảnh bìa."
      : "Đã cập nhật ảnh bìa. File cũ sẽ được dọn lại sau.",
    coverUrl: publicUrlData.publicUrl,
  };
}
