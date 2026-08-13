"use client";

import { useMemo, useState } from "react";
import { Search, Workflow as WorkflowIcon } from "lucide-react";
import type { Workflow } from "@/lib/workflows";
import { getMarketplaceCardActions, getMarketplaceCompareAtPriceLabel, getMarketplacePriceLabel } from "@/lib/catalog/product-state";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";

const allCategories = "Tất cả Workflow";

function workflowActions(workflow: Workflow) {
  const detailHref = `/workflow/${workflow.slug}`;
  return getMarketplaceCardActions(workflow.state, detailHref, workflow.appUrl, workflow.databaseId);
}

export function WorkflowsCatalog({ workflows }: { workflows: Workflow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(allCategories);
  const categories = useMemo(() => [allCategories, ...Array.from(new Set(workflows.map((workflow) => workflow.category)))], [workflows]);
  const visibleWorkflows = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("vi");
    return workflows.filter((workflow) => {
      const matches = `${workflow.name} ${workflow.shortDescription} ${workflow.category} ${workflow.tags.join(" ")}`.toLocaleLowerCase("vi").includes(normalized);
      return matches && (category === allCategories || workflow.category === category);
    });
  }, [category, query, workflows]);

  return <>
    <section className="mt-8"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm Workflow theo tên, mô tả hoặc công cụ..." className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10" /></div><div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${category === item ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-sky-400/30 hover:text-white"}`}>{item}</button>)}</div></section>
    <div className="mb-5 mt-9 flex items-center justify-between"><p className="text-sm text-slate-400"><b className="text-white">{visibleWorkflows.length}</b> Workflow phù hợp</p><span className="text-xs text-slate-500">Nhấn vào thẻ để xem chi tiết</span></div>
    {visibleWorkflows.length ? (
      <ProductCardGrid>
        {visibleWorkflows.map((workflow) => (
          <ProductCard
            key={workflow.id}
            title={workflow.name}
            description={workflow.shortDescription}
            image={workflow.coverImage}
            imageAlt={`Ảnh bìa ${workflow.name}`}
            category={workflow.category}
            badge={workflow.badge}
            status={workflow.state.hasActiveFlashSale ? "SALE" : undefined}
            price={!workflow.hidePrice ? getMarketplacePriceLabel(workflow.state) : undefined}
            originalPrice={!workflow.hidePrice ? getMarketplaceCompareAtPriceLabel(workflow.state) : undefined}
            href={`/workflow/${workflow.slug}`}
            meta={!workflow.appUrl ? workflow.tools.slice(0, 3).map((tool) => ({ label: tool })) : undefined}
            actions={workflowActions(workflow)}
            demoVideo={workflow.demoVideo}
          />
        ))}
      </ProductCardGrid>
    ) : (
      <section className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 text-center"><div><WorkflowIcon className="mx-auto h-9 w-9 text-slate-500" /><h2 className="mt-4 text-lg font-bold text-white">Chưa tìm thấy Workflow phù hợp</h2><p className="mt-2 text-sm text-slate-400">Hãy thử đổi từ khóa tìm kiếm hoặc danh mục.</p><button onClick={() => { setQuery(""); setCategory(allCategories); }} className="mt-4 text-sm font-bold text-sky-300">Xóa bộ lọc</button></div></section>
    )}
  </>;
}
