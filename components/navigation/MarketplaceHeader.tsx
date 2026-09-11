"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Boxes,
  Clapperboard,
  GraduationCap,
  Heart,
  Home,
  Menu,
  MessageSquareMore,
  Search,
  X,
} from "lucide-react";
import { HeaderAccountNav, SidebarAccountNav } from "@/components/auth/AccountNav";
import { CartNavLink } from "@/components/cart/CartNavLink";
import type { AuthUserSummary } from "@/lib/auth/session";

const primaryNavigation = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Prompt AI Miễn Phí", href: "/free-prompts", icon: MessageSquareMore },
  { label: "Chatbot & AI App", href: "/workflow", icon: Clapperboard },
  { label: "Khóa Học Video AI", href: "/video-ai-course", icon: GraduationCap },
  { label: "Công Cụ AI Nên Dùng", href: "/cong-cu-ai", icon: Boxes },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MarketplaceBrand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="Trung AI Media - Trang chủ" className="flex min-w-0 shrink-0 items-center gap-2.5">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-sky-300/20 bg-[#0B1728] shadow-[0_0_24px_rgba(56,189,248,.18)]">
        <img src="/images/brand/trung-ai-logo.png" alt="" className="h-8 w-8 object-contain" />
      </span>
      <span className={`${compact ? "hidden sm:block" : "hidden min-[480px]:block"} whitespace-nowrap text-[15px] font-black tracking-tight text-white`}>
        Trung AI <span className="text-sky-400">Media</span>
      </span>
    </Link>
  );
}

function SearchField({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className={`relative ${mobile ? "w-full" : "min-w-[170px] max-w-[260px] flex-1"}`}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        aria-label="Tìm kiếm sản phẩm AI"
        placeholder="Tìm công cụ, chatbot, prompt..."
        className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.035] pl-10 pr-3 text-xs text-white outline-none placeholder:text-slate-500 focus:border-sky-400/45 focus:ring-4 focus:ring-sky-500/10"
      />
    </div>
  );
}

export function MarketplaceHeader({ user }: { user: AuthUserSummary }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#07111F]/95 shadow-[0_14px_34px_rgba(0,0,0,.2)] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[68px] max-w-[1800px] items-center gap-3 px-4 py-2 sm:px-6 xl:px-8">
          <MarketplaceBrand />

          <div className="hidden md:block md:min-w-[180px] md:flex-1 xl:max-w-[240px]">
            <SearchField />
          </div>

          <nav aria-label="Điều hướng chính" className="mx-auto hidden min-w-0 items-center justify-center gap-0.5 xl:flex">
            {primaryNavigation.map(({ label, href }) => {
              const active = isActivePath(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-[11px] font-extrabold transition 2xl:px-3 2xl:text-xs ${active ? "bg-sky-500/12 text-sky-300" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"}`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-2 min-[1440px]:flex">
            <button type="button" aria-label="Yêu thích" className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-slate-300 transition hover:border-sky-300/35 hover:text-sky-300">
              <Heart className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Thông báo" className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-slate-300 transition hover:border-sky-300/35 hover:text-white">
              <Bell className="h-4 w-4" />
            </button>
            <HeaderAccountNav user={user} />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 min-[1440px]:hidden">
            <button
              type="button"
              aria-label={mobileSearchOpen ? "Đóng tìm kiếm" : "Mở tìm kiếm"}
              onClick={() => setMobileSearchOpen((current) => !current)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-slate-200 md:hidden"
            >
              <Search className="h-4 w-4" />
            </button>
            <CartNavLink />
            <button type="button" onClick={() => setMenuOpen(true)} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-slate-200">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {mobileSearchOpen ? <div className="border-t border-white/[0.06] px-4 py-3 md:hidden"><SearchField mobile /></div> : null}

      </header>

      {menuOpen ? <button type="button" aria-label="Đóng menu" onClick={() => setMenuOpen(false)} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm min-[1440px]:hidden" /> : null}
      <aside className={`fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col border-l border-white/[0.08] bg-[#07111F] p-5 shadow-2xl transition-transform duration-300 min-[1440px]:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between gap-3">
          <MarketplaceBrand />
          <button type="button" aria-label="Đóng menu" onClick={() => setMenuOpen(false)} className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-slate-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav aria-label="Điều hướng mobile" className="mt-8 space-y-1.5">
          {primaryNavigation.map(({ label, href, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${active ? "bg-sky-500/12 text-sky-200" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"}`}>
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="my-5 h-px bg-white/[0.07]" />
        <button type="button" className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm font-bold text-slate-300 hover:bg-white/[0.04] hover:text-white">
          <Heart className="h-[18px] w-[18px]" /> Yêu thích
        </button>
        <div className="mt-auto pt-6">
          <SidebarAccountNav user={user} close={() => setMenuOpen(false)} />
        </div>
      </aside>
    </>
  );
}
