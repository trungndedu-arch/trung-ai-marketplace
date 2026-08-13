import type { Metadata } from "next";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Đặt lại mật khẩu",
  description: "Đặt lại mật khẩu tài khoản Trung AI Media.",
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthFormShell
      title="Đặt lại mật khẩu"
      description="Tạo mật khẩu mới cho tài khoản của bạn. Liên kết đặt lại chỉ có hiệu lực trong thời gian giới hạn."
    >
      <ResetPasswordForm canReset={Boolean(user)} />
    </AuthFormShell>
  );
}
