"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Bot,
  Boxes,
  ChevronRight,
  GraduationCap,
  Heart,
  Home,
  Menu,
  MessageSquareMore,
  Sparkles,
  Store,
  Workflow,
  X,
} from "lucide-react";

const links = [
  { label: "Khám phá", icon: Home, href: "/" },
  { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts" },
  { label: "Chatbot", icon: Bot, href: "/#products" },
  { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course", active: true },
  { label: "Workflow", icon: Workflow, href: "/#products" },
  { label: "AI Apps", icon: Boxes, href: "/#products" },
];

function Brand() {
  return <Link href="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-glow"><Sparkles className="h-5 w-5 text-white" /></span><span className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <b className="text-violet-400">Studio</b></span></Link>;
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return <>
    {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#0c0b12]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center justify-between px-2"><Brand /><button aria-label="Đóng menu" onClick={close} className="text-zinc-400 lg:hidden"><X className="h-5 w-5" /></button></div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Khám phá</p>
      <nav className="space-y-1">{links.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-violet-500/15 text-violet-300" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`}><Icon className={`h-[18px] w-[18px] ${active ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />}</Link>)}</nav>
      <div className="my-6 h-px bg-white/[0.06]" />
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Cá nhân</p>
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-zinc-500" /> Yêu thích</button>
      <div className="mt-auto rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/[0.04] p-4"><div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-violet-500/20"><Store className="h-[18px] w-[18px] text-violet-300" /></div><p className="text-sm font-bold text-white">Trở thành creator</p><p className="mt-1 text-xs leading-5 text-zinc-500">Chia sẻ sản phẩm AI với cộng đồng.</p><button className="mt-3 flex items-center gap-1 text-xs font-bold text-violet-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button></div>
    </aside>
  </>;
}

export default function VideoAICoursePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="min-h-screen bg-ink text-zinc-200">
    <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />
    <div className="lg:pl-[252px]">
      <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><button onClick={() => setMenuOpen(true)} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 lg:hidden"><Menu className="h-5 w-5" /></button><span className="hidden md:block lg:hidden"><Brand /></span><div className="flex-1" /><button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-fuchsia-500" /></button></header>
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="hero-grid relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#100d1a] px-6 py-14 sm:px-10 sm:py-20 lg:px-14">
          <div className="absolute -right-24 -top-40 h-[430px] w-[430px] rounded-full bg-violet-600/25 blur-[100px]" />
          <div className="relative z-10 max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-violet-300"><GraduationCap className="h-4 w-4" /> Học cùng Trung AI Studio</span><h1 className="mt-5 text-4xl font-extrabold tracking-[-.04em] text-white sm:text-5xl lg:text-6xl">Khóa Học <span className="gradient-text">Video AI</span></h1><p className="mt-5 text-lg font-semibold text-zinc-300 sm:text-xl">Xây Kênh & Làm Affiliate Từ Số 0 Bằng Video AI</p><p className="mt-8 border-l-2 border-violet-500 pl-4 text-sm leading-7 text-zinc-500">Trang này sẽ được cập nhật nội dung khóa học trong các bước tiếp theo.</p></div>
        </section>
      </main>
    </div>
  </div>;
}
