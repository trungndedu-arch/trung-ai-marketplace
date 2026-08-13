import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ProductCoverUpload } from "@/components/admin/ProductCoverUpload";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { getAdminCategories, getAdminProductById } from "@/lib/admin/products";

export const metadata: Metadata = {
  title: "Chỉnh sửa sản phẩm",
};

export default async function AdminProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [productResult, categoryResult] = await Promise.all([
    getAdminProductById(id),
    getAdminCategories(),
  ]);

  if (productResult.error || categoryResult.error) {
    return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{productResult.error || categoryResult.error}</p><Link href={`/admin/products/${id}`} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Quay lại</Link></section>;
  }

  if (!productResult.product) notFound();
  const product = productResult.product;
  const categories = categoryResult.categories.filter((category) =>
    (category.isActive || category.id === product.category?.id)
      && (category.productType === null || category.productType === product.productType),
  );

  return (
    <div className="mx-auto w-full max-w-[1100px]">
      <Link href={`/admin/products/${product.id}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Chi tiết sản phẩm</Link>
      <div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Product Editor</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Chỉnh sửa sản phẩm</h1><p className="mt-2 line-clamp-2 text-sm text-slate-400">{product.title}</p></div>
      <ProductCoverUpload productId={product.id} title={product.title} currentCover={product.coverImage} />
      <ProductEditForm product={product} categories={categories} />
    </div>
  );
}
