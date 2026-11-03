"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { updateHomepageContactLinks } from "@/lib/admin/contact-links-actions";
import { initialContactLinksMutationState } from "@/lib/admin/contact-links-validation";
import type { HomepageContactLinks } from "@/lib/homepage-contact-links";

const inputClass = "mt-1 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/50";
const platforms = [
  ["facebook", "Facebook", "facebookUrl", "facebookLabel", "facebookEnabled"],
  ["zalo", "Zalo", "zaloUrl", "zaloLabel", "zaloEnabled"],
  ["youtube", "YouTube", "youtubeUrl", "youtubeLabel", "youtubeEnabled"],
] as const;

function ErrorText({ message }: { message?: string }) { return message ? <span className="mt-1 block text-xs text-rose-300">{message}</span> : null; }

export function ContactLinksForm({ settings }: { settings: HomepageContactLinks }) {
  const [state, action, pending] = useActionState(updateHomepageContactLinks, initialContactLinksMutationState);
  return <form action={action} className="space-y-6">
    {state.status !== "idle" ? <p className={`rounded-lg border px-4 py-3 text-sm ${state.status === "success" ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100" : "border-rose-300/20 bg-rose-400/10 text-rose-100"}`}>{state.message}</p> : null}
    <section className="rounded-xl border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6"><h2 className="text-lg font-extrabold text-white">Liên kết hiển thị trên trang chủ</h2><p className="mt-1 text-sm text-slate-400">Chỉ nút đã bật và có URL hợp lệ mới xuất hiện công khai.</p><div className="mt-5 space-y-5">{platforms.map(([platform, name, urlName, labelName, enabledName]) => { const link = settings[platform]; return <div key={platform} className="rounded-lg border border-white/[0.08] bg-[#07111F]/60 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-bold text-white">{name}</h3><label className="inline-flex items-center gap-2 text-sm font-bold text-slate-200"><input name={enabledName} type="checkbox" defaultChecked={link.enabled} className="h-4 w-4 accent-sky-400" />Hiển thị</label></div><div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]"><label className="block"><span className="text-sm font-semibold text-slate-300">URL</span><input name={urlName} type="url" defaultValue={link.url} placeholder={`https://${platform === "youtube" ? "youtube.com/..." : platform === "facebook" ? "facebook.com/..." : "zalo.me/..."}`} className={inputClass} /><ErrorText message={state.fieldErrors[urlName]} /></label><label className="block"><span className="text-sm font-semibold text-slate-300">Nhãn nút</span><input name={labelName} maxLength={40} defaultValue={link.label} className={inputClass} /><ErrorText message={state.fieldErrors[labelName]} /></label></div></div>; })}</div></section>
    <section className="rounded-xl border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6"><h2 className="text-lg font-extrabold text-white">Hỗ trợ & xem trước</h2><label className="mt-4 block"><span className="text-sm font-semibold text-slate-300">Dòng CTA hỗ trợ</span><textarea name="supportCta" maxLength={300} rows={3} defaultValue={settings.supportCta} className={inputClass} /><ErrorText message={state.fieldErrors.supportCta} /></label><label className="mt-4 flex items-start gap-3 rounded-lg border border-white/[0.08] bg-[#07111F]/60 p-4 text-sm text-slate-300"><input name="floatingZaloEnabled" type="checkbox" defaultChecked={settings.floatingZaloEnabled} className="mt-0.5 h-4 w-4 accent-sky-400" /><span><b className="block text-white">Bật nút Zalo nổi</b><span className="mt-1 block text-xs text-slate-500">Chỉ hiển thị khi Zalo đã bật và URL hợp lệ.</span></span></label><ErrorText message={state.fieldErrors.floatingZaloEnabled} /><div className="mt-5 rounded-lg border border-dashed border-sky-300/20 bg-sky-400/[0.04] p-4"><p className="text-xs font-black uppercase tracking-wider text-sky-300">Preview bố cục</p><div className="mt-3 flex flex-wrap gap-2">{platforms.map(([platform, name]) => <span key={platform} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-200">{settings[platform].label || name}</span>)}</div><p className="mt-3 text-xs text-slate-400">{settings.supportCta}</p></div></section>
    <div className="flex justify-end"><button disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" />{pending ? "Đang lưu..." : "Lưu kênh liên hệ"}</button></div>
  </form>;
}
