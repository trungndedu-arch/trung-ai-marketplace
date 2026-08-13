import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  CreditCard,
  ExternalLink,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { CommerceHeader } from "@/components/commerce/CommerceHeader";
import { PaymentValueCopy } from "@/components/checkout/PaymentValueCopy";
import { VietQrImage } from "@/components/checkout/VietQrImage";
import { getCheckoutOrderForCurrentUser, type CheckoutOrder } from "@/lib/checkout/orders";
import { buildVietQrUrl, buildZaloUrl } from "@/lib/checkout/vietqr";

export const metadata: Metadata = { title: "Thanh toán đơn hàng" };
export const dynamic = "force-dynamic";

function formatOrderTotal(total: number, currency: string) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  }).format(total);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

function getPaymentState(order: CheckoutOrder, expired: boolean) {
  if (order.status === "completed" && order.paymentStatus === "paid") {
    return {
      label: "Đã thanh toán",
      className: "border-emerald-300/25 bg-emerald-500/10 text-emerald-100",
      title: "Đơn hàng đã được thanh toán",
      message: "Bạn không cần chuyển khoản thêm cho đơn hàng này.",
      canPay: false,
    };
  }
  if (order.paymentStatus === "refunded") {
    return {
      label: "Đã hoàn tiền",
      className: "border-slate-300/20 bg-slate-500/10 text-slate-200",
      title: "Đơn hàng đã được hoàn tiền",
      message: "Không tiếp tục chuyển khoản theo thông tin của đơn hàng này.",
      canPay: false,
    };
  }
  if (order.status === "cancelled") {
    return {
      label: "Đã hủy",
      className: "border-slate-300/20 bg-slate-500/10 text-slate-200",
      title: "Đơn hàng đã bị hủy",
      message: "Không chuyển khoản theo thông tin của đơn hàng này.",
      canPay: false,
    };
  }
  if (expired) {
    return {
      label: "Đã hết hạn",
      className: "border-amber-300/25 bg-amber-500/10 text-amber-100",
      title: "Đơn hàng đã hết hạn thanh toán",
      message: "Không chuyển khoản theo đơn này. Bạn có thể quay lại giỏ hàng để tạo đơn mới.",
      canPay: false,
    };
  }
  if (order.paymentStatus === "pending_confirmation") {
    return {
      label: "Đang chờ xác nhận",
      className: "border-amber-300/25 bg-amber-500/10 text-amber-100",
      title: "Thanh toán đang chờ xác nhận",
      message: "Không cần chuyển khoản lại. Hệ thống đang chờ Admin đối soát giao dịch của bạn.",
      canPay: false,
    };
  }
  return {
    label: "Chờ thanh toán",
    className: "border-sky-300/25 bg-sky-500/10 text-sky-100",
    title: "Thanh toán đơn hàng",
    message: "Quét QR bằng ứng dụng ngân hàng hoặc chuyển khoản theo thông tin bên dưới.",
    canPay: order.status === "pending" && order.paymentStatus === "unpaid",
  };
}

