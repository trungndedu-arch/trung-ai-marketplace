import type { OrderStatus, PaymentStatus } from "@/lib/admin/orders";

const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "Đang xử lý",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

const orderStatusStyles: Record<OrderStatus, string> = {
  pending: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  completed: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  cancelled: "border-slate-300/15 bg-slate-400/10 text-slate-300",
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  unpaid: "Chờ thanh toán",
  pending_confirmation: "Chờ xác nhận",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
};

const paymentStatusStyles: Record<PaymentStatus, string> = {
  unpaid: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  pending_confirmation: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  paid: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  refunded: "border-slate-300/15 bg-slate-400/10 text-slate-300",
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function OrderStatusChip({ value }: { value: OrderStatus }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${orderStatusStyles[value]}`}>{orderStatusLabels[value]}</span>;
}

export function PaymentStatusChip({ value }: { value: PaymentStatus }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${paymentStatusStyles[value]}`}>{paymentStatusLabels[value]}</span>;
}

export function ExpiredOrderChip() {
  return <span className="inline-flex rounded-md border border-rose-300/20 bg-rose-400/10 px-2 py-1 text-[11px] font-bold text-rose-200">Hết hạn</span>;
}

export function isOrderExpired(status: OrderStatus, paymentStatus: PaymentStatus, expiresAt: string) {
  const expiry = new Date(expiresAt).getTime();
  return status === "pending" && paymentStatus === "unpaid" && Number.isFinite(expiry) && expiry <= Date.now();
}

export function formatOrderDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? dateFormatter.format(date) : "—";
}

export function formatOrderMoney(value: number | null, currency: string) {
  if (value === null) return "Không hợp lệ";

  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "VND" ? 0 : 2,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")} ${currency}`;
  }
}
