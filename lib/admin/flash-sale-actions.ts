"use server";

import { redirect } from "next/navigation";
import { revalidateFlashSaleRoutes } from "@/lib/admin/flash-sale-revalidation";
import {
  flashSaleDatabaseErrorMessage,
  isDatabaseUuid,
  isFlashSaleId,
  toFlashSaleDatabaseFields,
  validateFlashSaleFormData,
  type FlashSaleMutationState,
} from "@/lib/admin/flash-sale-validation";
import { stringField } from "@/lib/admin/product-validation";
import { requireAdminAccess } from "@/lib/auth/admin";
import { isFlashSaleEligibleProduct } from "@/lib/catalog/product-state";
import type { AccessType, FlashSaleStatus, ProductType, PublicationStatus, SalesStatus } from "@/lib/catalog/types";
import { createClient } from "@/lib/supabase/server";

type ServerSupabaseClient = Awaited<ReturnType<typeof createClient>>;

type ProductForFlashSale = {
  id: string;
  title: string;
  slug: string;
  product_type: ProductType;
  price: number | string | null;
  access_type: AccessType;
  sales_status: SalesStatus;
  publication_status: PublicationStatus;
  sellable: boolean;
  detail_url: string | null;
};

type ExistingFlashSale = {
  id: string;
  product_id: string;
  updated_at: string;
};

async function loadEligibleProduct(supabase: ServerSupabaseClient, productId: string) {
  if (!isDatabaseUuid(productId)) return { product: null, error: "Sản phẩm được chọn không hợp lệ." };
  const { data, error } = await supabase
    .from("products")
    .select("id, title, slug, product_type, price, access_type, sales_status, publication_status, sellable, detail_url")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    console.error("[admin/flash-sales] Unable to validate product:", error);
    return { product: null, error: "Không thể xác minh sản phẩm lúc này." };
  }
  if (!data) return { product: null, error: "Sản phẩm được chọn không còn tồn tại." };

  const row = data as ProductForFlashSale;
  const price = row.price === null ? null : Number(row.price);
  const product = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    productType: row.product_type,
    price: Number.isFinite(price) ? price : null,
    accessType: row.access_type,
    salesStatus: row.sales_status,
    publicationStatus: row.publication_status,
    sellable: row.sellable,
    detailUrl: row.detail_url,
  };
  if (!isFlashSaleEligibleProduct(product)) {
    return { product: null, error: "Sản phẩm không còn đủ điều kiện áp dụng Flash Sale." };
  }
  return { product, error: "" };
}

async function findOverlappingFlashSale({
  supabase,
  productId,
  status,
  startAt,
  endAt,
  excludedId,
}: {
  supabase: ServerSupabaseClient;
  productId: string;
  status: FlashSaleStatus;
  startAt: string;
  endAt: string;
  excludedId?: string;
}) {
  if (status !== "scheduled" && status !== "active") return { overlap: false, error: false };
  let query = supabase
    .from("flash_sales")
    .select("id")
    .eq("product_id", productId)
    .in("status", ["scheduled", "active"])
    .lt("start_at", endAt)
    .gt("end_at", startAt)
    .limit(1);
  if (excludedId) query = query.neq("id", excludedId);
  const { data, error } = await query;
  if (error) console.error("[admin/flash-sales] Unable to validate schedule overlap:", error);
  return { overlap: Boolean(data?.length), error: Boolean(error) };
}

function validationError(fieldErrors: FlashSaleMutationState["fieldErrors"]): FlashSaleMutationState {
  return { status: "error", message: "Vui lòng kiểm tra lại các trường được đánh dấu.", fieldErrors };
}

