// TEST WORK
"use client";

// Marketplace home page and featured AI tools.

import { useState } from "react";
import Image from "next/image";
import { orderedPrompts, type PromptItem as FreePromptItem } from "@/lib/free-prompts";
import { AiToolCard } from "@/components/ai-tools/AiToolCard";
import { getFeaturedAiTools } from "@/lib/ai-tools";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";
import { getFeaturedWorkflows } from "@/lib/workflows";
import { ChatbotCard } from "@/components/chatbots/ChatbotCard";
import { getFeaturedChatbots } from "@/lib/chatbots";
import { PromptFreeBadge, PromptFreeCardShell } from "@/components/prompt-free/PromptFreeCardShell";
import { featuredCourses, type Course } from "@/data/courses";
import {
  ArrowRight,
  Bell,
  Boxes,
  ChevronRight,
  Clapperboard,
  GraduationCap,
  Heart,
  Home,
  Image as ImageIcon,
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

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
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

function Header({ openMenu }: { openMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/75 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden"><Menu className="h-5 w-5" /></button>
      <span className="flex items-center gap-2 whitespace-nowrap text-xs font-extrabold text-white sm:text-sm lg:hidden"><img src="/images/brand/trung-ai-logo.png" alt="Trung AI Media" className="h-7 w-7 object-contain" />Trung AI <span className="text-sky-400">Media</span></span>
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-500" />
        <input aria-label="Tìm kiếm" placeholder="Tìm prompt, chatbot, workflow..." className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/10" />
      </div>
      <button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" /></button>
      <button className="hidden rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110 sm:block">Khám phá ngay</button>
    </header>
  );
}

function promptVisualHeightStyle(heightClass: string) {
  const arbitraryHeight = heightClass.match(/h-\[(.+?)\]/)?.[1];
  if (arbitraryHeight) return { height: arbitraryHeight };

  const fixedHeights: Record<string, string> = {
    "h-80": "20rem",
    "h-96": "24rem",
  };

  return { height: fixedHeights[heightClass] ?? "24rem" };
}

function HomePromptVisual({ item }: { item: FreePromptItem }) {
  const Icon = item.icon;
  return (
    <div style={promptVisualHeightStyle(item.height)} className={`relative overflow-hidden bg-gradient-to-br ${item.gradient}`}>
      {item.image ? (
        <Image
          src={item.image}
          alt={item.title}
          fill
          priority={item.id === orderedPrompts[0]?.id}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-[1.025]"
        />
      ) : (
        <>
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[28px] border-white/10" />
          <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-black/25 blur-sm" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[30px] border border-white/20 bg-black/20 shadow-2xl backdrop-blur-md">
            <Icon className="h-11 w-11 text-white" />
          </div>
        </>
      )}
      {item.image && <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">{item.category}</span>
        <ImageIcon className="h-4 w-4 text-white/60" />
      </div>
    </div>
  );
}

function HomePromptCard({ item }: { item: FreePromptItem }) {
  return (
    <a href="/free-prompts" className="prompt-card group block w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1F33] text-left shadow-[0_12px_45px_rgba(0,0,0,.24)]">
      <HomePromptVisual item={item} />
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-sky-300">{item.category}</span>
        </div>
        <h2 className="text-[15px] font-extrabold leading-6 text-white transition group-hover:text-sky-300">{item.title}</h2>
        {item.description && <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{item.description}</p>}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="truncate text-xs font-semibold text-sky-400">{item.model}</span>
          <span className="whitespace-nowrap rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300">{item.count}</span>
        </div>
      </div>
    </a>
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {section.prompts.map((item) => <HomePromptCard key={`${section.id}-${item.id}`} item={item} />)}
      </div>
    </section>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <PromptFreeCardShell>
      <div className="relative aspect-[4/3] overflow-hidden bg-[#07111F]">
        <img src={course.coverImage} alt={`Ảnh bìa ${course.name}`} className="h-full w-full object-contain transition duration-500 group-hover:scale-[1.025]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0B1728]/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">{course.category}</span>
          <ImageIcon className="h-4 w-4 text-white/60" />
        </div>
      </div>
      <div className="flex min-h-[13.5rem] flex-col p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <PromptFreeBadge>{course.badge}</PromptFreeBadge>
          <span className="line-clamp-1 text-[10px] font-semibold text-slate-400">{course.status}</span>
        </div>
        <h2 className="line-clamp-2 text-[15px] font-extrabold leading-6 text-white transition group-hover:text-sky-300">
          {course.name}
        </h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{course.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          {course.price ? (
            <div className="flex min-w-0 items-center gap-2">
              <span className="truncate text-xs font-semibold text-sky-400">{course.price}</span>
              {course.originalPrice ? <span className="whitespace-nowrap text-[10px] font-semibold text-slate-500 line-through">{course.originalPrice}</span> : null}
            </div>
          ) : (
            <span className="text-xs font-semibold text-cyan-300">Sắp ra mắt</span>
          )}
          {course.landingPageUrl ? (
            <a href={course.landingPageUrl} className="inline-flex h-7 shrink-0 items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300 transition hover:bg-sky-500/15 hover:text-sky-200">
              Xem chi tiết <ArrowRight className="h-3 w-3" />
            </a>
          ) : (
            <span className="inline-flex h-7 shrink-0 items-center rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300">Sắp ra mắt</span>
          )}
        </div>
      </div>
    </PromptFreeCardShell>
  );
}

function FeaturedCoursesSection() {
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
      <div className="grid items-stretch gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
        {featuredCourses.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </section>
  );
}

function FeaturedAiToolsSection() {
  const tools = getFeaturedAiTools().slice(0, 6);

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
        <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => <AiToolCard key={tool.id} tool={tool} compact />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 p-8 text-sm text-slate-400">Chưa có công cụ AI nổi bật. Bạn có thể thêm công cụ từ trang quản trị.</div>
      )}
    </section>
  );
}

function FeaturedChatbotAiAppsSection() {
  const chatbots = getFeaturedChatbots().slice(0, 4);
  const apps = getFeaturedWorkflows().slice(0, 4);

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
      {chatbots.length || apps.length ? <div className="grid items-stretch gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">{chatbots.map((chatbot) => <ChatbotCard key={`chatbot-${chatbot.id}`} chatbot={chatbot} />)}{apps.map((app) => <WorkflowCard key={`ai-app-${app.id}`} workflow={app} />)}</div> : <div className="rounded-2xl border border-dashed border-sky-300/20 bg-[#0B1728]/60 p-8 text-sm text-slate-400">Chưa có Chatbot hoặc AI App nổi bật.</div>}
    </section>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />
      <div className="lg:pl-[252px]">
        <Header openMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <section id="products" className="scroll-mt-24">
            <div className="space-y-12">
              <FeaturedChatbotAiAppsSection />
              <CategoryPreviewSection section={categorySections[0]} />
              <FeaturedCoursesSection />
              <FeaturedAiToolsSection />
            </div>
          </section>
          <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-slate-500 sm:flex-row"><Logo /><p>© 2026 Trung AI Media. Crafted for the AI era.</p></footer>
        </main>
      </div>
    </div>
  );
}

