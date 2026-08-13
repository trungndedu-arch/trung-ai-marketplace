"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  categoryDatabaseErrorMessage,
  toCategoryDatabaseFields,
  validateCategoryFormData,
  type CategoryMutationState,
} from "@/lib/admin/category-validation";
import { stringField } from "@/lib/admin/product-validation";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

function revalidateCategoryRoutes(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/categories/new");
  if (id) revalidatePath(`/admin/categories/${id}/edit`);
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/new");
  revalidatePath("/");
  revalidatePath("/workflow");
  revalidatePath("/cong-cu-ai");
  revalidatePath("/video-ai-course");
}

async function findDuplicateSlug(supabase: ServerSupabaseClient, slug: string, excludedId?: string) {
  let query = supabase.from("categories").select("id").eq("slug", slug);
  if (excludedId) query = query.neq("id", excludedId);
  return query.maybeSingle();
}

export async function createCategory(_previousState: CategoryMutationState, formData: FormData): Promise<CategoryMutationState> {
  await requireAdminAccess("/admin/categories/new");
  const validation = validateCategoryFormData(formData);
  if (!validation.isValid) return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };

  const payload = toCategoryDatabaseFields(validation.values);
  if (!payload) return { status: "error", message: "Dữ liệu danh mục chưa hợp lệ.", fieldErrors: validation.fieldErrors };

  const supabase = await createClient();
  const { data: duplicate, error: duplicateError } = await findDuplicateSlug(supabase, payload.slug);
  if (duplicateError) {
    console.error("[admin/categories] Unable to validate category slug:", duplicateError);
    return { status: "error", message: "Không thể kiểm tra slug lúc này.", fieldErrors: {} };
  }
  if (duplicate) return { status: "error", message: "Slug danh mục này đã được sử dụng.", fieldErrors: { slug: "Hãy chọn một slug khác." } };

  const { data: created, error } = await supabase.from("categories").insert(payload).select("id").single();
  if (error) {
    console.error("[admin/categories] Category create rejected:", error);
    return { status: "error", message: categoryDatabaseErrorMessage(error, "create"), fieldErrors: {} };
  }

  revalidateCategoryRoutes(created.id);
  redirect("/admin/categories?created=1");
}

export async function updateCategory(_previousState: CategoryMutationState, formData: FormData): Promise<CategoryMutationState> {
  const id = stringField(formData, "id");
  await requireAdminAccess(id ? `/admin/categories/${id}/edit` : "/admin/categories");
  if (!id) return { status: "error", message: "Không xác định được danh mục cần cập nhật.", fieldErrors: {} };

  const validation = validateCategoryFormData(formData);
  if (!validation.isValid) return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };

  const payload = toCategoryDatabaseFields(validation.values);
  if (!payload) return { status: "error", message: "Dữ liệu danh mục chưa hợp lệ.", fieldErrors: validation.fieldErrors };

  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from("categories")
    .select("id, product_type")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    console.error("[admin/categories] Unable to verify category before update:", existingError);
    return { status: "error", message: categoryDatabaseErrorMessage(existingError, "update"), fieldErrors: {} };
  }
  if (!existing) return { status: "error", message: "Danh mục không còn tồn tại.", fieldErrors: {} };

  if (existing.product_type !== payload.product_type) {
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      console.error("[admin/categories] Unable to verify category usage:", countError);
      return { status: "error", message: "Không thể kiểm tra sản phẩm đang dùng danh mục lúc này.", fieldErrors: {} };
    }
    if ((count ?? 0) > 0) {
      return {
        status: "error",
        message: "Không thể đổi loại sản phẩm vì danh mục đang được sử dụng.",
        fieldErrors: { productType: `Danh mục đang có ${count} sản phẩm.` },
      };
    }
  }

  const { data: duplicate, error: duplicateError } = await findDuplicateSlug(supabase, payload.slug, id);
  if (duplicateError) {
    console.error("[admin/categories] Unable to validate category slug:", duplicateError);
    return { status: "error", message: "Không thể kiểm tra slug lúc này.", fieldErrors: {} };
  }
  if (duplicate) return { status: "error", message: "Slug danh mục này đã được sử dụng.", fieldErrors: { slug: "Hãy chọn một slug khác." } };

  const { data: updated, error } = await supabase.from("categories").update(payload).eq("id", id).select("id").maybeSingle();
  if (error) {
    console.error("[admin/categories] Category update rejected:", error);
    return { status: "error", message: categoryDatabaseErrorMessage(error, "update"), fieldErrors: {} };
  }
  if (!updated) return { status: "error", message: "Danh mục không tồn tại hoặc bạn không có quyền cập nhật.", fieldErrors: {} };

  revalidateCategoryRoutes(id);
  redirect("/admin/categories?updated=1");
}
