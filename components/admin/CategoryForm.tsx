"use client";

import Link from "next/link";
import { Loader2, Plus, Save } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { getProductTypeLabel } from "@/components/admin/AdminProductUi";
import { createCategory, updateCategory } from "@/lib/admin/category-actions";
import type { AdminCategoryDetail } from "@/lib/admin/categories";
import type { CategoryMutationState } from "@/lib/admin/category-validation";
import { PRODUCT_TYPES } from "@/lib/admin/product-validation";

const initialState: CategoryMutationState = { status: "idle", message: "", fieldErrors: {} };
const inputClass = "mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";
const textareaClass = "mt-2 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{message}</span> : null;
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  const Icon = mode === "create" ? Plus : Save;
  return <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}{pending ? "Đang lưu..." : mode === "create" ? "Tạo danh mục" : "Lưu thay đổi"}</button>;
}

export function CategoryForm({ category }: { category?: AdminCategoryDetail }) {
  const mode = category ? "edit" : "create";
  const action = mode === "edit" ? updateCategory : createCategory;
  const [state, formAction] = useActionState(action, initialState);
  const productTypeLocked = Boolean(category && category.productCount > 0);

  return (
    <form action={formAction} className="space-y-5">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      {state.message ? <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">{state.message}</div> : null}

      <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
        <h2 className="text-base font-extrabold text-white">Thông tin danh mục</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Tên danh mục</span><input name="name" required maxLength={120} defaultValue={category?.name ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.name} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Slug</span><input name="slug" required maxLength={120} defaultValue={category?.slug ?? ""} placeholder="ten-danh-muc" className={inputClass} /><span className="mt-2 block text-xs leading-5 text-slate-500">Hệ thống chuẩn hóa chữ thường, bỏ dấu và thay khoảng trắng bằng dấu gạch ngang.</span><FieldError message={state.fieldErrors.slug} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Loại sản phẩm</span>{productTypeLocked ? <><input type="hidden" name="productType" value={category?.productType ?? ""} /><select disabled value={category?.productType ?? ""} className={`${inputClass} cursor-not-allowed text-slate-500`}><option value="">Dùng chung mọi loại</option>{PRODUCT_TYPES.map((value) => <option key={value} value={value}>{getProductTypeLabel(value)}</option>)}</select><span className="mt-2 block text-xs leading-5 text-amber-300/80">Đã khóa vì có {category?.productCount} sản phẩm đang sử dụng.</span></> : <select name="productType" defaultValue={category?.productType ?? ""} className={inputClass}><option value="">Dùng chung mọi loại</option>{PRODUCT_TYPES.map((value) => <option key={value} value={value}>{getProductTypeLabel(value)}</option>)}</select>}<FieldError message={state.fieldErrors.productType} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Thứ tự hiển thị</span><input name="displayOrder" type="number" required min={-999999} max={999999} step={1} defaultValue={category?.displayOrder ?? 0} className={inputClass} /><FieldError message={state.fieldErrors.displayOrder} /></label>
          <label className="flex min-h-12 items-center gap-3 self-end rounded-lg border border-white/[0.08] bg-[#07111F] px-4"><input name="isActive" type="checkbox" defaultChecked={category?.isActive ?? true} className="h-4 w-4 accent-sky-500" /><span><b className="block text-sm text-slate-200">Đang hoạt động</b><small className="text-xs text-slate-500">Danh mục tắt sẽ không thể chọn cho sản phẩm mới.</small></span></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Mô tả</span><textarea name="description" maxLength={1000} rows={5} defaultValue={category?.description ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.description} /></label>
        </div>
      </section>

      <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-end gap-3 rounded-lg border border-white/10 bg-[#08111E]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur"><Link href="/admin/categories" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-5 text-sm font-bold text-slate-300 hover:text-white">Hủy</Link><SubmitButton mode={mode} /></div>
    </form>
  );
}
