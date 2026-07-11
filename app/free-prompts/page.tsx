"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PromptFreeBadge, PromptFreeCardShell } from "@/components/prompt-free/PromptFreeCardShell";
import { orderedPrompts, type PromptItem } from "@/lib/free-prompts";
import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Bell,
  Bot,
  Boxes,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Clipboard,
  Copy,
  Heart,
  Home,
  GraduationCap,
  Image as ImageIcon,
  Menu,
  MessageSquareMore,
  Play,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Video,
  X,
} from "lucide-react";

const filters = ["Tất cả model", "Nano Banana Pro", "Nano Banana 2", "GPT Image", "Midjourney", "Grok", "Veo 3", "Sora", "Kling", "Runway", "Khác"];

function Brand() {
  return <Link href="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-glow"><Sparkles className="h-5 w-5 text-white" /></span><span className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <b className="text-sky-400">Media</b></span></Link>;
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  const links = [
    { label: "Trang chủ", icon: Home, href: "/" },
    { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts", active: true },
    { label: "Chatbot", icon: Bot, href: "/#products" },
    { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course" },
    { label: "AI Video App", icon: Clapperboard, href: "/workflow" },
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
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-slate-400" /> Yêu thích</button>
      <div className="mt-auto rounded-2xl border border-sky-400/15 bg-gradient-to-br from-sky-500/15 to-blue-500/[0.04] p-4"><div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-sky-500/20"><Store className="h-[18px] w-[18px] text-sky-300" /></div><p className="text-sm font-bold text-white">Trở thành creator</p><p className="mt-1 text-xs leading-5 text-slate-400">Chia sẻ sản phẩm AI với cộng đồng.</p><button className="mt-3 flex items-center gap-1 text-xs font-bold text-sky-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button></div>
    </aside>
  </>;
}

function Header({ openMenu }: { openMenu: () => void }) {
  return <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-slate-200 lg:hidden"><Menu className="h-5 w-5" /></button><span className="hidden md:block lg:hidden"><Brand /></span><div className="flex-1" /><span className="hidden text-xs font-semibold text-slate-400 sm:block">Prompt mới mỗi tuần</span><button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-300 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-500" /></button><Link href="/" className="hidden rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 py-2.5 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110 sm:block">Marketplace</Link></header>;
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

function PromptVisual({ item, modal = false }: { item: PromptItem; modal?: boolean }) {
  const Icon = item.icon;
  return <div style={modal ? undefined : promptVisualHeightStyle(item.height)} className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} ${modal ? "h-64 sm:h-full sm:min-h-[460px]" : ""}`}>
    {item.image ? <Image src={item.image} alt={item.title} fill priority={item.id === 13} sizes={modal ? "(max-width: 640px) 100vw, 45vw" : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"} className={`${modal ? "object-contain bg-black" : "object-cover"} transition duration-500 group-hover:scale-[1.025]`} /> : <>
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[28px] border-white/10" />
      <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-black/25 blur-sm" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[30px] border border-white/20 bg-black/20 shadow-2xl backdrop-blur-md"><Icon className="h-11 w-11 text-white" /></div>
    </>}
    {item.image && <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />}
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between"><span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">{item.category}</span><ImageIcon className="h-4 w-4 text-white/60" /></div>
  </div>;
}

function PromptCard({ item, open }: { item: PromptItem; open: () => void }) {
  return <PromptFreeCardShell onClick={open}><PromptVisual item={item} /><div className="p-4"><div className="mb-2 flex items-center gap-2"><PromptFreeBadge>{item.category}</PromptFreeBadge></div><h2 className="text-[15px] font-extrabold leading-6 text-white transition group-hover:text-sky-300">{item.title}</h2>{item.description && <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-400">{item.description}</p>}<div className="mt-3 flex items-center justify-between gap-3"><span className="truncate text-xs font-semibold text-sky-400">{item.model}</span><span className="whitespace-nowrap rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-slate-300">{item.count}</span></div></div></PromptFreeCardShell>;
}

function PromptGallery({ item }: { item: PromptItem }) {
  const images = item.images ?? (item.image ? [item.image] : []);
  const [activeIndex, setActiveIndex] = useState(0);
  const previous = () => setActiveIndex((current) => (current - 1 + images.length) % images.length);
  const next = () => setActiveIndex((current) => (current + 1) % images.length);

  return <div className="flex min-h-[520px] flex-col bg-black p-3 sm:min-h-[620px] sm:p-4">
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#0B1728]">
      <Image src={images[activeIndex]} alt={`${item.title} — ảnh ${activeIndex + 1}`} fill priority sizes="(max-width: 640px) 100vw, 45vw" className="object-contain" />
      <button type="button" aria-label="Ảnh trước" onClick={previous} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-sky-600"><ChevronLeft className="h-5 w-5" /></button>
      <button type="button" aria-label="Ảnh tiếp theo" onClick={next} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-sky-600"><ChevronRight className="h-5 w-5" /></button>
      <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">{activeIndex + 1}/{images.length}</span>
    </div>
    <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-1">
      {images.map((image, index) => <button type="button" key={image} onClick={() => setActiveIndex(index)} aria-label={`Chọn ảnh ${index + 1}`} className={`relative h-16 w-12 flex-none overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-14 ${activeIndex === index ? "border-sky-400 shadow-[0_0_18px_rgba(59,130,246,.55)]" : "border-transparent opacity-55 hover:opacity-100"}`}><Image src={image} alt="" fill sizes="56px" className="object-cover" /><span className={`absolute inset-x-0 bottom-0 h-1 ${activeIndex === index ? "bg-sky-400" : "bg-transparent"}`} /></button>)}
    </div>
  </div>;
}

function PromptModal({ item, close, copied, copy }: { item: PromptItem; close: () => void; copied: boolean; copy: () => void }) {
  useEffect(() => { const onKey = (event: KeyboardEvent) => event.key === "Escape" && close(); window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; }; }, [close]);
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-3 backdrop-blur-md sm:p-6" onMouseDown={close}>
    <div role="dialog" aria-modal="true" aria-label={item.title} onMouseDown={(event) => event.stopPropagation()} className="grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[24px] border border-white/10 bg-[#0F1F33] shadow-[0_0_80px_rgba(59,130,246,.22)] sm:grid-cols-[.9fr_1.1fr]">
      {item.images && item.images.length > 1 ? <PromptGallery item={item} /> : <PromptVisual item={item} modal />}
      <div className="flex flex-col p-5 sm:p-8">
        <button aria-label="Đóng" onClick={close} className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-white/10 text-slate-400 hover:bg-white/[0.06] hover:text-white"><X className="h-4 w-4" /></button>
        <span className="mt-2 text-[10px] font-black uppercase tracking-[.18em] text-sky-400">{item.category}</span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{item.title}</h2>
        {item.description && <p className="mt-3 text-sm leading-6 text-slate-300">{item.description}</p>}
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-300"><Sparkles className="h-4 w-4 text-sky-400" /> Model AI <b className="text-slate-100">{item.model}</b></div>
        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/25 p-4"><p className="mb-3 text-[10px] font-black uppercase tracking-[.17em] text-slate-500">Nội dung prompt</p><p className="max-h-48 whitespace-pre-line overflow-y-auto text-sm leading-7 text-slate-200">{item.prompt}</p></div>
        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row"><button onClick={copy} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-extrabold text-white transition ${copied ? "bg-cyan-600" : "bg-gradient-to-r from-sky-600 to-blue-600 hover:brightness-110"}`}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Đã sao chép Prompt" : "Sao chép Prompt"}</button><button onClick={close} className="rounded-xl border border-white/10 px-5 py-3.5 text-sm font-bold text-slate-300 hover:bg-white/[0.05] hover:text-white">Đóng</button></div>
      </div>
    </div>
  </div>;
}

export default function FreePromptsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PromptItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  const visible = useMemo(() => orderedPrompts.filter((item) => (activeFilter === "Tất cả model" || item.model === activeFilter) && `${item.title} ${item.category} ${item.model}`.toLowerCase().includes(query.toLowerCase().trim())), [activeFilter, query]);
  const closeModal = () => { setSelected(null); setCopied(false); };
  const copyPrompt = async () => { if (!selected) return; await navigator.clipboard.writeText(selected.prompt); setCopied(true); setToast(true); window.setTimeout(() => setToast(false), 2200); };

  return <div className="min-h-screen bg-ink text-slate-100"><Sidebar open={menuOpen} close={() => setMenuOpen(false)} /><div className="lg:pl-[252px]"><Header openMenu={() => setMenuOpen(true)} /><main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12"><section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0B1728] px-6 py-10 sm:px-10 lg:px-12"><div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-sky-600/20 blur-[90px]" /><div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-sky-300"><Sparkles className="h-3.5 w-3.5" /> Miễn phí · Cập nhật mỗi tuần</span><h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-.04em] text-white sm:text-5xl">Thư viện Prompt AI <span className="gradient-text">miễn phí</span></h1><p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">Sao chép và sử dụng ngay với ChatGPT, Gemini, Midjourney, Nano Banana, Veo 3 và các công cụ AI phổ biến.</p></div></section><section className="mt-8"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm prompt theo chủ đề, model..." className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-500/50 focus:ring-4 focus:ring-sky-500/10" /></div><div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${activeFilter === filter ? "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_24px_rgba(59,130,246,.30)]" : "border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-sky-400/30 hover:text-white"}`}>{filter}</button>)}</div></section><div className="mb-5 mt-9 flex items-center justify-between"><p className="text-sm text-slate-400"><b className="text-white">{visible.length}</b> prompt phù hợp</p><span className="text-xs text-slate-500">Nhấn vào thẻ để xem chi tiết</span></div>{visible.length > 0 ? <section className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">{visible.map((item) => <PromptCard key={item.id} item={item} open={() => { setSelected(item); setCopied(false); }} />)}</section> : <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 text-center"><div><Search className="mx-auto h-8 w-8 text-zinc-700" /><p className="mt-3 font-bold text-slate-300">Không tìm thấy prompt phù hợp</p><button onClick={() => { setQuery(""); setActiveFilter(filters[0]); }} className="mt-3 text-sm font-bold text-sky-400">Xóa bộ lọc</button></div></div>}<footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-slate-500 sm:flex-row"><Brand /><p>© 2026 Trung AI Media. Prompt tốt, ý tưởng lớn.</p></footer></main></div>{selected && <PromptModal item={selected} close={closeModal} copied={copied} copy={copyPrompt} />}{toast && <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-950/95 px-4 py-3 text-sm font-bold text-cyan-200 shadow-2xl backdrop-blur-md"><Check className="h-4 w-4" /> Đã sao chép Prompt</div>}</div>;
}
