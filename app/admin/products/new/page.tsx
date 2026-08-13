import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductCreateForm } from "@/components/admin/ProductEditForm";
import { getAdminCategories } from "@/lib/admin/products";

export const metadata: Metadata = {
  title: "Thêm sản phẩm",
};

export default async function AdminNewProductPage() {
  const result = await getAdminCategories();

  if (result.error) {
    return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/products" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách sản phẩm</Link></section>;
  }

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link href="/admin/products" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách sản phẩm</Link>
      <div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Product Creator</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Thêm sản phẩm</h1><p className="mt-2 text-sm text-slate-400">Sản phẩm mới luôn được lưu dưới dạng bản nháp.</p></div>
      <ProductCreateForm categories={result.categories} />
    </div>
  );
}
