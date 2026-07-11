import { Workflow } from "lucide-react";
import { WorkflowsCatalog } from "@/components/workflows/WorkflowsCatalog";
import { getActiveWorkflows } from "@/lib/workflows";

export default function WorkflowsPage() {
  const workflows = getActiveWorkflows();

  return <main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12"><section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0B1728] px-6 py-10 sm:px-10 lg:px-12"><div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-sky-600/20 blur-[90px]" /><div className="absolute -bottom-32 left-[18%] h-72 w-72 rounded-full bg-blue-600/15 blur-[90px]" /><div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-sky-300"><Workflow className="h-3.5 w-3.5" /> Quy trình thực chiến</span><h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-.04em] text-white sm:text-5xl">Workflow AI <span className="gradient-text">Dễ Áp Dụng</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Các quy trình có sẵn giúp bạn đi từ ý tưởng đến nội dung hoàn chỉnh nhanh hơn, dễ lặp lại và phù hợp với người mới.</p></div></section><WorkflowsCatalog workflows={workflows} /><footer className="mt-14 border-t border-white/[0.06] py-8 text-sm leading-6 text-slate-400">Mỗi Workflow được thiết kế để bạn có thể áp dụng ngay, sau đó tùy chỉnh theo ngành hàng và mục tiêu của mình.</footer></main>;
}
