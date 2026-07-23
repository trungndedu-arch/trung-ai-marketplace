"use client";

import { useMemo, useState } from "react";
import { Bot, Clapperboard, Search, Workflow as WorkflowIcon } from "lucide-react";
import type { Chatbot } from "@/lib/chatbots";
import type { Workflow } from "@/lib/workflows";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";

type Tab = "all" | "chatbot" | "ai-app";

type CatalogItem =
  | { kind: "chatbot"; item: Chatbot; order: number }
  | { kind: "ai-app"; item: Workflow; order: number };

function formatPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

function renderChatbotCard(chatbot: Chatbot) {
  return (
    <ProductCard
      key={`chatbot-${chatbot.id}`}
      title={chatbot.name}
      description={chatbot.shortDescription}
      image={chatbot.coverImage}
      category={chatbot.category}
      badge={chatbot.badge}
      status={chatbot.sales}
      price={chatbot.price === 0 ? "Sắp ra mắt" : formatPrice(chatbot.price)}
      originalPrice={chatbot.originalPrice ? formatPrice(chatbot.originalPrice) : undefined}
      href={`/workflow/chatbot/${chatbot.slug}`}
      meta={[{ label: chatbot.rating, tone: "cyan" }]}
      showFavorite
    />
  );
}

function renderWorkflowCard(workflow: Workflow) {
  const detailHref = `/workflow/${workflow.slug}`;
  const actions = workflow.appUrl
    ? [
        { label: "Xem chi tiết", href: detailHref },
        { label: "Sử dụng miễn phí", href: workflow.appUrl, external: true, variant: "primary" as const },
      ]
    : !workflow.isFree && workflow.price > 0 && !workflow.appUrl
      ? [
          { label: "Xem chi tiết", href: detailHref },
          { label: "Mua ngay", href: detailHref, variant: "primary" as const },
        ]
      : [{ label: "Xem chi tiết", href: detailHref }];

  return (
    <ProductCard
      key={`ai-app-${workflow.id}`}
      title={workflow.name}
      description={workflow.shortDescription}
      image={workflow.coverImage}
      imageAlt={`Ảnh bìa ${workflow.name}`}
      category={workflow.category}
      badge={workflow.isFree ? "FREE" : workflow.badge}
      price={!workflow.hidePrice ? (workflow.isFree ? "Miễn phí" : formatPrice(workflow.price)) : undefined}
      originalPrice={!workflow.isFree && workflow.originalPrice ? formatPrice(workflow.originalPrice) : undefined}
      href={detailHref}
      meta={!workflow.appUrl ? workflow.tools.slice(0, 3).map((tool) => ({ label: tool })) : undefined}
      actions={actions}
    />
  );
}

export function ChatbotAiAppCatalog({ chatbots, apps, initialTab = "all" }: { chatbots: Chatbot[]; apps: Workflow[]; initialTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const isChatbot = tab === "chatbot";
  const isAiApp = tab === "ai-app";
  const source = isChatbot ? chatbots : isAiApp ? apps : [];
  const categories = useMemo(() => ["Tất cả", ...Array.from(new Set(source.map((item) => item.category)))], [source]);
  const normalized = query.trim().toLocaleLowerCase("vi");
  const visibleChatbots = chatbots.filter((item) => `${item.name} ${item.shortDescription} ${item.category}`.toLocaleLowerCase("vi").includes(normalized) && (category === "Tất cả" || item.category === category));
  const visibleApps = apps.filter((item) => `${item.name} ${item.shortDescription} ${item.category} ${item.tags.join(" ")}`.toLocaleLowerCase("vi").includes(normalized) && (category === "Tất cả" || item.category === category));
  const combinedItems = useMemo<CatalogItem[]>(() => [
    ...visibleChatbots.map((item) => ({ kind: "chatbot" as const, item, order: item.displayOrder })),
    ...visibleApps.map((item) => ({ kind: "ai-app" as const, item, order: item.displayOrder })),
  ].sort((a, b) => a.order - b.order || a.item.name.localeCompare(b.item.name, "vi")), [visibleApps, visibleChatbots]);
  const visible = isChatbot ? visibleChatbots : isAiApp ? visibleApps : combinedItems;

  function chooseTab(nextTab: Tab) {
    setTab(nextTab);
    setQuery("");
    setCategory("Tất cả");
  }

  const label = isChatbot ? "Chatbot" : isAiApp ? "AI App" : "nội dung";
  const placeholder = isChatbot ? "Tìm Chatbot theo tên, mô tả hoặc danh mục..." : isAiApp ? "Tìm AI App theo tên, mô tả hoặc danh mục..." : "Tìm Chatbot hoặc AI App theo tên, mô tả hoặc danh mục...";

  return <>
    <section className="mt-8">
      <div className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1.5">
        <button onClick={() => chooseTab("all")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-extrabold transition ${tab === "all" ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "text-slate-400 hover:text-white"}`}><WorkflowIcon className="h-4 w-4" /> Tất cả</button>
        <button onClick={() => chooseTab("chatbot")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-extrabold transition ${isChatbot ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "text-slate-400 hover:text-white"}`}><Bot className="h-4 w-4" /> Chatbot</button>
        <button onClick={() => chooseTab("ai-app")} className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-extrabold transition ${isAiApp ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "text-slate-400 hover:text-white"}`}><Clapperboard className="h-4 w-4" /> AI App</button>
      </div>
      <div className="relative mt-5"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={placeholder} className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10" /></div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${category === item ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.3)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-sky-400/30 hover:text-white"}`}>{item}</button>)}</div>
    </section>
    <div className="mb-5 mt-9 flex items-center justify-between"><p className="text-sm text-slate-400"><b className="text-white">{visible.length}</b> {label} phù hợp</p><span className="text-xs text-slate-500">Nhấn vào thẻ để xem chi tiết</span></div>
    {visible.length ? (
      <ProductCardGrid>
        {tab === "all" ? combinedItems.map((entry) => entry.kind === "chatbot" ? renderChatbotCard(entry.item) : renderWorkflowCard(entry.item)) : isChatbot ? visibleChatbots.map(renderChatbotCard) : visibleApps.map(renderWorkflowCard)}
      </ProductCardGrid>
    ) : (
      <section className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 text-center"><div>{isChatbot ? <Bot className="mx-auto h-9 w-9 text-slate-500" /> : <WorkflowIcon className="mx-auto h-9 w-9 text-slate-500" />}<h2 className="mt-4 text-lg font-bold text-white">Chưa tìm thấy {label} phù hợp</h2><p className="mt-2 text-sm text-slate-400">Hãy thử đổi từ khóa tìm kiếm hoặc danh mục.</p><button onClick={() => { setQuery(""); setCategory("Tất cả"); }} className="mt-4 text-sm font-bold text-sky-300">Xóa bộ lọc</button></div></section>
    )}
  </>;
}
