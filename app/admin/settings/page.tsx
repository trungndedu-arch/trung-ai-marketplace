import type { Metadata } from "next";
import { Database, LockKeyhole } from "lucide-react";
import { PaymentSettingsForm } from "@/components/admin/PaymentSettingsForm";
import { getAdminPaymentSettings } from "@/lib/admin/payment-settings";

export const metadata: Metadata = { title: "Cài đặt thanh toán" };

function formatUpdatedAt(value: string | null) {
  if (!value) return "Chưa có cấu hình trong database";
  const date = new Date(value);
  return Number.isFinite(date.getTime())
    ? `Cập nhật gần nhất: ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" }).format(date)}`
    : "Chưa xác định được thời gian cập nhật";
}

export default async function AdminSettingsPage() {
  const result = await getAdminPaymentSettings();

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Marketplace Configuration</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Cài đặt</h1><p className="mt-2 text-sm text-slate-400">Quản lý cấu hình thanh toán dành cho Checkout phía server.</p></div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-[#0B1728] p-4"><LockKeyhole className="mt-0.5 h-5 w-5 text-emerald-300" /><div><p className="text-sm font-extrabold text-white">Private settings</p><p className="mt-1 text-xs leading-5 text-slate-500">Không được đọc qua public catalog repository.</p></div></div><div className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-[#0B1728] p-4"><Database className="mt-0.5 h-5 w-5 text-sky-300" /><div><p className="text-sm font-extrabold text-white">Nguồn snapshot đơn hàng</p><p className="mt-1 text-xs leading-5 text-slate-500">Checkout lưu cấu hình vào Order để dữ liệu thanh toán không đổi về sau.</p></div></div></div>

      {result.error || !result.settings ? <section className="mt-6 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-8 text-center"><p className="font-bold text-rose-100">{result.error ?? "Không thể tải cấu hình thanh toán."}</p><p className="mt-2 text-sm text-rose-200/70">Vui lòng tải lại trang sau ít phút.</p></section> : <div className="mt-6"><p className="mb-3 text-right text-xs font-semibold text-slate-500">{formatUpdatedAt(result.settings.updatedAt)}</p><PaymentSettingsForm settings={result.settings} /></div>}
    </div>
  );
}
