import { requireAdminRole } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export const ADMIN_ORDERS_PAGE_SIZE = 20;

export type OrderStatus = "pending" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "pending_confirmation" | "paid" | "refunded";

export type AdminOrderFilters = {
  search: string;
  orderStatus: OrderStatus | "all";
  paymentStatus: PaymentStatus | "all";
  page: number;
};

export type AdminOrderSummary = {
  id: string;
  orderCode: string;
  paymentReference: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  total: number | null;
  currency: string;
  expiresAt: string;
  createdAt: string;
  itemCount: number;
};

export type AdminOrderItem = {
  id: string;
  productId: string | null;
  productTitle: string;
  productSlug: string;
  productType: "chatbot" | "ai_app";
  quantity: number;
  basePrice: number | null;
  unitPrice: number | null;
  discountAmount: number | null;
  lineTotal: number | null;
  currency: string;
};

export type AdminOrderProfile = {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  status: "active" | "suspended" | "deleted";
} | null;

export type AdminOrderDetail = {
  id: string;
  orderCode: string;
  paymentReference: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: "bank_transfer";
  subtotal: number | null;
  discountTotal: number | null;
  total: number | null;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  bankName: string;
  bankBin: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  paymentInstructions: string;
  supportZaloPhone: string;
  expiresAt: string;
  paidAt: string | null;
  confirmedAt: string | null;
  confirmedBy: string | null;
  refundedAt: string | null;
  createdAt: string;
  updatedAt: string;
  profile: AdminOrderProfile;
  items: AdminOrderItem[];
};

export type AdminOrderListResult = {
  orders: AdminOrderSummary[];
  total: number;
  page: number;
  totalPages: number;
  error: string | null;
};

type OrderSummaryRow = {
  id: string;
  order_code: string;
  payment_reference: string;
  customer_name_snapshot: string | null;
  customer_email_snapshot: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number | string;
  currency: string;
  expires_at: string;
  created_at: string;
};

type OrderDetailRow = OrderSummaryRow & {
  user_id: string;
  payment_method: "bank_transfer";
  subtotal: number | string;
  discount_total: number | string;
  customer_phone_snapshot: string | null;
  bank_name_snapshot: string;
  bank_bin_snapshot: string;
  bank_account_number_snapshot: string;
  bank_account_holder_snapshot: string;
  payment_instructions_snapshot: string;
  support_zalo_phone_snapshot: string | null;
  paid_at: string | null;
  confirmed_at: string | null;
  confirmed_by: string | null;
  refunded_at: string | null;
  updated_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_title_snapshot: string;
  product_slug_snapshot: string;
  product_type_snapshot: "chatbot" | "ai_app";
  quantity: number;
  base_price: number | string;
  unit_price: number | string;
  discount_amount: number | string;
  line_total: number | string;
  currency: string;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  status: "active" | "suspended" | "deleted";
};

function toSafeNumber(value: number | string) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= 0 ? number : null;
}

function sanitizeSearch(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}@.+\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export function isAdminOrderId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getAdminOrders(filters: AdminOrderFilters): Promise<AdminOrderListResult> {
  await requireAdminRole("/admin/orders");

  const supabase = await createClient();
  const requestedPage = Math.max(1, filters.page);
  const from = (requestedPage - 1) * ADMIN_ORDERS_PAGE_SIZE;
  const to = from + ADMIN_ORDERS_PAGE_SIZE - 1;
  const search = sanitizeSearch(filters.search);
  let query = supabase
    .from("orders")
    .select("id, order_code, payment_reference, customer_name_snapshot, customer_email_snapshot, status, payment_status, total, currency, expires_at, created_at", { count: "exact" });

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(`order_code.ilike.${pattern},customer_email_snapshot.ilike.${pattern},customer_name_snapshot.ilike.${pattern}`);
  }
  if (filters.orderStatus !== "all") query = query.eq("status", filters.orderStatus);
  if (filters.paymentStatus !== "all") query = query.eq("payment_status", filters.paymentStatus);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[admin/orders] Unable to load order list:", error);
    return { orders: [], total: 0, page: requestedPage, totalPages: 0, error: "Không thể tải danh sách đơn hàng lúc này." };
  }

  const rows = (data ?? []) as OrderSummaryRow[];
  const itemCounts = new Map<string, number>();

  if (rows.length > 0) {
    const { data: itemRows, error: itemError } = await supabase
      .from("order_items")
      .select("order_id")
      .in("order_id", rows.map((order) => order.id));

    if (itemError) {
      console.error("[admin/orders] Unable to count order items:", itemError);
      return { orders: [], total: 0, page: requestedPage, totalPages: 0, error: "Không thể tải đầy đủ danh sách đơn hàng lúc này." };
    }

    for (const item of itemRows ?? []) {
      itemCounts.set(item.order_id, (itemCounts.get(item.order_id) ?? 0) + 1);
    }
  }

  const total = count ?? 0;
  return {
    orders: rows.map((row) => ({
      id: row.id,
      orderCode: row.order_code,
      paymentReference: row.payment_reference,
      customerName: row.customer_name_snapshot?.trim() ?? "",
      customerEmail: row.customer_email_snapshot,
      status: row.status,
      paymentStatus: row.payment_status,
      total: toSafeNumber(row.total),
      currency: row.currency,
      expiresAt: row.expires_at,
      createdAt: row.created_at,
      itemCount: itemCounts.get(row.id) ?? 0,
    })),
    total,
    page: requestedPage,
    totalPages: Math.ceil(total / ADMIN_ORDERS_PAGE_SIZE),
    error: null,
  };
}

