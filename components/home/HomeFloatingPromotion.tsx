"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

export type HomePromotion = {
  title: string;
  href: string;
  imageUrl?: string | null;
  eyebrow?: string | null;
};

function isSafePromotion(promotion?: HomePromotion | null) {
  if (!promotion || typeof promotion.title !== "string" || typeof promotion.href !== "string") return false;
  if (!promotion.title.trim() || !promotion.href.trim()) return false;

  return promotion.href.startsWith("/") && !promotion.href.startsWith("//");
}

export function HomeFloatingPromotion({ promotion }: { promotion?: HomePromotion | null }) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen || !isSafePromotion(promotion) || !promotion) return null;

  return (
    <aside className="fixed bottom-6 left-6 z-40 hidden w-64 overflow-hidden rounded-2xl border border-sky-300/20 bg-[#0B1728]/95 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-xl xl:block">
      <button
        type="button"
        aria-label="Đóng quảng bá"
        onClick={() => setIsOpen(false)}
        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-[#07111F]/90 text-slate-300 transition hover:border-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
      >
        <X className="h-4 w-4" />
      </button>
      {promotion.imageUrl ? (
        <div className="relative aspect-[16/9] overflow-hidden border-b border-white/[0.07]">
          <Image src={promotion.imageUrl} alt={promotion.title} fill sizes="256px" className="object-cover" />
        </div>
      ) : null}
      <div className="p-4 pr-11">
        {promotion.eyebrow ? <p className="text-[10px] font-black uppercase tracking-[.18em] text-sky-300">{promotion.eyebrow}</p> : null}
        <Link href={promotion.href} className="mt-1 block text-sm font-extrabold leading-5 text-white transition hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
          {promotion.title}
        </Link>
      </div>
    </aside>
  );
}
