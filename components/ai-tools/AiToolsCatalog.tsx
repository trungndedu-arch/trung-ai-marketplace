"use client";

import { useMemo, useState } from "react";
import { Boxes, Search, SlidersHorizontal } from "lucide-react";
import type { AiTool } from "@/lib/ai-tools";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";

const allCategories = "Tất cả danh mục";

export function AiToolsCatalog({ tools }: { tools: AiTool[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allCategories);
  const [sort, setSort] = useState("featured");
  const categories = useMemo(() => [allCategories, ...Array.from(new Set(tools.map((tool) => tool.category).filter(Boolean)))], [tools]);
  const visibleTools = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    const matches = (tool: AiTool) => `${tool.name} ${tool.shortDescription} ${tool.category} ${tool.tags.join(" ")}`.toLocaleLowerCase("vi").includes(normalized);
    const filtered = tools.filter((tool) => (category === allCategories || tool.category === category) && matches(tool));
    return [...filtered].sort((a, b) => {
      if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === "featured") return Number(b.isFeatured) - Number(a.isFeatured) || a.displayOrder - b.displayOrder;
      return a.displayOrder - b.displayOrder;
    });
  }, [tools, query, category, sort]);

  return <>
    <section className="mt-8"><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><div className="relative flex-1"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm công cụ theo tên, mô tả hoặc tag..." className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10" /></div><label className="flex h-14 items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 text-sm font-semibold text-slate-200"><SlidersHorizontal className="h-4 w-4 text-sky-300" /><span className="sr-only">Sắp xếp</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent text-sm outline-none"><option value="featured">Đề xuất</option><option value="newest">Mới nhất</option><option value="order">Thứ tự hiển thị</option></select></label></div><div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${category === item ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-sky-400/30 hover:text-white"}`}>{item}</button>)}</div></section>
    <div className="mb-5 mt-9 flex items-center justify-between"><p className="text-sm text-slate-400"><b className="text-white">{visibleTools.length}</b> công cụ phù hợp</p><span className="text-xs text-slate-500">Nhấn vào thẻ để xem chi tiết</span></div>
    {visibleTools.length ? (
      <ProductCardGrid>
        {visibleTools.map((tool) => (
          <ProductCard
            key={tool.id}
            title={tool.name}
            description={tool.shortDescription}
            image={tool.coverImage}
            imageAlt={`Ảnh bìa ${tool.name}`}
            category={tool.category}
            badge={tool.badge}
            status={tool.toolType}
            href={tool.detailUrl ?? `/cong-cu-ai/${tool.slug}`}
            meta={tool.tags.slice(0, 3).map((tag) => ({ label: tag, tone: "blue" }))}
            actions={[
              { label: "Xem chi tiết", href: tool.detailUrl ?? `/cong-cu-ai/${tool.slug}` },
              tool.state.canVisitAffiliate
                ? { label: "Truy cập", href: tool.affiliateUrl, external: true, variant: "primary" }
                : { label: "Sắp cập nhật", disabled: true, variant: "muted" },
            ]}
            demoVideo={tool.demoVideo}
          />
        ))}
      </ProductCardGrid>
    ) : (
      <section className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 text-center"><div><Boxes className="mx-auto h-9 w-9 text-slate-500" /><h2 className="mt-4 text-lg font-bold text-white">Chưa tìm thấy công cụ phù hợp</h2><p className="mt-2 text-sm text-slate-400">Hãy thử đổi từ khóa tìm kiếm hoặc bộ lọc danh mục.</p><button onClick={() => { setQuery(""); setCategory(allCategories); }} className="mt-4 text-sm font-bold text-sky-300">Xóa bộ lọc</button></div></section>
    )}
  </>;
}