export async function getAdminOrderById(id: string) {
  await requireAdminRole(`/admin/orders/${id}`);

  if (!isAdminOrderId(id)) return { order: null, error: null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_code, payment_reference, user_id, status, payment_status, payment_method, subtotal, discount_total, total, currency, customer_email_snapshot, customer_name_snapshot, customer_phone_snapshot, bank_name_snapshot, bank_bin_snapshot, bank_account_number_snapshot, bank_account_holder_snapshot, payment_instructions_snapshot, support_zalo_phone_snapshot, expires_at, paid_at, confirmed_at, confirmed_by, refunded_at, created_at, updated_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/orders] Unable to load order detail:", error);
    return { order: null, error: "Không thể tải chi tiết đơn hàng lúc này." };
  }
  if (!data) return { order: null, error: null };

  const row = data as OrderDetailRow;
  const [itemsResult, profileResult] = await Promise.all([
    supabase
      .from("order_items")
      .select("id, order_id, product_id, product_title_snapshot, product_slug_snapshot, product_type_snapshot, quantity, base_price, unit_price, discount_amount, line_total, currency")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("profiles")
      .select("id, email, full_name, phone, status")
      .eq("id", row.user_id)
      .maybeSingle(),
  ]);

  if (itemsResult.error) {
    console.error("[admin/orders] Unable to load order items:", itemsResult.error);
    return { order: null, error: "Không thể tải sản phẩm trong đơn hàng lúc này." };
  }
  if (profileResult.error) {
    console.error("[admin/orders] Unable to load customer profile:", profileResult.error);
  }

  const profileRow = profileResult.data as ProfileRow | null;
  const profile: AdminOrderProfile = profileRow ? {
    id: profileRow.id,
    email: profileRow.email,
    fullName: profileRow.full_name?.trim() ?? "",
    phone: profileRow.phone?.trim() ?? "",
    status: profileRow.status,
  } : null;

  const items = ((itemsResult.data ?? []) as OrderItemRow[]).map((item): AdminOrderItem => ({
    id: item.id,
    productId: item.product_id,
    productTitle: item.product_title_snapshot,
    productSlug: item.product_slug_snapshot,
    productType: item.product_type_snapshot,
    quantity: item.quantity,
    basePrice: toSafeNumber(item.base_price),
    unitPrice: toSafeNumber(item.unit_price),
    discountAmount: toSafeNumber(item.discount_amount),
    lineTotal: toSafeNumber(item.line_total),
    currency: item.currency,
  }));

  return {
    order: {
      id: row.id,
      orderCode: row.order_code,
      paymentReference: row.payment_reference,
      userId: row.user_id,
      status: row.status,
      paymentStatus: row.payment_status,
      paymentMethod: row.payment_method,
      subtotal: toSafeNumber(row.subtotal),
      discountTotal: toSafeNumber(row.discount_total),
      total: toSafeNumber(row.total),
      currency: row.currency,
      customerEmail: row.customer_email_snapshot,
      customerName: row.customer_name_snapshot?.trim() ?? "",
      customerPhone: row.customer_phone_snapshot?.trim() ?? "",
      bankName: row.bank_name_snapshot,
      bankBin: row.bank_bin_snapshot,
      bankAccountNumber: row.bank_account_number_snapshot,
      bankAccountHolder: row.bank_account_holder_snapshot,
      paymentInstructions: row.payment_instructions_snapshot,
      supportZaloPhone: row.support_zalo_phone_snapshot?.trim() ?? "",
      expiresAt: row.expires_at,
      paidAt: row.paid_at,
      confirmedAt: row.confirmed_at,
      confirmedBy: row.confirmed_by,
      refundedAt: row.refunded_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      profile,
      items,
    } satisfies AdminOrderDetail,
    error: null,
  };
}
