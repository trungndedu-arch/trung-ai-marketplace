// TEST WORK
"use client";

// Marketplace home page and featured AI tools.

import { useState } from "react";
import { orderedPrompts, type PromptItem as FreePromptItem } from "@/lib/free-prompts";
import { HeaderAccountNav, SidebarAccountNav } from "@/components/auth/AccountNav";
import type { AuthUserSummary } from "@/lib/auth/session";
import type { AiTool } from "@/lib/ai-tools";
import type { Workflow } from "@/lib/workflows";
import type { Chatbot } from "@/lib/chatbots";
import type { Course } from "@/lib/courses";
import { getMarketplaceCardActions, getMarketplaceCompareAtPriceLabel, getMarketplaceDiscountPercent, getMarketplacePriceLabel } from "@/lib/catalog/product-state";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";
import {
  ArrowRight,
  Bell,
  Boxes,
  ChevronRight,
  Clapperboard,
  GraduationCap,
  Heart,
  Home,
  Menu,
  MessageSquareMore,
  Search,
  Sparkles,
  Store,
  X,
} from "lucide-react";

const navItems = [
  { label: "Trang chủ", icon: Home, active: true, href: "/" },
  { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts" },
  { label: "Chatbot & AI App", icon: Clapperboard, href: "/workflow" },
  { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course" },
  { label: "Công Cụ AI Nên Dùng", icon: Boxes, href: "/cong-cu-ai" },
];

const homeFeaturedPromptTitles = [
  "Mẫu Nữ Ngồi Ô Tô",
  "Prompt Video Sức Khỏe Hoạt Hình 3D",
  "Quảng Cáo Đồ Uống Splash Siêu Thực",
  "Ốp Điện Thoại Xinh",
];

const homeFeaturedPrompts = homeFeaturedPromptTitles.flatMap((title) => {
  const prompt = orderedPrompts.find((item) => item.title === title);
  return prompt ? [prompt] : [];
});

type CategorySection = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  kind: "prompts";
  prompts: FreePromptItem[];
};

const categorySections: CategorySection[] = [
  {
    id: "free-prompts",
    title: "Prompt AI Miễn Phí",
    description: "Các prompt nổi bật dùng ngay cho ảnh, video, quảng cáo, bán hàng và xây kênh nội dung.",
    href: "/free-prompts",
    cta: "Xem thêm prompt",
    kind: "prompts",
    prompts: homeFeaturedPrompts,
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-glow">
        <img src="/images/brand/trung-ai-logo.png" alt="Trung AI Media" className="h-7 w-7 object-contain" />
      </div>
      <div className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <span className="text-sky-400">Media</span></div>
    </div>
  );
}

function Sidebar({ open, close, user }: { open: boolean; close: () => void; user: AuthUserSummary }) {
  return (
    <>
      {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#07111F]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between px-2">
          <Logo />
          <button aria-label="Đóng menu" onClick={close} className="text-slate-300 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Trang chủ</p>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, active, href }) => (
            <a key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-sky-500/15 text-sky-300" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"}`}>
              <Icon className={`h-[18px] w-[18px] ${active ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"}`} />
              {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38BDF8]" />}
            </a>
          ))}
        </nav>
        <div className="my-6 h-px bg-white/[0.06]" />
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Cá nhân</p>
        <div className="mb-2">
          <SidebarAccountNav user={user} close={close} />
        </div>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-slate-400" /> Yêu thích</a>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white"><Store className="h-[18px] w-[18px] text-slate-400" /> Bộ sưu tập</a>
        <div className="mt-auto rounded-2xl border border-sky-400/15 bg-gradient-to-br from-sky-500/15 to-blue-500/[0.04] p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-sky-500/20"><Store className="h-[18px] w-[18px] text-sky-300" /></div>
          <p className="text-sm font-bold text-white">Trở thành creator</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Biến ý tưởng AI của bạn thành thu nhập.</p>
          <button className="mt-3 flex items-center gap-1 text-xs font-bold text-sky-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </aside>
    </>
  );
}

