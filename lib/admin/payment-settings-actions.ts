"use server";

import { revalidatePath } from "next/cache";
import { PAYMENT_SETTING_DEFINITIONS } from "@/lib/admin/payment-settings";
import {
  validatePaymentSettingsFormData,
  type PaymentSettingsMutationState,
} from "@/lib/admin/payment-settings-validation";
import { requireAdminRole } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

const definitionByKey = new Map(PAYMENT_SETTING_DEFINITIONS.map((setting) => [setting.key, setting]));

export async function updatePaymentSettings(
  _previousState: PaymentSettingsMutationState,
  formData: FormData,
): Promise<PaymentSettingsMutationState> {
  const admin = await requireAdminRole("/admin/settings");
  const validation = validatePaymentSettingsFormData(formData);

  if (!validation.isValid) {
    return {
      status: "error",
      message: "Vui lòng kiểm tra lại các trường được đánh dấu.",
      fieldErrors: validation.fieldErrors,
    };
  }

  const { values } = validation;
  const settingValues = {
    "payment.bank_name": values.bankName,
    "payment.bank_bin": values.bankBin,
    "payment.bank_account_number": values.accountNumber,
    "payment.bank_account_holder": values.accountHolder,
    "payment.instructions": values.instructions,
    "support.zalo_phone": values.zaloPhone,
  } as const;
  const rows = Object.entries(settingValues).map(([key, value]) => ({
    key,
    value,
    visibility: "private" as const,
    description: definitionByKey.get(key as keyof typeof settingValues)?.description ?? "",
    updated_by: admin.userId,
  }));

  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) {
    console.error("[admin/settings] Payment settings update rejected:", error);
    const permissionError = error.code === "42501";
    return {
      status: "error",
      message: permissionError
        ? "Bạn không có quyền cập nhật cấu hình thanh toán."
        : "Không thể lưu cấu hình thanh toán lúc này.",
      fieldErrors: {},
    };
  }

  revalidatePath("/admin/settings");
  return {
    status: "success",
    message: "Đã lưu cấu hình thanh toán.",
    fieldErrors: {},
  };
}