export async function createFlashSale(
  _previousState: FlashSaleMutationState,
  formData: FormData,
): Promise<FlashSaleMutationState> {
  await requireAdminAccess("/admin/flash-sales/new");
  const validation = validateFlashSaleFormData(formData);
  if (!validation.isValid) return validationError(validation.fieldErrors);
  const fields = toFlashSaleDatabaseFields(validation.values);
  if (!fields) return validationError(validation.fieldErrors);

  const supabase = await createClient();
  const productResult = await loadEligibleProduct(supabase, fields.product_id);
  if (!productResult.product) return { status: "error", message: productResult.error, fieldErrors: { productId: productResult.error } };
  if (fields.sale_price >= productResult.product.price!) {
    return { status: "error", message: "Giá Flash Sale chưa hợp lệ.", fieldErrors: { salePrice: "Giá Flash Sale phải thấp hơn giá bán hiện tại của sản phẩm." } };
  }

  const overlap = await findOverlappingFlashSale({
    supabase,
    productId: fields.product_id,
    status: fields.status,
    startAt: fields.start_at,
    endAt: fields.end_at,
  });
  if (overlap.error) return { status: "error", message: "Không thể kiểm tra lịch Flash Sale lúc này.", fieldErrors: {} };
  if (overlap.overlap) return { status: "error", message: "Lịch Flash Sale bị trùng.", fieldErrors: { schedule: "Khoảng thời gian này trùng với một Flash Sale đang hoạt động hoặc đã lên lịch." } };

  const { data: created, error } = await supabase.from("flash_sales").insert(fields).select("id").single();
  if (error) {
    console.error("[admin/flash-sales] Flash Sale create rejected:", error);
    return { status: "error", message: flashSaleDatabaseErrorMessage(error, "create"), fieldErrors: {} };
  }

  revalidateFlashSaleRoutes(created.id, productResult.product);
  redirect(`/admin/flash-sales/${created.id}/edit?created=1`);
}

export async function updateFlashSale(
  _previousState: FlashSaleMutationState,
  formData: FormData,
): Promise<FlashSaleMutationState> {
  const id = stringField(formData, "id");
  await requireAdminAccess(id ? `/admin/flash-sales/${id}/edit` : "/admin/flash-sales");
  if (!isFlashSaleId(id)) return { status: "error", message: "Không xác định được Flash Sale cần cập nhật.", fieldErrors: {} };

  const supabase = await createClient();
  const { data: existingData, error: existingError } = await supabase
    .from("flash_sales")
    .select("id, product_id, updated_at")
    .eq("id", id)
    .maybeSingle();
  if (existingError) {
    console.error("[admin/flash-sales] Unable to verify Flash Sale before update:", existingError);
    return { status: "error", message: flashSaleDatabaseErrorMessage(existingError, "update"), fieldErrors: {} };
  }
  if (!existingData) return { status: "error", message: "Flash Sale không còn tồn tại.", fieldErrors: {} };
  const existing = existingData as ExistingFlashSale;

  const validation = validateFlashSaleFormData(formData, existing.product_id);
  if (!validation.isValid) return validationError(validation.fieldErrors);
  const fields = toFlashSaleDatabaseFields(validation.values);
  if (!fields) return validationError(validation.fieldErrors);

  const productResult = await loadEligibleProduct(supabase, existing.product_id);
  if (!productResult.product) return { status: "error", message: productResult.error, fieldErrors: { productId: productResult.error } };
  if (fields.sale_price >= productResult.product.price!) {
    return { status: "error", message: "Giá Flash Sale chưa hợp lệ.", fieldErrors: { salePrice: "Giá Flash Sale phải thấp hơn giá bán hiện tại của sản phẩm." } };
  }

  const overlap = await findOverlappingFlashSale({
    supabase,
    productId: existing.product_id,
    status: fields.status,
    startAt: fields.start_at,
    endAt: fields.end_at,
    excludedId: id,
  });
  if (overlap.error) return { status: "error", message: "Không thể kiểm tra lịch Flash Sale lúc này.", fieldErrors: {} };
  if (overlap.overlap) return { status: "error", message: "Lịch Flash Sale bị trùng.", fieldErrors: { schedule: "Khoảng thời gian này trùng với một Flash Sale đang hoạt động hoặc đã lên lịch." } };

  const { data: updated, error } = await supabase
    .from("flash_sales")
    .update({
      sale_price: fields.sale_price,
      status: fields.status,
      start_at: fields.start_at,
      end_at: fields.end_at,
    })
    .eq("id", id)
    .eq("updated_at", existing.updated_at)
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("[admin/flash-sales] Flash Sale update rejected:", error);
    return { status: "error", message: flashSaleDatabaseErrorMessage(error, "update"), fieldErrors: {} };
  }
  if (!updated) return { status: "error", message: "Flash Sale vừa được thay đổi ở nơi khác. Hãy tải lại trang rồi thử lại.", fieldErrors: {} };

  revalidateFlashSaleRoutes(id, productResult.product);
  redirect(`/admin/flash-sales/${id}/edit?updated=1`);
}
