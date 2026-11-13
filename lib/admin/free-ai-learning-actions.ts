"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import {
  freeAiLearningDatabaseErrorMessage,
  isValidFreeAiLearningUpdatedAtToken,
  validateFreeAiLearningSettings,
  validateFreeAiLearningVideo,
  type FreeAiLearningSettingsMutationState,
  type FreeAiLearningVideoMutationState,
} from "@/lib/admin/free-ai-learning-validation";

function revalidateFreeAiLearning() {
  revalidatePath("/");
  revalidatePath("/admin/free-ai-learning");
}

export async function createFreeAiLearningVideo(_state: FreeAiLearningVideoMutationState, formData: FormData): Promise<FreeAiLearningVideoMutationState> {
  const admin = await requireAdminRole("/admin/free-ai-learning/new");
  const validation = validateFreeAiLearningVideo(formData);
  if (!validation.isValid) return { status: "error", message: "Kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };
  const supabase = await createClient();
  const { data, error } = await supabase.from("free_ai_learning_videos").insert({ ...validation.values, created_by: admin.userId, updated_by: admin.userId }).select("id").single();
  if (error) return { status: "error", message: freeAiLearningDatabaseErrorMessage(error, "create"), fieldErrors: {} };
  revalidateFreeAiLearning();
  redirect(`/admin/free-ai-learning/${data.id}/edit?created=1`);
}

export async function updateFreeAiLearningVideo(_state: FreeAiLearningVideoMutationState, formData: FormData): Promise<FreeAiLearningVideoMutationState> {
  const id = String(formData.get("id") ?? "");
  const expectedUpdatedAt = String(formData.get("updatedAt") ?? "");
  const admin = await requireAdminRole(`/admin/free-ai-learning/${id}/edit`);
  const validation = validateFreeAiLearningVideo(formData);
  if (!id || !validation.isValid) return { status: "error", message: "Kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };
  if (!isValidFreeAiLearningUpdatedAtToken(expectedUpdatedAt)) return { status: "error", message: "Phiên chỉnh sửa không hợp lệ. Hãy tải lại trang trước khi lưu.", fieldErrors: {} };
  const supabase = await createClient();
  const { data, error } = await supabase.from("free_ai_learning_videos").update({ ...validation.values, updated_by: admin.userId }).eq("id", id).eq("updated_at", expectedUpdatedAt).select("id").maybeSingle();
  if (error) return { status: "error", message: freeAiLearningDatabaseErrorMessage(error, "update"), fieldErrors: {} };
  if (!data) return { status: "error", message: "Video đã được thay đổi ở phiên khác, không tồn tại hoặc bạn không có quyền cập nhật. Hãy tải lại trang.", fieldErrors: {} };
  revalidateFreeAiLearning();
  redirect(`/admin/free-ai-learning/${id}/edit?updated=1`);
}

export async function setFreeAiLearningVideoVisibility(id: string, isVisible: boolean) {
  const admin = await requireAdminRole("/admin/free-ai-learning");
  const supabase = await createClient();
  const { data, error } = await supabase.from("free_ai_learning_videos").update({ is_visible: isVisible, updated_by: admin.userId }).eq("id", id).select("id").maybeSingle();
  if (error) throw new Error(freeAiLearningDatabaseErrorMessage(error, "update"));
  if (!data) throw new Error("Video không tồn tại hoặc bạn không có quyền cập nhật.");
  revalidateFreeAiLearning();
}

export async function deleteFreeAiLearningVideo(id: string) {
  await requireAdminRole("/admin/free-ai-learning");
  const supabase = await createClient();
  const { data, error } = await supabase.from("free_ai_learning_videos").delete().eq("id", id).select("id").maybeSingle();
  if (error) throw new Error(freeAiLearningDatabaseErrorMessage(error, "delete"));
  if (!data) throw new Error("Video không tồn tại hoặc bạn không có quyền xóa.");
  revalidateFreeAiLearning();
}

export async function updateFreeAiLearningSettings(_state: FreeAiLearningSettingsMutationState, formData: FormData): Promise<FreeAiLearningSettingsMutationState> {
  const admin = await requireAdminRole("/admin/free-ai-learning");
  const validation = validateFreeAiLearningSettings(formData);
  if (!validation.isValid) return { status: "error", message: "Kiểm tra lại cấu hình được đánh dấu.", fieldErrors: validation.fieldErrors };
  const rows = [
    { key: "free_ai_learning.section_enabled", value: validation.values.sectionEnabled, visibility: "public" as const, description: "Bật khu vực Học AI Miễn Phí trên trang chủ", updated_by: admin.userId },
    { key: "free_ai_learning.youtube_channel_url", value: validation.values.youtubeChannelUrl, visibility: "public" as const, description: "URL kênh YouTube cho khu vực Học AI Miễn Phí", updated_by: admin.userId },
    { key: "free_ai_learning.channel_button_enabled", value: validation.values.channelButtonEnabled, visibility: "public" as const, description: "Bật nút xem thêm video trên YouTube", updated_by: admin.userId },
  ];
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" }).select("key");
  if (error || (data ?? []).length !== rows.length) return { status: "error", message: "Không thể lưu cấu hình Học AI Miễn Phí.", fieldErrors: {} };
  revalidateFreeAiLearning();
  return { status: "success", message: "Đã lưu cấu hình Học AI Miễn Phí.", fieldErrors: {} };
}
