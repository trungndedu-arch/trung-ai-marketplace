import { stringField } from "@/lib/admin/product-validation";
import type { FlashSaleStatus } from "@/lib/catalog/types";

export const FLASH_SALE_STATUSES: FlashSaleStatus[] = ["scheduled", "active", "paused", "ended"];

export type EditableFlashSaleField = "productId" | "salePrice" | "status" | "startAt" | "endAt" | "schedule";

export type FlashSaleMutationState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<EditableFlashSaleField, string>>;
};

export type FlashSaleMutationValues = {
  productId: string;
  salePrice: number | null;
  status: FlashSaleStatus | null;
  startAt: string | null;
  endAt: string | null;
};

export type FlashSaleDatabaseFields = {
  product_id: string;
  sale_price: number;
  status: FlashSaleStatus;
  start_at: string;
  end_at: string;
};

function parseSalePrice(value: string) {
  if (!/^\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number <= 999_999_999_999 ? number : null;
}

function parseStatus(value: string) {
  return FLASH_SALE_STATUSES.includes(value as FlashSaleStatus) ? value as FlashSaleStatus : null;
}

function parseTimezoneOffset(value: string) {
  if (!/^-?\d+$/.test(value)) return null;
  const offset = Number(value);
  return Number.isSafeInteger(offset) && offset >= -840 && offset <= 840 ? offset : null;
}

function parseLocalDateTime(value: string, timezoneOffset: number | null) {
  if (!value || timezoneOffset === null) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) return null;

  const [, yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue = "0"] = match;
  const [year, month, day, hour, minute, second] = [yearValue, monthValue, dayValue, hourValue, minuteValue, secondValue].map(Number);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute, second);
  const wallDate = new Date(wallTime);
  if (
    wallDate.getUTCFullYear() !== year
    || wallDate.getUTCMonth() !== month - 1
    || wallDate.getUTCDate() !== day
    || wallDate.getUTCHours() !== hour
    || wallDate.getUTCMinutes() !== minute
    || wallDate.getUTCSeconds() !== second
  ) return null;

  const instant = new Date(wallTime + timezoneOffset * 60_000);
  return Number.isFinite(instant.getTime()) ? instant.toISOString() : null;
}

export function validateFlashSaleFormData(formData: FormData, forcedProductId?: string) {
  const productId = forcedProductId ?? stringField(formData, "productId");
  const salePrice = parseSalePrice(stringField(formData, "salePrice"));
  const status = parseStatus(stringField(formData, "status"));
  const timezoneOffset = parseTimezoneOffset(stringField(formData, "timezoneOffset"));
  const rawStartAt = stringField(formData, "startAt");
  const rawEndAt = stringField(formData, "endAt");
  const startAt = parseLocalDateTime(rawStartAt, timezoneOffset);
  const endAt = parseLocalDateTime(rawEndAt, timezoneOffset);
  const fieldErrors: FlashSaleMutationState["fieldErrors"] = {};

  if (!productId) fieldErrors.productId = "Vui lòng chọn sản phẩm áp dụng Flash Sale.";
  if (salePrice === null) fieldErrors.salePrice = "Giá Flash Sale phải là số nguyên từ 0 đến 999.999.999.999.";
  if (!status) fieldErrors.status = "Trạng thái Flash Sale không hợp lệ.";
  if (!startAt) fieldErrors.startAt = "Thời gian bắt đầu không hợp lệ.";
  if (!endAt) fieldErrors.endAt = "Thời gian kết thúc không hợp lệ.";
  if (startAt && endAt && Date.parse(endAt) <= Date.parse(startAt)) {
    fieldErrors.schedule = "Thời gian kết thúc phải sau thời gian bắt đầu.";
  }

  const values: FlashSaleMutationValues = { productId, salePrice, status, startAt, endAt };
  return {
    values,
    fieldErrors,
    isValid: Object.keys(fieldErrors).length === 0 && salePrice !== null && status !== null && startAt !== null && endAt !== null,
  };
}

export function flashSaleDatabaseErrorMessage(error: { code?: string; message?: string }, operation: "create" | "update") {
  const message = error.message?.toLowerCase() ?? "";
  if (error.code === "23P01" || message.includes("no_overlapping_schedules") || message.includes("conflicting key value violates exclusion")) {
    return "Khoảng thời gian này bị trùng với một Flash Sale đang hoạt động hoặc đã lên lịch của sản phẩm.";
  }
  if (message.includes("only allowed for sellable products")) return "Sản phẩm không còn đủ điều kiện áp dụng Flash Sale.";
  if (message.includes("price must be lower")) return "Giá Flash Sale phải thấp hơn giá bán hiện tại của sản phẩm.";
  if (error.code === "23514" && message.includes("valid_schedule")) return "Thời gian kết thúc phải sau thời gian bắt đầu.";
  if (error.code === "23514" && message.includes("sale_price_nonnegative")) return "Giá Flash Sale không được là số âm.";
  if (error.code === "23503") return "Sản phẩm được chọn không còn tồn tại.";
  if (error.code === "42501" || message.includes("permission denied") || message.includes("row-level security")) {
    return operation === "create" ? "Bạn không có quyền tạo Flash Sale." : "Bạn không có quyền cập nhật Flash Sale này.";
  }
  return operation === "create"
    ? "Không thể tạo Flash Sale lúc này. Vui lòng thử lại."
    : "Không thể cập nhật Flash Sale lúc này. Vui lòng thử lại.";
}

export function toFlashSaleDatabaseFields(values: FlashSaleMutationValues): FlashSaleDatabaseFields | null {
  if (values.salePrice === null || !values.status || !values.startAt || !values.endAt) return null;
  return {
    product_id: values.productId,
    sale_price: values.salePrice,
    status: values.status,
    start_at: values.startAt,
    end_at: values.endAt,
  };
}

export function isDatabaseUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export const isFlashSaleId = isDatabaseUuid;
