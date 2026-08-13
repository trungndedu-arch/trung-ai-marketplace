import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Tạo tài khoản Trung AI Media bằng email và mật khẩu.",
};

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  return (
    <AuthFormShell
      title="Tạo tài khoản"
      description="Đăng ký bằng email để chuẩn bị sử dụng các sản phẩm trả phí trong marketplace."
    >
      <RegisterForm />
    </AuthFormShell>
  );
}
