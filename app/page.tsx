"use client";

import { useState } from "react";
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
  { label: "Khám phá", icon: Home, active: true, href: "/" },
  { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts" },
  { label: "Chatbot", icon: Bot, href: "#products" },
  { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course" },
  { label: "Workflow", icon: Workflow, href: "#products" },
  { label: "AI Apps", icon: Boxes, href: "#products" },
];

const categories = ["Tất cả", "Nổi bật", "Marketing", "Sáng tạo", "Năng suất", "Lập trình"];

const products = [
  { title: "Viral Content Machine", creator: "Linh AI Studio", type: "Workflow", price: "349.000đ", old: "499.000đ", rating: "4.9", sales: "1.2k", color: "from-fuchsia-500 via-purple-600 to-indigo-900", icon: Zap, tag: "Bestseller" },
  { title: "SEO Blog Architect", creator: "Growth Lab", type: "Prompt Pack", price: "189.000đ", old: "259.000đ", rating: "4.8", sales: "856", color: "from-violet-500 via-indigo-600 to-blue-900", icon: Sparkles, tag: "Hot" },
  { title: "Sales Copilot Pro", creator: "Minh Digital", type: "Chatbot", price: "599.000đ", old: "799.000đ", rating: "5.0", sales: "642", color: "from-pink-500 via-purple-600 to-slate-950", icon: Bot, tag: "Mới" },
  { title: "Brand Visual Factory", creator: "Neon Creative", type: "AI App", price: "429.000đ", old: "", rating: "4.7", sales: "530", color: "from-orange-400 via-fuchsia-600 to-violet-950", icon: Boxes, tag: "Featured" },
  { title: "YouTube Script Genius", creator: "Creator OS", type: "Prompt Pack", price: "229.000đ", old: "319.000đ", rating: "4.9", sales: "918", color: "from-red-500 via-rose-600 to-purple-950", icon: MessageSquareMore, tag: "-28%" },
  { title: "Customer Care 24/7", creator: "AutoBiz", type: "Chatbot", price: "699.000đ", old: "899.000đ", rating: "4.8", sales: "447", color: "from-cyan-400 via-blue-600 to-indigo-950", icon: ShieldCheck, tag: "Pro" },
  { title: "Research Agent Kit", creator: "Future Work", type: "Workflow", price: "389.000đ", old: "", rating: "4.9", sales: "721", color: "from-emerald-400 via-teal-600 to-slate-950", icon: Compass, tag: "Top rated" },
  { title: "Code Review Master", creator: "DevCraft", type: "AI App", price: "279.000đ", old: "369.000đ", rating: "4.8", sales: "384", color: "from-sky-400 via-violet-600 to-slate-950", icon: Grid2X2, tag: "-24%" },
];

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-glow">
        <Sparkles className="h-5 w-5 text-white" />
      </div>
      <div className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <span className="text-violet-400">Studio</span></div>
    </div>
  );
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return (
    <>
      {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#0c0b12]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-8 flex items-center justify-between px-2">
          <Logo />
          <button aria-label="Đóng menu" onClick={close} className="text-zinc-400 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Khám phá</p>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon, active, href }) => (
            <a key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-violet-500/15 text-violet-300" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`}>
              <Icon className={`h-[18px] w-[18px] ${active ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
              {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />}
            </a>
          ))}
        </nav>
        <div className="my-6 h-px bg-white/[0.06]" />
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Cá nhân</p>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-zinc-500" /> Yêu thích</a>
        <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white"><Store className="h-[18px] w-[18px] text-zinc-500" /> Bộ sưu tập</a>
        <div className="mt-auto rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/[0.04] p-4">
          <div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-violet-500/20"><Store className="h-[18px] w-[18px] text-violet-300" /></div>
          <p className="text-sm font-bold text-white">Trở thành creator</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Biến ý tưởng AI của bạn thành thu nhập.</p>
          <button className="mt-3 flex items-center gap-1 text-xs font-bold text-violet-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </aside>
    </>
  );
}

function Header({ openMenu }: { openMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/75 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 lg:hidden"><Menu className="h-5 w-5" /></button>
      <span className="whitespace-nowrap text-xs font-extrabold text-white sm:text-sm lg:hidden">Trung AI <span className="text-violet-400">Studio</span></span>
      <div className="relative max-w-xl flex-1">
        <Search className="absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-zinc-600" />
        <input aria-label="Tìm kiếm" placeholder="Tìm prompt, chatbot, workflow..." className="h-11 w-full rounded-xl border border-white/[0.07] bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10" />
      </div>
      <button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-fuchsia-500" /></button>
      <button className="hidden rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-zinc-950 transition hover:bg-violet-100 sm:block">Khám phá ngay</button>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-grid relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#100d1a] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
      <div className="absolute -right-28 -top-40 h-[460px] w-[460px] rounded-full bg-violet-600/25 blur-[100px]" />
      <div className="absolute bottom-[-180px] left-[35%] h-[360px] w-[360px] rounded-full bg-fuchsia-600/15 blur-[110px]" />
      <div className="relative z-10 max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-300">
          <Sparkles className="h-3.5 w-3.5" /> AI Marketplace thế hệ mới
        </div>
        <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl lg:text-[64px]">
          Biến ý tưởng thành<br /><span className="gradient-text">sức mạnh AI.</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">Khám phá những prompt, chatbot, workflow và ứng dụng AI được tạo bởi cộng đồng chuyên gia hàng đầu.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#products" className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-extrabold text-white shadow-glow transition hover:scale-[1.02]">Khám phá sản phẩm <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></a>
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
        <div className="absolute inset-0 animate-pulse rounded-full border border-violet-400/20" />
        <div className="absolute inset-10 rounded-full border border-fuchsia-400/20" />
        <div className="absolute inset-[82px] grid place-items-center rounded-[34px] border border-white/15 bg-gradient-to-br from-violet-500/60 to-fuchsia-500/20 shadow-[0_0_80px_rgba(139,92,246,.4)] backdrop-blur-xl rotate-12"><Sparkles className="h-16 w-16 -rotate-12 text-white" /></div>
        <div className="absolute left-3 top-16 rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md"><Bot className="h-6 w-6 text-violet-300" /></div>
        <div className="absolute bottom-10 right-0 rounded-xl border border-white/10 bg-black/40 p-3 backdrop-blur-md"><Workflow className="h-6 w-6 text-fuchsia-300" /></div>
      </div>
    </section>
  );
}

function FlashSale() {
  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2"><Flame className="h-5 w-5 fill-fuchsia-500 text-fuchsia-500" /><h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Flash Sale</h2></div>
          <p className="mt-1 text-sm text-zinc-500">Ưu đãi nổi bật, chỉ trong thời gian ngắn</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500"><Clock3 className="h-4 w-4" /> Kết thúc sau <span className="rounded-lg bg-white/[0.06] px-2.5 py-2 text-white">06</span>:<span className="rounded-lg bg-white/[0.06] px-2.5 py-2 text-white">24</span>:<span className="rounded-lg bg-white/[0.06] px-2.5 py-2 text-white">18</span></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="group relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-gradient-to-r from-[#211027] to-[#151020] p-5 sm:p-6">
          <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <span className="rounded-md bg-fuchsia-500 px-2 py-1 text-[10px] font-black uppercase text-white">Giảm 40%</span>
          <h3 className="mt-4 text-xl font-extrabold text-white">Ultimate Marketing Bundle</h3>
          <p className="mt-1 text-sm text-zinc-400">25+ workflow giúp tăng tốc đội ngũ marketing</p>
          <div className="mt-5 flex items-center gap-3"><span className="text-lg font-black text-white">599.000đ</span><span className="text-sm text-zinc-600 line-through">999.000đ</span><button className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-white text-black transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></button></div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-r from-[#17132c] to-[#11121e] p-5 sm:p-6">
          <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
          <span className="rounded-md bg-violet-500 px-2 py-1 text-[10px] font-black uppercase text-white">Giảm 35%</span>
          <h3 className="mt-4 text-xl font-extrabold text-white">AI Creator Starter Kit</h3>
          <p className="mt-1 text-sm text-zinc-400">Bộ công cụ khởi đầu cho nhà sáng tạo nội dung</p>
          <div className="mt-5 flex items-center gap-3"><span className="text-lg font-black text-white">389.000đ</span><span className="text-sm text-zinc-600 line-through">599.000đ</span><button className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-white text-black transition group-hover:translate-x-1"><ArrowRight className="h-4 w-4" /></button></div>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  const Icon = product.icon;
  return (
    <article className="card-hover group overflow-hidden rounded-2xl border border-white/[0.07] bg-panel">
      <div className={`relative aspect-[4/2.75] overflow-hidden bg-gradient-to-br ${product.color}`}>
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white_0,transparent_35%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/20 bg-black/20 backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:rotate-3"><Icon className="h-9 w-9 text-white" /></div>
        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md">{product.tag}</span>
        <button aria-label="Thêm vào yêu thích" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/35 text-white/70 backdrop-blur-md hover:text-pink-300"><Heart className="h-4 w-4" /></button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-violet-400">{product.type}</span><span className="flex items-center gap-1 text-[11px] text-zinc-500"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {product.rating} · {product.sales}</span></div>
        <h3 className="truncate text-[15px] font-extrabold text-white">{product.title}</h3>
        <p className="mt-1 text-xs text-zinc-500">bởi {product.creator}</p>
        <div className="mt-4 flex items-end gap-2 border-t border-white/[0.06] pt-4"><span className="text-sm font-black text-white">{product.price}</span>{product.old && <span className="text-[11px] text-zinc-600 line-through">{product.old}</span>}<button className="ml-auto text-zinc-600 transition group-hover:text-violet-400"><ArrowRight className="h-4 w-4" /></button></div>
      </div>
    </article>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tất cả");

  return (
    <div className="min-h-screen bg-ink text-zinc-200">
      <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />
      <div className="lg:pl-[252px]">
        <Header openMenu={() => setMenuOpen(true)} />
        <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Hero />
          <FlashSale />
          <section id="products" className="mt-14 scroll-mt-24">
            <div className="mb-6 flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div><h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Khám phá sản phẩm</h2><p className="mt-1 text-sm text-zinc-500">Công cụ AI chọn lọc dành cho công việc của bạn</p></div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-bold transition ${activeCategory === category ? "bg-white text-black" : "border border-white/[0.07] bg-white/[0.03] text-zinc-500 hover:text-white"}`}>{category}</button>)}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => <ProductCard key={product.title} product={product} />)}
            </div>
            <div className="mt-8 flex justify-center"><button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-bold text-zinc-300 hover:bg-white/[0.07]">Xem thêm sản phẩm <ArrowRight className="h-4 w-4" /></button></div>
          </section>
          <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-zinc-600 sm:flex-row"><Logo /><p>© 2026 Trung AI Studio. Crafted for the AI era.</p></footer>
        </main>
      </div>
    </div>
  );
}
