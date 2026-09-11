import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChartNoAxesCombined,
  CircleX,
  Clock3,
  Eye,
  ReceiptText,
  ShoppingCart,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  ExpiredOrderChip,
  formatOrderDate,
  formatOrderMoney,
  isOrderExpired,
  OrderStatusChip,
  PaymentStatusChip,
} from "@/components/admin/AdminOrderUi";
import {
  adminDashboardRanges,
  type AdminDashboardData,
  type AdminDashboardDailyRevenue,
} from "@/lib/admin/dashboard";

const updatedAtFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

function KpiCard({ label, value, note, icon: Icon, tone }: {
  label: string;
  value: string | number;
  note: string;
  icon: typeof WalletCards;
  tone: string;
}) {
  return (
    <article className="min-w-0 rounded-xl border border-white/[0.08] bg-[#0B1728] p-4 shadow-lg shadow-black/10 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-400">{label}</p>
          <strong className="mt-3 block break-words text-2xl font-black tabular-nums text-white sm:text-3xl">{value}</strong>
        </div>
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] ${tone}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-4 text-[11px] font-semibold text-slate-600">{note}</p>
    </article>
  );
}

function RevenueChart({ data }: { data: readonly AdminDashboardDailyRevenue[] }) {
  const maxRevenue = Math.max(0, ...data.map((point) => point.revenue));
  const labelEvery = Math.max(1, Math.ceil(data.length / 7));

  return (
    <div>
      <div
        className="grid h-64 items-end gap-1.5 border-b border-white/[0.08] pb-2 sm:gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.max(data.length, 1)}, minmax(0, 1fr))` }}
      >
        {data.map((point, index) => {
          const height = maxRevenue > 0 ? Math.max(3, (point.revenue / maxRevenue) * 100) : 3;
          const showLabel = index === 0 || index === data.length - 1 || index % labelEvery === 0;
          const description = `${point.label}: ${formatOrderMoney(point.revenue, "VND")}, ${point.paidOrderCount} đơn đã thanh toán`;
          return (
            <div key={point.date} className="flex h-full min-w-0 flex-col justify-end" title={description} aria-label={description}>
              <div className="mb-2 text-center text-[10px] font-black tabular-nums text-sky-200">{point.paidOrderCount || ""}</div>
              <div className="flex h-[190px] items-end">
                <div
                  className="w-full min-w-[2px] rounded-t bg-gradient-to-t from-sky-600 via-cyan-400 to-emerald-300 shadow-[0_0_16px_rgba(34,211,238,0.12)]"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="mt-2 hidden h-4 truncate text-center text-[10px] font-bold text-slate-600 sm:block">
                {showLabel ? point.label : ""}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] font-bold text-slate-600 sm:hidden">
        <span>{data[0]?.label ?? ""}</span>
        <span>{data[data.length - 1]?.label ?? ""}</span>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>Chiều cao cột: doanh thu</span>
        <span>Số trên cột: đơn đã thanh toán</span>
      </div>
    </div>
  );
}

function TopProducts({ dashboard }: { dashboard: AdminDashboardData }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B1728]">
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-5">
        <div><p className="text-xs font-black uppercase tracking-[0.14em] text-violet-300">Top Products</p><h2 className="mt-1 text-lg font-extrabold text-white">Sản phẩm bán chạy</h2></div>
        <span className="text-xs font-semibold text-slate-500">{dashboard.rangeLabel}</span>
      </div>
      {dashboard.topProducts.length === 0 ? (
        <div className="grid min-h-56 place-items-center px-5 text-center"><div><ChartNoAxesCombined className="mx-auto h-8 w-8 text-slate-700" /><p className="mt-3 font-bold text-slate-300">Chưa có doanh thu trong kỳ</p><p className="mt-1 text-xs text-slate-600">Sản phẩm sẽ xuất hiện sau khi có đơn được xác nhận.</p></div></div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead className="bg-white/[0.025] text-[10px] font-black uppercase tracking-[0.1em] text-slate-600"><tr><th className="px-4 py-3">Sản phẩm</th><th className="px-3 py-3 text-center">Đã bán</th><th className="px-3 py-3 text-center">Số đơn</th><th className="px-3 py-3 text-right">Doanh thu</th><th className="px-4 py-3 text-right">TB / đơn</th></tr></thead>
              <tbody className="divide-y divide-white/[0.06]">
                {dashboard.topProducts.map((product) => <tr key={product.key}><td className="px-4 py-3"><p className="max-w-xs text-sm font-bold text-white">{product.title}</p><p className="mt-1 max-w-xs truncate text-[11px] text-slate-600">{product.slug}</p></td><td className="px-3 py-3 text-center text-sm font-black tabular-nums text-cyan-200">{product.quantitySold}</td><td className="px-3 py-3 text-center text-sm font-bold tabular-nums text-slate-300">{product.orderCount}</td><td className="whitespace-nowrap px-3 py-3 text-right text-sm font-black text-emerald-300">{formatOrderMoney(product.revenue, product.currency)}</td><td className="whitespace-nowrap px-4 py-3 text-right text-xs font-bold text-slate-400">{formatOrderMoney(product.averageOrderValue, product.currency)}</td></tr>)}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-white/[0.06] md:hidden">
            {dashboard.topProducts.map((product, index) => <article key={product.key} className="p-4"><div className="flex items-start gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-400/10 text-xs font-black text-violet-200">#{index + 1}</span><div className="min-w-0 flex-1"><h3 className="text-sm font-bold text-white">{product.title}</h3><p className="mt-1 truncate text-[11px] text-slate-600">{product.slug}</p></div><strong className="whitespace-nowrap text-sm text-emerald-300">{formatOrderMoney(product.revenue, product.currency)}</strong></div><dl className="mt-4 grid grid-cols-3 gap-2 text-xs"><div><dt className="text-slate-600">Đã bán</dt><dd className="mt-1 font-black text-cyan-200">{product.quantitySold}</dd></div><div><dt className="text-slate-600">Số đơn</dt><dd className="mt-1 font-bold text-slate-300">{product.orderCount}</dd></div><div><dt className="text-slate-600">TB / đơn</dt><dd className="mt-1 font-bold text-slate-300">{formatOrderMoney(product.averageOrderValue, product.currency)}</dd></div></dl></article>)}
          </div>
        </>
      )}
    </section>
  );
}

function LatestOrders({ dashboard }: { dashboard: AdminDashboardData }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B1728]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-4 py-4 sm:px-5">
        <div><p className="text-xs font-black uppercase tracking-[0.14em] text-sky-300">Recent Orders</p><h2 className="mt-1 text-lg font-extrabold text-white">Đơn hàng mới nhất</h2></div>
        <Link href="/admin/orders" className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 px-3 text-xs font-bold text-sky-200 transition hover:border-sky-300/40 hover:text-white">Xem tất cả đơn hàng<ArrowRight className="h-3.5 w-3.5" /></Link>
      </div>
      {dashboard.latestOrders.length === 0 ? (
        <div className="grid min-h-56 place-items-center px-5 text-center"><div><ReceiptText className="mx-auto h-8 w-8 text-slate-700" /><p className="mt-3 font-bold text-slate-300">Chưa có đơn hàng</p></div></div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead className="bg-white/[0.025] text-[10px] font-black uppercase tracking-[0.1em] text-slate-600"><tr><th className="px-4 py-3">Mã đơn / khách</th><th className="px-3 py-3">Số tiền</th><th className="px-3 py-3">Trạng thái</th><th className="px-3 py-3">Thanh toán</th><th className="px-3 py-3">Thời gian</th><th className="px-4 py-3 text-right">Xem</th></tr></thead>
              <tbody className="divide-y divide-white/[0.06]">
                {dashboard.latestOrders.map((order) => { const expired = isOrderExpired(order.status, order.paymentStatus, order.expiresAt); return <tr key={order.id}><td className="px-4 py-3"><Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-black text-sky-200 hover:text-white">{order.orderCode}</Link><p className="mt-1 max-w-[220px] truncate text-xs font-bold text-white">{order.customerName || "Chưa có tên"}</p><p className="mt-1 max-w-[220px] truncate text-[11px] text-slate-600">{order.customerEmail}</p></td><td className="whitespace-nowrap px-3 py-3 text-sm font-black text-white">{formatOrderMoney(order.total, order.currency)}</td><td className="px-3 py-3"><span className="flex flex-wrap gap-1.5"><OrderStatusChip value={order.status} />{expired ? <ExpiredOrderChip /> : null}</span></td><td className="px-3 py-3"><PaymentStatusChip value={order.paymentStatus} /></td><td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">{formatOrderDate(order.createdAt)}</td><td className="px-4 py-3 text-right"><Link href={`/admin/orders/${order.id}`} aria-label={`Xem chi tiết đơn ${order.orderCode}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky-300/30 hover:text-sky-200"><Eye className="h-4 w-4" /></Link></td></tr>; })}
              </tbody>
            </table>
          </div>
          <div className="divide-y divide-white/[0.06] md:hidden">
            {dashboard.latestOrders.map((order) => { const expired = isOrderExpired(order.status, order.paymentStatus, order.expiresAt); return <article key={order.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-mono text-xs font-black text-sky-200">{order.orderCode}</p><h3 className="mt-2 truncate text-sm font-bold text-white">{order.customerName || "Chưa có tên"}</h3><p className="mt-1 truncate text-xs text-slate-600">{order.customerEmail}</p></div><strong className="shrink-0 whitespace-nowrap text-sm text-white">{formatOrderMoney(order.total, order.currency)}</strong></div><div className="mt-3 flex flex-wrap gap-2"><OrderStatusChip value={order.status} /><PaymentStatusChip value={order.paymentStatus} />{expired ? <ExpiredOrderChip /> : null}</div><div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-3"><span className="text-xs text-slate-500">{formatOrderDate(order.createdAt)}</span><Link href={`/admin/orders/${order.id}`} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 px-3 text-xs font-bold text-sky-200">Xem chi tiết<ArrowRight className="h-3.5 w-3.5" /></Link></div></article>; })}
          </div>
        </>
      )}
    </section>
  );
}

export function AdminDashboard({ dashboard }: { dashboard: AdminDashboardData }) {
  const revenueMetrics = [
    { label: "Tổng doanh thu", value: formatOrderMoney(dashboard.allTimeRevenue, "VND"), note: "Toàn bộ đơn đã xác nhận thanh toán", icon: WalletCards, tone: "text-emerald-300" },
    { label: "Doanh thu hôm nay", value: formatOrderMoney(dashboard.todayRevenue, "VND"), note: "Theo thời điểm Admin xác nhận", icon: CalendarDays, tone: "text-cyan-300" },
    { label: "Doanh thu 7 ngày", value: formatOrderMoney(dashboard.last7DaysRevenue, "VND"), note: "Hôm nay và 6 ngày trước", icon: TrendingUp, tone: "text-sky-300" },
    { label: "Doanh thu 30 ngày", value: formatOrderMoney(dashboard.last30DaysRevenue, "VND"), note: "Hôm nay và 29 ngày trước", icon: ChartNoAxesCombined, tone: "text-violet-300" },
  ];
  const orderMetrics = [
    { label: "Tổng đơn hàng", value: dashboard.totalOrders, note: dashboard.rangeLabel, icon: ShoppingCart, tone: "text-white" },
    { label: "Đã thanh toán", value: dashboard.paidOrders, note: `${dashboard.rangeLabel} · completed + paid`, icon: BadgeCheck, tone: "text-emerald-300" },
    { label: "Đang chờ", value: dashboard.pendingOrders, note: `${dashboard.rangeLabel} · chưa quá hạn/chờ xác nhận`, icon: Clock3, tone: "text-amber-300" },
    { label: "Hết hạn / không hoàn tất", value: dashboard.expiredOrIncompleteOrders, note: `${dashboard.rangeLabel} · hết hạn, hủy hoặc hoàn tiền`, icon: CircleX, tone: "text-rose-300" },
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Revenue Dashboard</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Tổng quan kinh doanh</h1><p className="mt-2 text-sm text-slate-400">Doanh thu chỉ ghi nhận sau khi Admin xác nhận thanh toán thực tế.</p></div>
        <div className="text-right"><span className="inline-flex rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200">Dữ liệu trực tiếp</span><p className="mt-2 text-[11px] text-slate-600">Cập nhật {updatedAtFormatter.format(new Date(dashboard.generatedAt))}</p></div>
      </div>

      <section aria-label="Bộ lọc thời gian" className="mt-7 flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-[#0B1728] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Khoảng thời gian</p><p className="mt-1 text-sm font-bold text-white">Doanh thu theo bộ lọc: <span className="text-emerald-300">{formatOrderMoney(dashboard.filteredRevenue, "VND")}</span></p></div>
        <nav aria-label="Lọc Dashboard theo thời gian" className="grid grid-cols-2 gap-2 sm:flex">
          {adminDashboardRanges.map((range) => <Link key={range.value} href={range.value === "30d" ? "/admin" : `/admin?range=${range.value}`} aria-current={dashboard.range === range.value ? "page" : undefined} className={`inline-flex min-h-10 items-center justify-center rounded-lg border px-4 text-xs font-extrabold transition ${dashboard.range === range.value ? "border-sky-300/30 bg-sky-400/15 text-sky-100" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"}`}>{range.label}</Link>)}
        </nav>
      </section>

      <section aria-label="KPI doanh thu" className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{revenueMetrics.map((metric) => <KpiCard key={metric.label} {...metric} />)}</section>
      <section aria-label="KPI đơn hàng" className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{orderMetrics.map((metric) => <KpiCard key={metric.label} {...metric} />)}</section>

      <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#0B1728] p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-cyan-300">Revenue Trend</p><h2 className="mt-1 text-lg font-extrabold text-white">Doanh thu theo ngày</h2></div><p className="text-xs font-semibold text-slate-500">{dashboard.rangeLabel} · múi giờ Việt Nam</p></div>
        <div className="mt-6"><RevenueChart data={dashboard.chart} /></div>
      </section>

      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
        <TopProducts dashboard={dashboard} />
        <LatestOrders dashboard={dashboard} />
      </div>
    </div>
  );
}
