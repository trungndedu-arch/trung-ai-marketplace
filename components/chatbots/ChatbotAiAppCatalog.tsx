"use client";

import { useEffect, useMemo, useState } from "react";
import { Clapperboard, Image as ImageIcon, Search, Workflow as WorkflowIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Chatbot } from "@/lib/chatbots";
import type { Workflow } from "@/lib/workflows";
import { getAppCatalogTab, getAppMediaTypes, type AppCatalogTab, type AppMediaType } from "@/lib/catalog/app-media-type";
import { getMarketplaceCardActions, getMarketplaceCompareAtPriceLabel, getMarketplaceDiscountPercent, getMarketplacePriceLabel } from "@/lib/catalog/product-state";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";

type Tab = AppCatalogTab;

type CatalogItem =
  | { kind: "chatbot"; item: Chatbot; order: number; mediaTypes: AppMediaType[] }
  | { kind: "ai-app"; item: Workflow; order: number; mediaTypes: AppMediaType[] };

function renderChatbotCard(chatbot: Chatbot) {
  const detailHref = `/workflow/chatbot/${chatbot.slug}`;
  return (
    <ProductCard
      key={`chatbot-${chatbot.id}`}
      title={chatbot.name}
      description={chatbot.shortDescription}
      image={chatbot.coverImage}
      category={chatbot.category}
      badge={chatbot.badge}
      status={chatbot.state.hasActiveFlashSale ? "SALE" : undefined}
      price={getMarketplacePriceLabel(chatbot.state)}
      originalPrice={getMarketplaceCompareAtPriceLabel(chatbot.state)}
      discountPercent={getMarketplaceDiscountPercent(chatbot.state)}
      href={detailHref}
      meta={[{ label: chatbot.rating, tone: "cyan" }]}
      actions={getMarketplaceCardActions(chatbot.state, detailHref, chatbot.appUrl, chatbot.databaseId)}
      showFavorite
      demoVideo={chatbot.demoVideo}
      variant="compact"
    />
  );
}

function renderWorkflowCard(workflow: Workflow) {
  const detailHref = workflow.detailUrl ?? `/workflow/${workflow.slug}`;
  const actions = getMarketplaceCardActions(workflow.state, detailHref, workflow.appUrl, workflow.databaseId);

  return (
    <ProductCard
      key={`ai-app-${workflow.id}`}
      title={workflow.name}
      description={workflow.shortDescription}
      image={workflow.coverImage}
      imageAlt={`Ảnh bìa ${workflow.name}`}
      category={workflow.category}
      badge={workflow.badge}
      status={workflow.state.hasActiveFlashSale ? "SALE" : undefined}
      price={!workflow.hidePrice ? getMarketplacePriceLabel(workflow.state) : undefined}
      originalPrice={!workflow.hidePrice ? getMarketplaceCompareAtPriceLabel(workflow.state) : undefined}
      discountPercent={!workflow.hidePrice ? getMarketplaceDiscountPercent(workflow.state) : undefined}
      href={detailHref}
      meta={!workflow.appUrl ? workflow.tools.slice(0, 3).map((tool) => ({ label: tool })) : undefined}
      actions={actions}
      demoVideo={workflow.demoVideo}
      variant="compact"
    />
  );
}

