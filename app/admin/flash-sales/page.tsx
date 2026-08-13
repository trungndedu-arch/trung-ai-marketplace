import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, Pencil, Plus } from "lucide-react";
import { ProductCover, formatAdminPrice, getProductTypeLabel } from "@/components/admin/AdminProductUi";
import {
  FlashSaleRuntimeChip,
  FlashSaleStatusChip,
  formatFlashSaleDate,
  getFlashSaleDiscount,
} from "@/components/admin/AdminFlashSaleUi";
import { getAdminFlashSales } from "@/lib/admin/flash-sales";

export const metadata: Metadata = { title: "Quản lý Flash Sale" };

export default async function AdminFlashSalesPage() {
  const result = await getAdminFlashSales();

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Marketplace Pricing</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Flash Sale</h1><p className="mt-2 text-sm text-slate-400">Quản lý giá ưu đãi theo khung thời gian cho sản phẩm Marketplace.</p></div><div className="flex items-center gap-3"><span className="text-sm font-semibold text-slate-400">{result.flashSales.length} chương trình</span><Link href="/admin/flash-sales/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Plus className="h-4 w-4" />Thêm Flash Sale</Link></div></div>

      {result.error ? (
        <section className="mt-6 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-8 text-center"><p className="font-bold text-rose-100">{result.error}</p><p className="mt-2 text-sm text-rose-200/70">Vui lòng tải lại trang sau ít phút.</p></section>
      ) : result.flashSales.length === 0 ? (
        <section className="mt-6 grid min-h-64 place-items-center rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 px-5 text-center"><div><BadgePercent className="mx-auto h-9 w-9 text-slate-600" /><h2 className="mt-4 font-extrabold text-white">Chưa có Flash Sale</h2><p className="mt-2 text-sm text-slate-500">Tạo chương trình ưu đãi đầu tiên cho sản phẩm đủ điều kiện.</p><Link href="/admin/flash-sales/new" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white"><Plus className="h-4 w-4" />Tạo Flash Sale</Link></div></section>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728] md:block"><div className="overflow-x-auto"><table className="w-full min-w-[1160px] border-collapse text-left"><thead className="border-b border-white/[0.08] bg-white/[0.025] text-[11px] font-black uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-4 py-3">Sản phẩm</th><th className="px-4 py-3">Giá gốc</th><th className="px-4 py-3">Giá sale</th><th className="px-4 py-3">Giảm</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Runtime</th><th className="px-4 py-3">Bắt đầu</th><th className="px-4 py-3">Kết thúc</th><th className="px-4 py-3 text-right">Sửa</th></tr></thead><tbody className="divide-y divide-white/[0.06]">
            {result.flashSales.map((sale) => <tr key={sale.id} className="transition hover:bg-white/[0.025]"><td className="px-4 py-3"><div className="flex min-w-0 items-center gap-3"><ProductCover image={sale.product.coverImage} title={sale.product.title} /><div className="min-w-0"><Link href={`/admin/flash-sales/${sale.id}/edit`} className="line-clamp-2 max-w-sm text-sm font-extrabold text-white hover:text-sky-300">{sale.product.title}</Link><p className="mt-1 text-xs text-slate-500">{getProductTypeLabel(sale.product.productType)}</p></div></div></td><td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-300">{formatAdminPrice(sale.product.price, sale.product.currency)}</td><td className="px-4 py-3 whitespace-nowrap text-sm font-black text-rose-300">{formatAdminPrice(sale.salePrice, sale.product.currency)}</td><td className="px-4 py-3 text-sm font-black text-emerald-300">-{getFlashSaleDiscount(sale.product.price, sale.salePrice)}%</td><td className="px-4 py-3"><FlashSaleStatusChip value={sale.status} /></td><td className="px-4 py-3"><FlashSaleRuntimeChip value={sale.runtimeState} /></td><td className="px-4 py-3 text-xs font-semibold text-slate-400">{formatFlashSaleDate(sale.startAt)}</td><td className="px-4 py-3 text-xs font-semibold text-slate-400">{formatFlashSaleDate(sale.endAt)}</td><td className="px-4 py-3 text-right"><Link href={`/admin/flash-sales/${sale.id}/edit`} aria-label={`Sửa Flash Sale ${sale.product.title}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky-300/30 hover:text-sky-200"><Pencil className="h-4 w-4" /></Link></td></tr>)}
          </tbody></table></div></div>

          <div className="mt-6 space-y-3 md:hidden">{result.flashSales.map((sale) => <article key={sale.id} className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-4"><div className="flex gap-3"><ProductCover image={sale.product.coverImage} title={sale.product.title} className="h-28 w-[63px]" /><div className="min-w-0 flex-1"><p className="text-xs font-bold text-sky-300">{getProductTypeLabel(sale.product.productType)}</p><h2 className="mt-1 line-clamp-2 text-sm font-extrabold text-white">{sale.product.title}</h2><p className="mt-3 text-xs text-slate-500 line-through">{formatAdminPrice(sale.product.price, sale.product.currency)}</p><div className="mt-1 flex items-center gap-2"><span className="text-base font-black text-rose-300">{formatAdminPrice(sale.salePrice, sale.product.currency)}</span><span className="text-xs font-black text-emerald-300">-{getFlashSaleDiscount(sale.product.price, sale.salePrice)}%</span></div></div></div><div className="mt-4 flex flex-wrap gap-2"><FlashSaleStatusChip value={sale.status} /><FlashSaleRuntimeChip value={sale.runtimeState} /></div><dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4 text-xs"><div><dt className="text-slate-600">Bắt đầu</dt><dd className="mt-1 font-semibold text-slate-400">{formatFlashSaleDate(sale.startAt)}</dd></div><div><dt className="text-slate-600">Kết thúc</dt><dd className="mt-1 font-semibold text-slate-400">{formatFlashSaleDate(sale.endAt)}</dd></div></dl><div className="mt-4 flex justify-end"><Link href={`/admin/flash-sales/${sale.id}/edit`} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 px-3 text-xs font-bold text-sky-200"><Pencil className="h-3.5 w-3.5" />Chỉnh sửa</Link></div></article>)}</div>
        </>
      )}
    </div>
  );
}
