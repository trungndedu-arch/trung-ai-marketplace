import type { Metadata } from "next";
import Link from "next/link";
import { ImageIcon, Pencil, Plus } from "lucide-react";
import {
  BannerPublicationChip,
  BannerRuntimeChip,
  formatBannerDate,
  getBannerPositionLabel,
} from "@/components/admin/AdminBannerUi";
import { getAdminBanners } from "@/lib/admin/banners";

export const metadata: Metadata = {
  title: "Quản lý Banner",
};

export default async function AdminBannersPage() {
  const result = await getAdminBanners();

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Homepage Content</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Banner</h1><p className="mt-2 text-sm text-slate-400">Quản lý banner chính trên trang chủ.</p></div>
        <div className="flex items-center gap-3"><span className="text-sm font-semibold text-slate-400">{result.banners.length} banner</span><Link href="/admin/banners/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Plus className="h-4 w-4" />Thêm banner</Link></div>
      </div>

      {result.error ? (
        <section className="mt-6 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-8 text-center"><p className="font-bold text-rose-100">{result.error}</p><p className="mt-2 text-sm text-rose-200/70">Vui lòng tải lại trang sau ít phút.</p></section>
      ) : result.banners.length === 0 ? (
        <section className="mt-6 grid min-h-64 place-items-center rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 px-5 text-center"><div><ImageIcon className="mx-auto h-9 w-9 text-slate-600" /><h2 className="mt-4 font-extrabold text-white">Chưa có banner trang chủ</h2><p className="mt-2 text-sm text-slate-500">Tạo bản nháp trước, sau đó tải ảnh và xuất bản.</p><Link href="/admin/banners/new" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white"><Plus className="h-4 w-4" />Tạo banner</Link></div></section>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] border-collapse text-left">
                <thead className="border-b border-white/[0.08] bg-white/[0.025] text-[11px] font-black uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-4 py-3">Banner</th><th className="px-4 py-3">Vị trí</th><th className="px-4 py-3">Xuất bản</th><th className="px-4 py-3">Runtime</th><th className="px-4 py-3">Bắt đầu</th><th className="px-4 py-3">Kết thúc</th><th className="px-4 py-3 text-center">Thứ tự</th><th className="px-4 py-3 text-right">Sửa</th></tr></thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {result.banners.map((banner) => (
                    <tr key={banner.id} className="transition hover:bg-white/[0.025]">
                      <td className="px-4 py-3"><div className="flex min-w-0 items-center gap-3"><div className="grid h-16 w-28 shrink-0 place-items-center overflow-hidden rounded-md border border-white/[0.08] bg-[#07111F]">{banner.desktopImageUrl ? <img src={banner.desktopImageUrl} alt="" className="h-full w-full object-contain" /> : <ImageIcon className="h-5 w-5 text-slate-600" />}</div><div className="min-w-0"><Link href={`/admin/banners/${banner.id}/edit`} className="line-clamp-2 max-w-sm text-sm font-extrabold text-white hover:text-sky-300">{banner.title || "Banner chưa đặt tiêu đề"}</Link><p className="mt-1 text-xs text-slate-500">{banner.mobileImageUrl ? "Đã có ảnh mobile" : "Chưa có ảnh mobile"}</p></div></div></td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-300">{getBannerPositionLabel()}</td>
                      <td className="px-4 py-3"><BannerPublicationChip value={banner.status} /></td>
                      <td className="px-4 py-3"><BannerRuntimeChip value={banner.runtimeState} /></td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-400">{formatBannerDate(banner.startAt)}</td>
                      <td className="px-4 py-3 text-xs font-semibold text-slate-400">{formatBannerDate(banner.endAt)}</td>
                      <td className="px-4 py-3 text-center text-sm font-black tabular-nums text-slate-300">{banner.sortOrder}</td>
                      <td className="px-4 py-3 text-right"><Link href={`/admin/banners/${banner.id}/edit`} aria-label={`Sửa ${banner.title || "banner"}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky-300/30 hover:text-sky-200"><Pencil className="h-4 w-4" /></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {result.banners.map((banner) => (
              <article key={banner.id} className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-4">
                <div className="grid aspect-[16/7] place-items-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#07111F]">{banner.desktopImageUrl ? <img src={banner.desktopImageUrl} alt="" className="h-full w-full object-contain" /> : <div className="text-center text-slate-600"><ImageIcon className="mx-auto h-7 w-7" /><p className="mt-2 text-xs font-semibold">Chưa có ảnh desktop</p></div>}</div>
                <p className="mt-4 text-xs font-bold text-sky-300">{getBannerPositionLabel()}</p><h2 className="mt-1 line-clamp-2 text-base font-extrabold text-white">{banner.title || "Banner chưa đặt tiêu đề"}</h2>
                <div className="mt-3 flex flex-wrap gap-2"><BannerPublicationChip value={banner.status} /><BannerRuntimeChip value={banner.runtimeState} /></div>
                <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4 text-xs"><div><dt className="text-slate-600">Bắt đầu</dt><dd className="mt-1 font-semibold text-slate-400">{formatBannerDate(banner.startAt)}</dd></div><div><dt className="text-slate-600">Kết thúc</dt><dd className="mt-1 font-semibold text-slate-400">{formatBannerDate(banner.endAt)}</dd></div></dl>
                <div className="mt-4 flex items-center justify-between"><span className="text-xs text-slate-500">Thứ tự: {banner.sortOrder}</span><Link href={`/admin/banners/${banner.id}/edit`} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 px-3 text-xs font-bold text-sky-200"><Pencil className="h-3.5 w-3.5" />Chỉnh sửa</Link></div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
