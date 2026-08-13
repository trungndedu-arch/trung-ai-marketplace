"use client";

import Link from "next/link";
import { BadgePercent, Loader2, Plus, Save } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { formatAdminPrice, getProductTypeLabel } from "@/components/admin/AdminProductUi";
import { createFlashSale, updateFlashSale } from "@/lib/admin/flash-sale-actions";
import type { AdminFlashSale, AdminFlashSaleProduct } from "@/lib/admin/flash-sales";
import type { FlashSaleMutationState } from "@/lib/admin/flash-sale-validation";

const initialState: FlashSaleMutationState = { status: "idle", message: "", fieldErrors: {} };
const inputClass = "mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{message}</span> : null;
}

function SubmitButton({ mode, disabled }: { mode: "create" | "edit"; disabled: boolean }) {
  const { pending } = useFormStatus();
  const Icon = mode === "create" ? Plus : Save;
  return (
    <button type="submit" disabled={pending || disabled} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {pending ? "Đang lưu..." : mode === "create" ? "Tạo Flash Sale" : "Lưu thay đổi"}
    </button>
  );
}

function toLocalInputValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}

export function FlashSaleForm({
  flashSale,
  eligibleProducts = [],
}: {
  flashSale?: AdminFlashSale;
  eligibleProducts?: AdminFlashSaleProduct[];
}) {
  const mode = flashSale ? "edit" : "create";
  const [state, formAction] = useActionState(mode === "edit" ? updateFlashSale : createFlashSale, initialState);
  const [productId, setProductId] = useState(flashSale?.productId ?? eligibleProducts[0]?.id ?? "");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const timezoneOffsetRef = useRef<HTMLInputElement>(null);
  const selectedProduct = flashSale?.product ?? eligibleProducts.find((product) => product.id === productId) ?? null;

  useEffect(() => {
    setStartAt(toLocalInputValue(flashSale?.startAt));
    setEndAt(toLocalInputValue(flashSale?.endAt));
  }, [flashSale?.endAt, flashSale?.startAt]);

  function syncTimezone() {
    if (timezoneOffsetRef.current) timezoneOffsetRef.current.value = String(new Date().getTimezoneOffset());
  }

  return (
    <form action={formAction} onSubmit={syncTimezone} className="space-y-5">
      {flashSale ? <input type="hidden" name="id" value={flashSale.id} /> : null}
      <input ref={timezoneOffsetRef} type="hidden" name="timezoneOffset" defaultValue="0" />
      {state.message ? <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">{state.message}</div> : null}

      <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
        <div className="flex items-center gap-2"><BadgePercent className="h-5 w-5 text-sky-300" /><h2 className="text-base font-extrabold text-white">Thông tin Flash Sale</h2></div>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {flashSale ? (
            <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Sản phẩm</span><input readOnly value={`${flashSale.product.title} · ${formatAdminPrice(flashSale.product.price, flashSale.product.currency)}`} className={`${inputClass} cursor-not-allowed text-slate-400`} /><span className="mt-2 block text-xs text-slate-500">Sản phẩm được khóa trong giai đoạn này. Hãy tạo Flash Sale mới nếu cần áp dụng cho sản phẩm khác.</span><FieldError message={state.fieldErrors.productId} /></label>
          ) : (
            <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Sản phẩm</span><select name="productId" required value={productId} onChange={(event) => setProductId(event.target.value)} className={inputClass}>{eligibleProducts.length === 0 ? <option value="">Không có sản phẩm đủ điều kiện</option> : eligibleProducts.map((product) => <option key={product.id} value={product.id}>{product.title} · {getProductTypeLabel(product.productType)} · {formatAdminPrice(product.price, product.currency)}</option>)}</select><span className="mt-2 block text-xs text-slate-500">Chỉ hiển thị Chatbot/AI App trả phí, đang bán, đã xuất bản và có thể mua.</span><FieldError message={state.fieldErrors.productId} /></label>
          )}

          <label className="block"><span className="text-sm font-bold text-slate-200">Giá Flash Sale</span><input name="salePrice" type="number" required min={0} max={999999999999} step={1} defaultValue={flashSale?.salePrice ?? ""} placeholder="0" className={inputClass} /><span className="mt-2 block text-xs text-slate-500">Giá bán hiện tại: {selectedProduct ? formatAdminPrice(selectedProduct.price, selectedProduct.currency) : "—"}</span><FieldError message={state.fieldErrors.salePrice} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Trạng thái</span><select name="status" defaultValue={flashSale?.status ?? "scheduled"} className={inputClass}><option value="scheduled">Lên lịch tự động</option><option value="active">Hoạt động</option><option value="paused">Tạm dừng</option><option value="ended">Đã kết thúc</option></select><span className="mt-2 block text-xs text-slate-500">“Lên lịch tự động” và “Hoạt động” đều áp dụng giá sale trong đúng khung giờ. “Tạm dừng” và “Đã kết thúc” luôn vô hiệu.</span><FieldError message={state.fieldErrors.status} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Bắt đầu</span><input name="startAt" type="datetime-local" required value={startAt} onChange={(event) => setStartAt(event.target.value)} className={inputClass} /><FieldError message={state.fieldErrors.startAt} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Kết thúc</span><input name="endAt" type="datetime-local" required value={endAt} onChange={(event) => setEndAt(event.target.value)} className={inputClass} /><FieldError message={state.fieldErrors.endAt} /></label>
          {state.fieldErrors.schedule ? <div className="md:col-span-2"><FieldError message={state.fieldErrors.schedule} /></div> : null}
        </div>
      </section>

      <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-end gap-3 rounded-lg border border-white/10 bg-[#08111E]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur"><Link href="/admin/flash-sales" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-5 text-sm font-bold text-slate-300 hover:text-white">Hủy</Link><SubmitButton mode={mode} disabled={mode === "create" && eligibleProducts.length === 0} /></div>
    </form>
  );
}
