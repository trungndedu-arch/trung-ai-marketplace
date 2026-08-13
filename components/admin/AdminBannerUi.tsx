import type { PublicationStatus } from "@/lib/catalog/types";
import type { BannerRuntimeState } from "@/lib/admin/banners";

const publicationStyles: Record<PublicationStatus, string> = {
  draft: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  published: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  hidden: "border-slate-300/15 bg-slate-300/10 text-slate-300",
};

const publicationLabels: Record<PublicationStatus, string> = {
  draft: "Bản nháp",
  published: "Đã xuất bản",
  hidden: "Đã ẩn",
};

const runtimeStyles: Record<BannerRuntimeState, string> = {
  draft: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  hidden: "border-slate-300/15 bg-slate-300/10 text-slate-300",
  scheduled: "border-violet-300/20 bg-violet-300/10 text-violet-200",
  active: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
  expired: "border-rose-300/20 bg-rose-300/10 text-rose-200",
};

const runtimeLabels: Record<BannerRuntimeState, string> = {
  draft: "Bản nháp",
  hidden: "Đã ẩn",
  scheduled: "Chưa bắt đầu",
  active: "Đang hiển thị",
  expired: "Đã hết hạn",
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function BannerPublicationChip({ value }: { value: PublicationStatus }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${publicationStyles[value]}`}>{publicationLabels[value]}</span>;
}

export function BannerRuntimeChip({ value }: { value: BannerRuntimeState }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${runtimeStyles[value]}`}>{runtimeLabels[value]}</span>;
}

export function formatBannerDate(value: string | null) {
  if (!value) return "Không giới hạn";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? dateFormatter.format(date) : "Không hợp lệ";
}

export function getBannerPositionLabel() {
  return "Banner trang chủ";
}
