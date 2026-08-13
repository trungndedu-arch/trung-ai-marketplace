import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { getAdminCategoryById } from "@/lib/admin/categories";

export const metadata: Metadata = { title: "Chỉnh sửa danh mục" };

export default async function AdminEditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getAdminCategoryById(id);
  if (result.error) return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/categories" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách danh mục</Link></section>;
  if (!result.category) notFound();

  return <div className="mx-auto w-full max-w-[900px]"><Link href="/admin/categories" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách danh mục</Link><div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Category Editor</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Chỉnh sửa danh mục</h1><p className="mt-2 line-clamp-2 text-sm text-slate-400">{result.category.name} · {result.category.productCount} sản phẩm</p></div><CategoryForm category={result.category} /></div>;
}
