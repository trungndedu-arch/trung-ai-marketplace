export type PaymentSettingsValues = {
  bankName: string;
  bankBin: string;
  accountNumber: string;
  accountHolder: string;
  instructions: string;
  zaloPhone: string;
};

export type PaymentSettingsFieldErrors = Partial<Record<keyof PaymentSettingsValues, string>>;

export type PaymentSettingsMutationState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors: PaymentSettingsFieldErrors;
};

function field(formData: FormData, name: keyof PaymentSettingsValues) {
  const value = formData.get(name);
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
}

function exactField(formData: FormData, name: keyof PaymentSettingsValues) {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function validatePaymentSettingsFormData(formData: FormData) {
  const values: PaymentSettingsValues = {
    bankName: field(formData, "bankName").replace(/\s+/g, " "),
    bankBin: exactField(formData, "bankBin"),
    accountNumber: field(formData, "accountNumber").replace(/\s+/g, " "),
    accountHolder: field(formData, "accountHolder").replace(/\s+/g, " "),
    instructions: field(formData, "instructions"),
    zaloPhone: field(formData, "zaloPhone").replace(/\s+/g, " "),
  };
  const fieldErrors: PaymentSettingsFieldErrors = {};

  if (values.bankName.length < 2 || values.bankName.length > 120) {
    fieldErrors.bankName = "Tên ngân hàng cần từ 2 đến 120 ký tự.";
  }

  if (!/^[0-9]{6}$/.test(values.bankBin)) {
    fieldErrors.bankBin = "Mã BIN ngân hàng phải gồm chính xác 6 chữ số.";
  }

  if (values.accountNumber.length < 4 || values.accountNumber.length > 50) {
    fieldErrors.accountNumber = "Số tài khoản cần từ 4 đến 50 ký tự.";
  } else if (!/^[\p{L}\p{N}\s.-]+$/u.test(values.accountNumber)) {
    fieldErrors.accountNumber = "Số tài khoản chỉ được chứa chữ, số, khoảng trắng, dấu chấm hoặc gạch ngang.";
  }

  if (values.accountHolder.length < 2 || values.accountHolder.length > 120) {
    fieldErrors.accountHolder = "Tên chủ tài khoản cần từ 2 đến 120 ký tự.";
  }

  if (values.instructions.length < 5 || values.instructions.length > 2000) {
    fieldErrors.instructions = "Hướng dẫn thanh toán cần từ 5 đến 2.000 ký tự.";
  }

  const zaloDigitCount = values.zaloPhone.replace(/\D/g, "").length;
  if (values.zaloPhone && (values.zaloPhone.length > 50 || !/^[+\d\s().-]+$/.test(values.zaloPhone) || zaloDigitCount < 8 || zaloDigitCount > 15)) {
    fieldErrors.zaloPhone = "Số Zalo cần có từ 8 đến 15 chữ số và đúng định dạng số điện thoại.";
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    values,
    fieldErrors,
  };
}
