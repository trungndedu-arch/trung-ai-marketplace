import Link from "next/link";
import { ArrowRight, Image as ImageIcon } from "lucide-react";
import { PromptFreeBadge, PromptFreeCardShell } from "@/components/prompt-free/PromptFreeCardShell";
import type { Workflow } from "@/lib/workflows";

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const detailHref = `/workflow/${workflow.slug}`;
  const priceLabel = workflow.isFree ? "Miễn phí" : formatPrice(workflow.price);
  const showPrice = !workflow.hidePrice;
  const hasPendingPurchase = workflow.purchaseUrl !== undefined;
  const purchaseHref = workflow.purchaseUrl || detailHref;

  return (
    <PromptFreeCardShell>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#07111F]">
        <img src={workflow.coverImage} alt={`Ảnh bìa ${workflow.name}`} className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.025]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">{workflow.category}</span>
          <ImageIcon className="h-4 w-4 text-white/60" />
        </div>
      </div>
      <div className="flex min-h-[13.5rem] flex-col p-4">
        <div className="mb-2 flex items-center gap-2"><PromptFreeBadge>{workflow.isFree ? "FREE" : workflow.badge}</PromptFreeBadge></div>
        <h2 className="line-clamp-2 text-[15px] font-extrabold leading-6 text-white transition group-hover:text-sky-300">{workflow.name}</h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{workflow.shortDescription}</p>
        {!workflow.appUrl ? <div className="mt-3 flex flex-wrap gap-1.5">{workflow.tools.slice(0, 3).map((tool) => <span key={tool} className="rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300">{tool}</span>)}</div> : null}
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">{showPrice ? <div className="flex min-w-0 items-center gap-2"><span className={`truncate text-xs font-semibold ${workflow.isFree ? "text-cyan-300" : "text-sky-400"}`}>{priceLabel}</span>{!workflow.isFree && workflow.originalPrice ? <span className="whitespace-nowrap text-[10px] font-semibold text-slate-500 line-through">{formatPrice(workflow.originalPrice)}</span> : null}</div> : <span />}{workflow.appUrl ? <div className="flex shrink-0 items-center gap-1.5"><Link href={detailHref} className="inline-flex h-7 items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300 transition hover:bg-sky-500/15 hover:text-sky-200">Xem chi tiết <ArrowRight className="h-3 w-3" /></Link><a href={workflow.appUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-7 items-center rounded-md bg-sky-500/15 px-2 py-1 text-[10px] font-bold text-sky-100 transition hover:bg-sky-500/25">Sử dụng miễn phí</a></div> : hasPendingPurchase ? <div className="flex shrink-0 items-center gap-1.5"><Link href={detailHref} className="inline-flex h-7 items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300 transition hover:bg-sky-500/15 hover:text-sky-200">Xem chi tiết <ArrowRight className="h-3 w-3" /></Link><Link href={purchaseHref} className="inline-flex h-7 items-center rounded-md bg-sky-500/15 px-2 py-1 text-[10px] font-bold text-sky-100 transition hover:bg-sky-500/25">Mua ngay</Link></div> : <Link href={detailHref} className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300 transition hover:bg-sky-500/15 hover:text-sky-200">Xem chi tiết <ArrowRight className="h-3 w-3" /></Link>}</div>
      </div>
    </PromptFreeCardShell>
  );
}
