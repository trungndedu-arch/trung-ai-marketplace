"use client";

import Link from "next/link";
import { Loader2, Plus, Save } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBanner, updateBanner } from "@/lib/admin/banner-actions";
import type { AdminBanner } from "@/lib/admin/banners";
import type { BannerMutationState } from "@/lib/admin/banner-validation";

const initialState: BannerMutationState = { status: "idle", message: "", fieldErrors: {} };
const inputClass = "mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";
const textareaClass = "mt-2 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{message}</span> : null;
}

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  const Icon = mode === "create" ? Plus : Save;
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {pending ? "Đang lưu..." : mode === "create" ? "Tạo bản nháp" : "Lưu thay đổi"}
    </button>
  );
}

function toLocalInputValue(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  const localTime = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 16);
}

export function BannerForm({ banner }: { banner?: AdminBanner }) {
  const mode = banner ? "edit" : "create";
  const action = mode === "edit" ? updateBanner : createBanner;
  const [state, formAction] = useActionState(action, initialState);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const timezoneOffsetRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStartAt(toLocalInputValue(banner?.startAt ?? null));
    setEndAt(toLocalInputValue(banner?.endAt ?? null));
  }, [banner?.endAt, banner?.startAt]);

  function syncTimezone() {
    if (timezoneOffsetRef.current) timezoneOffsetRef.current.value = String(new Date().getTimezoneOffset());
  }

  return (
    <form action={formAction} onSubmit={syncTimezone} className="space-y-5">
      {banner ? <input type="hidden" name="id" value={banner.id} /> : null}
      <input ref={timezoneOffsetRef} type="hidden" name="timezoneOffset" defaultValue="0" />
      {state.message ? <div role="alert" className="rounded-lg border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold text-rose-100">{state.message}</div> : null}

      <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
        <h2 className="text-base font-extrabold text-white">Nội dung banner</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Tiêu đề</span><input name="title" required maxLength={160} defaultValue={banner?.title ?? ""} className={inputClass} /><FieldError message={state.fieldErrors.title} /></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Mô tả phụ</span><textarea name="subtitle" maxLength={500} rows={4} defaultValue={banner?.subtitle ?? ""} className={textareaClass} /><FieldError message={state.fieldErrors.subtitle} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Nhãn CTA</span><input name="ctaLabel" maxLength={80} defaultValue={banner?.ctaLabel ?? ""} placeholder="Khám phá ngay" className={inputClass} /><FieldError message={state.fieldErrors.ctaLabel} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">URL CTA</span><input name="ctaUrl" maxLength={2048} defaultValue={banner?.ctaUrl ?? ""} placeholder="/workflow hoặc https://..." className={inputClass} /><FieldError message={state.fieldErrors.ctaUrl} /></label>
        </div>
      </section>

      <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
        <h2 className="text-base font-extrabold text-white">Hiển thị</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block"><span className="text-sm font-bold text-slate-200">Vị trí</span><input readOnly value="Banner trang chủ" className={`${inputClass} cursor-not-allowed text-slate-400`} /><span className="mt-2 block text-xs text-slate-500">Hệ thống lưu cố định dưới mã home_hero.</span></label>
          {banner ? (
            <label className="block"><span className="text-sm font-bold text-slate-200">Trạng thái xuất bản</span><select name="status" defaultValue={banner.status} className={inputClass}><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option><option value="hidden">Đã ẩn</option></select><FieldError message={state.fieldErrors.status} /></label>
          ) : (
            <label className="block"><span className="text-sm font-bold text-slate-200">Trạng thái xuất bản</span><input readOnly value="Bản nháp" className={`${inputClass} cursor-not-allowed text-slate-400`} /><span className="mt-2 block text-xs text-slate-500">Tải ảnh desktop trong trang chỉnh sửa trước khi xuất bản.</span></label>
          )}
          <label className="block"><span className="text-sm font-bold text-slate-200">Bắt đầu hiển thị</span><input name="startAt" type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} className={inputClass} /><FieldError message={state.fieldErrors.startAt} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Kết thúc hiển thị</span><input name="endAt" type="datetime-local" value={endAt} onChange={(event) => setEndAt(event.target.value)} className={inputClass} /><FieldError message={state.fieldErrors.endAt} /></label>
          {state.fieldErrors.schedule ? <div className="md:col-span-2"><FieldError message={state.fieldErrors.schedule} /></div> : null}
          <label className="block"><span className="text-sm font-bold text-slate-200">Thứ tự hiển thị</span><input name="sortOrder" type="number" required min={0} max={999999} step={1} defaultValue={banner?.sortOrder ?? 0} className={inputClass} /><FieldError message={state.fieldErrors.sortOrder} /></label>
        </div>
      </section>

      <div className="sticky bottom-3 z-20 flex flex-wrap items-center justify-end gap-3 rounded-lg border border-white/10 bg-[#08111E]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur">
        <Link href="/admin/banners" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-5 text-sm font-bold text-slate-300 hover:text-white">Hủy</Link>
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}
