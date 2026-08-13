"use client";

import { CircleAlert, Loader2, Save, ShieldCheck } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updatePaymentSettings } from "@/lib/admin/payment-settings-actions";
import type { AdminPaymentSettings } from "@/lib/admin/payment-settings";
import type { PaymentSettingsMutationState } from "@/lib/admin/payment-settings-validation";

const initialState: PaymentSettingsMutationState = { status: "idle", message: "", fieldErrors: {} };
const inputClass = "mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";
const textareaClass = "mt-2 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{message}</span> : null;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{pending ? "Đang lưu..." : "Lưu cấu hình"}</button>;
}

export function PaymentSettingsForm({ settings }: { settings: AdminPaymentSettings }) {
  const [state, formAction] = useActionState(updatePaymentSettings, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? <div role="alert" className={`rounded-lg border px-4 py-3 text-sm font-semibold ${state.status === "success" ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100" : "border-rose-300/20 bg-rose-400/10 text-rose-100"}`}>{state.message}</div> : null}
      {settings.hasPublicValues ? <div className="flex items-start gap-3 rounded-lg border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />Có cấu hình thanh toán đang để public. Khi lưu, sáu khóa bên dưới sẽ được chuyển về private.</div> : null}

      <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
        <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-sky-300" /><h2 className="text-base font-extrabold text-white">Thanh toán</h2></div>
        <p className="mt-2 text-sm leading-6 text-slate-400">Các giá trị này được lưu private để Checkout phía server sử dụng trong giai đoạn tiếp theo.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block"><span className="text-sm font-bold text-slate-200">Tên ngân hàng</span><input name="bankName" required maxLength={120} defaultValue={settings.bankName} placeholder="Ví dụ: Ngân hàng Quốc tế VIB" autoComplete="organization" className={inputClass} /><FieldError message={state.fieldErrors.bankName} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Mã BIN ngân hàng</span><input name="bankBin" required inputMode="numeric" pattern="[0-9]{6}" minLength={6} maxLength={6} defaultValue={settings.bankBin} placeholder="Ví dụ: 970441" autoComplete="off" className={inputClass} /><span className="mt-2 block text-xs text-slate-500">Luôn lưu dưới dạng chuỗi gồm đúng 6 chữ số.</span><FieldError message={state.fieldErrors.bankBin} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Số tài khoản</span><input name="accountNumber" required maxLength={50} defaultValue={settings.accountNumber} placeholder="Giữ nguyên số 0 ở đầu" autoComplete="off" className={inputClass} /><FieldError message={state.fieldErrors.accountNumber} /></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Chủ tài khoản</span><input name="accountHolder" required maxLength={120} defaultValue={settings.accountHolder} placeholder="Tên chủ tài khoản" autoComplete="name" className={inputClass} /><FieldError message={state.fieldErrors.accountHolder} /></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Hướng dẫn thanh toán</span><textarea name="instructions" required maxLength={2000} rows={6} defaultValue={settings.instructions} placeholder="Hướng dẫn khách hàng chuyển khoản và gửi xác nhận" className={textareaClass} /><FieldError message={state.fieldErrors.instructions} /></label>
          <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">Zalo hỗ trợ <span className="font-medium text-slate-500">(không bắt buộc)</span></span><input name="zaloPhone" type="tel" maxLength={50} defaultValue={settings.zaloPhone} placeholder="Ví dụ: 0869823437" autoComplete="tel" className={inputClass} /><span className="mt-2 block text-xs text-slate-500">Lưu số điện thoại, không lưu URL hoặc nội dung HTML.</span><FieldError message={state.fieldErrors.zaloPhone} /></label>
        </div>
      </section>

      <div className="sticky bottom-3 z-20 flex justify-end rounded-lg border border-white/10 bg-[#08111E]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur"><SubmitButton /></div>
    </form>
  );
}
