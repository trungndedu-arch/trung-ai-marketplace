"use client";

import { Save } from "lucide-react";
import { useActionState } from "react";
import { updateFreeAiLearningSettings } from "@/lib/admin/free-ai-learning-actions";
import { initialFreeAiLearningSettingsState } from "@/lib/admin/free-ai-learning-validation";
import type { FreeAiLearningSettings } from "@/lib/free-ai-learning";

const inputClass = "mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50";

export function FreeAiLearningSettingsForm({ settings, visibleCount }: { settings: FreeAiLearningSettings; visibleCount: number }) {
  const [state, action, pending] = useActionState(updateFreeAiLearningSettings, initialFreeAiLearningSettingsState);
  return <form action={action} className="rounded-xl border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-extrabold text-white">Cấu hình homepage</h2><p className="mt-1 text-sm text-slate-400">Section chỉ xuất hiện khi đã bật và có ít nhất một video đang hiển thị.</p></div><span className={`rounded-full border px-3 py-1 text-xs font-bold ${visibleCount > 6 ? "border-amber-300/25 bg-amber-400/10 text-amber-100" : "border-sky-300/20 bg-sky-400/10 text-sky-100"}`}>{visibleCount} video bật · hiển thị tối đa 6</span></div>
    {state.status !== "idle" ? <p role="status" className={`mt-4 rounded-lg border px-4 py-3 text-sm ${state.status === "success" ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100" : "border-rose-300/20 bg-rose-400/10 text-rose-100"}`}>{state.message}</p> : null}
    <div className="mt-5 grid gap-5 md:grid-cols-2">
      <label className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-[#07111F]/60 p-4 text-sm text-slate-300"><input name="sectionEnabled" type="checkbox" defaultChecked={settings.sectionEnabled} className="mt-0.5 h-4 w-4 accent-sky-400" /><span><b className="block text-white">Bật section trên trang chủ</b><span className="mt-1 block text-xs text-slate-500">Menu Học AI Miễn Phí chỉ hoạt động khi section có video công khai.</span></span></label>
      <label className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-[#07111F]/60 p-4 text-sm text-slate-300"><input name="channelButtonEnabled" type="checkbox" defaultChecked={settings.channelButtonEnabled} className="mt-0.5 h-4 w-4 accent-sky-400" /><span><b className="block text-white">Hiển thị nút xem thêm</b><span className="mt-1 block text-xs text-slate-500">Cần URL kênh YouTube hợp lệ.</span></span></label>
      <label className="block md:col-span-2"><span className="text-sm font-bold text-slate-200">URL kênh YouTube</span><input name="youtubeChannelUrl" type="url" maxLength={2048} defaultValue={settings.youtubeChannelUrl} placeholder="https://www.youtube.com/@tenkenh" className={inputClass} />{state.fieldErrors.youtubeChannelUrl ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{state.fieldErrors.youtubeChannelUrl}</span> : null}</label>
    </div>
    <div className="mt-5 flex justify-end"><button disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" />{pending ? "Đang lưu..." : "Lưu cấu hình"}</button></div>
  </form>;
}
