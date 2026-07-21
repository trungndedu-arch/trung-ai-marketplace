"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Boxes, ChevronRight, Clapperboard, GraduationCap, Heart, Home, Menu, MessageSquareMore, Store, X } from "lucide-react";

function Brand() {
  return <Link href="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-glow"><img src="/images/brand/trung-ai-logo.png" alt="Trung AI Media" className="h-7 w-7 object-contain" /></span><span className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <b className="text-sky-400">Media</b></span></Link>;
}

function Sidebar({ open, close, activeModule }: { open: boolean; close: () => void; activeModule: "tools" | "workflows" }) {
  const pathname = usePathname();
  const links = [
    { label: "Trang chủ", icon: Home, href: "/" },
    { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts" },
    { label: "Chatbot & AI App", icon: Clapperboard, href: "/workflow" },
    { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course" },
    { label: "Công Cụ AI Nên Dùng", icon: Boxes, href: "/cong-cu-ai" },
  ];

  return <>
    {open ? <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} /> : null}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#07111F]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center justify-between px-2"><Brand /><button aria-label="Đóng menu" onClick={close} className="text-slate-300 lg:hidden"><X className="h-5 w-5" /></button></div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Khám phá</p>
      <nav className="space-y-1">{links.map(({ label, icon: Icon, href }) => { const active = href === "/cong-cu-ai" ? activeModule === "tools" && (pathname === href || pathname.startsWith("/cong-cu-ai/")) : href === "/workflow" ? activeModule === "workflows" && (pathname === href || pathname.startsWith("/workflow/")) : pathname === href; return <Link key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-sky-500/15 text-sky-300" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"}`}><Icon className={`h-[18px] w-[18px] ${active ? "text-sky-400" : "text-slate-400 group-hover:text-slate-200"}`} />{label}{active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38BDF8]" /> : null}</Link>; })}</nav>
      <div className="my-6 h-px bg-white/[0.06]" />
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Cá nhân</p>
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-slate-400" /> Yêu thích</button>
      <div className="mt-auto rounded-2xl border border-sky-400/15 bg-gradient-to-br from-sky-500/15 to-blue-500/[0.04] p-4"><div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-sky-500/20"><Store className="h-[18px] w-[18px] text-sky-300" /></div><p className="text-sm font-bold text-white">Trở thành creator</p><p className="mt-1 text-xs leading-5 text-slate-400">Chia sẻ sản phẩm AI với cộng đồng.</p><button className="mt-3 flex items-center gap-1 text-xs font-bold text-sky-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button></div>
    </aside>
  </>;
}

function Header({ openMenu }: { openMenu: () => void }) {
  return <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden"><Menu className="h-5 w-5" /></button><span className="hidden md:block lg:hidden"><Brand /></span><div className="flex-1" /><span className="hidden text-xs font-semibold text-slate-400 sm:block">Công cụ được chọn lọc</span><button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" /></button><Link href="/" className="hidden rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110 sm:block">Marketplace</Link></header>;
}

export function AiToolsShell({ children, activeModule = "tools" }: { children: React.ReactNode; activeModule?: "tools" | "workflows" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <div className="min-h-screen bg-ink text-slate-100"><Sidebar open={menuOpen} close={() => setMenuOpen(false)} activeModule={activeModule} /><div className="lg:pl-[252px]"><Header openMenu={() => setMenuOpen(true)} />{children}</div></div>;
}
