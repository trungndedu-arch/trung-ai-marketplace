import { requireAdminRole } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus, PaymentStatus } from "@/lib/admin/orders";

const DASHBOARD_TIME_ZONE = "Asia/Ho_Chi_Minh";
const QUERY_PAGE_SIZE = 1000;
const RECENT_ORDER_LIMIT = 8;
const TOP_PRODUCT_LIMIT = 10;

export type AdminDashboardRange = "today" | "7d" | "30d" | "all";

export const adminDashboardRanges: ReadonlyArray<{ value: AdminDashboardRange; label: string }> = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "all", label: "Tất cả" },
];

export type AdminDashboardDailyRevenue = {
  date: string;
  label: string;
  revenue: number;
  paidOrderCount: number;
};

export type AdminDashboardProduct = {
  key: string;
  title: string;
  slug: string;
  quantitySold: number;
  orderCount: number;
  revenue: number;
  averageOrderValue: number;
  currency: string;
};

export type AdminDashboardRecentOrder = {
  id: string;
  orderCode: string;
  customerName: string;
  customerEmail: string;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  expiresAt: string;
  createdAt: string;
};

export type AdminDashboardData = {
  range: AdminDashboardRange;
  rangeLabel: string;
  generatedAt: string;
  allTimeRevenue: number;
  todayRevenue: number;
  last7DaysRevenue: number;
  last30DaysRevenue: number;
  filteredRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  expiredOrIncompleteOrders: number;
  chart: AdminDashboardDailyRevenue[];
  topProducts: AdminDashboardProduct[];
  latestOrders: AdminDashboardRecentOrder[];
};

type DashboardOrderRow = {
  id: string;
  order_code: string;
  customer_name_snapshot: string | null;
  customer_email_snapshot: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number | string;
  currency: string;
  expires_at: string;
  paid_at: string | null;
  confirmed_at: string | null;
  created_at: string;
};

type DashboardOrderItemRow = {
  order_id: string;
  product_id: string | null;
  product_title_snapshot: string;
  product_slug_snapshot: string;
  quantity: number;
  line_total: number | string;
  currency: string;
  created_at: string;
};

type DateWindow = { start: number | null; end: number };

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: DASHBOARD_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const chartDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: DASHBOARD_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
});

function toSafeAmount(value: number | string) {
  const amount = Number(value);
  return Number.isSafeInteger(amount) && amount >= 0 ? amount : 0;
}

function toTimestamp(value: string | null) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : null;
}

function getDateKey(value: Date | string) {
  return dateKeyFormatter.format(typeof value === "string" ? new Date(value) : value);
}

function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function startOfVietnamDay(dateKey: string) {
  return new Date(`${dateKey}T00:00:00+07:00`).getTime();
}

function getDateWindow(range: AdminDashboardRange, todayKey: string): DateWindow {
  const end = startOfVietnamDay(shiftDateKey(todayKey, 1));
  if (range === "all") return { start: null, end };
  const days = range === "today" ? 1 : range === "7d" ? 7 : 30;
  return { start: startOfVietnamDay(shiftDateKey(todayKey, -(days - 1))), end };
}

function isInsideWindow(timestamp: number | null, window: DateWindow) {
  return timestamp !== null && timestamp < window.end && (window.start === null || timestamp >= window.start);
}

function isConfirmedPaidOrder(order: DashboardOrderRow) {
  return order.status === "completed"
    && order.payment_status === "paid"
    && toTimestamp(order.paid_at) !== null
    && toTimestamp(order.confirmed_at) !== null;
}

function isPendingOrder(order: DashboardOrderRow, now: number) {
  if (order.status !== "pending") return false;
  if (order.payment_status === "pending_confirmation") return true;
  return order.payment_status === "unpaid" && (toTimestamp(order.expires_at) ?? 0) > now;
}

function isExpiredOrIncompleteOrder(order: DashboardOrderRow, now: number) {
  return order.status === "cancelled"
    || order.payment_status === "refunded"
    || (order.status === "pending"
      && order.payment_status === "unpaid"
      && (toTimestamp(order.expires_at) ?? 0) <= now);
}

async function loadAllOrders(supabase: Awaited<ReturnType<typeof createClient>>) {
  const rows: DashboardOrderRow[] = [];
  for (let from = 0; ; from += QUERY_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_code, customer_name_snapshot, customer_email_snapshot, status, payment_status, total, currency, expires_at, paid_at, confirmed_at, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + QUERY_PAGE_SIZE - 1);
    if (error) throw new Error(`Không thể tải dữ liệu đơn hàng cho Dashboard: ${error.message}`);
    const page = (data ?? []) as DashboardOrderRow[];
    rows.push(...page);
    if (page.length < QUERY_PAGE_SIZE) break;
  }
  return rows;
}

async function loadAllOrderItems(supabase: Awaited<ReturnType<typeof createClient>>) {
  const rows: DashboardOrderItemRow[] = [];
  for (let from = 0; ; from += QUERY_PAGE_SIZE) {
    const { data, error } = await supabase
      .from("order_items")
      .select("order_id, product_id, product_title_snapshot, product_slug_snapshot, quantity, line_total, currency, created_at")
      .order("created_at", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + QUERY_PAGE_SIZE - 1);
    if (error) throw new Error(`Không thể tải snapshot sản phẩm cho Dashboard: ${error.message}`);
    const page = (data ?? []) as DashboardOrderItemRow[];
    rows.push(...page);
    if (page.length < QUERY_PAGE_SIZE) break;
  }
  return rows;
}

