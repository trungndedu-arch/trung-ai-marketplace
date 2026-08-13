import type { Metadata } from "next";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Quên mật khẩu",
  description: "Nhận liên kết đặt lại mật khẩu tài khoản Trung AI Media.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthFormShell
      title="Quên mật khẩu"
      description="Nhập email tài khoản của bạn. Nếu email hợp lệ, hệ thống sẽ gửi liên kết đặt lại mật khẩu."
    >
      <ForgotPasswordForm />
    </AuthFormShell>
  );
}
