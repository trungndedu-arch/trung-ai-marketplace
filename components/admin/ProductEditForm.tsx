"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  ImagePlus,
  Loader2,
  PlayCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { ProductCoverUpload } from "@/components/admin/ProductCoverUpload";
import { getProductTypeLabel } from "@/components/admin/AdminProductUi";
import { createProduct, updateProduct } from "@/lib/admin/product-actions";
import {
  getPlacementOption,
  getProductCatalogDestination,
  getProductPlacement,
  getProductPlacementOptions,
  getRecommendedCategorySlug,
  getSuggestedDetailUrl,
  type ProductPlacement,
} from "@/lib/admin/product-catalog";
import {
  metadataBoolean,
  metadataString,
  metadataStringList,
  PRODUCT_METADATA_KEYS,
} from "@/lib/admin/product-metadata";
import type { ProductMutationState } from "@/lib/admin/product-validation";
import type { AdminCategory, AdminProduct } from "@/lib/admin/products";
import type { ProductType } from "@/lib/catalog/types";
import { getYouTubeThumbnailUrl, getYouTubeWatchUrl } from "@/lib/youtube";

const initialState: ProductMutationState = { status: "idle", message: "", fieldErrors: {} };
const inputClass = "mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";
const textareaClass = "mt-2 w-full rounded-xl border border-white/10 bg-[#07111F] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{message}</span> : null;
}

function FormSection({ step, title, description, children }: { step: number; title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B1728] shadow-[0_16px_50px_rgba(0,0,0,.12)]">
      <div className="flex gap-3 border-b border-white/[0.07] bg-white/[0.018] px-5 py-4 sm:px-6">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-xs font-black text-sky-200">{step}</span>
        <div><h2 className="text-base font-extrabold text-white">{title}</h2><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>
      </div>
      <div className="grid gap-5 p-5 sm:p-6 md:grid-cols-2">{children}</div>
    </section>
  );
}

type ListItem = { id: number; value: string };

