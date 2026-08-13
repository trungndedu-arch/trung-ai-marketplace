import { requireAdminRole } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export const PAYMENT_SETTING_DEFINITIONS = [
  { key: "payment.bank_name", description: "Tên ngân hàng nhận thanh toán" },
  { key: "payment.bank_bin", description: "Mã BIN ngân hàng nhận thanh toán" },
  { key: "payment.bank_account_number", description: "Số tài khoản ngân hàng nhận thanh toán" },
  { key: "payment.bank_account_holder", description: "Tên chủ tài khoản ngân hàng" },
  { key: "payment.instructions", description: "Hướng dẫn thanh toán chuyển khoản" },
  { key: "support.zalo_phone", description: "Số điện thoại Zalo hỗ trợ thanh toán" },
] as const;

export type PaymentSettingKey = typeof PAYMENT_SETTING_DEFINITIONS[number]["key"];

export type AdminPaymentSettings = {
  bankName: string;
  bankBin: string;
  accountNumber: string;
  accountHolder: string;
  instructions: string;
  zaloPhone: string;
  updatedAt: string | null;
  hasPublicValues: boolean;
};

type SiteSettingRow = {
  key: string;
  value: unknown;
  visibility: "public" | "private";
  updated_at: string;
};

function settingString(value: unknown) {
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

export async function getAdminPaymentSettings() {
  await requireAdminRole("/admin/settings");

  const supabase = await createClient();
  const keys = PAYMENT_SETTING_DEFINITIONS.map((setting) => setting.key);
  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value, visibility, updated_at")
    .in("key", keys);

  if (error) {
    console.error("[admin/settings] Unable to load payment settings:", error);
    return {
      settings: null,
      error: "Không thể tải cấu hình thanh toán lúc này.",
    };
  }

  const rows = (data ?? []) as SiteSettingRow[];
  const values = new Map(rows.map((row) => [row.key, settingString(row.value)]));
  const latestTimestamp = rows.reduce<number | null>((latest, row) => {
    const timestamp = Date.parse(row.updated_at);
    if (!Number.isFinite(timestamp)) return latest;
    return latest === null || timestamp > latest ? timestamp : latest;
  }, null);

  const settings: AdminPaymentSettings = {
    bankName: values.get("payment.bank_name") ?? "",
    bankBin: values.get("payment.bank_bin") ?? "",
    accountNumber: values.get("payment.bank_account_number") ?? "",
    accountHolder: values.get("payment.bank_account_holder") ?? "",
    instructions: values.get("payment.instructions") ?? "",
    zaloPhone: values.get("support.zalo_phone") ?? "",
    updatedAt: latestTimestamp === null ? null : new Date(latestTimestamp).toISOString(),
    hasPublicValues: rows.some((row) => row.visibility !== "private"),
  };

  return { settings, error: null };
}
