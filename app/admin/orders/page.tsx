import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, ReceiptText, RotateCcw, Search } from "lucide-react";
import {
  ExpiredOrderChip,
  formatOrderDate,
  formatOrderMoney,
  isOrderExpired,
  OrderStatusChip,
  PaymentStatusChip,
} from "@/components/admin/AdminOrderUi";
import {
  ADMIN_ORDERS_PAGE_SIZE,
  getAdminOrders,
  type AdminOrderFilters,
  type OrderStatus,
  type PaymentStatus,
} from "@/lib/admin/orders";

export const metadata: Metadata = { title: "Quản lý đơn hàng" };

const orderStatuses: OrderStatus[] = ["pending", "completed", "cancelled"];
const paymentStatuses: PaymentStatus[] = ["unpaid", "pending_confirmation", "paid", "refunded"];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseFilters(params: Record<string, string | string[] | undefined>): AdminOrderFilters {
  const page = Number.parseInt(firstValue(params.page) ?? "1", 10);
  const orderStatus = firstValue(params.order_status) ?? "all";
  const paymentStatus = firstValue(params.payment_status) ?? "all";

  return {
    search: (firstValue(params.q) ?? "").trim().slice(0, 100),
    orderStatus: orderStatuses.includes(orderStatus as OrderStatus) ? orderStatus as OrderStatus : "all",
    paymentStatus: paymentStatuses.includes(paymentStatus as PaymentStatus) ? paymentStatus as PaymentStatus : "all",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

function buildOrdersHref(filters: AdminOrderFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.orderStatus !== "all") params.set("order_status", filters.orderStatus);
  if (filters.paymentStatus !== "all") params.set("payment_status", filters.paymentStatus);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/orders?${query}` : "/admin/orders";
}

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const filters = parseFilters(await searchParams);
  const result = await getAdminOrders(filters);

  if (!result.error && result.totalPages > 0 && result.page > result.totalPages) {
    redirect(buildOrdersHref(filters, result.totalPages));
  }

  const firstItem = result.total ? (result.page - 1) * ADMIN_ORDERS_PAGE_SIZE + 1 : 0;
  const lastItem = Math.min(result.page * ADMIN_ORDERS_PAGE_SIZE, result.total);

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Order Management</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Đơn hàng</h1><p className="mt-2 text-sm text-slate-400">Theo dõi đơn chuyển khoản ở chế độ chỉ đọc.</p></div>
        <span className="text-sm font-semibold text-slate-400">{result.total} đơn hàng</span>
      </div>

      <form method="get" className="mt-7 grid gap-3 rounded-lg border border-white/[0.08] bg-[#0B1728] p-4 md:grid-cols-[minmax(240px,1fr)_190px_210px_auto_auto]">
        <label className="relative min-w-0"><span className="sr-only">Tìm đơn hàng</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input name="q" defaultValue={filters.search} maxLength={100} placeholder="Mã đơn, email hoặc tên khách" className="h-11 w-full rounded-lg border border-white/10 bg-[#07111F] pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40" /></label>
        <label><span className="sr-only">Trạng thái đơn</span><select name="order_status" defaultValue={filters.orderStatus} className="h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm font-semibold text-slate-200 outline-none focus:border-sky-400/40"><option value="all">Tất cả trạng thái đơn</option><option value="pending">Đang xử lý</option><option value="completed">Hoàn tất</option><option value="cancelled">Đã hủy</option></select></label>
        <label><span className="sr-only">Trạng thái thanh toán</span><select name="payment_status" defaultValue={filters.paymentStatus} className="h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm font-semibold text-slate-200 outline-none focus:border-sky-400/40"><option value="all">Tất cả thanh toán</option><option value="unpaid">Chờ thanh toán</option><option value="pending_confirmation">Chờ xác nhận thanh toán</option><option value="paid">Đã thanh toán</option><option value="refunded">Đã hoàn tiền</option></select></label>
        <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Search className="h-4 w-4" />Lọc</button>
        <Link href="/admin/orders" aria-label="Xóa bộ lọc" title="Xóa bộ lọc" className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white"><RotateCcw className="h-4 w-4" /></Link>
      </form>

      {result.error ? (
        <section className="mt-6 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-8 text-center"><p className="font-bold text-rose-100">{result.error}</p><p className="mt-2 text-sm text-rose-200/70">Vui lòng tải lại trang sau ít phút.</p></section>
      ) : result.orders.length === 0 ? (
        <section className="mt-6 grid min-h-64 place-items-center rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 px-5 text-center"><div><ReceiptText className="mx-auto h-9 w-9 text-slate-600" /><h2 className="mt-4 font-extrabold text-white">{filters.search || filters.orderStatus !== "all" || filters.paymentStatus !== "all" ? "Không có đơn hàng phù hợp" : "Chưa có đơn hàng"}</h2><p className="mt-2 text-sm text-slate-500">{filters.search || filters.orderStatus !== "all" || filters.paymentStatus !== "all" ? "Hãy thử điều kiện lọc khác." : "Đơn hàng mới sẽ xuất hiện tại đây."}</p></div></section>
      ) : <>
        <div className="mt-6 hidden overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728] lg:block"><div className="overflow-x-auto"><table className="w-full min-w-[1180px] border-collapse text-left"><thead className="border-b border-white/[0.08] bg-white/[0.025] text-[11px] font-black uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-4 py-3">Mã đơn</th><th className="px-4 py-3">Khách hàng</th><th className="px-4 py-3">Tổng tiền</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Thanh toán</th><th className="px-4 py-3">Sản phẩm</th><th className="px-4 py-3">Thời gian</th><th className="px-4 py-3 text-right">Xem</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{result.orders.map((order) => { const expired = isOrderExpired(order.status, order.paymentStatus, order.expiresAt); return <tr key={order.id} className="transition hover:bg-white/[0.025]"><td className="px-4 py-3"><Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-black text-sky-200 hover:text-white">{order.orderCode}</Link><p className="mt-1 text-[11px] text-slate-600">{order.paymentReference}</p></td><td className="px-4 py-3"><p className="max-w-[220px] truncate text-sm font-extrabold text-white">{order.customerName || "Chưa có tên"}</p><p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">{order.customerEmail}</p></td><td className="whitespace-nowrap px-4 py-3 text-sm font-black text-white">{formatOrderMoney(order.total, order.currency)}</td><td className="px-4 py-3"><span className="flex flex-wrap gap-1.5"><OrderStatusChip value={order.status} />{expired ? <ExpiredOrderChip /> : null}</span></td><td className="px-4 py-3"><PaymentStatusChip value={order.paymentStatus} /></td><td className="px-4 py-3 text-center text-sm font-bold text-slate-300">{order.itemCount}</td><td className="whitespace-nowrap px-4 py-3 text-xs leading-5 text-slate-400"><p>{formatOrderDate(order.createdAt)}</p><p className="text-slate-600">Hạn: {formatOrderDate(order.expiresAt)}</p></td><td className="px-4 py-3 text-right"><Link href={`/admin/orders/${order.id}`} aria-label={`Xem đơn ${order.orderCode}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky-300/30 hover:text-sky-200"><Eye className="h-4 w-4" /></Link></td></tr>; })}</tbody></table></div></div>

        <div className="mt-6 space-y-3 lg:hidden">{result.orders.map((order) => { const expired = isOrderExpired(order.status, order.paymentStatus, order.expiresAt); return <article key={order.id} className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs font-black text-sky-200">{order.orderCode}</p><h2 className="mt-2 text-sm font-extrabold text-white">{order.customerName || "Chưa có tên"}</h2><p className="mt-1 break-all text-xs text-slate-500">{order.customerEmail}</p></div><strong className="text-sm text-white">{formatOrderMoney(order.total, order.currency)}</strong></div><div className="mt-4 flex flex-wrap gap-2"><OrderStatusChip value={order.status} /><PaymentStatusChip value={order.paymentStatus} />{expired ? <ExpiredOrderChip /> : null}</div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-3 text-xs"><div><dt className="text-slate-600">Sản phẩm</dt><dd className="mt-1 font-bold text-slate-300">{order.itemCount}</dd></div><div><dt className="text-slate-600">Ngày tạo</dt><dd className="mt-1 font-bold text-slate-300">{formatOrderDate(order.createdAt)}</dd></div></dl><Link href={`/admin/orders/${order.id}`} className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 px-3 text-xs font-bold text-sky-200">Xem chi tiết<ArrowRight className="h-3.5 w-3.5" /></Link></article>; })}</div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500"><p>Hiển thị {firstItem}–{lastItem} trong {result.total} đơn hàng</p>{result.totalPages > 1 ? <nav aria-label="Phân trang đơn hàng" className="flex items-center gap-2"><Link href={buildOrdersHref(filters, Math.max(1, result.page - 1))} aria-disabled={result.page <= 1} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 font-bold ${result.page <= 1 ? "pointer-events-none border-white/5 text-slate-700" : "border-white/10 text-slate-300 hover:text-white"}`}><ArrowLeft className="h-4 w-4" />Trước</Link><span className="px-2 font-bold text-slate-300">{result.page}/{result.totalPages}</span><Link href={buildOrdersHref(filters, Math.min(result.totalPages, result.page + 1))} aria-disabled={result.page >= result.totalPages} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 font-bold ${result.page >= result.totalPages ? "pointer-events-none border-white/5 text-slate-700" : "border-white/10 text-slate-300 hover:text-white"}`}>Sau<ArrowRight className="h-4 w-4" /></Link></nav> : null}</div>
      </>}
    </div>
  );
}
