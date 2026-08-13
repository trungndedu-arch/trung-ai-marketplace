"use server";

import { redirect } from "next/navigation";
import { revalidateBannerRoutes } from "@/lib/admin/banner-revalidation";
import {
  HOME_HERO_POSITION,
  bannerDatabaseErrorMessage,
  toBannerDatabaseFields,
  validateBannerFormData,
  type BannerMutationState,
} from "@/lib/admin/banner-validation";
import { stringField } from "@/lib/admin/product-validation";
import { isBannerId } from "@/lib/banner-assets";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export async function createBanner(_previousState: BannerMutationState, formData: FormData): Promise<BannerMutationState> {
  await requireAdminAccess("/admin/banners/new");
  const validation = validateBannerFormData(formData, "create");
  if (!validation.isValid) {
    return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };
  }

  const fields = toBannerDatabaseFields(validation.values);
  if (!fields) return { status: "error", message: "Dữ liệu banner chưa hợp lệ.", fieldErrors: validation.fieldErrors };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .insert({
      ...fields,
      position: HOME_HERO_POSITION,
      status: "draft",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[admin/banners] Banner create rejected:", error);
    return { status: "error", message: bannerDatabaseErrorMessage(error, "create"), fieldErrors: {} };
  }

  revalidateBannerRoutes(data.id);
  redirect(`/admin/banners/${data.id}/edit?created=1`);
}

export async function updateBanner(_previousState: BannerMutationState, formData: FormData): Promise<BannerMutationState> {
  const id = stringField(formData, "id");
  await requireAdminAccess(id ? `/admin/banners/${id}/edit` : "/admin/banners");
  if (!isBannerId(id)) return { status: "error", message: "Không xác định được banner cần cập nhật.", fieldErrors: {} };

  const validation = validateBannerFormData(formData, "edit");
  if (!validation.isValid) {
    return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };
  }

  const fields = toBannerDatabaseFields(validation.values);
  if (!fields) return { status: "error", message: "Dữ liệu banner chưa hợp lệ.", fieldErrors: validation.fieldErrors };

  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from("banners")
    .select("id, position, desktop_image_path")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    console.error("[admin/banners] Unable to verify banner before update:", existingError);
    return { status: "error", message: bannerDatabaseErrorMessage(existingError, "update"), fieldErrors: {} };
  }
  if (!existing || existing.position !== HOME_HERO_POSITION) {
    return { status: "error", message: "Banner không tồn tại hoặc không thuộc vị trí được hỗ trợ.", fieldErrors: {} };
  }
  if (fields.status === "published" && !existing.desktop_image_path) {
    return {
      status: "error",
      message: "Cần tải ảnh desktop trước khi xuất bản banner.",
      fieldErrors: { status: "Cần tải ảnh desktop trước khi xuất bản banner." },
    };
  }

  const { data: updated, error } = await supabase
    .from("banners")
    .update(fields)
    .eq("id", id)
    .eq("position", HOME_HERO_POSITION)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[admin/banners] Banner update rejected:", error);
    return { status: "error", message: bannerDatabaseErrorMessage(error, "update"), fieldErrors: {} };
  }
  if (!updated) return { status: "error", message: "Banner không tồn tại hoặc bạn không có quyền cập nhật.", fieldErrors: {} };

  revalidateBannerRoutes(id);
  redirect(`/admin/banners/${id}/edit?updated=1`);
}