function MetadataListField({ formId, name, label, description, initialValues }: { formId: string; name: string; label: string; description: string; initialValues: string[] }) {
  const nextId = useRef(initialValues.length);
  const [items, setItems] = useState<ListItem[]>(() => initialValues.map((value, index) => ({ id: index, value })));

  function addItem() {
    setItems((current) => [...current, { id: nextId.current++, value: "" }]);
  }

  function moveItem(index: number, offset: -1 | 1) {
    setItems((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <div className="md:col-span-2 rounded-xl border border-white/[0.07] bg-[#07111F]/70 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm font-bold text-slate-200">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div><button type="button" onClick={addItem} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 bg-sky-500/10 px-3 text-xs font-bold text-sky-200 hover:border-sky-300/40"><Plus className="h-3.5 w-3.5" />Thêm mục</button></div>
      {items.length ? <div className="mt-4 space-y-2">{items.map((item, index) => <div key={item.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"><input form={formId} name={`metadata.${name}`} value={item.value} onChange={(event) => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, value: event.target.value } : entry))} maxLength={500} placeholder={`${label} ${index + 1}`} className="h-10 min-w-0 rounded-lg border border-white/10 bg-[#050B14] px-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-sky-400/40" /><div className="flex gap-1"><button type="button" onClick={() => moveItem(index, -1)} disabled={index === 0} aria-label={`Đưa ${label} lên`} className="grid h-10 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30"><ArrowUp className="h-3.5 w-3.5" /></button><button type="button" onClick={() => moveItem(index, 1)} disabled={index === items.length - 1} aria-label={`Đưa ${label} xuống`} className="grid h-10 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white disabled:opacity-30"><ArrowDown className="h-3.5 w-3.5" /></button><button type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} aria-label={`Xóa ${label}`} className="grid h-10 w-9 place-items-center rounded-lg border border-rose-300/15 text-rose-300 hover:bg-rose-400/10"><Trash2 className="h-3.5 w-3.5" /></button></div></div>)}</div> : <p className="mt-4 rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-xs text-slate-600">Chưa có mục nào. Nhấn “Thêm mục” để bắt đầu.</p>}
    </div>
  );
}

function MetadataTextField({ formId, name, label, description, value, multiline = false, type = "text" }: { formId: string; name: string; label: string; description?: string; value: string; multiline?: boolean; type?: "text" | "url" }) {
  return <label className={multiline ? "block md:col-span-2" : "block"}><span className="text-sm font-bold text-slate-200">{label}</span>{multiline ? <textarea form={formId} name={`metadata.${name}`} defaultValue={value} maxLength={2000} rows={3} className={textareaClass} /> : <input form={formId} name={`metadata.${name}`} type={type} defaultValue={value} maxLength={2000} className={inputClass} />}{description ? <span className="mt-1.5 block text-xs leading-5 text-slate-500">{description}</span> : null}</label>;
}

function MetadataEditor({ formId, productType, metadata }: { formId: string; productType: ProductType; metadata: Record<string, unknown> }) {
  if (productType === "ai_app") return <>
    <MetadataListField formId={formId} name="features" label="Tính năng" description="Các thẻ tính năng trên trang chi tiết AI App." initialValues={metadataStringList(metadata, "features")} />
    <MetadataListField formId={formId} name="steps" label="Cách sử dụng" description="Các bước được hiển thị đúng theo thứ tự này." initialValues={metadataStringList(metadata, "steps")} />
    <MetadataListField formId={formId} name="suitable_for" label="Phù hợp với" description="Nhóm khách hàng phù hợp với sản phẩm." initialValues={metadataStringList(metadata, "suitable_for")} />
    <MetadataListField formId={formId} name="tools" label="Công cụ sử dụng" description="Công cụ hoặc đầu vào cần có để sử dụng AI App." initialValues={metadataStringList(metadata, "tools")} />
    <MetadataTextField formId={formId} name="cta_title" label="Tiêu đề CTA" value={metadataString(metadata, "cta_title")} />
    <MetadataTextField formId={formId} name="cta_label" label="Nhãn nút CTA" value={metadataString(metadata, "cta_label")} />
    <MetadataTextField formId={formId} name="cta_description" label="Mô tả CTA" value={metadataString(metadata, "cta_description")} multiline />
    <MetadataTextField formId={formId} name="license" label="Thông tin giấy phép" value={metadataString(metadata, "license")} />
    <MetadataTextField formId={formId} name="transfer_content" label="Nội dung chuyển khoản gợi ý" value={metadataString(metadata, "transfer_content")} description="Chỉ là nội dung hiển thị; không thay đổi quy trình xác nhận thanh toán thủ công." />
    <label className="flex min-h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#07111F] px-4"><input form={formId} name="metadata.hide_price" type="checkbox" defaultChecked={metadataBoolean(metadata, "hide_price")} className="h-4 w-4 accent-sky-500" /><span><b className="block text-sm text-slate-200">Ẩn giá ngoài catalog</b><small className="text-xs text-slate-500">Chỉ dùng khi template hiện tại cần ẩn giá.</small></span></label>
  </>;

  if (productType === "chatbot") return <>
    <MetadataTextField formId={formId} name="creator" label="Đơn vị phát triển" value={metadataString(metadata, "creator")} />
    <MetadataTextField formId={formId} name="rating" label="Nhãn đánh giá/trạng thái" value={metadataString(metadata, "rating")} />
    <MetadataTextField formId={formId} name="sales_label" label="Nhãn bán hàng" value={metadataString(metadata, "sales_label")} />
    <MetadataTextField formId={formId} name="color" label="Màu nền kỹ thuật" value={metadataString(metadata, "color")} description="Chuỗi màu Tailwind hiện đang được template Chatbot sử dụng." />
    <label className="block"><span className="text-sm font-bold text-slate-200">Biểu tượng</span><select form={formId} name="metadata.icon" defaultValue={metadataString(metadata, "icon") || "bot"} className={inputClass}><option value="bot">Bot</option><option value="shield">Khiên</option></select></label>
    <label className="block"><span className="text-sm font-bold text-slate-200">Tỷ lệ ảnh</span><select form={formId} name="metadata.cover_aspect" defaultValue={metadataString(metadata, "cover_aspect") || "portrait"} className={inputClass}><option value="portrait">Dọc</option><option value="landscape">Ngang</option></select></label>
    <MetadataTextField formId={formId} name="transfer_content" label="Nội dung chuyển khoản gợi ý" value={metadataString(metadata, "transfer_content")} />
  </>;

  if (productType === "ai_tool") return <>
    <MetadataTextField formId={formId} name="logo" label="Logo" value={metadataString(metadata, "logo")} description="Đường dẫn nội bộ hoặc URL ảnh." />
    <MetadataTextField formId={formId} name="tool_type" label="Loại công cụ" value={metadataString(metadata, "tool_type")} />
    <MetadataTextField formId={formId} name="official_website" label="Website chính thức" value={metadataString(metadata, "official_website")} type="url" />
    <MetadataTextField formId={formId} name="tutorial_url" label="Link hướng dẫn" value={metadataString(metadata, "tutorial_url")} type="url" />
    <MetadataListField formId={formId} name="features" label="Tính năng" description="Tính năng nổi bật của công cụ." initialValues={metadataStringList(metadata, "features")} />
    <MetadataListField formId={formId} name="target_users" label="Phù hợp với" description="Nhóm người dùng mục tiêu." initialValues={metadataStringList(metadata, "target_users")} />
    <MetadataListField formId={formId} name="use_cases" label="Trường hợp sử dụng" description="Các công việc có thể thực hiện với công cụ." initialValues={metadataStringList(metadata, "use_cases")} />
    <MetadataListField formId={formId} name="benefits" label="Ưu điểm" description="Lợi ích được hiển thị trên trang chi tiết." initialValues={metadataStringList(metadata, "benefits")} />
    <MetadataListField formId={formId} name="gallery_images" label="Ảnh thư viện" description="Mỗi mục là một đường dẫn nội bộ hoặc URL ảnh." initialValues={metadataStringList(metadata, "gallery_images")} />
    <MetadataTextField formId={formId} name="demo_video_url" label="Video MP4 cũ" value={metadataString(metadata, "demo_video_url")} description="Trường video trực tiếp mà template AI Tool hiện đang hỗ trợ." />
  </>;

  return <MetadataTextField formId={formId} name="status_label" label="Nhãn trạng thái khóa học" value={metadataString(metadata, "status_label")} description="Để trống để dùng nhãn mặc định của template." />;
}

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 160);
}

function formatPrice(value: string) {
  const amount = Number(value);
  return value && Number.isFinite(amount) && amount >= 0 ? new Intl.NumberFormat("vi-VN").format(amount) + "đ" : "—";
}

function ProductForm({ mode, product, categories }: { mode: "create" | "edit"; product?: AdminProduct; categories: AdminCategory[] }) {
  const action = mode === "create" ? createProduct : updateProduct;
  const [state, formAction, pending] = useActionState(action, initialState);
  const formId = `product-${mode}-form`;
  const [productType, setProductType] = useState<ProductType>(product?.productType ?? "ai_app");
  const [placement, setPlacement] = useState<ProductPlacement>(getProductPlacement(product?.productType ?? "ai_app"));
  function getSuggestedCategoryId(type: ProductType) {
    const slug = getRecommendedCategorySlug(type);
    return slug ? categories.find((category) => category.isActive && category.productType === type && category.slug === slug)?.id ?? "" : "";
  }
  const [categoryId, setCategoryId] = useState(product?.category?.id ?? getSuggestedCategoryId(product?.productType ?? "ai_app"));
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [detailUrl, setDetailUrl] = useState(product?.detailUrl ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() ?? "");
  const [dirty, setDirty] = useState(false);
  const slugWasEdited = useRef(Boolean(product?.slug));
  const detailUrlWasEdited = useRef(Boolean(product?.detailUrl));
  const cancelHref = product ? `/admin/products/${product.id}` : "/admin/products";
  const destination = getProductCatalogDestination(productType);
  const placementOption = getPlacementOption(placement);
  const homepageVisibilityNote = "Chỉ xuất hiện khi đã xuất bản. Tất cả sản phẩm được chọn đều hiển thị; số ưu tiên nhỏ hơn hiển thị trước trong khu vực tương ứng.";
  const compatibleCategories = categories.filter((category) => ((category.isActive && (category.productType === null || category.productType === productType)) || category.id === product?.category?.id));
  const unknownMetadata = useMemo(() => Object.fromEntries(Object.entries(product?.metadata ?? {}).filter(([key]) => !PRODUCT_METADATA_KEYS[productType].includes(key))), [product?.metadata, productType]);

  useEffect(() => {
    function warnBeforeLeaving(event: BeforeUnloadEvent) {
      if (!dirty || pending) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [dirty, pending]);

  function updateTitle(value: string) {
    setTitle(value);
    if (mode === "create" && !slugWasEdited.current) {
      const nextSlug = slugify(value);
      setSlug(nextSlug);
      if (!detailUrlWasEdited.current) setDetailUrl(getSuggestedDetailUrl(productType, nextSlug));
    }
  }

  function updateProductType(value: ProductType) {
    setProductType(value);
    setPlacement(getProductPlacement(value));
    setCategoryId(getSuggestedCategoryId(value));
    setDirty(true);
    if (mode === "create" && !detailUrlWasEdited.current) setDetailUrl(getSuggestedDetailUrl(value, slug));
  }

  function updatePlacement(value: ProductPlacement) {
    const next = getPlacementOption(value);
    setPlacement(value);
    updateProductType(next.defaultProductType);
  }

  const current = Number(price);
  const compare = Number(originalPrice);
  const discount = price && originalPrice && Number.isFinite(current) && Number.isFinite(compare) && current >= 0 && compare > current ? Math.round(((compare - current) / compare) * 100) : null;

  return (
    <div onChange={(event) => { if ((event.target as HTMLInputElement).form?.id === formId) setDirty(true); }} className="space-y-5">
      <form id={formId} action={formAction} className="hidden" />
      {product ? <input form={formId} type="hidden" name="id" value={product.id} /> : null}
      {state.message ? <div role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">{state.message}</div> : null}

      <FormSection step={1} title="Phân loại" description="Chọn nơi sản phẩm xuất hiện trên website trước khi nhập nội dung.">
        {mode === "create" ? <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Nhóm hiển thị ngoài website</span><select value={placement} onChange={(event) => updatePlacement(event.target.value as ProductPlacement)} className={inputClass}>{getProductPlacementOptions().map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select><span className="mt-1.5 block text-xs leading-5 text-slate-500">Chỉ là cách chọn dễ hiểu trong Admin; hệ thống vẫn lưu bằng loại sản phẩm và danh mục hiện có.</span></label> : <div className="md:col-span-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Nhóm hiển thị ngoài website</p><p className="mt-1 text-sm font-bold text-slate-200">{placementOption.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">Được suy ra từ loại sản phẩm hiện có và không làm thay đổi dữ liệu khi chỉnh sửa.</p></div>}
        {mode === "create" && placementOption.productTypes.length > 1 ? <label className="block"><span className="text-sm font-bold text-slate-200">Loại sản phẩm</span><select form={formId} name="productType" value={productType} onChange={(event) => updateProductType(event.target.value as ProductType)} className={inputClass}>{placementOption.productTypes.map((value) => <option key={value} value={value}>{getProductTypeLabel(value)}</option>)}</select><span className="mt-1.5 block text-xs text-slate-500">AI App hiển thị tab AI App; Chatbot hiển thị tab Chatbot.</span><FieldError message={state.fieldErrors.productType} /></label> : mode === "create" ? <div><input form={formId} type="hidden" name="productType" value={productType} /><span className="text-sm font-bold text-slate-200">Loại sản phẩm</span><div className="mt-2 flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-sm font-semibold text-slate-300">{getProductTypeLabel(productType)} · xác định từ nhóm hiển thị</div></div> : <div><span className="text-sm font-bold text-slate-200">Loại sản phẩm</span><div className="mt-2 flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 text-sm font-semibold text-slate-300">{getProductTypeLabel(productType)} · không đổi sau khi tạo</div></div>}
        <div className="block"><span className="text-sm font-bold text-slate-200">Danh mục chi tiết</span>{compatibleCategories.length ? <select form={formId} name="categoryId" value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setDirty(true); }} className={inputClass}><option value="">Chưa chọn danh mục chi tiết</option>{compatibleCategories.map((category) => <option key={category.id} value={category.id}>{category.name}{category.isActive ? "" : " (đang ẩn)"}</option>)}</select> : <div className="mt-2 rounded-xl border border-dashed border-amber-300/25 bg-amber-400/[0.06] px-3 py-3 text-xs leading-5 text-amber-100">Chưa có danh mục phù hợp với loại này. Bạn có thể lưu không phân loại hoặc tạo danh mục từ khu vực Danh mục khi được duyệt.</div>}<span className="mt-1.5 block text-xs leading-5 text-slate-500">Chỉ hiển thị category đang hoạt động phù hợp với loại sản phẩm. AI App và Chatbot được gợi ý category chung tương ứng.</span><FieldError message={state.fieldErrors.categoryId} /></div>
        <div className="md:col-span-2 rounded-xl border border-sky-300/15 bg-sky-500/[0.07] px-4 py-3"><p className="text-xs font-black uppercase tracking-[0.12em] text-sky-300">Vị trí cụ thể ngoài website</p><p className="mt-1 text-sm font-bold text-white">{destination.label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{destination.description}</p></div>
        <div className="md:col-span-2 rounded-xl border border-dashed border-violet-300/20 bg-violet-500/[0.05] px-4 py-3"><p className="text-sm font-bold text-violet-100">Prompt AI Miễn Phí không được quản lý ở đây</p><p className="mt-1 text-xs leading-5 text-slate-400">Menu Prompt AI Miễn Phí dùng module nội dung riêng tại <span className="font-mono">/free-prompts</span>, không có product_type hoặc category DB tương ứng. Không chọn mục này để tránh tạo bản ghi giả.</p></div>
      </FormSection>

      <FormSection step={2} title="Thông tin cơ bản" description="Tên, đường dẫn và nội dung giới thiệu khách hàng sẽ nhìn thấy.">
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Tên sản phẩm</span><input form={formId} name="title" required maxLength={160} value={title} onChange={(event) => updateTitle(event.target.value)} className={inputClass} /><FieldError message={state.fieldErrors.title} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Slug</span><input form={formId} name="slug" required maxLength={160} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={(event) => { slugWasEdited.current = true; setSlug(event.target.value.toLowerCase()); }} placeholder="ten-san-pham" className={inputClass} /><span className="mt-1.5 block text-xs text-slate-500">Tự gợi ý từ tên và vẫn có thể chỉnh.</span><FieldError message={state.fieldErrors.slug} /></label>
        {product ? <div><span className="text-sm font-bold text-slate-200">Mã dữ liệu cũ</span><div className="mt-2 flex h-11 items-center truncate rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 font-mono text-xs text-slate-500">{product.legacyId || "Không có"}</div></div> : <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-xs leading-5 text-slate-500">Loại sản phẩm được cố định sau khi lưu bản nháp đầu tiên.</div>}
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Mô tả ngắn</span><textarea form={formId} name="shortDescription" required maxLength={500} rows={3} defaultValue={product?.shortDescription ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.shortDescription} /></label>
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Mô tả chi tiết</span><textarea form={formId} name="fullDescription" maxLength={20000} rows={9} defaultValue={product?.fullDescription ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.fullDescription} /></label>
      </FormSection>

      <FormSection step={3} title="Ảnh bìa" description="Ảnh dọc 9:16, tối đa 5 MB; dùng chung cơ chế Supabase Storage hiện có.">
        <div className="md:col-span-2">{product ? <ProductCoverUpload productId={product.id} title={product.title} currentCover={product.coverImage} embedded /> : <div className="grid gap-4 rounded-xl border border-dashed border-sky-300/20 bg-[#07111F]/70 p-5 sm:grid-cols-[90px_minmax(0,1fr)] sm:items-center"><div className="grid aspect-[9/16] w-[72px] place-items-center rounded-lg border border-white/10 bg-white/[0.025] text-slate-600"><ImagePlus className="h-6 w-6" /></div><div><p className="text-sm font-extrabold text-white">Lưu bản nháp trước để tải ảnh</p><p className="mt-2 text-xs leading-5 text-slate-500">Sau khi tạo, hệ thống chuyển thẳng tới trang chỉnh sửa để bạn tải ảnh và hoàn thiện sản phẩm trước khi xuất bản.</p></div></div>}</div>
      </FormSection>

      <FormSection step={4} title="Giá bán" description="Preview dùng cùng quy tắc giá bán và giá so sánh ngoài catalog.">
        <label className="block"><span className="text-sm font-bold text-slate-200">Giá hiện tại (VND)</span><input form={formId} name="price" type="number" inputMode="numeric" min={0} max={999999999999} step={1} value={price} onChange={(event) => setPrice(event.target.value)} className={inputClass} /><FieldError message={state.fieldErrors.price} /></label>
        <label className="block"><span className="text-sm font-bold text-slate-200">Giá so sánh (VND)</span><input form={formId} name="originalPrice" type="number" inputMode="numeric" min={0} max={999999999999} step={1} value={originalPrice} onChange={(event) => setOriginalPrice(event.target.value)} className={inputClass} /><FieldError message={state.fieldErrors.originalPrice} /></label>
        <div className="md:col-span-2 rounded-xl border border-amber-300/25 bg-gradient-to-r from-amber-400/[0.09] to-rose-500/[0.05] p-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-300">Xem trước giá ngoài website</p><div className="mt-2 flex flex-wrap items-baseline gap-3"><strong className="text-2xl font-black text-amber-200">{formatPrice(price)}</strong>{originalPrice ? <span className="text-sm font-bold text-slate-400 line-through">{formatPrice(originalPrice)}</span> : null}{discount ? <span className="rounded-full bg-rose-500 px-2 py-1 text-[10px] font-black text-white">-{discount}%</span> : null}</div></div>
        <label className="block"><span className="text-sm font-bold text-slate-200">Loại truy cập</span><select form={formId} name="accessType" defaultValue={product?.accessType ?? "paid"} className={inputClass}><option value="paid">Trả phí</option><option value="free">Miễn phí</option></select><FieldError message={state.fieldErrors.accessType} /></label>
        <label className="flex min-h-12 items-center gap-3 self-end rounded-xl border border-white/[0.08] bg-[#07111F] px-4"><input form={formId} name="sellable" type="checkbox" defaultChecked={product?.sellable ?? false} className="h-4 w-4 accent-sky-500" /><span><b className="block text-sm text-slate-200">Cho phép mua trực tiếp</b><small className="text-xs text-slate-500">Chỉ Chatbot/AI App trả phí đang bán.</small></span></label>
        <FieldError message={state.fieldErrors.sellable} />
      </FormSection>

      <FormSection step={5} title="Nội dung trang chi tiết" description={`Chỉ gồm các trường template ${getProductTypeLabel(productType)} hiện đang sử dụng.`}>
        <MetadataEditor key={`${mode}-${productType}`} formId={formId} productType={productType} metadata={product?.metadata ?? {}} />
        <div className="md:col-span-2"><FieldError message={state.fieldErrors.metadata} /></div>
      </FormSection>

      <FormSection step={6} title="Video demo YouTube" description="Có thể để trống và bổ sung sau; hệ thống không tự tạo link demo.">
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Link video YouTube</span><input form={formId} name="demoVideoUrl" type="url" maxLength={2048} defaultValue={product?.demoVideo ? getYouTubeWatchUrl(product.demoVideo.id) : ""} placeholder="https://www.youtube.com/watch?v=..." className={inputClass} /><span className="mt-2 block text-xs leading-5 text-slate-500">Để trống khi chưa có video. Trên trang chi tiết sẽ hiển thị trạng thái đang cập nhật.</span><FieldError message={state.fieldErrors.demoVideoUrl} /></label>
        {product?.demoVideo ? <div className="md:col-span-2 grid gap-4 rounded-xl border border-white/[0.08] bg-[#07111F] p-4 sm:grid-cols-[180px_minmax(0,1fr)]"><img src={getYouTubeThumbnailUrl(product.demoVideo.id)} alt={`Thumbnail video demo ${product.title}`} className="aspect-video w-full rounded-lg border border-white/10 object-cover" /><div className="min-w-0 self-center"><p className="flex items-center gap-2 text-sm font-extrabold text-white"><PlayCircle className="h-4 w-4 text-red-300" />Video hiện tại</p><a href={getYouTubeWatchUrl(product.demoVideo.id)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-9 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white">Mở trên YouTube<ExternalLink className="h-3.5 w-3.5" /></a></div></div> : <div className="md:col-span-2 flex items-center gap-3 rounded-xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500"><PlayCircle className="h-5 w-5" />Chưa có video demo.</div>}
      </FormSection>

      <FormSection step={7} title="Trạng thái" description="Kiểm tra kỹ ảnh, giá và nội dung trước khi xuất bản.">
        {mode === "create" ? <div><span className="text-sm font-bold text-slate-200">Xuất bản</span><div className="mt-2 flex h-11 items-center rounded-xl border border-amber-300/20 bg-amber-400/10 px-3 text-sm font-bold text-amber-200">Bản nháp · an toàn khi tạo</div></div> : <label className="block"><span className="text-sm font-bold text-slate-200">Trạng thái xuất bản</span><select form={formId} name="publicationStatus" defaultValue={product?.publicationStatus} className={inputClass}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option><option value="hidden">Đã ẩn</option></select><FieldError message={state.fieldErrors.publicationStatus} /></label>}
        <label className="block"><span className="text-sm font-bold text-slate-200">Trạng thái bán hàng</span><select form={formId} name="salesStatus" defaultValue={product?.salesStatus ?? "coming_soon"} className={inputClass}><option value="coming_soon">Sắp ra mắt</option><option value="on_sale">Đang bán</option><option value="paused">Tạm dừng</option></select><FieldError message={state.fieldErrors.salesStatus} /></label>
        <label className="md:col-span-2 flex min-h-16 items-start gap-3 rounded-xl border border-sky-300/20 bg-sky-500/[0.07] px-4 py-3"><input form={formId} name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured ?? false} className="mt-0.5 h-4 w-4 shrink-0 accent-sky-500" /><span><b className="block text-sm text-sky-100">Hiển thị sản phẩm trên trang chủ</b><small className="mt-1 block text-xs leading-5 text-slate-400">{homepageVisibilityNote}</small></span></label>
        <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Thứ tự ưu tiên hiển thị</span><input form={formId} name="displayOrder" type="number" required min={-999999} max={999999} step={1} defaultValue={product?.displayOrder ?? 0} className={inputClass} /><span className="mt-1.5 block text-xs leading-5 text-slate-500">Số nhỏ hơn hiển thị trước. Khi trùng số, hệ thống giữ thứ tự ổn định theo thời điểm tạo và mã sản phẩm.</span><FieldError message={state.fieldErrors.displayOrder} /></label>
        <div className="md:col-span-2 flex gap-3 rounded-xl border border-amber-300/15 bg-amber-400/[0.06] p-4 text-xs leading-5 text-amber-100/80"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><p>“Đã xuất bản” quyết định khả năng xuất hiện công khai. “Đang bán” và “Cho phép mua trực tiếp” chỉ hoạt động khi sản phẩm đáp ứng đủ điều kiện giá và loại sản phẩm.</p></div>
      </FormSection>

      <details className="rounded-2xl border border-white/[0.08] bg-[#0B1728]">
        <summary className="cursor-pointer list-none px-5 py-4 text-sm font-extrabold text-slate-200 sm:px-6">Nâng cao · SEO, liên kết và sắp xếp</summary>
        <div className="grid gap-5 border-t border-white/[0.07] p-5 sm:p-6 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Đường dẫn trang chi tiết</span><input form={formId} name="detailUrl" maxLength={2048} value={detailUrl} onChange={(event) => { detailUrlWasEdited.current = true; setDetailUrl(event.target.value); }} placeholder={getSuggestedDetailUrl(productType, slug) || "/duong-dan-landing-page"} className={inputClass} /><span className="mt-1.5 block text-xs text-slate-500">Đã gợi ý theo loại sản phẩm; không đổi URL sản phẩm cũ nếu không cần.</span><FieldError message={state.fieldErrors.detailUrl} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Affiliate URL</span><input form={formId} name="affiliateUrl" type="url" maxLength={2048} defaultValue={product?.affiliateUrl ?? ""} placeholder="https://..." className={inputClass} /><FieldError message={state.fieldErrors.affiliateUrl} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Link truy cập bên ngoài</span><input form={formId} name="externalUrl" type="url" maxLength={2048} defaultValue={product?.externalUrl ?? ""} placeholder="https://..." className={inputClass} /><FieldError message={state.fieldErrors.externalUrl} /></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Tags</span><textarea form={formId} name="tags" rows={2} defaultValue={product?.tags.join(", ") ?? ""} placeholder="AI App, Video AI, Marketing" className={textareaClass} /><span className="mt-1.5 block text-xs text-slate-500">Phân cách bằng dấu phẩy.</span><FieldError message={state.fieldErrors.tags} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Badge</span><input form={formId} name="badge" maxLength={60} defaultValue={product?.badge ?? ""} placeholder="HOT, NỔI BẬT..." className={inputClass} /><FieldError message={state.fieldErrors.badge} /></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">SEO title</span><input form={formId} name="seoTitle" maxLength={160} defaultValue={product?.seoTitle ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.seoTitle} /></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">SEO description</span><textarea form={formId} name="seoDescription" maxLength={320} rows={3} defaultValue={product?.seoDescription ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.seoDescription} /></label>
          {Object.keys(unknownMetadata).length ? <div className="md:col-span-2"><p className="text-sm font-bold text-slate-200">Metadata cũ được bảo toàn tự động</p><pre className="mt-2 max-h-64 overflow-auto rounded-xl border border-white/[0.07] bg-[#07111F] p-4 text-xs leading-6 text-slate-400">{JSON.stringify(unknownMetadata, null, 2)}</pre><p className="mt-2 text-xs text-slate-500">Các key template khác hoặc dữ liệu cũ không bị xóa khi lưu.</p></div> : null}
        </div>
      </details>

      <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#08111E]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur"><p className="hidden text-xs text-slate-500 sm:block">{dirty ? "Có thay đổi chưa lưu" : "Chưa có thay đổi"}</p><div className="ml-auto flex flex-wrap gap-2"><Link href={cancelHref} className="inline-flex min-h-11 items-center rounded-xl border border-white/10 px-5 text-sm font-bold text-slate-300 hover:text-white">Hủy</Link><button form={formId} type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "create" ? <Plus className="h-4 w-4" /> : <Save className="h-4 w-4" />}{pending ? "Đang lưu..." : mode === "create" ? "Lưu bản nháp và thêm ảnh" : "Lưu thay đổi"}</button></div></div>
    </div>
  );
}

export function ProductEditForm({ product, categories }: { product: AdminProduct; categories: AdminCategory[] }) {
  return <ProductForm mode="edit" product={product} categories={categories} />;
}

export function ProductCreateForm({ categories }: { categories: AdminCategory[] }) {
  return <ProductForm mode="create" categories={categories} />;
}
