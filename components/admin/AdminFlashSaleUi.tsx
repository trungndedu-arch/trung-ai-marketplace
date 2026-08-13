import type { FlashSaleRuntimeState } from "@/lib/admin/flash-sales";
import type { FlashSaleStatus } from "@/lib/catalog/types";

const statusLabels: Record<FlashSaleStatus, string> = {
  scheduled: "Lên lịch tự động",
  active: "Hoạt động",
  paused: "Tạm dừng",
  ended: "Đã kết thúc",
};

const statusStyles: Record<FlashSaleStatus, string> = {
  scheduled: "border-violet-300/20 bg-violet-300/10 text-violet-200",
  active: "border-sky-300/20 bg-sky-300/10 text-sky-200",
  paused: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  ended: "border-slate-300/15 bg-slate-300/10 text-slate-300",
};

const runtimeLabels: Record<FlashSaleRuntimeState, string> = {
  scheduled: "Chưa bắt đầu",
  active: "Đang diễn ra",
  expired: "Đã kết thúc",
  inactive: "Không hoạt động",
};

const runtimeStyles: Record<FlashSaleRuntimeState, string> = {
  scheduled: "border-violet-300/20 bg-violet-300/10 text-violet-200",
  active: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  expired: "border-slate-300/15 bg-slate-300/10 text-slate-300",
  inactive: "border-rose-300/20 bg-rose-300/10 text-rose-200",
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function FlashSaleStatusChip({ value }: { value: FlashSaleStatus }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${statusStyles[value]}`}>{statusLabels[value]}</span>;
}

export function FlashSaleRuntimeChip({ value }: { value: FlashSaleRuntimeState }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${runtimeStyles[value]}`}>{runtimeLabels[value]}</span>;
}

export function formatFlashSaleDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? dateFormatter.format(date) : "Không hợp lệ";
}

export function getFlashSaleDiscount(basePrice: number, salePrice: number) {
  if (basePrice <= 0 || salePrice < 0 || salePrice >= basePrice) return 0;
  return Math.round((1 - salePrice / basePrice) * 100);
}
