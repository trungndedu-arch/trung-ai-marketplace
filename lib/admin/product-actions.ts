"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin";
import { revalidateAdminProductRoutes, revalidatePublicProductRoutes } from "@/lib/admin/product-revalidation";
import {
  parseProductType,
  productDatabaseErrorMessage,
  stringField,
  toProductDatabaseFields,
  validateProductFormData,
  type ProductMutationState,
} from "@/lib/admin/product-validation";
import { createClient } from "@/lib/supabase/server";
import type { ProductType } from "@/lib/catalog/types";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type ExistingProduct = {
  id: string;
  slug: string;
  product_type: ProductType;
  category_id: string | null;
  detail_url: string | null;
};

async function validateCategory(
  supabase: ServerSupabaseClient,
  categoryId: string,
  productType: ProductType,
  existingCategoryId: string | null = null,
) {
  if (!categoryId) return "";

  const { data: category, error } = await supabase
    .from("categories")
    .select("id, product_type, is_active")
    .eq("id", categoryId)
    .maybeSingle();

  if (error) {
    console.error("[admin/products] Unable to validate category:", error);
    return "Không thể xác minh danh mục lúc này.";
  }
  if (!category) return "Danh mục đã chọn không tồn tại.";
  if (!category.is_active && category.id !== existingCategoryId) return "Không thể chọn một danh mục đang tạm ẩn.";
  if (category.product_type && category.product_type !== productType) return "Danh mục không phù hợp với loại sản phẩm hiện tại.";
  return "";
}

async function findDuplicateSlug(supabase: ServerSupabaseClient, slug: string, excludedId?: string) {
  let query = supabase.from("products").select("id").eq("slug", slug);
  if (excludedId) query = query.neq("id", excludedId);
  return query.maybeSingle();
}

function revalidateUpdatedProductRoutes(productType: ProductType, oldSlug: string, newSlug: string, oldDetailUrl: string | null, newDetailUrl: string | null, id: string) {
  revalidateAdminProductRoutes(id);
  revalidatePublicProductRoutes(
    { productType, slug: oldSlug, detailUrl: oldDetailUrl },
    { productType, slug: newSlug, detailUrl: newDetailUrl },
  );
}

export async function updateProduct(_previousState: ProductMutationState, formData: FormData): Promise<ProductMutationState> {
  const id = stringField(formData, "id");
  await requireAdminAccess(id ? `/admin/products/${id}/edit` : "/admin/products");
  if (!id) return { status: "error", message: "Không xác định được sản phẩm cần cập nhật.", fieldErrors: {} };

  const supabase = await createClient();
  const { data: existingData, error: existingError } = await supabase
    .from("products")
    .select("id, slug, product_type, category_id, detail_url")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    console.error("[admin/products] Unable to verify product before update:", existingError);
    return { status: "error", message: productDatabaseErrorMessage(existingError, "update"), fieldErrors: {} };
  }
  if (!existingData) return { status: "error", message: "Sản phẩm không còn tồn tại.", fieldErrors: {} };

  const existing = existingData as ExistingProduct;
  const validation = validateProductFormData(formData, existing.product_type);
  const categoryError = await validateCategory(supabase, validation.values.categoryId, existing.product_type, existing.category_id);
  if (categoryError) validation.fieldErrors.categoryId = categoryError;

  if (!validation.isValid || Object.keys(validation.fieldErrors).length) {
    return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };
  }

  const payload = toProductDatabaseFields(validation.values);
  if (!payload) return { status: "error", message: "Dữ liệu sản phẩm chưa hợp lệ.", fieldErrors: validation.fieldErrors };

  const { data: duplicateSlug, error: duplicateError } = await findDuplicateSlug(supabase, payload.slug, id);
  if (duplicateError) {
    console.error("[admin/products] Unable to validate product slug:", duplicateError);
    return { status: "error", message: "Không thể kiểm tra slug lúc này.", fieldErrors: {} };
  }
  if (duplicateSlug) return { status: "error", message: "Slug này đã được sử dụng.", fieldErrors: { slug: "Hãy chọn một slug khác." } };

  const { data: updated, error: updateError } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("[admin/products] Product update rejected:", updateError);
    return { status: "error", message: productDatabaseErrorMessage(updateError, "update"), fieldErrors: {} };
  }
  if (!updated) return { status: "error", message: "Sản phẩm không tồn tại hoặc bạn không có quyền cập nhật.", fieldErrors: {} };

  revalidateUpdatedProductRoutes(existing.product_type, existing.slug, payload.slug, existing.detail_url, payload.detail_url, id);
  redirect(`/admin/products/${id}?updated=1`);
}

export async function createProduct(_previousState: ProductMutationState, formData: FormData): Promise<ProductMutationState> {
  await requireAdminAccess("/admin/products/new");

  const productType = parseProductType(stringField(formData, "productType"));
  if (!productType) return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors: { productType: "Loại sản phẩm không hợp lệ." } };

  const validation = validateProductFormData(formData, productType, "draft");
  const supabase = await createClient();
  const categoryError = await validateCategory(supabase, validation.values.categoryId, productType);
  if (categoryError) validation.fieldErrors.categoryId = categoryError;

  if (!validation.isValid || Object.keys(validation.fieldErrors).length) {
    return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };
  }

  const fields = toProductDatabaseFields(validation.values);
  if (!fields) return { status: "error", message: "Dữ liệu sản phẩm chưa hợp lệ.", fieldErrors: validation.fieldErrors };

  const { data: duplicateSlug, error: duplicateError } = await findDuplicateSlug(supabase, fields.slug);
  if (duplicateError) {
    console.error("[admin/products] Unable to validate new product slug:", duplicateError);
    return { status: "error", message: "Không thể kiểm tra slug lúc này.", fieldErrors: {} };
  }
  if (duplicateSlug) return { status: "error", message: "Slug này đã được sử dụng.", fieldErrors: { slug: "Hãy chọn một slug khác." } };

  const { data: created, error: createError } = await supabase
    .from("products")
    .insert({
      ...fields,
      product_type: productType,
      publication_status: "draft",
    })
    .select("id")
    .single();

  if (createError) {
    console.error("[admin/products] Product create rejected:", createError);
    return { status: "error", message: productDatabaseErrorMessage(createError, "create"), fieldErrors: {} };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  redirect(`/admin/products/${created.id}?created=1`);
}
