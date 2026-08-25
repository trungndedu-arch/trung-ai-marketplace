"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminOrderId } from "@/lib/admin/orders";
import { requireAdminRole } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export type ConfirmOrderPaymentState = {
  status: "idle" | "error";
  code: string;
  message: string;
};

type ConfirmOrderPaymentRow = {
  order_id: string;
  order_code: string;
  order_status: "completed";
  payment_status: "paid";
  confirmed_at: string;
  entitlement_count: number | string;
  already_confirmed: boolean;
};

const confirmPaymentErrorMessages: Record<string, string> = {
  P2001: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
  P2002: "Bạn không có quyền xác nhận thanh toán.",
  P2003: "Không tìm thấy đơn hàng.",
  P2004: "Đơn hàng đã bị hủy.",
  P2005: "Đơn hàng đã được hoàn tiền.",
  P2006: "Đơn hàng đã hết hạn và chưa được báo thanh toán.",
  P2007: "Đơn hàng không có sản phẩm nên chưa thể xác nhận thanh toán.",
  P2008: "Có sản phẩm trong đơn hàng không còn tồn tại. Thanh toán chưa được xác nhận.",
  P2009: "Tài khoản khách hàng không còn hợp lệ để cấp quyền sản phẩm.",
  P2010: "Quyền sở hữu sản phẩm của đơn hàng không nhất quán. Chưa có thay đổi nào được thực hiện.",
  P2011: "Trạng thái đơn hàng không hợp lệ để xác nhận thanh toán.",
  P2099: "Không thể xác nhận thanh toán lúc này. Vui lòng thử lại.",
};

function errorState(code: string): ConfirmOrderPaymentState {
  return {
    status: "error",
    code,
    message: confirmPaymentErrorMessages[code] ?? confirmPaymentErrorMessages.P2099,
  };
}

function getOrderId(formData: FormData) {
  const value = formData.get("orderId");
  return typeof value === "string" ? value.trim() : "";
}

function normalizeRpcRow(data: unknown, expectedOrderId: string): ConfirmOrderPaymentRow | null {
  const value = Array.isArray(data) ? data[0] : data;
  if (!value || typeof value !== "object") return null;

  const row = value as Partial<ConfirmOrderPaymentRow>;
  const entitlementCount = Number(row.entitlement_count);
  if (
    row.order_id !== expectedOrderId
    || typeof row.order_code !== "string"
    || row.order_code.length === 0
    || row.order_status !== "completed"
    || row.payment_status !== "paid"
    || typeof row.confirmed_at !== "string"
    || !Number.isSafeInteger(entitlementCount)
    || entitlementCount <= 0
    || typeof row.already_confirmed !== "boolean"
  ) return null;

  return {
    order_id: row.order_id,
    order_code: row.order_code,
    order_status: row.order_status,
    payment_status: row.payment_status,
    confirmed_at: row.confirmed_at,
    entitlement_count: entitlementCount,
    already_confirmed: row.already_confirmed,
  };
}

export async function confirmOrderPaymentAction(
  _previousState: ConfirmOrderPaymentState,
  formData: FormData,
): Promise<ConfirmOrderPaymentState> {
  await requireAdminRole("/admin/orders");

  const orderId = getOrderId(formData);
  if (!isAdminOrderId(orderId)) return errorState("P2003");

  let rpcData: unknown = null;
  let rpcError: { code?: string; message?: string } | null = null;

  try {
    const supabase = await createClient();
    const response = await supabase.rpc("confirm_order_payment", { p_order_id: orderId });
    rpcData = response.data;
    rpcError = response.error;
  } catch (error) {
    console.error("[admin/orders] confirm_order_payment RPC threw unexpectedly:", error);
    return errorState("P2099");
  }

  if (rpcError) {
    const code = typeof rpcError.code === "string" ? rpcError.code : "P2099";
    if (!confirmPaymentErrorMessages[code] || code === "P2099") {
      console.error("[admin/orders] confirm_order_payment RPC failed:", {
        code,
        message: rpcError.message,
      });
    }
    return errorState(code);
  }

  const result = normalizeRpcRow(rpcData, orderId);
  if (!result) {
    console.error("[admin/orders] confirm_order_payment returned an invalid contract.");
    return errorState("P2099");
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/checkout/order/${orderId}`);

  const outcome = result.already_confirmed ? "already-confirmed" : "confirmed";
  redirect(`/admin/orders/${orderId}?result=${outcome}`);
}
