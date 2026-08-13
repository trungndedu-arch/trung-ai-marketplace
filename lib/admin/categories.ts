import { requireAdminAccess } from "@/lib/auth/admin";
import type { ProductType } from "@/lib/catalog/types";
import { createClient } from "@/lib/supabase/server";

export type AdminCategoryDetail = {
  id: string;
  legacyId: string;
  slug: string;
  name: string;
  description: string;
  productType: ProductType | null;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
  createdAt: string;
  updatedAt: string;
};

type ProductCountRelation = { count: number } | { count: number }[] | null;

type CategoryRow = {
  id: string;
  legacy_id: string | null;
  slug: string;
  name: string;
  description: string | null;
  product_type: ProductType | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  products: ProductCountRelation;
};

const adminCategorySelect = `
  id,
  legacy_id,
  slug,
  name,
  description,
  product_type,
  is_active,
  display_order,
  created_at,
  updated_at,
  products(count)
`;

function productCount(relation: ProductCountRelation) {
  const countRow = Array.isArray(relation) ? relation[0] : relation;
  return countRow && Number.isFinite(countRow.count) ? countRow.count : 0;
}

function normalizeCategory(row: CategoryRow): AdminCategoryDetail {
  return {
    id: row.id,
    legacyId: row.legacy_id ?? "",
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    productType: row.product_type,
    isActive: row.is_active,
    displayOrder: row.display_order,
    productCount: productCount(row.products),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getAdminCategoryList() {
  await requireAdminAccess("/admin/categories");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(adminCategorySelect)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("[admin/categories] Unable to load category list:", error);
    return { categories: [] as AdminCategoryDetail[], error: "Không thể tải danh sách danh mục lúc này." };
  }

  return { categories: ((data ?? []) as unknown as CategoryRow[]).map(normalizeCategory), error: null };
}

export async function getAdminCategoryById(id: string) {
  await requireAdminAccess(`/admin/categories/${id}/edit`);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select(adminCategorySelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[admin/categories] Unable to load category:", error);
    return { category: null, error: "Không thể tải danh mục lúc này." };
  }

  return { category: data ? normalizeCategory(data as unknown as CategoryRow) : null, error: null };
}