export function ChatbotAiAppCatalog({ chatbots, apps, initialTab = "all" }: { chatbots: Chatbot[]; apps: Workflow[]; initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isImage = tab === "image";
  const isVideo = tab === "video";
  const queryTab = getAppCatalogTab(searchParams.get("tab"));

  useEffect(() => {
    setTab(queryTab);
    setQuery("");
    setCategory("Tất cả");
  }, [queryTab]);

  const allItems = useMemo<CatalogItem[]>(() => [
    ...chatbots.map((item) => ({ kind: "chatbot" as const, item, order: item.displayOrder, mediaTypes: getAppMediaTypes({ title: item.name, shortDescription: item.shortDescription, category: item.category }) })),
    ...apps.map((item) => ({ kind: "ai-app" as const, item, order: item.displayOrder, mediaTypes: getAppMediaTypes({ title: item.name, shortDescription: item.shortDescription, category: item.category, tags: item.tags }) })),
  ].sort((a, b) => a.order - b.order || a.item.name.localeCompare(b.item.name, "vi")), [apps, chatbots]);
  const tabItems = useMemo(() => tab === "all" ? allItems : allItems.filter((item) => item.mediaTypes.includes(tab)), [allItems, tab]);
  const categories = useMemo(() => ["Tất cả", ...Array.from(new Set(tabItems.map((item) => item.item.category)))], [tabItems]);
  const normalized = query.trim().toLocaleLowerCase("vi");
  const visible = tabItems.filter(({ item }) => {
    const tags = "tags" in item ? item.tags.join(" ") : "";
    return `${item.name} ${item.shortDescription} ${item.category} ${tags}`.toLocaleLowerCase("vi").includes(normalized)
      && (category === "Tất cả" || item.category === category);
  });

  function chooseTab(nextTab: Tab) {
    setTab(nextTab);
    setQuery("");
    setCategory("Tất cả");
    const params = new URLSearchParams(searchParams.toString());
    if (nextTab === "all") params.delete("tab");
    else params.set("tab", nextTab);
    const nextSearch = params.toString();
    router.push(nextSearch ? `${pathname}?${nextSearch}` : pathname, { scroll: false });
  }

  const label = isImage ? "App Tạo Ảnh AI" : isVideo ? "App Tạo Video AI" : "sản phẩm";
  const placeholder = isImage ? "Tìm App Tạo Ảnh AI theo tên, mô tả hoặc danh mục..." : isVideo ? "Tìm App Tạo Video AI theo tên, mô tả hoặc danh mục..." : "Tìm App Tạo Ảnh & Video AI theo tên, mô tả hoặc danh mục...";

  return <>
    <section className="mt-8">
      <div className="flex flex-wrap gap-1.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5">
        <button onClick={() => chooseTab("all")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-extrabold transition sm:px-4 sm:text-sm ${tab === "all" ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "text-slate-400 hover:text-white"}`}><WorkflowIcon className="h-4 w-4" /> Tất Cả</button>
        <button onClick={() => chooseTab("image")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-extrabold transition sm:px-4 sm:text-sm ${isImage ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "text-slate-400 hover:text-white"}`}><ImageIcon className="h-4 w-4" /> Tạo Ảnh AI</button>
        <button onClick={() => chooseTab("video")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-xs font-extrabold transition sm:px-4 sm:text-sm ${isVideo ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "text-slate-400 hover:text-white"}`}><Clapperboard className="h-4 w-4" /> Tạo Video AI</button>
      </div>
      <div className="relative mt-5"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10" /></div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${category === item ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-sky-400/30 hover:text-white"}`}>{item}</button>)}</div>
    </section>
    <div className="mb-5 mt-9 flex items-center justify-between"><p className="text-sm text-slate-400"><b className="text-white">{visible.length}</b> {label} phù hợp</p><span className="text-xs text-slate-500">Nhấn vào thẻ để xem chi tiết</span></div>
    {visible.length ? (
      <ProductCardGrid variant="compact">
        {visible.map((entry) => entry.kind === "chatbot" ? renderChatbotCard(entry.item) : renderWorkflowCard(entry.item))}
      </ProductCardGrid>
    ) : (
      <section className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 text-center"><div>{isImage ? <ImageIcon className="mx-auto h-9 w-9 text-slate-500" /> : <Clapperboard className="mx-auto h-9 w-9 text-slate-500" />}<h2 className="mt-4 text-lg font-bold text-white">Chưa tìm thấy {label} phù hợp</h2><p className="mt-2 text-sm text-slate-400">Hãy thử đổi từ khóa tìm kiếm hoặc danh mục.</p><button onClick={() => { setQuery(""); setCategory("Tất cả"); }} className="mt-4 text-sm font-bold text-sky-300">Xóa bộ lọc</button></div></section>
    )}
  </>;
}
