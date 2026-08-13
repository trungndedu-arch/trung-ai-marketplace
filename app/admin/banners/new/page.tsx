import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BannerForm } from "@/components/admin/BannerForm";

export const metadata: Metadata = {
  title: "Thêm Banner",
};

export default function AdminNewBannerPage() {
  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link href="/admin/banners" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách banner</Link>
      <div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Banner Creator</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Thêm banner</h1><p className="mt-2 text-sm text-slate-400">Banner mới được tạo dưới dạng bản nháp tại vị trí Banner trang chủ.</p></div>
      <BannerForm />
    </div>
  );
}
