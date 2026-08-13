import { ImageIcon } from "lucide-react";
import type { AccessType, ProductType, PublicationStatus, SalesStatus } from "@/lib/catalog/types";

const labels = {
  productType: { chatbot: "Chatbot", ai_app: "AI App", ai_tool: "AI Tool", course: "Khóa học" },
  publicationStatus: { published: "Đã xuất bản", draft: "Bản nháp", hidden: "Đã ẩn" },
  salesStatus: { on_sale: "Đang bán", coming_soon: "Sắp ra mắt", paused: "Tạm dừng" },
  accessType: { paid: "Trả phí", free: "Miễn phí" },
} as const;

export function getProductTypeLabel(value: ProductType) {
  return labels.productType[value];
}

export function getPublicationStatusLabel(value: PublicationStatus) {
  return labels.publicationStatus[value];
}

export function getSalesStatusLabel(value: SalesStatus) {
  return labels.salesStatus[value];
}

export function getAccessTypeLabel(value: AccessType) {
  return labels.accessType[value];
}

export function formatAdminPrice(value: number | null, currency = "VND") {
  if (value === null) return "—";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

export function ProductCover({ image, title, className = "h-20 w-12" }: { image: { url: string; alt: string } | null; title: string; className?: string }) {
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#07111F] ${className}`}>
      {image ? <img src={image.url} alt={image.alt || title} className="h-full w-full object-cover object-center" /> : <span className="grid h-full w-full place-items-center text-slate-600"><ImageIcon className="h-5 w-5" /></span>}
    </span>
  );
}

export function PublicationChip({ value }: { value: PublicationStatus }) {
  const tone = value === "published" ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200" : value === "draft" ? "border-amber-300/20 bg-amber-400/10 text-amber-200" : "border-slate-300/15 bg-slate-400/10 text-slate-300";
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${tone}`}>{getPublicationStatusLabel(value)}</span>;
}

export function SalesChip({ value }: { value: SalesStatus }) {
  const tone = value === "on_sale" ? "border-sky-300/20 bg-sky-400/10 text-sky-200" : value === "coming_soon" ? "border-violet-300/20 bg-violet-400/10 text-violet-200" : "border-rose-300/20 bg-rose-400/10 text-rose-200";
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${tone}`}>{getSalesStatusLabel(value)}</span>;
}

export function AccessChip({ value }: { value: AccessType }) {
  const tone = value === "free" ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-200" : "border-white/10 bg-white/[0.04] text-slate-300";
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${tone}`}>{getAccessTypeLabel(value)}</span>;
}