function Header({ openMenu, user }: { openMenu: () => void; user: AuthUserSummary }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/75 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden"><Menu className="h-5 w-5" /></button>
      <span className="flex items-center gap-2 whitespace-nowrap text-xs font-extrabold text-white sm:text-sm lg:hidden"><img src="/images/brand/trung-ai-logo.png" alt="Trung AI Media" className="h-7 w-7 object-contain" />Trung AI <span className="text-sky-400">Media</span></span>
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />
        <input aria-label="Tìm kiếm" placeholder="Tìm prompt, chatbot, workflow..." className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10" />
      </div>
      <button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" /></button>
      <HeaderAccountNav user={user} />
      <button className="hidden rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110 sm:block">Khám phá ngay</button>
    </header>
  );
}

function renderPromptCard(item: FreePromptItem) {
  return (
    <ProductCard
      key={item.id}
      title={item.title}
      description={item.description}
      image={item.image}
      category={item.category}
      badge="Prompt"
      href="/free-prompts"
      meta={[
        { label: item.model, tone: "blue" },
        { label: item.count },
      ]}
    />
  );
}

function renderCourseCard(course: Course) {
  return (
    <ProductCard
      key={course.id}
      title={course.name}
      description={course.shortDescription}
      image={course.coverImage}
      imageAlt={`Ảnh bìa ${course.name}`}
      category={course.category}
      badge={course.badge}
      status={course.status}
      price={course.state.isComingSoon ? "Sắp ra mắt" : course.price}
      originalPrice={course.originalPrice}
      discountPercent={getMarketplaceDiscountPercent(course.state)}
      href={course.landingPageUrl}
      actions={[course.state.isOnSale && course.landingPageUrl ? { label: "Xem chi tiết", href: course.landingPageUrl } : { label: course.status, disabled: true, variant: "muted" }]}
      demoVideo={course.demoVideo}
    />
  );
}

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

function CategoryPreviewSection({ section }: { section: CategorySection }) {
  return (
    <section id={section.id} className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
            <Sparkles className="h-3.5 w-3.5" /> {section.title}
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{section.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{section.description}</p>
        </div>
        <a href={section.href} className="group inline-flex w-fit items-center gap-2 rounded-xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm font-extrabold text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-400/15 hover:text-white">
          {section.cta}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>
      </div>
      <ProductCardGrid>
        {section.prompts.map(renderPromptCard)}
      </ProductCardGrid>
    </section>
  );
}

function FeaturedCoursesSection({ courses }: { courses: Course[] }) {
  return (
    <section id="video-ai-course" className="scroll-mt-24">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">
            <GraduationCap className="h-3.5 w-3.5" /> Khóa Học Video AI
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Khóa Học Video AI</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Lộ trình học Video AI thực chiến để xây kênh, tạo nội dung ngắn và làm Affiliate từ số 0.</p>
        </div>
        <a href="/video-ai-course" className="group inline-flex w-fit items-center gap-2 rounded-xl border border-sky-400/25 bg-sky-400/10 px-4 py-3 text-sm font-extrabold text-sky-200 transition hover:border-sky-300/50 hover:bg-sky-400/15 hover:text-white">
          Xem khóa học
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>
      </div>
      <ProductCardGrid>
        {courses.map(renderCourseCard)}
      </ProductCardGrid>
    </section>
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
      {chatbots.length || apps.length ? <ProductCardGrid>{chatbots.map(renderChatbotCard)}{apps.map(renderWorkflowCard)}</ProductCardGrid> : <div className="rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 p-8 text-sm text-slate-400">Chưa có Chatbot hoặc AI App nổi bật.</div>}
    </section>
  );
}

export function HomePageClient({ chatbots, apps, courses, aiTools, user }: { chatbots: Chatbot[]; apps: Workflow[]; courses: Course[]; aiTools: AiTool[]; user: AuthUserSummary }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} user={user} />
      <div className="lg:pl-[252px]">
        <Header openMenu={() => setMenuOpen(true)} user={user} />
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section id="products" className="scroll-mt-24">
            <div className="space-y-12">
              <FeaturedChatbotAiAppsSection chatbots={chatbots} apps={apps} />
              <CategoryPreviewSection section={categorySections[0]} />
              <FeaturedCoursesSection courses={courses} />
              <FeaturedAiToolsSection tools={aiTools} />
            </div>
          </section>
          <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-slate-500 sm:flex-row"><Logo /><p>© 2026 Trung AI Media. Crafted for the AI era.</p></footer>
        </main>
      </div>
    </div>
  );
}
