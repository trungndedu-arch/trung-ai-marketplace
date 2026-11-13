"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteFreeAiLearningVideo, setFreeAiLearningVideoVisibility } from "@/lib/admin/free-ai-learning-actions";

export function FreeAiLearningRowActions({ id, isVisible }: { id: string; isVisible: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const run = (operation: () => Promise<void>) => startTransition(async () => {
    try { await operation(); router.refresh(); } catch (error) { alert(error instanceof Error ? error.message : "Không thể cập nhật video."); }
  });
  return <span className="flex flex-wrap gap-2"><button type="button" disabled={pending} onClick={() => run(() => setFreeAiLearningVideoVisibility(id, !isVisible))} className="rounded-md border border-sky-400/30 px-2.5 py-1.5 text-xs font-bold text-sky-200 disabled:cursor-wait disabled:opacity-60">{pending ? "Đang lưu…" : isVisible ? "Ẩn" : "Hiển thị"}</button><button type="button" disabled={pending} onClick={() => { if (confirm("Xóa video này khỏi danh sách? Thao tác không ảnh hưởng video trên YouTube.")) run(() => deleteFreeAiLearningVideo(id)); }} className="rounded-md border border-rose-400/30 px-2.5 py-1.5 text-xs font-bold text-rose-200 disabled:cursor-wait disabled:opacity-60">{pending ? "Đang xử lý…" : "Xóa"}</button></span>;
}
