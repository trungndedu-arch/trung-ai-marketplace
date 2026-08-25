import Link from "next/link";
import { ArrowLeft, ReceiptText } from "lucide-react";

export default function AdminOrderNotFound() {
  return <section className="mx-auto grid min-h-[420px] max-w-2xl place-items-center rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 px-5 text-center"><div><ReceiptText className="mx-auto h-10 w-10 text-slate-600" /><h1 className="mt-4 text-xl font-extrabold text-white">Không tìm thấy đơn hàng</h1><p className="mt-2 text-sm text-slate-500">Order ID không tồn tại hoặc không còn khả dụng.</p><Link href="/admin/orders" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg border border-sky-300/20 px-4 text-sm font-bold text-sky-200"><ArrowLeft className="h-4 w-4" />Danh sách đơn hàng</Link></div></section>;
}
