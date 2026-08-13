"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildAuthRedirectUrl, getSafeNextPath } from "@/lib/auth/redirects";

export type AuthActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

function getStringField(formData: FormData, fieldName: string) {
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return "Mật khẩu cần có tối thiểu 8 ký tự.";
  }

  return "";
}

function mapAuthError(message?: string) {
  const normalizedMessage = message?.toLowerCase() ?? "";

  if (normalizedMessage.includes("email not confirmed")) {
    return "Email chưa được xác thực. Vui lòng kiểm tra hộp thư của bạn.";
  }

  if (normalizedMessage.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng.";
  }

  if (normalizedMessage.includes("password")) {
    return "Mật khẩu chưa hợp lệ. Vui lòng kiểm tra lại.";
  }

  if (normalizedMessage.includes("rate limit") || normalizedMessage.includes("too many")) {
    return "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.";
  }

  return "Đã có lỗi xảy ra. Vui lòng thử lại.";
}

export async function signUp(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getStringField(formData, "email").toLowerCase();
  const password = getStringField(formData, "password");
  const confirmPassword = getStringField(formData, "confirmPassword");

  if (!isValidEmail(email)) {
    return { status: "error", message: "Vui lòng nhập email hợp lệ." };
  }

  const passwordError = validatePassword(password);

  if (passwordError) {
    return { status: "error", message: passwordError };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "Hai mật khẩu chưa trùng nhau." };
  }

  const supabase = await createClient();
  const emailRedirectTo = await buildAuthRedirectUrl("/auth/callback", "/account");

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    return { status: "error", message: mapAuthError(error.message) };
  }

  return {
    status: "success",
    message: "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.",
  };
}

export async function signIn(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getStringField(formData, "email").toLowerCase();
  const password = getStringField(formData, "password");
  const nextPath = getSafeNextPath(formData.get("next"));

  if (!isValidEmail(email)) {
    return { status: "error", message: "Vui lòng nhập email hợp lệ." };
  }

  if (!password) {
    return { status: "error", message: "Vui lòng nhập mật khẩu." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { status: "error", message: mapAuthError(error.message) };
  }

  redirect(nextPath);
}

export async function requestPasswordReset(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getStringField(formData, "email").toLowerCase();

  if (!isValidEmail(email)) {
    return { status: "error", message: "Vui lòng nhập email hợp lệ." };
  }

  const supabase = await createClient();
  const redirectTo = await buildAuthRedirectUrl("/auth/callback", "/reset-password");

  await supabase.auth.resetPasswordForEmail(email, { redirectTo });

  return {
    status: "success",
    message: "Nếu email hợp lệ, chúng tôi đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư.",
  };
}

export async function updatePassword(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = getStringField(formData, "password");
  const confirmPassword = getStringField(formData, "confirmPassword");

  const passwordError = validatePassword(password);

  if (passwordError) {
    return { status: "error", message: passwordError };
  }

  if (password !== confirmPassword) {
    return { status: "error", message: "Hai mật khẩu chưa trùng nhau." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng gửi lại yêu cầu.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { status: "error", message: mapAuthError(error.message) };
  }

  redirect("/account?message=Đặt lại mật khẩu thành công.");
}
