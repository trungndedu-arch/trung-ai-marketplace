import Link from "next/link";
import { ArrowRight, ExternalLink, Sparkles, Video } from "lucide-react";
import type { AiTool } from "@/lib/ai-tools";

function ToolLogo({ tool }: { tool: AiTool }) {
  if (tool.logo) {
    return (
      <span className="grid h-10 w-10 overflow-hidden rounded-xl border border-white/15 bg-white/95 shadow-lg">
        <img src={tool.logo} alt={`Logo ${tool.name}`} className="h-full w-full object-contain p-1.5" />
      </span>
    );
  }

  return (
    <span className="grid h-10 w-10 place-items-center rounded-xl border border-sky-300/25 bg-sky-500/15 text-sky-200">
      {tool.category === "AI Video" ? <Video className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
    </span>
  );
}

export function AiToolCard({ tool, compact = false }: { tool: AiTool; compact?: boolean }) {
  const hasAffiliateLink = Boolean(tool.affiliateUrl);
  const detailHref = `/cong-cu-ai/${tool.slug}`;

  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0F1F33] shadow-[0_16px_48px_rgba(0,0,0,.24)] transition duration-300 hover:-translate-y-1 hover:border-sky-300/45 hover:shadow-[0_24px_62px_rgba(59,130,246,.18)] ${compact ? "h-[30rem] sm:h-[31rem]" : "h-[31rem] sm:h-[32rem]"}`}>
      <Link href={detailHref} aria-label={`Xem chi tiết ${tool.name}`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" />
      <div className="pointer-events-none relative z-10 h-[62%] shrink-0 overflow-hidden bg-[#07111F]">
        <img
          src={tool.coverImage}
          alt={`Ảnh bìa ${tool.name}`}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.025]"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0F1F33] to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {tool.badge ? <span className="rounded-full border border-sky-200/25 bg-[#07111F]/75 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-sky-100 backdrop-blur-md">{tool.badge}</span> : null}
          {tool.toolType ? <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">{tool.toolType}</span> : null}
        </div>
      </div>

      <div className="pointer-events-none relative z-10 flex flex-1 flex-col p-4 sm:p-5">
        <div className="-mt-9 mb-3 flex items-end justify-between gap-3">
          <ToolLogo tool={tool} />
          <span className="max-w-[58%] truncate rounded-full border border-white/10 bg-[#07111F]/85 px-2.5 py-1 text-[10px] font-bold text-slate-200">{tool.category}</span>
        </div>
        <h3 className="line-clamp-2 text-lg font-extrabold leading-6 text-white transition group-hover:text-sky-200">{tool.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-300">{tool.shortDescription}</p>
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-2 border-t border-white/[0.08] p-4 pt-3 sm:p-5 sm:pt-3">
        <Link href={detailHref} className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-sky-300/25 bg-sky-500/10 px-3 text-xs font-black text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-500/20 hover:text-white">
          Xem chi tiết <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        {hasAffiliateLink ? (
          <a href={tool.affiliateUrl} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-3 text-xs font-black text-white shadow-[0_0_20px_rgba(59,130,246,.2)] transition hover:brightness-110">
            Truy cập <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span aria-disabled="true" className="inline-flex min-h-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-black text-slate-500">
            Sắp cập nhật
          </span>
        )}
      </div>
    </article>
  );
}
