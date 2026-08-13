import "server-only";

import { randomUUID } from "node:crypto";
import { requireAdminAccess } from "@/lib/auth/admin";
import {
  BANNER_ASSETS_BUCKET,
  BANNER_IMAGE_MIME_EXTENSIONS,
  MAX_BANNER_IMAGE_SIZE,
  isBannerId,
  isBannerImageMime,
  isBannerImageVariant,
  isCanonicalBannerAssetPath,
  type BannerImageMime,
  type BannerImageVariant,
} from "@/lib/banner-assets";
import { createClient } from "@/lib/supabase/server";

export type BannerAssetUploadResult =
  | { ok: true; path: string }
  | { ok: false; error: string };

export type BannerAssetDeleteResult =
  | { ok: true }
  | { ok: false; error: string };

function hasBytes(bytes: Uint8Array, signature: readonly number[], offset = 0) {
  return signature.every((byte, index) => bytes[offset + index] === byte);
}

function detectImageMime(bytes: Uint8Array): BannerImageMime | null {
  if (hasBytes(bytes, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  return null;
}

async function bannerExists(bannerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("banners").select("id").eq("id", bannerId).maybeSingle();
  if (error) console.error("[admin/banner-assets] Unable to verify banner:", error);
  return { supabase, exists: Boolean(data), error: Boolean(error) };
}

export async function uploadBannerImage({
  bannerId,
  variant,
  file,
}: {
  bannerId: string;
  variant: unknown;
  file: unknown;
}): Promise<BannerAssetUploadResult> {
  await requireAdminAccess(isBannerId(bannerId) ? `/admin/banners/${bannerId}/edit` : "/admin/banners");

  if (!isBannerId(bannerId)) return { ok: false, error: "Không xác định được Banner cần cập nhật." };
  if (!isBannerImageVariant(variant)) return { ok: false, error: "Biến thể ảnh Banner không hợp lệ." };
  if (!(file instanceof File)) return { ok: false, error: "Vui lòng chọn một file ảnh." };
  if (file.size === 0) return { ok: false, error: "File ảnh đang trống." };
  if (file.size > MAX_BANNER_IMAGE_SIZE) return { ok: false, error: "Ảnh Banner không được vượt quá 5 MB." };

  const declaredMime = file.type.toLowerCase();
  if (!isBannerImageMime(declaredMime)) return { ok: false, error: "Chỉ hỗ trợ ảnh JPG, JPEG, PNG hoặc WEBP." };

  const bytes = new Uint8Array(await file.arrayBuffer());
  const detectedMime = detectImageMime(bytes);
  if (!detectedMime || detectedMime !== declaredMime) {
    return { ok: false, error: "Nội dung file không khớp với định dạng ảnh được hỗ trợ." };
  }

  const canonicalBannerId = bannerId.toLowerCase();
  const verification = await bannerExists(canonicalBannerId);
  if (verification.error) return { ok: false, error: "Không thể xác minh Banner lúc này." };
  if (!verification.exists) return { ok: false, error: "Banner không còn tồn tại hoặc bạn không có quyền cập nhật." };

  const extension = BANNER_IMAGE_MIME_EXTENSIONS[detectedMime];
  const storagePath = `banners/${canonicalBannerId}/${variant}/${randomUUID()}.${extension}`;
  const { error } = await verification.supabase.storage.from(BANNER_ASSETS_BUCKET).upload(storagePath, bytes, {
    cacheControl: "31536000",
    contentType: detectedMime,
    upsert: false,
  });

  if (error) {
    console.error("[admin/banner-assets] Storage upload rejected:", error);
    return { ok: false, error: "Không thể tải ảnh Banner lên. Vui lòng kiểm tra quyền hoặc thử lại." };
  }

  return { ok: true, path: storagePath };
}

export async function deleteBannerImage({
  bannerId,
  variant,
  path,
}: {
  bannerId: string;
  variant: BannerImageVariant;
  path: string;
}): Promise<BannerAssetDeleteResult> {
  await requireAdminAccess(isBannerId(bannerId) ? `/admin/banners/${bannerId}/edit` : "/admin/banners");

  if (!isBannerId(bannerId) || !isBannerImageVariant(variant)) {
    return { ok: false, error: "Đường dẫn ảnh Banner không hợp lệ." };
  }

  const canonicalBannerId = bannerId.toLowerCase();
  if (!isCanonicalBannerAssetPath(path, canonicalBannerId, variant)) {
    return { ok: false, error: "Đường dẫn ảnh Banner không hợp lệ." };
  }

  const verification = await bannerExists(canonicalBannerId);
  if (verification.error) return { ok: false, error: "Không thể xác minh Banner lúc này." };
  if (!verification.exists) return { ok: false, error: "Banner không còn tồn tại hoặc bạn không có quyền cập nhật." };

  const { error } = await verification.supabase.storage.from(BANNER_ASSETS_BUCKET).remove([path]);
  if (error) {
    console.error("[admin/banner-assets] Storage delete rejected:", error);
    return { ok: false, error: "Không thể xóa ảnh Banner lúc này." };
  }

  return { ok: true };
}
