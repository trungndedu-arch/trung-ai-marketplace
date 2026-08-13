import { stringField } from "@/lib/admin/product-validation";
import type { PublicationStatus } from "@/lib/catalog/types";

export const HOME_HERO_POSITION = "home_hero" as const;
export const BANNER_PUBLICATION_STATUSES: PublicationStatus[] = ["draft", "published", "hidden"];

export type EditableBannerField =
  | "title"
  | "subtitle"
  | "ctaLabel"
  | "ctaUrl"
  | "status"
  | "startAt"
  | "endAt"
  | "schedule"
  | "sortOrder";

export type BannerMutationState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<EditableBannerField, string>>;
};

export type BannerMutationValues = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  status: PublicationStatus;
  startAt: string | null;
  endAt: string | null;
  sortOrder: number | null;
};

export type BannerDatabaseFields = {
  title: string;
  subtitle: string | null;
  cta_label: string | null;
  cta_url: string | null;
  status: PublicationStatus;
  start_at: string | null;
  end_at: string | null;
  sort_order: number;
};

function parsePublicationStatus(value: string): PublicationStatus | null {
  return BANNER_PUBLICATION_STATUSES.includes(value as PublicationStatus) ? value as PublicationStatus : null;
}

function parseSortOrder(value: string) {
  if (!/^\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number <= 999_999 ? number : null;
}

function parseTimezoneOffset(value: string) {
  if (!/^-?\d+$/.test(value)) return null;
  const offset = Number(value);
  return Number.isSafeInteger(offset) && offset >= -840 && offset <= 840 ? offset : null;
}

function parseLocalDateTime(value: string, timezoneOffset: number | null) {
  if (!value) return { value: null, valid: true };
  if (timezoneOffset === null) return { value: null, valid: false };

  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return { value: null, valid: false };

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue = "0"] = match;
  const parts = [yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue].map(Number);
  const [year, month, day, hour, minute, second] = parts;
  const wallTime = Date.UTC(year, month - 1, day, hour, minute, second);
  const wallDate = new Date(wallTime);

  if (
    wallDate.getUTCFullYear() !== year
    || wallDate.getUTCMonth() !== month - 1
    || wallDate.getUTCDate() !== day
    || wallDate.getUTCHours() !== hour
    || wallDate.getUTCMinutes() !== minute
    || wallDate.getUTCSeconds() !== second
  ) {
    return { value: null, valid: false };
  }

  const instant = new Date(wallTime + timezoneOffset * 60_000);
  return Number.isFinite(instant.getTime())
    ? { value: instant.toISOString(), valid: true }
    : { value: null, valid: false };
}

function isSafeCtaUrl(value: string) {
  if (!value || /[<>"'`\\\u0000-\u001f\u007f]/.test(value)) return false;
  if (value.startsWith("/")) return !value.startsWith("//") && !/\s/.test(value);

  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validateBannerFormData(formData: FormData, mode: "create" | "edit") {
  const title = stringField(formData, "title");
  const subtitle = stringField(formData, "subtitle");
  const ctaLabel = stringField(formData, "ctaLabel");
  const ctaUrl = stringField(formData, "ctaUrl");
  const rawStatus = mode === "create" ? "draft" : stringField(formData, "status");
  const status = parsePublicationStatus(rawStatus);
  const timezoneOffset = parseTimezoneOffset(stringField(formData, "timezoneOffset"));
  const startAt = parseLocalDateTime(stringField(formData, "startAt"), timezoneOffset);
  const endAt = parseLocalDateTime(stringField(formData, "endAt"), timezoneOffset);
  const sortOrder = parseSortOrder(stringField(formData, "sortOrder"));
  const fieldErrors: BannerMutationState["fieldErrors"] = {};

  if (!title) fieldErrors.title = "Tiêu đề banner không được để trống.";
  else if (title.length > 160) fieldErrors.title = "Tiêu đề không được vượt quá 160 ký tự.";
  if (subtitle.length > 500) fieldErrors.subtitle = "Mô tả phụ không được vượt quá 500 ký tự.";
  if (ctaLabel.length > 80) fieldErrors.ctaLabel = "Nhãn CTA không được vượt quá 80 ký tự.";
  if (ctaUrl.length > 2_048) fieldErrors.ctaUrl = "URL CTA không được vượt quá 2.048 ký tự.";
  if (Boolean(ctaLabel) !== Boolean(ctaUrl)) {
    fieldErrors.ctaLabel = ctaLabel ? "CTA cần có URL đi kèm." : "URL CTA cần có nhãn đi kèm.";
    fieldErrors.ctaUrl = ctaUrl ? "URL CTA cần có nhãn đi kèm." : "CTA cần có URL đi kèm.";
  } else if (ctaUrl && !isSafeCtaUrl(ctaUrl)) {
    fieldErrors.ctaUrl = "Chỉ chấp nhận đường dẫn nội bộ bắt đầu bằng / hoặc URL http/https hợp lệ.";
  }
  if (!status) fieldErrors.status = "Trạng thái xuất bản không hợp lệ.";
  if (!startAt.valid) fieldErrors.startAt = "Thời gian bắt đầu không hợp lệ.";
  if (!endAt.valid) fieldErrors.endAt = "Thời gian kết thúc không hợp lệ.";
  if (startAt.value && endAt.value && Date.parse(endAt.value) <= Date.parse(startAt.value)) {
    fieldErrors.schedule = "Thời gian kết thúc phải sau thời gian bắt đầu.";
  }
  if (sortOrder === null) fieldErrors.sortOrder = "Thứ tự hiển thị phải là số nguyên từ 0 đến 999.999.";

  const values: BannerMutationValues = {
    title,
    subtitle,
    ctaLabel,
    ctaUrl,
    status: status ?? "draft",
    startAt: startAt.value,
    endAt: endAt.value,
    sortOrder,
  };

  return { values, fieldErrors, isValid: Object.keys(fieldErrors).length === 0 && sortOrder !== null && status !== null };
}

export function toBannerDatabaseFields(values: BannerMutationValues): BannerDatabaseFields | null {
  if (values.sortOrder === null) return null;
  return {
    title: values.title,
    subtitle: values.subtitle || null,
    cta_label: values.ctaLabel || null,
    cta_url: values.ctaUrl || null,
    status: values.status,
    start_at: values.startAt,
    end_at: values.endAt,
    sort_order: values.sortOrder,
  };
}

export function bannerDatabaseErrorMessage(error: { code?: string; message?: string }, operation: "create" | "update") {
  const message = error.message?.toLowerCase() ?? "";
  if (error.code === "42501" || message.includes("permission denied") || message.includes("row-level security")) {
    return operation === "create" ? "Bạn không có quyền tạo banner." : "Bạn không có quyền cập nhật banner này.";
  }
  if (error.code === "23514" && message.includes("published_requires_desktop")) {
    return "Cần tải ảnh desktop trước khi xuất bản banner.";
  }
  if (error.code === "23514" && message.includes("valid_schedule")) {
    return "Thời gian kết thúc phải sau thời gian bắt đầu.";
  }
  return operation === "create"
    ? "Không thể tạo banner lúc này. Vui lòng thử lại."
    : "Không thể cập nhật banner lúc này. Vui lòng thử lại.";
}