function sumRevenue(orders: readonly DashboardOrderRow[], window?: DateWindow) {
  return orders.reduce((sum, order) => {
    if (!isConfirmedPaidOrder(order)) return sum;
    if (window && !isInsideWindow(toTimestamp(order.paid_at), window)) return sum;
    return sum + toSafeAmount(order.total);
  }, 0);
}

function buildChart(orders: readonly DashboardOrderRow[], range: AdminDashboardRange, todayKey: string) {
  const paidOrders = orders.filter(isConfirmedPaidOrder);
  let firstDateKey = todayKey;
  if (range === "7d") firstDateKey = shiftDateKey(todayKey, -6);
  else if (range === "30d") firstDateKey = shiftDateKey(todayKey, -29);
  else if (range === "all") {
    const firstPaidTimestamp = paidOrders
      .map((order) => toTimestamp(order.paid_at))
      .filter((value): value is number => value !== null)
      .sort((a, b) => a - b)[0];
    if (firstPaidTimestamp !== undefined) firstDateKey = getDateKey(new Date(firstPaidTimestamp));
  }

  const daily = new Map<string, { revenue: number; paidOrderCount: number }>();
  for (const order of paidOrders) {
    if (!order.paid_at) continue;
    const date = getDateKey(order.paid_at);
    const current = daily.get(date) ?? { revenue: 0, paidOrderCount: 0 };
    current.revenue += toSafeAmount(order.total);
    current.paidOrderCount += 1;
    daily.set(date, current);
  }

  const result: AdminDashboardDailyRevenue[] = [];
  for (let date = firstDateKey; date <= todayKey; date = shiftDateKey(date, 1)) {
    const value = daily.get(date) ?? { revenue: 0, paidOrderCount: 0 };
    result.push({ date, label: chartDateFormatter.format(new Date(`${date}T12:00:00+07:00`)), revenue: value.revenue, paidOrderCount: value.paidOrderCount });
  }
  return result;
}

function buildTopProducts(items: readonly DashboardOrderItemRow[], paidOrderIds: ReadonlySet<string>) {
  const products = new Map<string, { title: string; slug: string; quantitySold: number; orders: Set<string>; revenue: number; currency: string }>();
  for (const item of items) {
    if (!paidOrderIds.has(item.order_id)) continue;
    const key = item.product_id ?? `snapshot:${item.product_slug_snapshot}`;
    const product = products.get(key) ?? { title: item.product_title_snapshot, slug: item.product_slug_snapshot, quantitySold: 0, orders: new Set<string>(), revenue: 0, currency: item.currency };
    product.quantitySold += item.quantity;
    product.orders.add(item.order_id);
    product.revenue += toSafeAmount(item.line_total);
    products.set(key, product);
  }
  return Array.from(products.entries())
    .map(([key, product]): AdminDashboardProduct => ({ key, title: product.title, slug: product.slug, quantitySold: product.quantitySold, orderCount: product.orders.size, revenue: product.revenue, averageOrderValue: product.orders.size ? Math.round(product.revenue / product.orders.size) : 0, currency: product.currency }))
    .sort((a, b) => b.revenue - a.revenue || b.quantitySold - a.quantitySold || a.title.localeCompare(b.title, "vi"))
    .slice(0, TOP_PRODUCT_LIMIT);
}

export async function getAdminDashboardData(range: AdminDashboardRange): Promise<AdminDashboardData> {
  await requireAdminRole("/admin");
  const supabase = await createClient();
  const [orders, orderItems] = await Promise.all([loadAllOrders(supabase), loadAllOrderItems(supabase)]);
  const now = new Date();
  const nowTimestamp = now.getTime();
  const todayKey = getDateKey(now);
  const selectedWindow = getDateWindow(range, todayKey);
  const todayWindow = getDateWindow("today", todayKey);
  const sevenDayWindow = getDateWindow("7d", todayKey);
  const thirtyDayWindow = getDateWindow("30d", todayKey);
  const selectedOrders = orders.filter((order) => isInsideWindow(toTimestamp(order.created_at), selectedWindow));
  const selectedPaidOrders = orders.filter((order) => isConfirmedPaidOrder(order) && isInsideWindow(toTimestamp(order.paid_at), selectedWindow));
  const selectedPaidOrderIds = new Set(selectedPaidOrders.map((order) => order.id));
  const rangeLabel = adminDashboardRanges.find((item) => item.value === range)?.label ?? "30 ngày";

  return {
    range,
    rangeLabel,
    generatedAt: now.toISOString(),
    allTimeRevenue: sumRevenue(orders),
    todayRevenue: sumRevenue(orders, todayWindow),
    last7DaysRevenue: sumRevenue(orders, sevenDayWindow),
    last30DaysRevenue: sumRevenue(orders, thirtyDayWindow),
    filteredRevenue: sumRevenue(orders, selectedWindow),
    totalOrders: selectedOrders.length,
    paidOrders: selectedPaidOrders.length,
    pendingOrders: selectedOrders.filter((order) => isPendingOrder(order, nowTimestamp)).length,
    expiredOrIncompleteOrders: selectedOrders.filter((order) => isExpiredOrIncompleteOrder(order, nowTimestamp)).length,
    chart: buildChart(orders, range, todayKey),
    topProducts: buildTopProducts(orderItems, selectedPaidOrderIds),
    latestOrders: orders.slice(0, RECENT_ORDER_LIMIT).map((order) => ({ id: order.id, orderCode: order.order_code, customerName: order.customer_name_snapshot?.trim() ?? "", customerEmail: order.customer_email_snapshot, total: toSafeAmount(order.total), currency: order.currency, status: order.status, paymentStatus: order.payment_status, expiresAt: order.expires_at, createdAt: order.created_at })),
  };
}
