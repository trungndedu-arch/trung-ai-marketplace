import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldX } from "lucide-react";

export const metadata: Metadata = {
  title: "Không có quyền truy cập",
  description: "Tài khoản không có quyền truy cập khu vực quản trị.",
};

export default function AdminAccessDeniedPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#050B14] px-4 py-10 text-white">
      <section className="w-full max-w-lg rounded-lg border border-rose-300/20 bg-[#0B1728] p-7 text-center shadow-2xl shadow-black/30 sm:p-9">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-rose-300/25 bg-rose-400/10 text-rose-200"><ShieldX className="h-7 w-7" /></span>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-rose-300">403 · Access denied</p>
        <h1 className="mt-3 text-2xl font-extrabold">Không có quyền quản trị</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">Tài khoản hiện tại không có role Admin hoặc Editor.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/account" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-sky-300/25 bg-sky-400/10 px-4 text-sm font-bold text-sky-100"><ArrowLeft className="h-4 w-4" />Tài khoản của tôi</Link>
          <Link href="/" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-4 text-sm font-bold text-slate-300">Về trang chủ</Link>
        </div>
      </section>
    </main>
  );
}
