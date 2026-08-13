import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, ImageIcon, Pencil, PlayCircle } from "lucide-react";
import {
  AccessChip,
  formatAdminPrice,
  getProductTypeLabel,
  ProductCover,
  PublicationChip,
  SalesChip,
} from "@/components/admin/AdminProductUi";
import { getAdminProductById } from "@/lib/admin/products";
import { getYouTubeThumbnailUrl, getYouTubeWatchUrl } from "@/lib/youtube";

export const metadata: Metadata = {
  title: "Chi tiết sản phẩm",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function DetailItem({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="border-b border-white/[0.06] py-3 last:border-0"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{label}</dt><dd className="mt-1.5 break-words text-sm leading-6 text-slate-200">{children}</dd></div>;
}

function ProductUrl({ value }: { value: string }) {
  if (!value) return <>—</>;
  const isExternal = value.startsWith("http://") || value.startsWith("https://");
  return isExternal ? <a href={value} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex items-start gap-2 text-sky-300 hover:text-sky-200"><span className="break-all">{value}</span><ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0" /></a> : <span>{value}</span>;
}

export default async function AdminProductDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ updated?: string | string[]; created?: string | string[] }> }) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getAdminProductById(id);

  if (result.error) {
    return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/products" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách sản phẩm</Link></section>;
  }

  if (!result.product) notFound();
  const product = result.product;
  const hasMetadata = Object.keys(product.metadata).length > 0;

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/admin/products" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách sản phẩm</Link><Link href={`/admin/products/${product.id}/edit`} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Pencil className="h-4 w-4" />Chỉnh sửa</Link></div>

      {query.updated === "1" ? <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100"><CheckCircle2 className="h-5 w-5" />Đã cập nhật sản phẩm.</div> : null}
      {query.created === "1" ? <div className="mt-4 flex items-center gap-3 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-bold text-emerald-100"><CheckCircle2 className="h-5 w-5" />Đã tạo sản phẩm nháp.</div> : null}

      <div className="mt-5 flex flex-col gap-6 border-b border-white/[0.08] pb-7 md:flex-row md:items-start">
        <ProductCover image={product.coverImage} title={product.title} className="aspect-[9/16] h-auto w-full max-w-[220px]" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2"><PublicationChip value={product.publicationStatus} /><SalesChip value={product.salesStatus} /><AccessChip value={product.accessType} /></div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-sky-300">{getProductTypeLabel(product.productType)}</p>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-white sm:text-3xl">{product.title}</h1>
          <p className="mt-2 break-all text-sm text-slate-500">/{product.slug}</p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-300">{product.shortDescription}</p>
          <div className="mt-6 flex flex-wrap items-end gap-3"><strong className="text-2xl font-black text-white">{formatAdminPrice(product.price, product.currency)}</strong>{product.originalPrice !== null ? <span className="text-sm font-semibold text-slate-500 line-through">{formatAdminPrice(product.originalPrice, product.currency)}</span> : null}</div>
        </div>
      </div>

      <div className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
        <div className="space-y-7">
          <section><h2 className="text-lg font-extrabold text-white">Nội dung</h2><div className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] p-5"><h3 className="text-sm font-bold text-slate-300">Mô tả đầy đủ</h3><p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-400">{product.fullDescription || "—"}</p></div></section>
          <section><h2 className="text-lg font-extrabold text-white">SEO</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="SEO title">{product.seoTitle || "—"}</DetailItem><DetailItem label="SEO description">{product.seoDescription || "—"}</DetailItem></dl></section>
          {hasMetadata ? <section><h2 className="text-lg font-extrabold text-white">Metadata</h2><pre className="mt-3 max-h-96 overflow-auto rounded-lg border border-white/[0.08] bg-[#07111F] p-4 text-xs leading-6 text-slate-300">{JSON.stringify(product.metadata, null, 2)}</pre></section> : null}
        </div>

        <aside className="space-y-7">
          <section><h2 className="text-lg font-extrabold text-white">Thông tin sản phẩm</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="ID"><span className="break-all font-mono text-xs">{product.id}</span></DetailItem><DetailItem label="Legacy ID">{product.legacyId || "—"}</DetailItem><DetailItem label="Danh mục">{product.category?.name ?? "Chưa phân loại"}</DetailItem><DetailItem label="Badge">{product.badge || "—"}</DetailItem><DetailItem label="Có thể bán">{product.sellable ? "Có" : "Không"}</DetailItem><DetailItem label="Nổi bật">{product.isFeatured ? "Có" : "Không"}</DetailItem><DetailItem label="Thứ tự hiển thị">{product.displayOrder}</DetailItem><DetailItem label="Tags">{product.tags.length ? <span className="flex flex-wrap gap-2">{product.tags.map((tag) => <span key={tag} className="rounded-md border border-white/10 px-2 py-1 text-xs">{tag}</span>)}</span> : "—"}</DetailItem></dl></section>
          <section><h2 className="text-lg font-extrabold text-white">Liên kết</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Affiliate URL"><ProductUrl value={product.affiliateUrl} /></DetailItem><DetailItem label="External URL"><ProductUrl value={product.externalUrl} /></DetailItem><DetailItem label="Detail URL"><ProductUrl value={product.detailUrl} /></DetailItem></dl></section>
          <section><h2 className="text-lg font-extrabold text-white">Video demo YouTube</h2>{product.demoVideo ? <div className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] p-4"><img src={getYouTubeThumbnailUrl(product.demoVideo.id)} alt={`Thumbnail video demo ${product.title}`} className="aspect-video w-full rounded-lg border border-white/10 object-cover" /><p className="mt-4 font-mono text-xs text-slate-500">Video ID: {product.demoVideo.id}</p><a href={getYouTubeWatchUrl(product.demoVideo.id)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><PlayCircle className="h-4 w-4" />Mở video<ExternalLink className="h-3.5 w-3.5" /></a></div> : <div className="mt-3 flex items-center gap-3 rounded-lg border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500"><PlayCircle className="h-5 w-5" />Chưa có video demo.</div>}</section>
          <section><h2 className="text-lg font-extrabold text-white">Thời gian</h2><dl className="mt-3 rounded-lg border border-white/[0.08] bg-[#0B1728] px-5"><DetailItem label="Ngày tạo">{formatDate(product.createdAt)}</DetailItem><DetailItem label="Cập nhật">{formatDate(product.updatedAt)}</DetailItem></dl></section>
          {!product.coverImage ? <div className="flex items-center gap-3 rounded-lg border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500"><ImageIcon className="h-5 w-5" />Sản phẩm chưa có ảnh cover.</div> : null}
        </aside>
      </div>
    </div>
  );
}
