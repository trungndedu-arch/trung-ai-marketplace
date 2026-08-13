import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Mail, Phone, ReceiptText, ShieldCheck } from "lucide-react";
import {
  CustomerAvatar,
  CustomerRoleChips,
  CustomerStatusChip,
  formatCustomerDate,
} from "@/components/admin/AdminCustomerUi";
import { getAdminCustomerById } from "@/lib/admin/customers";

export const metadata: Metadata = { title: "Chi tiết khách hàng" };

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="border-b border-white/[0.06] py-4 last:border-0"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{label}</dt><dd className="mt-2 break-words text-sm leading-6 text-slate-200">{children}</dd></div>;
}

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getAdminCustomerById(id);

  if (result.error) return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/customers" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách khách hàng</Link></section>;
  if (!result.customer) notFound();
  const customer = result.customer;

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link href="/admin/customers" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách khách hàng</Link>
      <section className="mt-5 rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-start"><CustomerAvatar customer={customer} className="h-20 w-20 text-2xl" /><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2"><CustomerStatusChip status={customer.status} /><CustomerRoleChips roles={customer.roles} /></div><h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">{customer.fullName || "Chưa cập nhật tên"}</h1><p className="mt-2 break-all text-sm text-slate-400">{customer.email}</p></div></div></section>

      <div className="mt-7 grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(300px,.75fr)]">
        <section><h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><ShieldCheck className="h-5 w-5 text-sky-300" />Hồ sơ khách hàng</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Customer ID"><span className="break-all font-mono text-xs">{customer.id}</span></DetailItem><DetailItem label="Họ tên">{customer.fullName || "—"}</DetailItem><DetailItem label="Email"><span className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" />{customer.email}</span></DetailItem><DetailItem label="Điện thoại"><span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" />{customer.phone || "—"}</span></DetailItem><DetailItem label="Trạng thái"><CustomerStatusChip status={customer.status} /></DetailItem><DetailItem label="Roles"><CustomerRoleChips roles={customer.roles} /></DetailItem></dl></section>

        <aside className="space-y-7"><section><h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><CalendarDays className="h-5 w-5 text-sky-300" />Thời gian</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Ngày đăng ký">{formatCustomerDate(customer.createdAt)}</DetailItem><DetailItem label="Cập nhật gần nhất">{formatCustomerDate(customer.updatedAt)}</DetailItem></dl></section><section className="rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 p-5"><div className="flex items-center gap-2"><ReceiptText className="h-5 w-5 text-slate-500" /><h2 className="font-extrabold text-white">Đơn hàng</h2></div><p className="mt-3 text-sm leading-6 text-slate-400">Dữ liệu đơn hàng sẽ được bổ sung sau khi hệ thống đặt hàng được triển khai.</p></section></aside>
      </div>
    </div>
  );
}
