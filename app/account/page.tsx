import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock3, PackageCheck, ReceiptText, UserRound } from "lucide-react";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getAuthMessage } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Tài khoản của tôi",
  description: "Trang tài khoản cá nhân Trung AI Media.",
};

type AccountPageProps = {
  searchParams: Promise<{
    message?: string | string[];
  }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/account");
  }

  const message = getAuthMessage(params.message);
  const isEmailConfirmed = Boolean(user.email_confirmed_at || user.confirmed_at);

  return (
    <main className="hero-grid min-h-screen bg-[var(--color-bg)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Về trang chủ">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-400/35 bg-sky-400/10">
              <span className="text-xl font-black text-sky-200">T</span>
            </span>
            <span className="text-lg font-extrabold tracking-[0.18em] text-sky-100">TRUNG AI</span>
          </Link>
          <SignOutButton />
        </div>

        {message ? (
          <p className="mb-6 rounded-[8px] border border-sky-400/30 bg-sky-400/10 px-4 py-3 text-sm leading-6 text-sky-100">
            {message}
          </p>
        ) : null}

        <section className="rounded-[8px] border border-sky-400/20 bg-slate-950/80 p-6 shadow-2xl shadow-blue-950/40 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-sky-300">Tài khoản</p>
              <h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Tài khoản của tôi</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Quản lý thông tin đăng nhập và chuẩn bị cho thư viện sản phẩm, đơn hàng trong các giai đoạn sau.
              </p>
            </div>
            <div className="rounded-[8px] border border-sky-400/15 bg-slate-900/70 px-4 py-3 text-sm text-slate-200">
              <p className="font-semibold text-white">{user.email}</p>
              <p className="mt-2 inline-flex items-center gap-2 text-slate-300">
                {isEmailConfirmed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    Email đã xác thực
                  </>
                ) : (
                  <>
                    <Clock3 className="h-4 w-4 text-amber-300" />
                    Email chưa xác thực
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[8px] border border-sky-400/15 bg-slate-900/60 p-5">
              <PackageCheck className="h-6 w-6 text-sky-300" />
              <h2 className="mt-4 text-base font-bold text-white">Sản phẩm của tôi</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Khu vực này sẽ hiển thị sản phẩm đã mua.</p>
            </div>
            <div className="rounded-[8px] border border-sky-400/15 bg-slate-900/60 p-5">
              <ReceiptText className="h-6 w-6 text-sky-300" />
              <h2 className="mt-4 text-base font-bold text-white">Đơn hàng</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Lịch sử và trạng thái đơn hàng sẽ được bổ sung sau.</p>
            </div>
            <div className="rounded-[8px] border border-sky-400/15 bg-slate-900/60 p-5">
              <UserRound className="h-6 w-6 text-sky-300" />
              <h2 className="mt-4 text-base font-bold text-white">Hồ sơ cá nhân</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Thông tin hồ sơ sẽ được kết nối khi có bảng profiles.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
