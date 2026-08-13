"use server";

import { deleteBannerImage, uploadBannerImage } from "@/lib/admin/banner-assets";
import { revalidateBannerRoutes } from "@/lib/admin/banner-revalidation";
import { HOME_HERO_POSITION } from "@/lib/admin/banner-validation";
import { stringField } from "@/lib/admin/product-validation";
import { BANNER_ASSETS_BUCKET, isBannerId, isBannerImageVariant, isCanonicalBannerAssetPath } from "@/lib/banner-assets";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export type BannerImageUploadState = {
  status: "idle" | "success" | "error";
  message: string;
  imageUrl?: string;
};

type ExistingBannerImage = {
  id: string;
  position: string;
  desktop_image_path: string | null;
  mobile_image_path: string | null;
  updated_at: string;
};

export async function replaceBannerImage(
  _previousState: BannerImageUploadState,
  formData: FormData,
): Promise<BannerImageUploadState> {
  const bannerId = stringField(formData, "bannerId");
  const variantValue = stringField(formData, "variant");
  await requireAdminAccess(bannerId ? `/admin/banners/${bannerId}/edit` : "/admin/banners");

  if (!isBannerId(bannerId) || !isBannerImageVariant(variantValue)) {
    return { status: "error", message: "Không xác định được banner hoặc loại ảnh cần cập nhật." };
  }

  const supabase = await createClient();
  const { data, error: existingError } = await supabase
    .from("banners")
    .select("id, position, desktop_image_path, mobile_image_path, updated_at")
    .eq("id", bannerId)
    .maybeSingle();

  if (existingError) {
    console.error("[admin/banner-media] Unable to verify banner:", existingError);
    return { status: "error", message: "Không thể xác minh banner lúc này." };
  }
  if (!data || data.position !== HOME_HERO_POSITION) {
    return { status: "error", message: "Banner không tồn tại hoặc không thuộc vị trí được hỗ trợ." };
  }

  const existing = data as ExistingBannerImage;
  const oldPath = variantValue === "desktop" ? existing.desktop_image_path : existing.mobile_image_path;
  const file = formData.get("image");
  const uploadResult = await uploadBannerImage({ bannerId, variant: variantValue, file });
  if (!uploadResult.ok) return { status: "error", message: uploadResult.error };

  const payload = variantValue === "desktop"
    ? { desktop_image_path: uploadResult.path }
    : { mobile_image_path: uploadResult.path };
  const { data: switched, error: switchError } = await supabase
    .from("banners")
    .update(payload)
    .eq("id", bannerId)
    .eq("position", HOME_HERO_POSITION)
    .eq("updated_at", existing.updated_at)
    .select("id")
    .maybeSingle();

  if (switchError || !switched) {
    if (switchError) console.error("[admin/banner-media] Banner image switch rejected:", switchError);
    const cleanup = await deleteBannerImage({ bannerId, variant: variantValue, path: uploadResult.path });
    if (!cleanup.ok) console.warn("[admin/banner-media] Unable to remove new object after database failure:", cleanup.error);
    return {
      status: "error",
      message: switchError
        ? "Không thể cập nhật ảnh banner. Vui lòng thử lại."
        : "Banner vừa được thay đổi ở nơi khác. Hãy tải lại trang rồi thử lại.",
    };
  }

  let oldImageCleaned = true;
  if (oldPath && oldPath !== uploadResult.path && isCanonicalBannerAssetPath(oldPath, bannerId, variantValue)) {
    const cleanup = await deleteBannerImage({ bannerId, variant: variantValue, path: oldPath });
    oldImageCleaned = cleanup.ok;
    if (!cleanup.ok) console.warn("[admin/banner-media] Unable to remove replaced banner image:", cleanup.error);
  }

  revalidateBannerRoutes(bannerId);
  const imageUrl = supabase.storage.from(BANNER_ASSETS_BUCKET).getPublicUrl(uploadResult.path).data.publicUrl;
  return {
    status: "success",
    message: oldImageCleaned
      ? "Đã cập nhật ảnh banner."
      : "Đã cập nhật ảnh banner. File cũ cần được dọn lại sau.",
    imageUrl,
  };
}
