// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { isValidYouTubeChannelUrl } from "../free-ai-learning-core.ts";
// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { getYouTubeWatchUrl, parseYouTubeVideoUrl } from "../youtube.ts";

export type FreeAiLearningVideoMutationState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<"videoUrl" | "title" | "displayOrder" | "isVisible", string>>;
};

export type FreeAiLearningSettingsMutationState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: Partial<Record<"youtubeChannelUrl" | "sectionEnabled" | "channelButtonEnabled", string>>;
};

export const initialFreeAiLearningVideoState: FreeAiLearningVideoMutationState = { status: "idle", message: "", fieldErrors: {} };
export const initialFreeAiLearningSettingsState: FreeAiLearningSettingsMutationState = { status: "idle", message: "", fieldErrors: {} };

const text = (formData: FormData, key: string) => String(formData.get(key) ?? "").trim();

export function isValidFreeAiLearningUpdatedAtToken(value: string) {
  return value.length <= 64 && !Number.isNaN(Date.parse(value));
}

function parseDisplayOrder(value: string) {
  if (!/^\d+$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= 999_999 ? parsed : null;
}

export function validateFreeAiLearningVideo(formData: FormData) {
  const videoUrl = text(formData, "videoUrl");
  const videoId = parseYouTubeVideoUrl(videoUrl);
  const title = text(formData, "title");
  const displayOrder = parseDisplayOrder(text(formData, "displayOrder"));
  const isVisible = formData.get("isVisible") === "on";
  const fieldErrors: FreeAiLearningVideoMutationState["fieldErrors"] = {};

  if (!videoId) fieldErrors.videoUrl = "URL YouTube không hợp lệ. Hỗ trợ watch, youtu.be, shorts và live.";
  if (!title) fieldErrors.title = "Tiêu đề video là bắt buộc.";
  else if (title.length > 200) fieldErrors.title = "Tiêu đề tối đa 200 ký tự.";
  if (displayOrder === null) fieldErrors.displayOrder = "Thứ tự phải là số nguyên từ 0 đến 999.999.";

  return {
    isValid: Object.keys(fieldErrors).length === 0 && videoId !== null && displayOrder !== null,
    fieldErrors,
    values: {
      youtube_video_id: videoId ?? "",
      video_url: videoId ? getYouTubeWatchUrl(videoId) : "",
      title,
      display_order: displayOrder ?? 0,
      is_visible: isVisible,
    },
  };
}

export function validateFreeAiLearningSettings(formData: FormData) {
  const youtubeChannelUrl = text(formData, "youtubeChannelUrl");
  const sectionEnabled = formData.get("sectionEnabled") === "on";
  const channelButtonEnabled = formData.get("channelButtonEnabled") === "on";
  const fieldErrors: FreeAiLearningSettingsMutationState["fieldErrors"] = {};

  if (youtubeChannelUrl && !isValidYouTubeChannelUrl(youtubeChannelUrl)) {
    fieldErrors.youtubeChannelUrl = "Chỉ chấp nhận URL HTTPS thuộc youtube.com.";
  }
  if (channelButtonEnabled && !youtubeChannelUrl) {
    fieldErrors.youtubeChannelUrl = "Cần nhập URL kênh trước khi bật nút xem thêm.";
    fieldErrors.channelButtonEnabled = "Nút xem thêm cần URL kênh YouTube hợp lệ.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
    values: { youtubeChannelUrl, sectionEnabled, channelButtonEnabled },
  };
}

export function freeAiLearningDatabaseErrorMessage(error: { code?: string; message?: string }, operation: "create" | "update" | "delete") {
  const message = error.message?.toLowerCase() ?? "";
  if (error.code === "23505") return "Video YouTube này đã có trong danh sách.";
  if (error.code === "42501" || message.includes("permission denied") || message.includes("row-level security")) return "Chỉ Admin được phép thay đổi video Học AI Miễn Phí.";
  if (error.code === "42P01" || error.code === "PGRST205") return "Bảng Học AI Miễn Phí chưa được khởi tạo.";
  if (operation === "create") return "Không thể thêm video lúc này.";
  if (operation === "update") return "Không thể cập nhật video lúc này.";
  return "Không thể xóa video lúc này.";
}
