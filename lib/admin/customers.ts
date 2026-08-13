import { requireAdminRole, type AppRole } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export const ADMIN_CUSTOMERS_PAGE_SIZE = 20;

export type ProfileStatus = "active" | "suspended" | "deleted";

export type AdminCustomerFilters = {
  search: string;
  page: number;
};

export type AdminCustomer = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  phone: string;
  status: ProfileStatus;
  roles: AppRole[];
  createdAt: string;
  updatedAt: string;
};

export type AdminCustomerListResult = {
  customers: AdminCustomer[];
  total: number;
  page: number;
  totalPages: number;
  error: string | null;
};

type RoleRow = { role: string };

type CustomerRow = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
  customer_roles: RoleRow[] | null;
  roles: RoleRow[] | null;
};

const customerSelect = `
  id,
  email,
  full_name,
  avatar_url,
  phone,
  status,
  created_at,
  updated_at,
  customer_roles:user_roles!user_roles_user_id_fkey!inner (
    role
  ),
  roles:user_roles!user_roles_user_id_fkey (
    role
  )
`;

function isAppRole(value: string): value is AppRole {
  return value === "customer" || value === "editor" || value === "admin";
}

function safeHttpUrl(value: string | null) {
  if (!value) return "";

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function normalizeCustomer(row: CustomerRow): AdminCustomer | null {
  const roles = Array.from(new Set((row.roles ?? []).map((item) => item.role).filter(isAppRole)));
  const isCustomer = roles.includes("customer")
    || (row.customer_roles ?? []).some((item) => item.role === "customer");

  if (!isCustomer) return null;

  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name?.trim() ?? "",
    avatarUrl: safeHttpUrl(row.avatar_url),
    phone: row.phone?.trim() ?? "",
    status: row.status,
    roles,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function sanitizeSearch(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}@.+\-\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100);
}

export async function getAdminCustomers(filters: AdminCustomerFilters): Promise<AdminCustomerListResult> {
  await requireAdminRole("/admin/customers");

  const supabase = await createClient();
  const requestedPage = Math.max(1, filters.page);
  const from = (requestedPage - 1) * ADMIN_CUSTOMERS_PAGE_SIZE;
  const to = from + ADMIN_CUSTOMERS_PAGE_SIZE - 1;
  const search = sanitizeSearch(filters.search);
  let query = supabase
    .from("profiles")
    .select(customerSelect, { count: "exact" })
    .eq("customer_roles.role", "customer");

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(`email.ilike.${pattern},full_name.ilike.${pattern},phone.ilike.${pattern}`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("[admin/customers] Unable to load customer list:", error);
    return {
      customers: [],
      total: 0,
      page: requestedPage,
      totalPages: 0,
      error: "Không thể tải danh sách khách hàng lúc này.",
    };
  }

  const total = count ?? 0;
  return {
    customers: ((data ?? []) as unknown as CustomerRow[]).flatMap((row) => {
      const customer = normalizeCustomer(row);
      return customer ? [customer] : [];
    }),
    total,
    page: requestedPage,
    totalPages: Math.ceil(total / ADMIN_CUSTOMERS_PAGE_SIZE),
    error: null,
  };
}

export async function getAdminCustomerById(id: string) {
  await requireAdminRole(`/admin/customers/${id}`);

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return { customer: null, error: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(customerSelect)
    .eq("id", id)
    .eq("customer_roles.role", "customer")
    .maybeSingle();

  if (error) {
    console.error("[admin/customers] Unable to load customer detail:", error);
    return { customer: null, error: "Không thể tải thông tin khách hàng lúc này." };
  }

  return {
    customer: data ? normalizeCustomer(data as unknown as CustomerRow) : null,
    error: null,
  };
}
