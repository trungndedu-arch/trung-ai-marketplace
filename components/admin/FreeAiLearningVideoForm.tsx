"use client";

import Link from "next/link";
import { Loader2, Plus, Save, Youtube } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createFreeAiLearningVideo, updateFreeAiLearningVideo } from "@/lib/admin/free-ai-learning-actions";
import { YouTubeThumbnail } from "@/components/shared/YouTubeThumbnail";
import { initialFreeAiLearningVideoState } from "@/lib/admin/free-ai-learning-validation";
import type { AdminFreeAiLearningVideo } from "@/lib/admin/free-ai-learning";
import { parseYouTubeVideoUrl } from "@/lib/youtube";

const inputClass = "mt-2 h-11 w-full rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/10";

function FieldError({ message }: { message?: string }) {
  return message ? <span className="mt-1.5 block text-xs font-semibold text-rose-300">{message}</span> : null;
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  const Icon = editing ? Save : Plus;
  return <button disabled={pending} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-wait disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}{pending ? "Đang lưu..." : editing ? "Lưu thay đổi" : "Thêm video"}</button>;
}

export function FreeAiLearningVideoForm({ video }: { video?: AdminFreeAiLearningVideo }) {
  const editing = Boolean(video);
  const [state, action] = useActionState(editing ? updateFreeAiLearningVideo : createFreeAiLearningVideo, initialFreeAiLearningVideoState);
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl ?? "");
  const previewId = useMemo(() => parseYouTubeVideoUrl(videoUrl), [videoUrl]);

  return <form action={action} className="space-y-6">
    {video ? <><input type="hidden" name="id" value={video.id} /><input type="hidden" name="updatedAt" value={video.updatedAt} /></> : null}
    {state.message ? <p role="alert" className="rounded-lg border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{state.message}</p> : null}
    <section className="rounded-xl border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
      <h2 className="text-lg font-extrabold text-white">Thông tin video YouTube</h2>
      <p className="mt-1 text-sm text-slate-400">Hỗ trợ URL watch, youtu.be, Shorts và YouTube Live. Hệ thống không tự lấy tiêu đề.</p>
      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <label className="block"><span className="text-sm font-bold text-slate-200">URL video YouTube</span><input name="videoUrl" type="url" required maxLength={2048} value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." className={inputClass} /><FieldError message={state.fieldErrors.videoUrl} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Tiêu đề video</span><input name="title" required maxLength={200} defaultValue={video?.title ?? ""} className={inputClass} /><span className="mt-2 block text-xs text-slate-500">Nhập đúng tiêu đề đã kiểm chứng trên YouTube.</span><FieldError message={state.fieldErrors.title} /></label>
          <label className="block"><span className="text-sm font-bold text-slate-200">Thứ tự hiển thị</span><input name="displayOrder" type="number" required min={0} max={999999} step={1} defaultValue={video?.displayOrder ?? 0} className={inputClass} /><span className="mt-2 block text-xs text-slate-500">Số nhỏ hơn hiển thị trước. Homepage chỉ lấy tối đa 6 video đang bật.</span><FieldError message={state.fieldErrors.displayOrder} /></label>
          <label className="flex items-start gap-3 rounded-lg border border-white/[0.08] bg-[#07111F]/60 p-4 text-sm text-slate-300"><input name="isVisible" type="checkbox" defaultChecked={video?.isVisible ?? false} className="mt-0.5 h-4 w-4 accent-sky-400" /><span><b className="block text-white">Hiển thị video</b><span className="mt-1 block text-xs text-slate-500">Chỉ xuất hiện khi toàn bộ section cũng đang bật.</span></span></label>
        </div>
        <div><p className="text-sm font-bold text-slate-200">Xem trước thumbnail</p><div className="mt-2 grid aspect-video place-items-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#07111F]">{previewId ? <YouTubeThumbnail key={previewId} videoId={previewId} alt="Xem trước thumbnail YouTube" className="h-full w-full" imageClassName="h-full w-full object-cover" /> : <div className="text-center text-slate-500"><Youtube className="mx-auto h-9 w-9" /><p className="mt-2 text-xs">Nhập URL hợp lệ để xem thumbnail</p></div>}</div>{previewId ? <a href={`https://www.youtube.com/watch?v=${previewId}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-xs font-bold text-sky-300 hover:text-white">Mở video trên YouTube</a> : null}</div>
      </div>
    </section>
    <div className="sticky bottom-3 z-20 flex justify-end gap-3 rounded-lg border border-white/10 bg-[#08111E]/95 p-3 shadow-2xl shadow-black/40 backdrop-blur"><Link href="/admin/free-ai-learning" className="inline-flex min-h-11 items-center rounded-lg border border-white/10 px-5 text-sm font-bold text-slate-300 hover:text-white">Hủy</Link><SubmitButton editing={editing} /></div>
  </form>;
}
