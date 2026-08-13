import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getAuthMessage, getSafeNextPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập tài khoản Trung AI Media.",
};

type LoginPageProps = {
  searchParams: Promise<{
    message?: string | string[];
    next?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/account");
  }

  const nextPath = getSafeNextPath(Array.isArray(params.next) ? params.next[0] : params.next);
  const message = getAuthMessage(params.message);

  return (
    <AuthFormShell
      title="Đăng nhập"
      description="Truy cập tài khoản để quản lý sản phẩm đã mua, đơn hàng và thông tin cá nhân."
    >
      <LoginForm nextPath={nextPath} message={message} />
    </AuthFormShell>
  );
}
