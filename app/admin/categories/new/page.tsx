import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata: Metadata = { title: "Thêm danh mục" };

export default function AdminNewCategoryPage() {
  return <div className="mx-auto w-full max-w-[900px]"><Link href="/admin/categories" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách danh mục</Link><div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Category Creator</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Thêm danh mục</h1><p className="mt-2 text-sm text-slate-400">Tạo nhóm phân loại mới cho sản phẩm trong Marketplace.</p></div><CategoryForm /></div>;
}
