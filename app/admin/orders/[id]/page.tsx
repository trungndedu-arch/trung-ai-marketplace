import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Building2, CheckCircle2, Clock3, CreditCard, Info, Mail, PackageSearch, Phone, ReceiptText, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import { CustomerStatusChip } from "@/components/admin/AdminCustomerUi";
import { ConfirmOrderPayment } from "@/components/admin/ConfirmOrderPayment";
import {
  ExpiredOrderChip,
  formatOrderDate,
  formatOrderMoney,
  isOrderExpired,
  OrderStatusChip,
  PaymentStatusChip,
} from "@/components/admin/AdminOrderUi";
import { getAdminOrderById } from "@/lib/admin/orders";

export const metadata: Metadata = { title: "Chi tiết đơn hàng" };

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="border-b border-white/[0.06] py-4 last:border-0"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{label}</dt><dd className="mt-2 break-words text-sm leading-6 text-slate-200">{children}</dd></div>;
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminOrderDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ result?: string | string[] }> }) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getAdminOrderById(id);

  if (result.error) {
    return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/orders" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách đơn hàng</Link></section>;
  }
  if (!result.order) notFound();

  const order = result.order;
  const expired = isOrderExpired(order.status, order.paymentStatus, order.expiresAt);
  const canConfirmPayment = order.status === "pending"
    && (order.paymentStatus === "pending_confirmation" || (order.paymentStatus === "unpaid" && !expired));
  const isConfirmed = order.status === "completed" && order.paymentStatus === "paid";
  const actionResult = firstValue(query.result);

  return (
    <div className="mx-auto w-full max-w-[1250px]">
      <Link href="/admin/orders" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách đơn hàng</Link>

      {isConfirmed && actionResult === "confirmed" ? <div role="status" className="mt-4 flex items-start gap-3 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold leading-6 text-emerald-100"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />Đã xác nhận thanh toán và cấp quyền sản phẩm cho khách hàng.</div> : null}
      {isConfirmed && actionResult === "already-confirmed" ? <div role="status" className="mt-4 flex items-start gap-3 rounded-lg border border-sky-300/20 bg-sky-400/10 px-4 py-3 text-sm font-bold leading-6 text-sky-100"><Info className="mt-0.5 h-5 w-5 shrink-0" />Đơn hàng này đã được xác nhận thanh toán trước đó.</div> : null}

      <section className="mt-5 rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Order Detail</p><h1 className="mt-2 break-all font-mono text-xl font-black text-white sm:text-2xl">{order.orderCode}</h1><p className="mt-2 text-sm text-slate-500">Tạo lúc {formatOrderDate(order.createdAt)}</p></div><div className="flex flex-wrap gap-2"><OrderStatusChip value={order.status} /><PaymentStatusChip value={order.paymentStatus} />{expired ? <ExpiredOrderChip /> : null}</div></div>
      </section>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)]">
        <div className="space-y-7">
          <section>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><ReceiptText className="h-5 w-5 text-sky-300" />Sản phẩm trong đơn</h2>
            {order.items.length === 0 ? <div className="mt-3 rounded-lg border border-dashed border-amber-300/20 bg-amber-400/10 p-5 text-sm text-amber-100">Không tìm thấy Order Item cho đơn hàng này.</div> : <div className="mt-3 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728]"><div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="border-b border-white/[0.08] bg-white/[0.025] text-[11px] font-black uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-4 py-3">Sản phẩm snapshot</th><th className="px-4 py-3">SL</th><th className="px-4 py-3">Giá gốc</th><th className="px-4 py-3">Đơn giá</th><th className="px-4 py-3 text-right">Thành tiền</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{order.items.map((item) => <tr key={item.id}><td className="px-4 py-4"><p className="font-extrabold text-white">{item.productTitle}</p><p className="mt-1 text-xs text-slate-500">{item.productType === "chatbot" ? "Chatbot" : "AI App"} · /{item.productSlug}</p>{item.productId ? <Link href={`/admin/products/${item.productId}`} className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white"><PackageSearch className="h-3.5 w-3.5" />Sản phẩm hiện tại</Link> : <p className="mt-2 text-xs font-semibold text-amber-300">Sản phẩm hiện tại đã bị xóa; dữ liệu snapshot vẫn được giữ.</p>}</td><td className="px-4 py-4 text-sm font-bold text-slate-300">{item.quantity}</td><td className="whitespace-nowrap px-4 py-4 text-sm text-slate-400">{formatOrderMoney(item.basePrice, item.currency)}</td><td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-200">{formatOrderMoney(item.unitPrice, item.currency)}</td><td className="whitespace-nowrap px-4 py-4 text-right text-sm font-black text-white">{formatOrderMoney(item.lineTotal, item.currency)}</td></tr>)}</tbody></table></div></div>}
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><WalletCards className="h-5 w-5 text-sky-300" />Thông tin đối chiếu thanh toán</h2>
            <div className="mt-3 rounded-lg border border-sky-300/20 bg-sky-500/[0.07] p-5 sm:p-6"><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Số tiền cần nhận</dt><dd className="mt-2 text-2xl font-black text-white">{formatOrderMoney(order.total, order.currency)}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Nội dung chuyển khoản</dt><dd className="mt-2 break-all font-mono text-lg font-black text-sky-100">{order.paymentReference}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Ngân hàng</dt><dd className="mt-2 flex items-center gap-2 font-bold text-white"><Building2 className="h-4 w-4 text-sky-300" />{order.bankName}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">BIN</dt><dd className="mt-2 font-mono font-bold text-white">{order.bankBin}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Số tài khoản</dt><dd className="mt-2 flex items-center gap-2 break-all font-bold text-white"><CreditCard className="h-4 w-4 shrink-0 text-sky-300" />{order.bankAccountNumber}</dd></div><div><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Chủ tài khoản</dt><dd className="mt-2 flex items-center gap-2 font-bold text-white"><ShieldCheck className="h-4 w-4 text-sky-300" />{order.bankAccountHolder}</dd></div></dl>{canConfirmPayment ? <div className="mt-6 border-t border-sky-200/10 pt-5"><ConfirmOrderPayment orderId={order.id} orderCode={order.orderCode} customer={order.customerName || order.customerEmail} total={formatOrderMoney(order.total, order.currency)} paymentReference={order.paymentReference} /></div> : null}</div>
          </section>

          <section><h2 className="text-lg font-extrabold text-white">Hướng dẫn chuyển khoản snapshot</h2><p className="mt-3 whitespace-pre-line rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 text-sm leading-7 text-slate-300">{order.paymentInstructions}</p></section>
        </div>

        <aside className="space-y-7">
          <section><h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><UserRound className="h-5 w-5 text-sky-300" />Khách hàng snapshot</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Họ tên">{order.customerName || "—"}</DetailItem><DetailItem label="Email"><span className="inline-flex items-center gap-2 break-all"><Mail className="h-4 w-4 shrink-0 text-slate-500" />{order.customerEmail}</span></DetailItem><DetailItem label="Điện thoại"><span className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" />{order.customerPhone || "—"}</span></DetailItem><DetailItem label="User ID"><span className="break-all font-mono text-xs">{order.userId}</span></DetailItem></dl></section>

          <section><h2 className="text-lg font-extrabold text-white">Hồ sơ hiện tại</h2>{order.profile ? <dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Họ tên">{order.profile.fullName || "—"}</DetailItem><DetailItem label="Email">{order.profile.email}</DetailItem><DetailItem label="Điện thoại">{order.profile.phone || "—"}</DetailItem><DetailItem label="Trạng thái"><CustomerStatusChip status={order.profile.status} /></DetailItem><DetailItem label="Hồ sơ"><Link href={`/admin/customers/${order.profile.id}`} className="font-bold text-sky-300 hover:text-white">Xem khách hàng</Link></DetailItem></dl> : <div className="mt-3 rounded-lg border border-dashed border-amber-300/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">Không đọc được profile hiện tại. Thông tin khách hàng snapshot của Order vẫn được giữ nguyên.</div>}</section>

          <section><h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><ReceiptText className="h-5 w-5 text-sky-300" />Tổng kết đơn</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Order ID"><span className="break-all font-mono text-xs">{order.id}</span></DetailItem><DetailItem label="Phương thức">Chuyển khoản ngân hàng</DetailItem><DetailItem label="Tạm tính">{formatOrderMoney(order.subtotal, order.currency)}</DetailItem><DetailItem label="Giảm giá">{formatOrderMoney(order.discountTotal, order.currency)}</DetailItem><DetailItem label="Tổng tiền"><strong className="text-base text-white">{formatOrderMoney(order.total, order.currency)}</strong></DetailItem><DetailItem label="Số sản phẩm">{order.items.length}</DetailItem></dl></section>

          <section><h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><Clock3 className="h-5 w-5 text-sky-300" />Thời gian</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Ngày tạo">{formatOrderDate(order.createdAt)}</DetailItem><DetailItem label="Hết hạn">{formatOrderDate(order.expiresAt)}</DetailItem><DetailItem label="Đã thanh toán lúc">{formatOrderDate(order.paidAt)}</DetailItem><DetailItem label="Xác nhận lúc">{formatOrderDate(order.confirmedAt)}</DetailItem><DetailItem label="Admin xác nhận">{order.confirmedBy ? <span className="break-all font-mono text-xs">{order.confirmedBy}</span> : "—"}</DetailItem><DetailItem label="Hoàn tiền lúc">{formatOrderDate(order.refundedAt)}</DetailItem><DetailItem label="Cập nhật gần nhất">{formatOrderDate(order.updatedAt)}</DetailItem></dl></section>

          {order.supportZaloPhone ? <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5"><p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Zalo hỗ trợ snapshot</p><p className="mt-2 font-bold text-white">{order.supportZaloPhone}</p></section> : null}
        </aside>
      </div>
    </div>
  );
}
