"use client";

import Link from "next/link";
import { ExternalLink, Loader2, PlayCircle, Plus, Save } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { getProductTypeLabel } from "@/components/admin/AdminProductUi";
import { createProduct, updateProduct } from "@/lib/admin/product-actions";
import type { ProductMutationState } from "@/lib/admin/product-validation";
import type { AdminCategory, AdminProduct } from "@/lib/admin/products";
import type { ProductType } from "@/lib/catalog/types";
import { getYouTubeThumbnailUrl, getYouTubeWatchUrl } from "@/lib/youtube";

const initialState: ProductMutationState = { status: "idle", message: "", fieldErrors: {} };
const inputClass = "mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";
const textareaClass = "mt-2 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";
const productTypes: ProductType[] = ["chatbot", "ai_app", "ai_tool", "course"];

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{message}</span> : null;
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6"><h2 className="text-base font-extrabold text-white">{title}</h2><div className="mt-5 grid gap-5 md:grid-cols-2">{children}</div></section>;
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  const Icon = mode === "create" ? Plus : Save;
  const idleLabel = mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi";
  return <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}{pending ? "Đang lưu..." : idleLabel}</button>;
}

function ProductForm({ mode, product, categories }: { mode: "create" | "edit"; product?: AdminProduct; categories: AdminCategory[] }) {
  const action = mode === "create" ? createProduct : updateProduct;
  const [state, formAction] = useActionState(action, initialState);
  const [productType, setProductType] = useState<ProductType>(product?.productType ?? "ai_app");
  const compatibleCategories = categories.filter((category) => category.isActive && (category.productType === null || category.productType === productType) || category.id === product?.category?.id);
  const cancelHref = product ? `/admin/products/${product.id}` : "/admin/products";

  return (
    <form action={formAction} className="space-y-5">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {state.message ? <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">{state.message}</div> : null}

      <FormSection title="Thông tin cơ bản">
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Tên sản phẩm</span><input name="title" required maxLength={160} defaultValue={product?.title ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.title} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Slug</span><input name="slug" required maxLength={160} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={product?.slug ?? ""} placeholder="ten-san-pham" className={inputClass} /><FieldError message={state.fieldErrors.slug} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Danh mục</span><select key={`${mode}-${productType}`} name="categoryId" defaultValue={product?.category?.id ?? ""} className={inputClass}><option value="">Không có danh mục</option>{compatibleCategories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.isActive ? "" : " (đang ẩn)"}</option>)}</select><FieldError message={state.fieldErrors.categoryId} /></label>
        {mode === "create" ? <label className="block"><span className="text-sm font-bold text-slate-200">Loại sản phẩm</span><select name="productType" value={productType} onChange={(event) => setProductType(event.target.value as ProductType)} className={inputClass}>{productTypes.map((value) => <option key={value} value={value}>{getProductTypeLabel(value)}</option>)}</select><FieldError message={state.fieldErrors.productType} /></label> : <div><span className="text-sm font-bold text-slate-200">Loại sản phẩm</span><div className="mt-2 flex h-11 items-center rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 text-sm font-semibold text-slate-400">{getProductTypeLabel(productType)} · Chỉ đọc</div></div>}
        {product ? <div><span className="text-sm font-bold text-slate-200">Legacy ID</span><div className="mt-2 flex h-11 items-center truncate rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 font-mono text-xs text-slate-500">{product.legacyId || "—"}</div></div> : <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs leading-5 text-slate-500">Loại sản phẩm được cố định sau khi tạo.</div>}
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Mô tả ngắn</span><textarea name="shortDescription" required maxLength={500} rows={3} defaultValue={product?.shortDescription ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.shortDescription} /></label>
      </FormSection>

      <FormSection title="Nội dung">
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Mô tả đầy đủ</span><textarea name="fullDescription" maxLength={20000} rows={10} defaultValue={product?.fullDescription ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.fullDescription} /></label>
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Tags</span><textarea name="tags" rows={2} defaultValue={product?.tags.join(", ") ?? ""} placeholder="AI App, Video AI, Marketing" className={textareaClass} /><FieldError message={state.fieldErrors.tags} /></label>
      </FormSection>

      <FormSection title="Giá và bán hàng">
        <label className="block"><span className="text-sm font-bold text-slate-200">Loại truy cập</span><select name="accessType" defaultValue={product?.accessType ?? "paid"} className={inputClass}><option value="paid">Trả phí</option><option value="free">Miễn phí</option></select><FieldError message={state.fieldErrors.accessType} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Trạng thái bán</span><select name="salesStatus" defaultValue={product?.salesStatus ?? "coming_soon"} className={inputClass}><option value="on_sale">Đang bán</option><option value="coming_soon">Sắp ra mắt</option><option value="paused">Tạm dừng</option></select><FieldError message={state.fieldErrors.salesStatus} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Giá bán (VND)</span><input name="price" type="number" inputMode="numeric" min={0} max={999999999999} step={1} defaultValue={product?.price ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.price} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Giá gốc (VND)</span><input name="originalPrice" type="number" inputMode="numeric" min={0} max={999999999999} step={1} defaultValue={product?.originalPrice ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.originalPrice} /></label>
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-white/[0.08] bg-[#07111F] px-4"><input name="sellable" type="checkbox" defaultChecked={product?.sellable ?? false} className="h-4 w-4 accent-sky-500" /><span><b className="block text-sm text-slate-200">Bán trực tiếp</b><small className="text-xs text-slate-500">Chỉ Chatbot/AI App trả phí đang bán</small></span></label>
        <div className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs leading-5 text-slate-500">Sản phẩm miễn phí dùng giá trống hoặc 0. AI Tool và khóa học không được bật bán trực tiếp.</div>
        <FieldError message={state.fieldErrors.sellable} />
      </FormSection>

      <FormSection title="Trạng thái">
        {mode === "create" ? <div><span className="text-sm font-bold text-slate-200">Xuất bản</span><div className="mt-2 flex h-11 items-center rounded-lg border border-amber-300/20 bg-amber-400/10 px-3 text-sm font-bold text-amber-200">Bản nháp · Cố định khi tạo</div></div> : <label className="block"><span className="text-sm font-bold text-slate-200">Xuất bản</span><select name="publicationStatus" defaultValue={product?.publicationStatus} className={inputClass}><option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option><option value="hidden">Đã ẩn</option></select><FieldError message={state.fieldErrors.publicationStatus} /></label>}
        <label className="block"><span className="text-sm font-bold text-slate-200">Thứ tự hiển thị</span><input name="displayOrder" type="number" min={-999999} max={999999} step={1} defaultValue={product?.displayOrder ?? 0} className={inputClass} /><FieldError message={state.fieldErrors.displayOrder} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Badge</span><input name="badge" maxLength={60} defaultValue={product?.badge ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.badge} /></label>
        <label className="flex min-h-12 items-center gap-3 rounded-lg border border-white/[0.08] bg-[#07111F] px-4"><input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured ?? false} className="h-4 w-4 accent-sky-500" /><span className="text-sm font-bold text-slate-200">Sản phẩm nổi bật</span></label>
      </FormSection>

      <FormSection title="Liên kết">
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Affiliate URL</span><input name="affiliateUrl" type="url" maxLength={2048} defaultValue={product?.affiliateUrl ?? ""} placeholder="https://..." className={inputClass} /><FieldError message={state.fieldErrors.affiliateUrl} /></label>
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">External URL</span><input name="externalUrl" type="url" maxLength={2048} defaultValue={product?.externalUrl ?? ""} placeholder="https://..." className={inputClass} /><FieldError message={state.fieldErrors.externalUrl} /></label>
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Detail URL</span><input name="detailUrl" maxLength={2048} defaultValue={product?.detailUrl ?? ""} placeholder="/workflow/example hoặc https://..." className={inputClass} /><FieldError message={state.fieldErrors.detailUrl} /></label>
      </FormSection>

      {product ? <FormSection title="Video demo YouTube"><label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Link video YouTube</span><input name="demoVideoUrl" type="url" maxLength={2048} defaultValue={product.demoVideo ? getYouTubeWatchUrl(product.demoVideo.id) : ""} placeholder="https://www.youtube.com/watch?v=..." className={inputClass} /><span className="mt-2 block text-xs leading-5 text-slate-500">Video được tải lên YouTube trước, sau đó dán đường link vào đây. Để trống và lưu để xóa video demo.</span><FieldError message={state.fieldErrors.demoVideoUrl} /></label>{product.demoVideo ? <div className="md:col-span-2 grid gap-4 rounded-lg border border-white/[0.08] bg-[#07111F] p-4 sm:grid-cols-[180px_minmax(0,1fr)]"><img src={getYouTubeThumbnailUrl(product.demoVideo.id)} alt={`Thumbnail video demo ${product.title}`} className="aspect-video w-full rounded-lg border border-white/10 object-cover" /><div className="min-w-0 self-center"><p className="flex items-center gap-2 text-sm font-extrabold text-white"><PlayCircle className="h-4 w-4 text-red-300" />Video hiện tại</p><p className="mt-2 font-mono text-xs text-slate-500">ID: {product.demoVideo.id}</p><a href={getYouTubeWatchUrl(product.demoVideo.id)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white">Mở trên YouTube<ExternalLink className="h-3.5 w-3.5" /></a></div></div> : <div className="md:col-span-2 flex items-center gap-3 rounded-lg border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500"><PlayCircle className="h-5 w-5" />Chưa có video demo.</div>}</FormSection> : null}

      <FormSection title="SEO">
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">SEO title</span><input name="seoTitle" maxLength={160} defaultValue={product?.seoTitle ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.seoTitle} /></label>
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">SEO description</span><textarea name="seoDescription" maxLength={320} rows={3} defaultValue={product?.seoDescription ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.seoDescription} /></label>
      </FormSection>

      {product ? <FormSection title="Nâng cao — chỉ đọc"><div className="md:col-span-2"><span className="text-sm font-bold text-slate-200">Metadata JSON</span><pre className="mt-2 max-h-72 overflow-auto rounded-lg border border-white/[0.07] bg-[#07111F] p-4 text-xs leading-6 text-slate-400">{JSON.stringify(product.metadata, null, 2)}</pre><p className="mt-2 text-xs text-slate-500">Metadata chỉ đọc trong biểu mẫu này.</p></div></FormSection> : null}

      <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-end gap-3 rounded-lg border border-white/10 bg-[#08111E]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur"><Link href={cancelHref} className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-5 text-sm font-bold text-slate-300 hover:text-white">Hủy</Link><SubmitButton mode={mode} /></div>
    </form>
  );
}

export function ProductEditForm({ product, categories }: { product: AdminProduct; categories: AdminCategory[] }) {
  return <ProductForm mode="edit" product={product} categories={categories} />;
}

export function ProductCreateForm({ categories }: { categories: AdminCategory[] }) {
  return <ProductForm mode="create" categories={categories} />;
}