export default async function CheckoutOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getCheckoutOrderForCurrentUser(id);
  if (result.status === "auth-required") redirect(`/login?next=${encodeURIComponent(`/checkout/order/${id}`)}`);
  if (result.status === "not-found") notFound();

  const user = result.userEmail ? { email: result.userEmail } : null;
  if (result.status === "error") {
    return (
      <div className="min-h-screen bg-ink text-slate-100">
        <CommerceHeader user={user} />
        <main className="mx-auto grid min-h-[520px] max-w-xl place-items-center px-4 text-center">
          <div><AlertTriangle className="mx-auto h-10 w-10 text-amber-300" /><h1 className="mt-4 text-2xl font-extrabold text-white">Chưa thể tải đơn hàng</h1><p className="mt-3 text-sm leading-6 text-slate-400">Vui lòng tải lại trang hoặc quay lại giỏ hàng sau ít phút.</p><Link href="/cart" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-sky-500 px-5 text-sm font-extrabold text-white">Quay lại giỏ hàng</Link></div>
        </main>
      </div>
    );
  }

  const { order } = result;
  const formattedTotal = formatOrderTotal(order.total, order.currency);
  const expiresAt = new Date(order.expiresAt).getTime();
  const expired = order.status === "pending"
    && order.paymentStatus === "unpaid"
    && Number.isFinite(expiresAt)
    && expiresAt <= Date.now();
  const paymentState = getPaymentState(order, expired);
  const vietQrUrl = paymentState.canPay && order.currency === "VND"
    ? buildVietQrUrl({
      bankBin: order.bankBin,
      bankAccountNumber: order.bankAccountNumber,
      bankAccountHolder: order.bankAccountHolder,
      amount: order.total,
      paymentReference: order.paymentReference,
    })
    : null;
  const zaloUrl = buildZaloUrl(order.supportZaloPhone);

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <CommerceHeader user={user} />
      <main className="mx-auto max-w-[1120px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <Link href="/workflow" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Về Marketplace</Link>

        <section className="mt-4 overflow-hidden rounded-2xl border border-sky-300/15 bg-[#0B1728]">
          <header className="border-b border-white/[0.08] p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Thanh toán đơn hàng</p>
                <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">{paymentState.title}</h1>
                <p className="mt-2 text-sm text-slate-400">Mã đơn: <strong className="text-slate-200">{order.orderCode}</strong></p>
              </div>
              <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${paymentState.className}`}>{paymentState.label}</span>
            </div>
          </header>

          {!paymentState.canPay ? (
            <div className="m-5 flex gap-3 rounded-xl border border-amber-300/25 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100 sm:m-7">
              {order.paymentStatus === "paid" ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /> : <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />}
              <div><strong>{paymentState.title}.</strong><p className="mt-1 text-amber-100/80">{paymentState.message}</p></div>
            </div>
          ) : null}

          <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)] lg:items-start">
            <aside className="space-y-4">
              <div className="rounded-2xl border border-sky-300/20 bg-[#0F1F33] p-4 sm:p-5">
                <div className="text-center">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">Số tiền cần thanh toán</p>
                  <p className="mt-2 text-3xl font-black text-white sm:text-4xl">{formattedTotal}</p>
                </div>
                {vietQrUrl ? <div className="mx-auto mt-5 max-w-[360px]"><VietQrImage src={vietQrUrl} /><p className="mt-3 text-center text-sm font-semibold text-slate-300">Quét QR bằng ứng dụng ngân hàng</p></div> : null}
                {paymentState.canPay && order.currency !== "VND" ? <p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-500/10 p-3 text-sm leading-6 text-amber-100">VietQR chỉ hỗ trợ đơn hàng VND. Vui lòng chuyển khoản thủ công theo thông tin bên cạnh.</p> : null}
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-[#0F1F33] p-5">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><Clock3 className="h-4 w-4 text-sky-300" />Hạn thanh toán</p>
                <p className="mt-2 text-sm font-extrabold text-white">{formatDate(order.expiresAt)}</p>
                <p className="mt-3 text-xs leading-5 text-slate-400">Trang này chỉ hiển thị snapshot đã lưu trong Order và không tự thay đổi trạng thái thanh toán.</p>
              </div>
            </aside>

            <div className="min-w-0 space-y-4">
              <div className="rounded-2xl border border-sky-300/20 bg-sky-500/[0.07] p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">Nội dung chuyển khoản</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3"><strong className="break-all text-xl font-black tracking-wide text-white">{order.paymentReference}</strong><PaymentValueCopy value={order.paymentReference} /></div>
                <p className="mt-3 text-xs leading-5 text-slate-400">Vui lòng ghi chính xác nội dung này. Không tự thêm hoặc sửa ký tự.</p>
              </div>

              <dl className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1F33]">
                <div className="grid gap-2 border-b border-white/[0.08] px-4 py-4 sm:grid-cols-[180px_1fr]"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><Building2 className="h-4 w-4 text-sky-300" />Ngân hàng</dt><dd className="break-words font-extrabold text-white">{order.bankName}</dd></div>
                <div className="grid gap-3 border-b border-white/[0.08] px-4 py-4 sm:grid-cols-[180px_1fr]"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><CreditCard className="h-4 w-4 text-sky-300" />Số tài khoản</dt><dd className="flex min-w-0 flex-wrap items-center justify-between gap-3"><strong className="break-all text-white">{order.bankAccountNumber}</strong><PaymentValueCopy value={order.bankAccountNumber} /></dd></div>
                <div className="grid gap-2 border-b border-white/[0.08] px-4 py-4 sm:grid-cols-[180px_1fr]"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><ShieldCheck className="h-4 w-4 text-sky-300" />Chủ tài khoản</dt><dd className="break-words font-extrabold text-white">{order.bankAccountHolder}</dd></div>
                <div className="grid gap-3 border-b border-white/[0.08] px-4 py-4 sm:grid-cols-[180px_1fr]"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><WalletCards className="h-4 w-4 text-sky-300" />Số tiền</dt><dd className="flex min-w-0 flex-wrap items-center justify-between gap-3"><strong className="text-white">{formattedTotal}</strong><PaymentValueCopy value={String(order.total)} /></dd></div>
                <div className="grid gap-3 px-4 py-4 sm:grid-cols-[180px_1fr]"><dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500"><ReceiptText className="h-4 w-4 text-sky-300" />Nội dung</dt><dd className="flex min-w-0 flex-wrap items-center justify-between gap-3"><strong className="break-all text-white">{order.paymentReference}</strong><PaymentValueCopy value={order.paymentReference} /></dd></div>
              </dl>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0F1F33] p-5">
                <h2 className="flex items-center gap-2 text-sm font-extrabold text-white"><ReceiptText className="h-4 w-4 text-sky-300" />Hướng dẫn thanh toán</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">{order.paymentInstructions}</p>
              </div>

              {order.supportZaloPhone ? (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0F1F33] p-5">
                  <div><p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Hỗ trợ Zalo</p><p className="mt-1 font-extrabold text-white">{order.supportZaloPhone}</p></div>
                  {zaloUrl ? <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-sky-300/25 bg-sky-500/10 px-4 text-sm font-extrabold text-sky-100 transition hover:bg-sky-500/20">Mở Zalo<ExternalLink className="h-4 w-4" /></a> : null}
                </div>
              ) : null}

              {expired ? <Link href="/cart" className="flex min-h-11 items-center justify-center rounded-xl border border-sky-300/25 bg-sky-500/10 text-sm font-extrabold text-sky-100">Quay lại giỏ hàng</Link> : null}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
