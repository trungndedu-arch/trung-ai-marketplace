import { isCartProductId } from "@/lib/cart";
import { createClient } from "@/lib/supabase/server";

export type CheckoutOrder = {
  id: string;
  orderCode: string;
  paymentReference: string;
  status: "pending" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "pending_confirmation" | "paid" | "refunded";
  total: number;
  currency: string;
  bankName: string;
  bankBin: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  paymentInstructions: string;
  supportZaloPhone: string | null;
  expiresAt: string;
};

type CheckoutOrderRow = {
  id: string;
  order_code: string;
  payment_reference: string;
  status: CheckoutOrder["status"];
  payment_status: CheckoutOrder["paymentStatus"];
  total: number | string;
  currency: string;
  bank_name_snapshot: string;
  bank_bin_snapshot: string;
  bank_account_number_snapshot: string;
  bank_account_holder_snapshot: string;
  payment_instructions_snapshot: string;
  support_zalo_phone_snapshot: string | null;
  expires_at: string;
};

export async function getCheckoutOrderForCurrentUser(orderId: string) {
  if (!isCartProductId(orderId)) return { status: "not-found" as const };

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return { status: "auth-required" as const };

  const { data, error } = await supabase
    .from("orders")
    .select("id, order_code, payment_reference, status, payment_status, total, currency, bank_name_snapshot, bank_bin_snapshot, bank_account_number_snapshot, bank_account_holder_snapshot, payment_instructions_snapshot, support_zalo_phone_snapshot, expires_at")
    .eq("id", orderId)
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (error) {
    console.error("Unable to load checkout order:", { code: error.code, message: error.message });
    return { status: "error" as const, userEmail: authData.user.email ?? "" };
  }
  if (!data) return { status: "not-found" as const, userEmail: authData.user.email ?? "" };

  const row = data as CheckoutOrderRow;
  const total = Number(row.total);
  const validPaymentSnapshot = /^[0-9]{6}$/.test(row.bank_bin_snapshot)
    && row.bank_name_snapshot.trim().length > 0
    && row.bank_account_number_snapshot.trim().length > 0
    && row.bank_account_holder_snapshot.trim().length > 0
    && row.payment_reference.trim().length > 0;
  if (!Number.isSafeInteger(total) || total <= 0 || !validPaymentSnapshot) {
    return { status: "error" as const, userEmail: authData.user.email ?? "" };
  }

  return {
    status: "success" as const,
    userEmail: authData.user.email ?? "",
    order: {
      id: row.id,
      orderCode: row.order_code,
      paymentReference: row.payment_reference,
      status: row.status,
      paymentStatus: row.payment_status,
      total,
      currency: row.currency,
      bankName: row.bank_name_snapshot,
      bankBin: row.bank_bin_snapshot,
      bankAccountNumber: row.bank_account_number_snapshot,
      bankAccountHolder: row.bank_account_holder_snapshot,
      paymentInstructions: row.payment_instructions_snapshot,
      supportZaloPhone: row.support_zalo_phone_snapshot,
      expiresAt: row.expires_at,
    } satisfies CheckoutOrder,
  };
}
