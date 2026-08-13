import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { FlashSaleRuntimeChip, FlashSaleStatusChip } from "@/components/admin/AdminFlashSaleUi";
import { FlashSaleForm } from "@/components/admin/FlashSaleForm";
import { getAdminFlashSaleById } from "@/lib/admin/flash-sales";

export const metadata: Metadata = { title: "Chỉnh sửa Flash Sale" };

export default async function AdminFlashSaleEditPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { id } = await params;
  const query = await searchParams;
  const result = await getAdminFlashSaleById(id);
  if (result.error) return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/flash-sales" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách Flash Sale</Link></section>;
  if (!result.flashSale) notFound();
  const sale = result.flashSale;
  const successMessage = query.created === "1" ? "Đã tạo Flash Sale." : query.updated === "1" ? "Đã lưu thay đổi Flash Sale." : "";

  return <div className="mx-auto w-full max-w-[1000px]"><Link href="/admin/flash-sales" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách Flash Sale</Link><div className="mb-7 mt-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Flash Sale Editor</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Chỉnh sửa Flash Sale</h1><p className="mt-2 line-clamp-2 text-sm text-slate-400">{sale.product.title}</p></div><div className="flex flex-wrap gap-2"><FlashSaleStatusChip value={sale.status} /><FlashSaleRuntimeChip value={sale.runtimeState} /></div></div>{successMessage ? <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100"><CheckCircle2 className="h-4 w-4" />{successMessage}</div> : null}<FlashSaleForm flashSale={sale} /></div>;
}
