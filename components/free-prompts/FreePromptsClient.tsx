"use client";

import { useMemo, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { MarketplaceBrand, MarketplaceHeader } from "@/components/navigation/MarketplaceHeader";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";
import { orderedPrompts, type PromptItem } from "@/lib/free-prompts";
import type { AuthUserSummary } from "@/lib/auth/session";

const filters = ["Tất cả model", "Nano Banana Pro", "Nano Banana 2", "GPT Image", "Midjourney", "Grok", "Veo 3", "Sora", "Kling", "Runway", "Khác"];

function PromptCard({ item }: { item: PromptItem }) {
  return (
    <ProductCard
      title={item.title}
      description={item.description}
      image={item.image}
      category={item.category}
      badge="Prompt"
      href={`/free-prompts/${item.slug}`}
      meta={[{ label: item.model, tone: "blue" }, { label: item.count }]}
    />
  );
}

export function FreePromptsClient({ user }: { user: AuthUserSummary }) {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");
  const visible = useMemo(
    () => orderedPrompts.filter((item) => (
      activeFilter === "Tất cả model" || item.model === activeFilter
    ) && `${item.title} ${item.category} ${item.model}`.toLowerCase().includes(query.toLowerCase().trim())),
    [activeFilter, query],
  );

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <MarketplaceHeader user={user} />
      <main className="mx-auto max-w-[1800px] px-4 py-9 sm:px-6 lg:py-12 xl:px-8">
        <section className="relative overflow-hidden border-y border-white/[0.07] bg-[#0B1728] px-6 py-10 sm:px-10 lg:px-12">
          <div className="absolute inset-0 hero-grid opacity-60" />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-sky-300"><Sparkles className="h-3.5 w-3.5" /> Miễn phí · Cập nhật mỗi tuần</span>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">Thư viện Prompt AI <span className="gradient-text">miễn phí</span></h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Sao chép và sử dụng ngay với ChatGPT, Gemini, Midjourney, Nano Banana, Veo 3 và các công cụ AI phổ biến.</p>
          </div>
        </section>

        <section className="mt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm prompt theo chủ đề, model..." className="h-14 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10" />
          </div>
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">
            {filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${activeFilter === filter ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.30)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-sky-400/30 hover:text-white"}`}>{filter}</button>)}
          </div>
        </section>

        <div className="mb-5 mt-9 flex items-center justify-between gap-4"><p className="text-sm text-slate-400"><b className="text-white">{visible.length}</b> prompt phù hợp</p><span className="hidden text-xs text-slate-500 sm:block">Nhấn vào thẻ để xem chi tiết</span></div>
        {visible.length > 0 ? <ProductCardGrid>{visible.map((item) => <PromptCard key={item.id} item={item} />)}</ProductCardGrid> : <div className="grid min-h-64 place-items-center border border-dashed border-white/10 text-center"><div><Search className="mx-auto h-8 w-8 text-zinc-700" /><p className="mt-3 font-bold text-slate-300">Không tìm thấy prompt phù hợp</p><button onClick={() => { setQuery(""); setActiveFilter(filters[0]); }} className="mt-3 text-sm font-bold text-sky-400">Xóa bộ lọc</button></div></div>}
        <footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-slate-500 sm:flex-row"><MarketplaceBrand /><p>© 2026 Trung AI Media. Prompt tốt, ý tưởng lớn.</p></footer>
      </main>
    </div>
  );
}
