import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FlashSaleForm } from "@/components/admin/FlashSaleForm";
import { getEligibleFlashSaleProducts } from "@/lib/admin/flash-sales";

export const metadata: Metadata = { title: "Thêm Flash Sale" };

export default async function AdminNewFlashSalePage() {
  const result = await getEligibleFlashSaleProducts();
  if (result.error) return <section className="mx-auto max-w-3xl rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-10 text-center"><p className="font-bold text-rose-100">{result.error}</p><Link href="/admin/flash-sales" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg border border-rose-200/20 px-4 text-sm font-bold text-rose-100"><ArrowLeft className="h-4 w-4" />Danh sách Flash Sale</Link></section>;

  return <div className="mx-auto w-full max-w-[1000px]"><Link href="/admin/flash-sales" className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-sky-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Danh sách Flash Sale</Link><div className="mb-7 mt-4"><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Flash Sale Creator</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Thêm Flash Sale</h1><p className="mt-2 text-sm text-slate-400">Mặc định “Lên lịch tự động”: giá ưu đãi tự bắt đầu và kết thúc theo thời gian đã chọn.</p></div><FlashSaleForm eligibleProducts={result.products} /></div>;
}
