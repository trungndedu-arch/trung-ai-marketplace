"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { orderedPrompts, type PromptItem } from "@/lib/free-prompts";
import { HeaderAccountNav, SidebarAccountNav } from "@/components/auth/AccountNav";
import type { AuthUserSummary } from "@/lib/auth/session";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";
import {
  Bell,
  Boxes,
  ChevronRight,
  Clapperboard,
  Heart,
  Home,
  GraduationCap,
  Menu,
  MessageSquareMore,
  Search,
  Sparkles,
  Store,
  X,
} from "lucide-react";

const filters = ["Tất cả model", "Nano Banana Pro", "Nano Banana 2", "GPT Image", "Midjourney", "Grok", "Veo 3", "Sora", "Kling", "Runway", "Khác"];

function Brand() {
  return <Link href="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-glow"><img src="/images/brand/trung-ai-logo.png" alt="Trung AI Media" className="h-7 w-7 object-contain" /></span><span className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <b className="text-sky-400">Media</b></span></Link>;
}

function Sidebar({ open, close, user }: { open: boolean; close: () => void; user: AuthUserSummary }) {
  const links = [
    { label: "Trang chủ", icon: Home, href: "/" },
    { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts", active: true },
    { label: "Chatbot & AI App", icon: Clapperboard, href: "/workflow" },
    { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course" },
    { label: "Công Cụ AI Nên Dùng", icon: Boxes, href: "/cong-cu-ai" },
  ];
  return <>
    {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#07111F]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center justify-between px-2"><Brand /><button aria-label="Đóng menu" onClick={close} className="text-slate-300 lg:hidden"><X className="h-5 w-5" /></button></div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Trang chủ</p>
      <nav className="space-y-1">{links.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-sky-500/15 text-sky-300" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"}`}><Icon className={`h-[18px] w-[18px] ${active ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"}`} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38BDF8]" />}</Link>)}</nav>
      <div className="my-6 h-px bg-white/[0.06]" />
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Cá nhân</p>
      <div className="mb-2">
        <SidebarAccountNav user={user} close={close} />
      </div>
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-slate-400" /> Yêu thích</button>
      <div className="mt-auto rounded-2xl border border-sky-400/15 bg-gradient-to-br from-sky-500/15 to-blue-500/[0.04] p-4"><div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-sky-500/20"><Store className="h-[18px] w-[18px] text-sky-300" /></div><p className="text-sm font-bold text-white">Trở thành creator</p><p className="mt-1 text-xs leading-5 text-slate-400">Chia sẻ sản phẩm AI với cộng đồng.</p><button className="mt-3 flex items-center gap-1 text-xs font-bold text-sky-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button></div>
    </aside>
  </>;
}

function Header({ openMenu, user }: { openMenu: () => void; user: AuthUserSummary }) {
  return <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden"><Menu className="h-5 w-5" /></button><span className="hidden md:block lg:hidden"><Brand /></span><div className="flex-1" /><span className="hidden text-xs font-semibold text-slate-400 sm:block">Prompt mới mỗi tuần</span><button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" /></button><HeaderAccountNav user={user} /><Link href="/" className="hidden rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110 sm:block">Marketplace</Link></header>;
}

function PromptCard({ item }: { item: PromptItem }) {
  return (
    <ProductCard
      title={item.title}
      description={item.description}
      image={item.image}
      category={item.category}
      badge="Prompt"
      href={`/free-prompts/${item.slug}`}
      meta={[
        { label: item.model, tone: "blue" },
        { label: item.count },
      ]}
    />
  );
}

export function FreePromptsClient({ user }: { user: AuthUserSummary }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => orderedPrompts.filter((item) => (activeFilter === "Tất cả model" || item.model === activeFilter) && `${item.title} ${item.category} ${item.model}`.toLowerCase().includes(query.toLowerCase().trim())), [activeFilter, query]);

  return <div className="min-h-screen bg-ink text-slate-100"><Sidebar open={menuOpen} close={() => setMenuOpen(false)} user={user} /><div className="lg:pl-[252px]"><Header openMenu={() => setMenuOpen(true)} user={user} /><main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12"><section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0B1728] px-6 py-10 sm:px-10 lg:px-12"><div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-sky-600/20 blur-[90px]" /><div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-sky-300"><Sparkles className="h-3.5 w-3.5" /> Miễn phí · Cập nhật mỗi tuần</span><h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-.04em] text-white sm:text-5xl">Thư viện Prompt AI <span className="gradient-text">miễn phí</span></h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Sao chép và sử dụng ngay với ChatGPT, Gemini, Midjourney, Nano Banana, Veo 3 và các công cụ AI phổ biến.</p></div></section><section className="mt-8"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm prompt theo chủ đề, model..." className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10" /></div><div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${activeFilter === filter ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.30)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-sky-400/30 hover:text-white"}`}>{filter}</button>)}</div></section><div className="mb-5 mt-9 flex items-center justify-between"><p className="text-sm text-slate-400"><b className="text-white">{visible.length}</b> prompt phù hợp</p><span className="text-xs text-slate-500">Nhấn vào thẻ để xem chi tiết</span></div>{visible.length > 0 ? <ProductCardGrid>{visible.map((item) => <PromptCard key={item.id} item={item} />)}</ProductCardGrid> : <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 text-center"><div><Search className="mx-auto h-8 w-8 text-zinc-700" /><p className="mt-3 font-bold text-slate-300">Không tìm thấy prompt phù hợp</p><button onClick={() => { setQuery(""); setActiveFilter(filters[0]); }} className="mt-3 text-sm font-bold text-sky-400">Xóa bộ lọc</button></div></div>}<footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-slate-500 sm:flex-row"><Brand /><p>© 2026 Trung AI Media. Prompt tốt, ý tưởng lớn.</p></footer></main></div></div>;
}
