"use client";

import Link from "next/link";
import { LogIn, LogOut, UserRound, UserPlus } from "lucide-react";
import { CartNavLink } from "@/components/cart/CartNavLink";
import type { AuthUserSummary } from "@/lib/auth/session";

function compactEmail(email: string) {
  const [name, domain] = email.split("@");

  if (!domain) return email;
  const shortName = name.length > 12 ? `${name.slice(0, 10)}...` : name;

  return `${shortName}@${domain}`;
}

function SignOutControl({ compact = false }: { compact?: boolean }) {
  return (
    <form action="/auth/sign-out" method="post">
      <button
        type="submit"
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-extrabold text-slate-300 transition hover:border-sky-300/35 hover:bg-white/[0.06] hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        <span className={compact ? "sr-only sm:not-sr-only" : ""}>Đăng xuất</span>
      </button>
    </form>
  );
}

export function HeaderAccountNav({ user, showLabels = false }: { user: AuthUserSummary; showLabels?: boolean }) {
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <CartNavLink showLabel={showLabels} />
        <Link
          href="/login"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-xs font-extrabold text-slate-200 transition hover:border-sky-300/35 hover:bg-white/[0.06] hover:text-white"
        >
          <LogIn className="h-4 w-4" />
          <span className={showLabels ? "" : "hidden sm:inline"}>Đăng nhập</span>
        </Link>
        <Link
          href="/register"
          className={`${showLabels ? "inline-flex" : "hidden sm:inline-flex"} min-h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-3 text-xs font-extrabold text-white shadow-glow transition hover:brightness-110`}
        >
          <UserPlus className="h-4 w-4" />
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <CartNavLink showLabel={showLabels} />
      <Link
        href="/account"
        className="inline-flex min-h-10 min-w-0 items-center gap-2 rounded-xl border border-sky-400/20 bg-sky-500/10 px-3 text-xs font-extrabold text-sky-100 transition hover:border-sky-300/45 hover:bg-sky-500/15 hover:text-white"
        title={user.email}
      >
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sky-400/15">
          <UserRound className="h-3.5 w-3.5" />
        </span>
        <span className={`${showLabels ? "inline" : "hidden md:inline"} max-w-[150px] truncate`}>{compactEmail(user.email)}</span>
      </Link>
      <SignOutControl compact />
    </div>
  );
}

export function SidebarAccountNav({ user, close }: { user: AuthUserSummary; close?: () => void }) {
  if (!user) {
    return (
      <div className="space-y-2">
        <Link
          href="/login"
          onClick={close}
          className="flex min-h-11 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 text-sm font-semibold text-slate-200 transition hover:border-sky-300/35 hover:bg-white/[0.06] hover:text-white"
        >
          <LogIn className="h-[18px] w-[18px] text-sky-300" />
          Đăng nhập
        </Link>
        <Link
          href="/register"
          onClick={close}
          className="flex min-h-11 items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-3 text-sm font-extrabold text-white shadow-glow transition hover:brightness-110"
        >
          <UserPlus className="h-[18px] w-[18px]" />
          Đăng ký
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Link
        href="/account"
        onClick={close}
        className="flex min-h-11 min-w-0 items-center gap-3 rounded-xl border border-sky-300/20 bg-sky-500/10 px-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/45 hover:bg-sky-500/15 hover:text-white"
        title={user.email}
      >
        <UserRound className="h-[18px] w-[18px] shrink-0 text-sky-300" />
        <span className="min-w-0 truncate">{compactEmail(user.email)}</span>
      </Link>
      <SignOutControl />
    </div>
  );
}
