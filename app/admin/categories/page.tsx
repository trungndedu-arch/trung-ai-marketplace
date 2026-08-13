import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ListTree, Pencil, Plus } from "lucide-react";
import { getProductTypeLabel } from "@/components/admin/AdminProductUi";
import { getAdminCategoryList } from "@/lib/admin/categories";

export const metadata: Metadata = { title: "Quản lý danh mục" };

function CategoryStatus({ active }: { active: boolean }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${active ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200" : "border-slate-300/15 bg-slate-400/10 text-slate-400"}`}>{active ? "Hoạt động" : "Tạm ẩn"}</span>;
}

export default async function AdminCategoriesPage({ searchParams }: { searchParams: Promise<{ created?: string | string[]; updated?: string | string[] }> }) {
  const query = await searchParams;
  const result = await getAdminCategoryList();

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Catalog</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Danh mục</h1></div><div className="flex items-center gap-3"><span className="text-sm font-semibold text-slate-400">{result.categories.length} danh mục</span><Link href="/admin/categories/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Plus className="h-4 w-4" />Thêm danh mục</Link></div></div>

      {query.created === "1" ? <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100"><CheckCircle2 className="h-5 w-5" />Đã tạo danh mục.</div> : null}
      {query.updated === "1" ? <div className="mt-5 flex items-center gap-3 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100"><CheckCircle2 className="h-5 w-5" />Đã cập nhật danh mục.</div> : null}

      {result.error ? <section className="mt-6 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-8 text-center"><p className="font-bold text-rose-100">{result.error}</p></section> : result.categories.length === 0 ? <section className="mt-6 grid min-h-64 place-items-center rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 text-center"><div><ListTree className="mx-auto h-9 w-9 text-slate-600" /><h2 className="mt-4 font-extrabold text-white">Chưa có danh mục</h2><p className="mt-2 text-sm text-slate-500">Hãy tạo danh mục đầu tiên cho catalog.</p></div></section> : <>
        <div className="mt-6 hidden overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728] md:block"><div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-left"><thead className="border-b border-white/[0.08] bg-white/[0.025] text-[11px] font-black uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-4 py-3">Danh mục</th><th className="px-4 py-3">Loại sản phẩm</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-center">Sản phẩm</th><th className="px-4 py-3 text-center">Thứ tự</th><th className="px-4 py-3 text-right">Chỉnh sửa</th></tr></thead><tbody className="divide-y divide-white/[0.06]">{result.categories.map((category) => <tr key={category.id} className="transition hover:bg-white/[0.025]"><td className="px-4 py-3"><p className="text-sm font-extrabold text-white">{category.name}</p><p className="mt-1 font-mono text-xs text-slate-500">/{category.slug}</p></td><td className="px-4 py-3 text-sm font-bold text-slate-300">{category.productType ? getProductTypeLabel(category.productType) : "Dùng chung"}</td><td className="px-4 py-3"><CategoryStatus active={category.isActive} /></td><td className="px-4 py-3 text-center text-sm font-black tabular-nums text-slate-200">{category.productCount}</td><td className="px-4 py-3 text-center text-sm font-black tabular-nums text-slate-300">{category.displayOrder}</td><td className="px-4 py-3 text-right"><Link href={`/admin/categories/${category.id}/edit`} aria-label={`Chỉnh sửa ${category.name}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky-300/30 hover:text-sky-200"><Pencil className="h-4 w-4" /></Link></td></tr>)}</tbody></table></div></div>
        <div className="mt-6 space-y-3 md:hidden">{result.categories.map((category) => <article key={category.id} className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-sm font-extrabold text-white">{category.name}</p><p className="mt-1 truncate font-mono text-xs text-slate-500">/{category.slug}</p></div><CategoryStatus active={category.isActive} /></div><dl className="mt-4 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-4 text-xs"><div><dt className="text-slate-500">Loại</dt><dd className="mt-1 font-bold text-slate-200">{category.productType ? getProductTypeLabel(category.productType) : "Dùng chung"}</dd></div><div><dt className="text-slate-500">Sản phẩm</dt><dd className="mt-1 font-black text-white">{category.productCount}</dd></div><div><dt className="text-slate-500">Thứ tự</dt><dd className="mt-1 font-black text-white">{category.displayOrder}</dd></div></dl><Link href={`/admin/categories/${category.id}/edit`} className="mt-4 inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 px-3 text-xs font-bold text-sky-200"><Pencil className="h-3.5 w-3.5" />Chỉnh sửa</Link></article>)}</div>
      </>}
    </div>
  );
}
