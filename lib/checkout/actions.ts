"use server";

import { CART_MAX_ITEMS, isCartProductId } from "@/lib/cart";
import { findRecoverablePendingOrderForProducts } from "@/lib/checkout/orders";
import { createClient } from "@/lib/supabase/server";

export type CheckoutOrderActionResult =
  | { status: "success"; orderId: string }
  | { status: "existing-order"; orderId: string }
  | { status: "error"; code: string; message: string };

const checkoutErrorMessages: Record<string, string> = {
  P1001: "Vui lòng đăng nhập trước khi thanh toán.",
  P1002: "Hồ sơ tài khoản chưa hợp lệ để tạo đơn hàng.",
  P1003: "Giỏ hàng đang trống hoặc dữ liệu giỏ hàng không hợp lệ.",
  P1004: `Mỗi đơn hàng chỉ được chứa tối đa ${CART_MAX_ITEMS} sản phẩm.`,
  P1005: "Giỏ hàng chứa mã sản phẩm không hợp lệ.",
  P1006: "Giỏ hàng đang chứa sản phẩm trùng lặp.",
  P1007: "Thông tin chuyển khoản đang được cập nhật. Vui lòng thử lại sau.",
  P1008: "Có sản phẩm không còn tồn tại. Vui lòng cập nhật giỏ hàng.",
  P1009: "Có sản phẩm không còn được bán. Vui lòng cập nhật giỏ hàng.",
  P1010: "Bạn đã sở hữu sản phẩm này.",
  P1011: "Bạn đã có đơn hàng đang chờ thanh toán cho sản phẩm này.",
  P1012: "Giá Flash Sale hiện không hợp lệ. Vui lòng thử lại sau.",
  P1013: "Các sản phẩm trong giỏ hàng không dùng cùng loại tiền tệ.",
  P1014: "Không thể xác nhận tổng tiền đơn hàng. Vui lòng thử lại.",
  P1015: "Không thể tạo mã đơn hàng lúc này. Vui lòng thử lại.",
  P1099: "Hệ thống chưa thể tạo đơn hàng. Vui lòng thử lại sau.",
};

function errorResult(code: string): CheckoutOrderActionResult {
  return { status: "error", code, message: checkoutErrorMessages[code] ?? checkoutErrorMessages.P1099 };
}

export async function createCheckoutOrder(input: unknown): Promise<CheckoutOrderActionResult> {
  if (!Array.isArray(input) || input.length === 0) return errorResult("P1003");
  if (input.length > CART_MAX_ITEMS) return errorResult("P1004");
  if (!input.every(isCartProductId)) return errorResult("P1005");

  const productIds = input as string[];
  if (new Set(productIds).size !== productIds.length) return errorResult("P1006");

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return errorResult("P1001");

  const { data, error } = await supabase.rpc("create_order", { p_product_ids: productIds });
  if (error) {
    const code = typeof error.code === "string" ? error.code : "P1099";
    if (code === "P1011") {
      const existingOrderId = await findRecoverablePendingOrderForProducts(
        supabase,
        authData.user.id,
        productIds,
      );
      if (existingOrderId) return { status: "existing-order", orderId: existingOrderId };
    }
    if (code === "P1099" || !checkoutErrorMessages[code]) console.error("create_order RPC failed:", { code, message: error.message });
    return errorResult(code);
  }

  const row = Array.isArray(data) ? data[0] : data;
  const orderId = row && typeof row === "object" && "order_id" in row ? row.order_id : null;
  if (!isCartProductId(orderId)) {
    console.error("create_order RPC returned an invalid order identifier.");
    return errorResult("P1099");
  }

  return { status: "success", orderId };
}
