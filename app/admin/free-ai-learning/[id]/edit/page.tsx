import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { FreeAiLearningVideoForm } from "@/components/admin/FreeAiLearningVideoForm";
import { getAdminFreeAiLearningVideoById } from "@/lib/admin/free-ai-learning";

export const metadata = { title: "Chỉnh sửa video Học AI Miễn Phí" };

export default async function AdminEditFreeAiLearningVideoPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getAdminFreeAiLearningVideoById(id);
  if (result.error) return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 p-6 text-center text-rose-100">{result.error}</section>;
  if (!result.video) notFound();
  const message = query.created === "1" ? "Đã thêm video." : query.updated === "1" ? "Đã lưu thay đổi." : "";
  return <div className="mx-auto w-full max-w-[1100px]"><Link href="/admin/free-ai-learning" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách video</Link><div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">YouTube Video</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Chỉnh sửa video</h1></div>{message ? <p className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"><CheckCircle2 className="h-4 w-4" />{message}</p> : null}<FreeAiLearningVideoForm video={result.video} /></div>;
}
