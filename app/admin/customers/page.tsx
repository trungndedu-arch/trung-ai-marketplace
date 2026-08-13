import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, RotateCcw, Search, Users } from "lucide-react";
import {
  CustomerAvatar,
  CustomerRoleChips,
  CustomerStatusChip,
  formatCustomerDate,
} from "@/components/admin/AdminCustomerUi";
import {
  ADMIN_CUSTOMERS_PAGE_SIZE,
  getAdminCustomers,
  type AdminCustomerFilters,
} from "@/lib/admin/customers";

export const metadata: Metadata = { title: "Quản lý khách hàng" };

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(params: Record<string, string | string[] | undefined>): AdminCustomerFilters {
  const page = Number.parseInt(firstValue(params.page) ?? "1", 10);
  return {
    search: (firstValue(params.q) ?? "").trim().slice(0, 100),
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function buildCustomersHref(filters: AdminCustomerFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/customers?${query}` : "/admin/customers";
}

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseFilters(await searchParams);
  const result = await getAdminCustomers(filters);

  if (!result.error && result.totalPages > 0 && result.page > result.totalPages) {
    redirect(buildCustomersHref(filters, result.totalPages));
  }

  const firstItem = result.total ? (result.page - 1) * ADMIN_CUSTOMERS_PAGE_SIZE + 1 : 0;
  const lastItem = Math.min(result.page * ADMIN_CUSTOMERS_PAGE_SIZE, result.total);

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Customer Management</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Khách hàng</h1><p className="mt-2 text-sm text-slate-400">Tra cứu hồ sơ khách hàng ở chế độ chỉ đọc.</p></div><span className="text-sm font-semibold text-slate-400">{result.total} khách hàng</span></div>

      <form method="get" className="mt-7 flex flex-col gap-3 rounded-lg border border-white/[0.08] bg-[#0B1728] p-4 sm:flex-row">
        <label className="relative min-w-0 flex-1"><span className="sr-only">Tìm khách hàng</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input name="q" defaultValue={filters.search} maxLength={100} placeholder="Email, họ tên hoặc số điện thoại" className="h-11 w-full rounded-lg border border-white/10 bg-[#07111F] pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40" /></label>
        <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Search className="h-4 w-4" />Tìm kiếm</button>
        <Link href="/admin/customers" aria-label="Xóa tìm kiếm" title="Xóa tìm kiếm" className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white"><RotateCcw className="h-4 w-4" /></Link>
      </form>

      {result.error ? <section className="mt-6 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-8 text-center"><p className="font-bold text-rose-100">{result.error}</p><p className="mt-2 text-sm text-rose-200/70">Vui lòng tải lại trang sau ít phút.</p></section> : result.customers.length === 0 ? <section className="mt-6 grid min-h-64 place-items-center rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 px-5 text-center"><div><Users className="mx-auto h-9 w-9 text-slate-600" /><h2 className="mt-4 font-extrabold text-white">{filters.search ? "Không có khách hàng phù hợp" : "Chưa có khách hàng"}</h2><p className="mt-2 text-sm text-slate-500">{filters.search ? "Hãy thử từ khóa khác." : "Chưa có profile mang role Khách hàng."}</p></div></section> : <>
        <div className="mt-6 hidden overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728] md:block"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] border-collapse text-left"><thead className="border-b border-white/[0.08] bg-white/[0.025] text-[11px] font-black uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">Điện thoại</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Roles</th><th className="px-4 py-3">Ngày đăng ký</th><th className="px-4 py-3 text-right">Xem</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{result.customers.map((customer) => <tr key={customer.id} className="transition hover:bg-white/[0.025]"><td className="px-4 py-3"><div className="flex min-w-0 items-center gap-3"><CustomerAvatar customer={customer} /><div className="min-w-0"><Link href={`/admin/customers/${customer.id}`} className="line-clamp-1 max-w-sm text-sm font-extrabold text-white hover:text-sky-300">{customer.fullName || "Chưa cập nhật tên"}</Link><p className="mt-1 max-w-sm truncate text-xs text-slate-500">{customer.email}</p></div></div></td><td className="px-4 py-3 text-sm font-semibold text-slate-300">{customer.phone || "—"}</td><td className="px-4 py-3"><CustomerStatusChip status={customer.status} /></td><td className="px-4 py-3"><CustomerRoleChips roles={customer.roles} /></td><td className="px-4 py-3 whitespace-nowrap text-xs font-semibold text-slate-400">{formatCustomerDate(customer.createdAt)}</td><td className="px-4 py-3 text-right"><Link href={`/admin/customers/${customer.id}`} aria-label={`Xem ${customer.email}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky-300/30 hover:text-sky-200"><Eye className="h-4 w-4" /></Link></td></tr>)}</tbody></table></div></div>

        <div className="mt-6 space-y-3 md:hidden">{result.customers.map((customer) => <article key={customer.id} className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-4"><div className="flex gap-3"><CustomerAvatar customer={customer} /><div className="min-w-0 flex-1"><h2 className="truncate text-sm font-extrabold text-white">{customer.fullName || "Chưa cập nhật tên"}</h2><p className="mt-1 truncate text-xs text-slate-500">{customer.email}</p><p className="mt-2 text-xs font-semibold text-slate-400">{customer.phone || "Chưa cập nhật điện thoại"}</p></div><CustomerStatusChip status={customer.status} /></div><div className="mt-4"><CustomerRoleChips roles={customer.roles} /></div><div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3"><span className="text-xs text-slate-500">{formatCustomerDate(customer.createdAt)}</span><Link href={`/admin/customers/${customer.id}`} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 px-3 text-xs font-bold text-sky-200">Xem chi tiết<ArrowRight className="h-3.5 w-3.5" /></Link></div></article>)}</div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500"><p>Hiển thị {firstItem}–{lastItem} trong {result.total} khách hàng</p>{result.totalPages > 1 ? <nav aria-label="Phân trang khách hàng" className="flex items-center gap-2"><Link href={buildCustomersHref(filters, Math.max(1, result.page - 1))} aria-disabled={result.page <= 1} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 font-bold ${result.page <= 1 ? "pointer-events-none border-white/5 text-slate-700" : "border-white/10 text-slate-300 hover:text-white"}`}><ArrowLeft className="h-4 w-4" />Trước</Link><span className="px-2 font-bold text-slate-300">{result.page}/{result.totalPages}</span><Link href={buildCustomersHref(filters, Math.min(result.totalPages, result.page + 1))} aria-disabled={result.page >= result.totalPages} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 font-bold ${result.page >= result.totalPages ? "pointer-events-none border-white/5 text-slate-700" : "border-white/10 text-slate-300 hover:text-white"}`}>Sau<ArrowRight className="h-4 w-4" /></Link></nav> : null}</div>
      </>}
    </div>
  );
}
