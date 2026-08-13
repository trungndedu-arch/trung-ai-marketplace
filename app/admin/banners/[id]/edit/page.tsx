import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { BannerForm } from "@/components/admin/BannerForm";
import { BannerImageUpload } from "@/components/admin/BannerImageUpload";
import { BannerPublicationChip, BannerRuntimeChip } from "@/components/admin/AdminBannerUi";
import { getAdminBannerById } from "@/lib/admin/banners";

export const metadata: Metadata = {
  title: "Chỉnh sửa Banner",
};

export default async function AdminBannerEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getAdminBannerById(id);

  if (result.error) {
    return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/banners" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách banner</Link></section>;
  }
  if (!result.banner) notFound();
  const banner = result.banner;
  const successMessage = query.created === "1" ? "Đã tạo bản nháp. Bạn có thể tải ảnh và hoàn thiện banner." : query.updated === "1" ? "Đã lưu thay đổi banner." : "";

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link href="/admin/banners" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách banner</Link>
      <div className="mb-7 mt-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Banner Editor</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Chỉnh sửa banner</h1><p className="mt-2 line-clamp-2 text-sm text-slate-400">{banner.title || "Banner chưa đặt tiêu đề"}</p></div><div className="flex flex-wrap gap-2"><BannerPublicationChip value={banner.status} /><BannerRuntimeChip value={banner.runtimeState} /></div></div>
      {successMessage ? <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100"><CheckCircle2 className="h-4 w-4" />{successMessage}</div> : null}
      <div className="mb-5 grid gap-5 lg:grid-cols-2"><BannerImageUpload bannerId={banner.id} variant="desktop" currentImageUrl={banner.desktopImageUrl} /><BannerImageUpload bannerId={banner.id} variant="mobile" currentImageUrl={banner.mobileImageUrl} /></div>
      <BannerForm banner={banner} />
    </div>
  );
}
