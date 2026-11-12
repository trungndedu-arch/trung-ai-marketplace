// TEST WORK
"use client";

// Marketplace home page and featured AI tools.

import { useState } from "react";
import { MarketplaceBrand, MarketplaceHeader } from "@/components/navigation/MarketplaceHeader";
import { CoachingConsultationModal } from "@/components/home/CoachingConsultationModal";
import type { AuthUserSummary } from "@/lib/auth/session";
import { HomeHeroAbout } from "@/components/home/HomeHeroAbout";
import type { HomepageContactLinks } from "@/lib/homepage-contact-links";
import type { AiTool } from "@/lib/ai-tools";
import type { Workflow } from "@/lib/workflows";
import type { Chatbot } from "@/lib/chatbots";
import { getMarketplaceCardActions, getMarketplaceCompareAtPriceLabel, getMarketplaceDiscountPercent, getMarketplacePriceLabel } from "@/lib/catalog/product-state";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";
import {
  ArrowRight,
  Boxes,
  Clapperboard,
} from "lucide-react";

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
    />
  );
}

function renderWorkflowCard(workflow: Workflow) {
  const detailHref = workflow.detailUrl ?? `/workflow/${workflow.slug}`;

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
      actions={getMarketplaceCardActions(workflow.state, detailHref, workflow.appUrl, workflow.databaseId)}
      demoVideo={workflow.demoVideo}
    />
  );
}

function renderAiToolCard(tool: AiTool) {
  const detailHref = tool.detailUrl ?? `/cong-cu-ai/${tool.slug}`;

  return (
    <ProductCard
      key={tool.id}
      title={tool.name}
      description={tool.shortDescription}
      image={tool.coverImage}
      imageAlt={`Ảnh bìa ${tool.name}`}
      category={tool.category}
      badge={tool.badge}
      status={tool.toolType}
      href={detailHref}
      meta={tool.tags.slice(0, 3).map((tag) => ({ label: tag, tone: "blue" }))}
      actions={[
        { label: "Xem chi tiết", href: detailHref },
        tool.state.canVisitAffiliate
          ? { label: "Truy cập", href: tool.affiliateUrl, external: true, variant: "primary" }
          : { label: "Sắp cập nhật", disabled: true, variant: "muted" },
      ]}
      demoVideo={tool.demoVideo}
    />
  );
}

function FeaturedAiToolsSection({ tools }: { tools: AiTool[] }) {
  return (
    <section id="ai-apps" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
            <Boxes className="h-3.5 w-3.5" /> Công Cụ AI Nên Dùng
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Công Cụ AI Nên Dùng</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Các công cụ AI được chọn lọc để hỗ trợ tạo nội dung, xây kênh và làm Affiliate hiệu quả hơn.</p>
        </div>
        <a href="/cong-cu-ai" className="group inline-flex w-fit items-center gap-2 rounded-xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm font-extrabold text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-400/15 hover:text-white">
          Xem thêm công cụ AI
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>
      </div>
      {tools.length ? (
        <ProductCardGrid>
          {tools.map(renderAiToolCard)}
        </ProductCardGrid>
      ) : (
        <div className="rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 p-8 text-sm text-slate-400">Chưa có công cụ AI nổi bật. Bạn có thể thêm công cụ từ trang quản trị.</div>
      )}
    </section>
  );
}

function FeaturedChatbotAiAppsSection({ chatbots, apps }: { chatbots: Chatbot[]; apps: Workflow[] }) {
  const products = [
    ...chatbots.map((product) => ({ kind: "chatbot" as const, product })),
    ...apps.map((product) => ({ kind: "ai_app" as const, product })),
  ].sort((a, b) => a.product.displayOrder - b.product.displayOrder || a.product.createdAt.localeCompare(b.product.createdAt) || a.product.databaseId.localeCompare(b.product.databaseId));

  return (
    <section id="chatbot-ai-app" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
            <Clapperboard className="h-3.5 w-3.5" /> Chatbot & AI App
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Chatbot & AI App</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Khám phá các Chatbot và AI App hữu ích giúp tạo nội dung, bán hàng, chăm sóc khách hàng và tự động hóa công việc.</p>
        </div>
        <a href="/workflow" className="group inline-flex w-fit items-center gap-2 rounded-xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm font-extrabold text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-400/15 hover:text-white">
          Xem thêm
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>
      </div>
      {products.length ? <ProductCardGrid>{products.map((item) => item.kind === "chatbot" ? renderChatbotCard(item.product) : renderWorkflowCard(item.product))}</ProductCardGrid> : <div className="rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 p-8 text-sm text-slate-400">Chưa có Chatbot hoặc AI App nổi bật.</div>}
    </section>
  );
}

export function HomePageClient({ chatbots, apps, aiTools, user, contactLinks }: { chatbots: Chatbot[]; apps: Workflow[]; aiTools: AiTool[]; user: AuthUserSummary; contactLinks: HomepageContactLinks }) {
  const [coachingOpen, setCoachingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <MarketplaceHeader user={user} onCoachingConsultation={() => setCoachingOpen(true)} />
      <CoachingConsultationModal open={coachingOpen} onClose={() => setCoachingOpen(false)} settings={contactLinks} />
      <main className="mx-auto max-w-[1800px] px-4 py-6 sm:px-6 lg:py-8 xl:px-8">
        <HomeHeroAbout contactLinks={contactLinks} onCoachingConsultation={() => setCoachingOpen(true)} />
        <section id="products" className="mt-14 scroll-mt-24">
          <div className="space-y-14">
            <FeaturedChatbotAiAppsSection chatbots={chatbots} apps={apps} />
            <FeaturedAiToolsSection tools={aiTools} />
          </div>
        </section>
        <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-slate-500 sm:flex-row"><MarketplaceBrand /><p>© 2026 Trung AI Media. Đồng hành cùng người Việt ứng dụng AI thực chiến.</p></footer>
      </main>
    </div>
  );
}
