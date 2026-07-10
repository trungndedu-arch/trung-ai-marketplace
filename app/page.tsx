"use client";

import { useState } from "react";
import Image from "next/image";
import { orderedPrompts, type PromptItem as FreePromptItem } from "@/lib/free-prompts";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bell,
  Bot,
  Boxes,
  ChevronRight,
  Clock3,
  Compass,
  Flame,
  Grid2X2,
  GraduationCap,
  Heart,
  Home,
  Image as ImageIcon,
  Menu,
  MessageSquareMore,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const navItems = [
  { label: "Trang chủ", icon: Home, active: true, href: "/" },
  { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts" },
  { label: "Chatbot", icon: Bot, href: "#chatbot" },
  { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course" },
  { label: "Workflow", icon: Workflow, href: "#workflow" },
  { label: "Công Cụ AI Nên Dùng", icon: Boxes, href: "#ai-apps" },
];

type ProductItem = {
  title: string;
  creator: string;
  type: string;
  price: string;
  old: string;
  rating: string;
  sales: string;
  color: string;
  icon: LucideIcon;
  tag: string;
};

const products: ProductItem[] = [
  { title: "Viral Content Machine", creator: "Linh AI Studio", type: "Workflow", price: "349.000đ", old: "499.000đ", rating: "4.9", sales: "1.2k", color: "from-red-500 via-orange-700 to-zinc-950", icon: Zap, tag: "Bestseller" },
  { title: "SEO Blog Architect", creator: "Growth Lab", type: "Prompt Pack", price: "189.000đ", old: "259.000đ", rating: "4.8", sales: "856", color: "from-orange-500 via-red-700 to-zinc-950", icon: Sparkles, tag: "Hot" },
  { title: "Sales Copilot Pro", creator: "Minh Digital", type: "Chatbot", price: "599.000đ", old: "799.000đ", rating: "5.0", sales: "642", color: "from-red-500 via-orange-600 to-slate-950", icon: Bot, tag: "Mới" },
  { title: "Brand Visual Factory", creator: "Neon Creative", type: "Công cụ AI", price: "429.000đ", old: "", rating: "4.7", sales: "530", color: "from-orange-400 via-red-600 to-orange-950", icon: Boxes, tag: "Featured" },
  { title: "YouTube Script Genius", creator: "Creator OS", type: "Prompt Pack", price: "229.000đ", old: "319.000đ", rating: "4.9", sales: "918", color: "from-red-500 via-rose-700 to-zinc-950", icon: MessageSquareMore, tag: "-28%" },
  { title: "Customer Care 24/7", creator: "AutoBiz", type: "Chatbot", price: "699.000đ", old: "899.000đ", rating: "4.8", sales: "447", color: "from-amber-400 via-red-700 to-zinc-950", icon: ShieldCheck, tag: "Pro" },
  { title: "Research Agent Kit", creator: "Future Work", type: "Workflow", price: "389.000đ", old: "", rating: "4.9", sales: "721", color: "from-orange-400 via-red-700 to-slate-950", icon: Compass, tag: "Top rated" },
  { title: "Code Review Master", creator: "DevCraft", type: "Công cụ AI", price: "279.000đ", old: "369.000đ", rating: "4.8", sales: "384", color: "from-yellow-400 via-orange-600 to-slate-950", icon: Grid2X2, tag: "-24%" },
];

type CategorySection = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
} & (
  | { kind: "prompts"; prompts: FreePromptItem[] }
  | { kind: "products"; items: ProductItem[] }
);

const categorySections: CategorySection[] = [
  {
    id: "free-prompts",
    title: "Prompt AI Miễn Phí",
    description: "Các prompt nổi bật dùng ngay cho ảnh, video, quảng cáo, bán hàng và xây kênh nội dung.",
    href: "/free-prompts",
    cta: "Xem thêm prompt",
    kind: "prompts",
    prompts: orderedPrompts.slice(0, 4),
  },
  {
    id: "chatbot",
    title: "Chatbot",
    description: "Những chatbot AI nổi bật giúp chăm sóc khách hàng, bán hàng và tự động hóa hội thoại.",
    href: "#chatbot",
    cta: "Xem thêm chatbot",
    kind: "products",
    items: [products[2], products[5]],
  },
  {
    id: "video-ai-course",
    title: "Khóa Học Video AI",
    description: "Lộ trình học Video AI thực chiến để xây kênh, tạo nội dung ngắn và làm Affiliate từ số 0.",
    href: "/video-ai-course",
    cta: "Xem khóa học",
    kind: "products",
    items: [
      { title: "Video AI Thực Chiến", creator: "Trung AI Media", type: "Khóa học", price: "149.000đ", old: "899.000đ", rating: "5.0", sales: "Ưu đãi", color: "from-red-500 via-orange-600 to-zinc-950", icon: GraduationCap, tag: "Giảm 83%" },
      { title: "Xây Kênh & Kiếm Tiền Affiliate", creator: "Trung AI Media", type: "Video AI", price: "149.000đ", old: "899.000đ", rating: "5.0", sales: "20 bài", color: "from-orange-400 via-red-600 to-black", icon: Zap, tag: "Thực chiến" },
    ],
  },
  {
    id: "workflow",
    title: "Workflow",
    description: "Bộ quy trình AI giúp bạn đi từ ý tưởng đến nội dung hoàn chỉnh nhanh hơn và dễ lặp lại.",
    href: "#workflow",
    cta: "Xem thêm workflow",
    kind: "products",
    items: [products[0], products[6]],
  },
  {
    id: "ai-apps",
    title: "Công Cụ AI Nên Dùng",
    description: "Các công cụ AI nổi bật nên dùng cho thiết kế, nội dung, lập trình và tự động hóa công việc.",
    href: "#ai-apps",
    cta: "Xem thêm công cụ AI",
    kind: "products",
    items: [products[3], products[7]],
  },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-glow">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <span className="text-orange-400">Media</span></div>
    </div>
  );
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return (
    <>
      {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#080202]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between px-2">
          <Logo />
          <button aria-label="Đóng menu" onClick={close} className="text-zinc-400 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Trang chủ</p>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, active, href }) => (
            <a key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-orange-500/15 text-orange-300" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`}>
              <Icon className={`h-[18px] w-[18px] ${active ? "text-orange-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
              {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400 shadow-[0_0_10px_#fb923c]" />}
            </a>
          ))}
        </nav>
        <div className="my-6 h-px bg-white/[0.06]" />
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Cá nhân</p>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-zinc-500" /> Yêu thích</a>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white"><Store className="h-[18px] w-[18px] text-zinc-500" /> Bộ sưu tập</a>
        <div className="mt-auto rounded-2xl border border-orange-400/15 bg-gradient-to-br from-orange-500/15 to-red-500/[0.04] p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-orange-500/20"><Store className="h-[18px] w-[18px] text-orange-300" /></div>
          <p className="text-sm font-bold text-white">Trở thành creator</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Biến ý tưởng AI của bạn thành thu nhập.</p>
          <button className="mt-3 flex items-center gap-1 text-xs font-bold text-orange-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </aside>
    </>
  );
}

function Header({ openMenu }: { openMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/75 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 lg:hidden"><Menu className="h-5 w-5" /></button>
      <span className="whitespace-nowrap text-xs font-extrabold text-white sm:text-sm lg:hidden">Trung AI <span className="text-orange-400">Media</span></span>
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-600" />
        <input aria-label="Tìm kiếm" placeholder="Tìm prompt, chatbot, workflow..." className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/10" />
      </div>
      <button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-red-500" /></button>
      <button className="hidden rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110 sm:block">Khám phá ngay</button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-grid relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#120606] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div className="absolute -right-28 -top-40 h-[460px] w-[460px] rounded-full bg-orange-600/25 blur-[100px]" />
      <div className="absolute bottom-[-180px] left-[35%] h-[360px] w-[360px] rounded-full bg-red-600/15 blur-[110px]" />
      <div className="relative z-10 max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-orange-300">
          <Sparkles className="h-3.5 w-3.5" /> AI Marketplace thế hệ mới
        </div>
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[64px]">
          Biến ý tưởng thành<br /><span className="gradient-text">sức mạnh AI.</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">Khám phá những prompt, chatbot, workflow và ứng dụng AI được tạo bởi cộng đồng chuyên gia hàng đầu.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#products" className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 px-5 py-3 text-sm font-extrabold text-white shadow-glow transition hover:scale-[1.02]">Khám phá sản phẩm <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></a>
          <button className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-zinc-200 hover:bg-white/[0.08]">Trở thành người bán</button>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6 text-xs text-zinc-500">
          <span><b className="text-base text-white">2,500+</b><br />Sản phẩm AI</span>
          <span className="h-8 w-px bg-white/10" />
          <span><b className="text-base text-white">12K+</b><br />Người sáng tạo</span>
          <span className="h-8 w-px bg-white/10" />
          <span><b className="text-base text-white">4.9/5</b><br />Đánh giá</span>
        </div>
      </div>
      <div className="absolute right-10 top-1/2 hidden h-[280px] w-[280px] -translate-y-1/2 lg:block xl:right-20 xl:h-[330px] xl:w-[330px]">
        <div className="absolute inset-0 animate-pulse rounded-full border border-orange-400/20" />
        <div className="absolute inset-10 rounded-full border border-red-400/20" />
        <div className="absolute inset-[82px] grid place-items-center rounded-[34px] border border-white/15 bg-gradient-to-br from-orange-500/60 to-red-500/20 shadow-[0_0_80px_rgba(249,115,22,.4)] backdrop-blur-xl rotate-12"><Sparkles className="h-16 w-16 -rotate-12 text-white" /></div>
        <div className="absolute left-3 top-16 rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md"><Bot className="h-6 w-6 text-orange-300" /></div>
        <div className="absolute bottom-10 right-0 rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md"><Workflow className="h-6 w-6 text-red-300" /></div>
      </div>
    </section>
  );
}

function FlashSale() {
  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><Flame className="h-5 w-5 fill-red-500 text-red-500" /><h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Flash Sale</h2></div>
          <p className="mt-1 text-sm text-zinc-500">Ưu đãi nổi bật, chỉ trong thời gian ngắn</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500"><Clock3 className="h-4 w-4" /> Kết thúc sau <span className="rounded-lg bg-white/[0.06] px-2.5 py-2 text-white">06</span>:<span className="rounded-lg bg-white/[0.06] px-2.5 py-2 text-white">24</span>:<span className="rounded-lg bg-white/[0.06] px-2.5 py-2 text-white">18</span></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-[#210909] to-[#130707] p-5 sm:p-6">
          <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-red-500/20 blur-3xl" />
          <span className="rounded-md bg-red-500 px-2 py-1 text-[10px] font-black uppercase text-white">Giảm 40%</span>
          <h3 className="mt-4 text-xl font-extrabold text-white">Ultimate Marketing Bundle</h3>
          <p className="mt-1 text-sm text-zinc-400">25+ workflow giúp tăng tốc đội ngũ marketing</p>
          <div className="mt-5 flex items-center gap-3"><span className="text-lg font-black text-white">599.000đ</span><span className="text-sm text-zinc-600 line-through">999.000đ</span><button className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-[0_0_22px_rgba(249,115,22,.22)] transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></button></div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-r from-[#160909] to-[#11121e] p-5 sm:p-6">
          <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />
          <span className="rounded-md bg-orange-500 px-2 py-1 text-[10px] font-black uppercase text-white">Giảm 35%</span>
          <h3 className="mt-4 text-xl font-extrabold text-white">AI Creator Starter Kit</h3>
          <p className="mt-1 text-sm text-zinc-400">Bộ công cụ khởi đầu cho nhà sáng tạo nội dung</p>
          <div className="mt-5 flex items-center gap-3"><span className="text-lg font-black text-white">389.000đ</span><span className="text-sm text-zinc-600 line-through">599.000đ</span><button className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-[0_0_22px_rgba(249,115,22,.25)] transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </div>
    </section>
  );
}

function HomePromptVisual({ item }: { item: FreePromptItem }) {
  const Icon = item.icon;
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} ${item.height}`}>
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
    <a href="/free-prompts" className="prompt-card group block w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#140707] text-left shadow-[0_12px_45px_rgba(0,0,0,.24)]">
      <HomePromptVisual item={item} />
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-orange-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-orange-300">{item.category}</span>
        </div>
        <h2 className="text-[15px] font-extrabold leading-6 text-white transition group-hover:text-orange-300">{item.title}</h2>
        {item.description && <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">{item.description}</p>}
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="truncate text-xs font-semibold text-orange-400">{item.model}</span>
          <span className="whitespace-nowrap rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-zinc-400">{item.count}</span>
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
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-400/15 bg-orange-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-orange-300">
            <Sparkles className="h-3.5 w-3.5" /> {section.title}
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{section.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">{section.description}</p>
        </div>
        <a href={section.href} className="group inline-flex w-fit items-center gap-2 rounded-xl border border-orange-400/25 bg-orange-400/10 px-4 py-3 text-sm font-extrabold text-orange-200 transition hover:border-orange-300/50 hover:bg-orange-400/15 hover:text-white">
          {section.cta}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </a>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {section.kind === "prompts"
          ? section.prompts.map((item) => <HomePromptCard key={`${section.id}-${item.id}`} item={item} />)
          : section.items.map((product) => <ProductCard key={`${section.id}-${product.title}`} product={product} />)}
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: ProductItem }) {
  const Icon = product.icon;
  return (
    <article className="card-hover group overflow-hidden rounded-2xl border border-white/[0.07] bg-panel">
      <div className={`relative aspect-[4/2.75] overflow-hidden bg-gradient-to-br ${product.color}`}>
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white_0,transparent_35%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/20 bg-black/20 backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:rotate-3"><Icon className="h-9 w-9 text-white" /></div>
        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md">{product.tag}</span>
        <button aria-label="Thêm vào yêu thích" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/35 text-white/70 backdrop-blur-md hover:text-orange-300"><Heart className="h-4 w-4" /></button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-400">{product.type}</span><span className="flex items-center gap-1 text-[11px] text-zinc-500"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {product.rating} · {product.sales}</span></div>
        <h3 className="truncate text-[15px] font-extrabold text-white">{product.title}</h3>
        <p className="mt-1 text-xs text-zinc-500">bởi {product.creator}</p>
        <div className="mt-4 flex items-end gap-2 border-t border-white/[0.06] pt-4"><span className="text-sm font-black text-white">{product.price}</span>{product.old && <span className="text-[11px] text-zinc-600 line-through">{product.old}</span>}<button className="ml-auto text-zinc-600 transition group-hover:text-orange-400"><ArrowRight className="h-4 w-4" /></button></div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-zinc-200">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />
      <div className="lg:pl-[252px]">
        <Header openMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Hero />
          <FlashSale />
          <section id="products" className="mt-14 scroll-mt-24">
            <div className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Trang chủ theo danh mục</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">Các mục bên dưới được sắp xếp theo đúng menu bên trái, mỗi mục có một vài card nổi bật và nút xem thêm để đi thẳng tới danh mục đó.</p>
              </div>
            </div>
            <div className="space-y-12">
              {categorySections.map((section) => <CategoryPreviewSection key={section.id} section={section} />)}
            </div>
          </section>
          <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-zinc-600 sm:flex-row"><Logo /><p>© 2026 Trung AI Media. Crafted for the AI era.</p></footer>
        </main>
      </div>
    </div>
  );
}
