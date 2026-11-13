import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FreeAiLearningVideoForm } from "@/components/admin/FreeAiLearningVideoForm";
import { requireAdminRole } from "@/lib/auth/admin";

export const metadata = { title: "Thêm video Học AI Miễn Phí" };

export default async function AdminNewFreeAiLearningVideoPage() {
  await requireAdminRole("/admin/free-ai-learning/new");
  return <div className="mx-auto w-full max-w-[1100px]"><Link href="/admin/free-ai-learning" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách video</Link><div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">YouTube Video</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Thêm video Học AI Miễn Phí</h1></div><FreeAiLearningVideoForm /></div>;
}
