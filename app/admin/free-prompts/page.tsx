import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FreePromptRowActions } from "@/components/admin/FreePromptRowActions";
import { filterFreePrompts, type FreePromptListItem } from "@/lib/admin/free-prompt-list";
import { requireAdminAccess } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
type PromptRow = FreePromptListItem & { id: string; display_order: number; updated_at: string; cover_image_url: string | null };
const statuses = ["draft", "published", "hidden"] as const;
const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

export default async function AdminFreePromptsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdminAccess("/admin/free-prompts");
  const params = await searchParams;
  const requestedStatus = first(params.status);
  const status = statuses.includes(requestedStatus as (typeof statuses)[number]) ? requestedStatus as (typeof statuses)[number] : undefined;
  const filters = { query: first(params.q), model: first(params.model), category: first(params.category), status };
  const showDeleted = first(params.deleted) === "1";
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("free_prompts")
    .select("id,slug,title,model,category,status,display_order,updated_at,cover_image_url,deleted_at")
    .order("display_order")
    .order("updated_at", { ascending: false });
  const allRows = (data ?? []) as PromptRow[];
  const rows = allRows.filter((item) => showDeleted ? Boolean(item.deleted_at) : !item.deleted_at);
  const visibleRows = filterFreePrompts(rows, filters);
  const models = [...new Set(rows.map((item) => item.model).filter(Boolean))].sort();
  const categories = [...new Set(rows.map((item) => item.category).filter(Boolean))].sort();

  return <div className="mx-auto w-full max-w-[1500px]">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Content Library</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Prompt miễn phí</h1></div><Link href="/admin/free-prompts/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white"><Plus className="h-4 w-4" />Thêm Prompt</Link></div>
    {error ? <section className="mt-6 rounded-lg border border-amber-300/20 bg-amber-400/10 p-5 text-sm text-amber-100">Nguồn quản lý chưa sẵn sàng. Áp dụng migration review-only trước khi dùng CRUD.</section> : <>
      <form className="mt-6 grid gap-3 rounded-lg border border-white/10 bg-slate-950/30 p-4 md:grid-cols-5">
        <input name="q" defaultValue={filters.query} placeholder="Tìm tiêu đề hoặc slug" className="min-h-10 rounded-md border border-white/15 bg-slate-950 px-3 text-sm text-white placeholder:text-slate-500 md:col-span-2" />
        <select name="model" defaultValue={filters.model} className="min-h-10 rounded-md border border-white/15 bg-slate-950 px-3 text-sm text-white"><option value="">Tất cả model</option>{models.map((model) => <option key={model} value={model}>{model}</option>)}</select>
        <select name="category" defaultValue={filters.category} className="min-h-10 rounded-md border border-white/15 bg-slate-950 px-3 text-sm text-white"><option value="">Tất cả danh mục</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select>
        <select name="status" defaultValue={filters.status} className="min-h-10 rounded-md border border-white/15 bg-slate-950 px-3 text-sm text-white"><option value="">Tất cả trạng thái</option><option value="draft">Bản nháp</option><option value="published">Đã xuất bản</option><option value="hidden">Đã ẩn</option></select>
        <div className="flex flex-wrap gap-2 md:col-span-5"><button className="rounded-md bg-sky-500 px-3 py-2 text-sm font-bold text-white">Lọc</button><Link href="/admin/free-prompts" className="rounded-md border border-white/15 px-3 py-2 text-sm font-bold text-slate-200">Xóa bộ lọc</Link><Link href={showDeleted ? "/admin/free-prompts" : "/admin/free-prompts?deleted=1"} className="rounded-md border border-white/15 px-3 py-2 text-sm font-bold text-slate-200">{showDeleted ? "Danh sách đang quản lý" : "Prompt đã xóa"}</Link></div>
      </form>
      <div className="mt-6 overflow-x-auto rounded-lg border border-white/10"><table className="w-full min-w-[900px] text-sm"><thead className="bg-slate-950/50 text-left text-slate-400"><tr><th className="p-3">Ảnh / Prompt</th><th className="p-3">Model</th><th className="p-3">Danh mục</th><th className="p-3">Trạng thái</th><th className="p-3">Thứ tự</th><th className="p-3">Cập nhật</th><th className="p-3">Thao tác</th></tr></thead><tbody>{visibleRows.length ? visibleRows.map((prompt) => <tr key={prompt.id} className="border-t border-white/10 align-middle text-slate-200"><td className="p-3"><div className="flex min-w-[260px] items-center gap-3">{prompt.cover_image_url ? <Image src={prompt.cover_image_url} alt="" width={56} height={40} className="h-10 w-14 rounded object-cover" /> : <div className="h-10 w-14 rounded bg-slate-800" />}<div><p className="font-bold text-white">{prompt.title}</p><small className="block text-slate-500">/{prompt.slug}</small></div></div></td><td className="p-3">{prompt.model}</td><td className="p-3">{prompt.category}</td><td className="p-3"><span className="rounded-full border border-white/15 px-2 py-1 text-xs font-bold">{prompt.deleted_at ? "Đã xóa" : prompt.status === "published" ? "Đã xuất bản" : prompt.status === "draft" ? "Bản nháp" : "Đã ẩn"}</span></td><td className="p-3">{prompt.display_order}</td><td className="p-3 text-xs text-slate-400">{new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(prompt.updated_at))}</td><td className="p-3"><div className="flex flex-wrap items-center gap-2">{!prompt.deleted_at ? <Link className="text-sm font-bold text-sky-300 hover:text-sky-200" href={`/admin/free-prompts/${prompt.id}/preview`}>Xem trước</Link> : null}<Link className="text-sm font-bold text-sky-300 hover:text-sky-200" href={`/admin/free-prompts/${prompt.id}/edit`}>Sửa</Link><FreePromptRowActions id={prompt.id} slug={prompt.slug} status={prompt.status} deleted={Boolean(prompt.deleted_at)} /></div></td></tr>) : <tr><td colSpan={7} className="p-8 text-center text-slate-400">Không có Prompt phù hợp.</td></tr>}</tbody></table></div>
    </>}
  </div>;
}
