import { parseProductType, stringField } from "@/lib/admin/product-validation";
import type { ProductType } from "@/lib/catalog/types";

export type EditableCategoryField = "name" | "slug" | "description" | "productType" | "displayOrder" | "isActive";

export type CategoryMutationState = {
  status: "idle" | "error";
  message: string;
  fieldErrors: Partial<Record<EditableCategoryField, string>>;
};

export type CategoryMutationValues = {
  name: string;
  slug: string;
  description: string;
  productType: ProductType | null;
  displayOrder: number | null;
  isActive: boolean;
};

export type CategoryDatabaseFields = {
  name: string;
  slug: string;
  description: string | null;
  product_type: ProductType | null;
  display_order: number;
  is_active: boolean;
};

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("vi")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseDisplayOrder(value: string) {
  if (!/^-?\d+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number >= -999_999 && number <= 999_999 ? number : null;
}

export function validateCategoryFormData(formData: FormData) {
  const name = stringField(formData, "name");
  const slug = normalizeSlug(stringField(formData, "slug"));
  const description = stringField(formData, "description");
  const rawProductType = stringField(formData, "productType");
  const productType = rawProductType ? parseProductType(rawProductType) : null;
  const displayOrder = parseDisplayOrder(stringField(formData, "displayOrder"));
  const isActive = formData.get("isActive") === "on";
  const fieldErrors: CategoryMutationState["fieldErrors"] = {};

  if (!name) fieldErrors.name = "Tên danh mục không được để trống.";
  else if (name.length > 120) fieldErrors.name = "Tên danh mục không được vượt quá 120 ký tự.";
  if (!slug) fieldErrors.slug = "Slug không được để trống.";
  else if (slug.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fieldErrors.slug = "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang.";
  if (description.length > 1_000) fieldErrors.description = "Mô tả không được vượt quá 1.000 ký tự.";
  if (rawProductType && !productType) fieldErrors.productType = "Loại sản phẩm không hợp lệ.";
  if (displayOrder === null) fieldErrors.displayOrder = "Thứ tự hiển thị phải là số nguyên hợp lệ.";

  const values: CategoryMutationValues = { name, slug, description, productType, displayOrder, isActive };
  return { values, fieldErrors, isValid: Object.keys(fieldErrors).length === 0 && displayOrder !== null };
}

export function toCategoryDatabaseFields(values: CategoryMutationValues): CategoryDatabaseFields | null {
  if (values.displayOrder === null) return null;
  return {
    name: values.name,
    slug: values.slug,
    description: values.description || null,
    product_type: values.productType,
    display_order: values.displayOrder,
    is_active: values.isActive,
  };
}

export function categoryDatabaseErrorMessage(error: { code?: string; message?: string }, operation: "create" | "update") {
  const message = error.message?.toLowerCase() ?? "";
  if (error.code === "23505" || message.includes("categories_slug_key")) return "Slug danh mục này đã được sử dụng.";
  if (error.code === "42501" || message.includes("permission denied") || message.includes("row-level security")) {
    return operation === "create" ? "Bạn không có quyền tạo danh mục." : "Bạn không có quyền cập nhật danh mục này.";
  }
  return operation === "create" ? "Không thể tạo danh mục lúc này. Vui lòng thử lại." : "Không thể cập nhật danh mục lúc này. Vui lòng thử lại.";
}
