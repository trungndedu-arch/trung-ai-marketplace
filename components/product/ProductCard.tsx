"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, Heart } from "lucide-react";

export type ProductCardAction = {
  label: string;
  href?: string;
  external?: boolean;
  variant?: "primary" | "secondary" | "muted";
  disabled?: boolean;
};

export type ProductCardMeta = {
  label: string;
  tone?: "blue" | "cyan" | "slate";
};

type ProductCardProps = {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  badge?: string;
  status?: string;
  meta?: ProductCardMeta[];
  price?: string;
  originalPrice?: string;
  href?: string;
  onClick?: () => void;
  actions?: ProductCardAction[];
  showFavorite?: boolean;
  className?: string;
};

export function ProductCardGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`grid auto-rows-fr items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${className}`}>
      {children}
    </section>
  );
}

function metaToneClass(tone: ProductCardMeta["tone"] = "slate") {
  if (tone === "blue") return "bg-sky-500/10 text-sky-300";
  if (tone === "cyan") return "bg-cyan-500/10 text-cyan-200";
  return "bg-white/[0.06] text-slate-300";
}

function actionClass(variant: ProductCardAction["variant"] = "secondary", disabled = false) {
  if (disabled) return "border border-white/[0.08] bg-white/[0.03] text-slate-500";
  if (variant === "primary") return "bg-gradient-to-r from-blue-500 to-sky-500 text-white shadow-[0_0_20px_rgba(59,130,246,.22)] hover:brightness-110";
  if (variant === "muted") return "border border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white";
  return "border border-sky-300/25 bg-sky-500/10 text-sky-200 hover:border-sky-300/50 hover:bg-sky-500/20 hover:text-white";
}

function ActionItem({ action }: { action: ProductCardAction }) {
  const content = (
    <>
      {action.label}
      {action.external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
    </>
  );
  const classes = `inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-[11px] font-black transition ${actionClass(action.variant, action.disabled)}`;

  if (!action.href || action.disabled) return <span aria-disabled="true" className={classes}>{content}</span>;
  if (action.external) return <a href={action.href} target="_blank" rel="noopener noreferrer sponsored" className={classes}>{content}</a>;
  return <Link href={action.href} className={classes}>{content}</Link>;
}

export function ProductCard({
  title,
  description,
  image,
  imageAlt,
  category,
  badge,
  status,
  meta = [],
  price,
  originalPrice,
  href,
  onClick,
  actions = [],
  showFavorite = false,
  className = "",
}: ProductCardProps) {
  const hasPrice = Boolean(price || originalPrice);
  const hasFooter = hasPrice || meta.length > 0 || actions.length > 0 || href;
  const imageBadges = Array.from(new Set([badge, status].filter(Boolean))).slice(0, 2);
  const content = (
    <>
      {href && !onClick ? <Link href={href} aria-label={`Xem chi tiết ${title}`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" /> : null}
      <div className="pointer-events-none relative z-10 aspect-[9/16] w-full shrink-0 overflow-hidden rounded-t-2xl bg-[#07111F]">
        {image ? (
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-center transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 via-blue-700/20 to-cyan-500/10" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0F1F33]/95 to-transparent" />
        <div className="absolute left-3 top-3 flex max-w-[calc(100%-4rem)] flex-wrap gap-2">
          {imageBadges.map((item, index) => (
            <span key={item} className={`max-w-full truncate rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${index === 0 ? "border-sky-200/25 bg-[#07111F]/75 text-sky-100" : "border-white/15 bg-black/35 text-white"}`}>
              {item}
            </span>
          ))}
        </div>
        {showFavorite ? (
          <button
            type="button"
            aria-label="Thêm vào yêu thích"
            className="pointer-events-auto absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/35 text-white/70 backdrop-blur-md transition hover:text-sky-300"
          >
            <Heart className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col p-3.5 sm:p-4">
        {category ? <span className="block min-h-4 truncate text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400">{category}</span> : null}
        <div className="mt-1.5 shrink-0">
          <h3 className="line-clamp-2 min-h-11 text-[15px] font-extrabold leading-[1.45] text-white transition group-hover:text-sky-300">{title}</h3>
          {description ? <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-slate-400">{description}</p> : <div className="mt-1.5 min-h-10" />}
        </div>

        {hasFooter ? (
          <div className="mt-auto shrink-0 space-y-2.5 pt-2.5">
            {hasPrice ? (
              <div className="flex min-h-5 min-w-0 items-center gap-2">
                {price ? <span className="max-w-[9rem] truncate text-xs font-black text-white">{price}</span> : null}
                {originalPrice ? <span className="max-w-[6rem] truncate text-[10px] font-semibold text-slate-500 line-through">{originalPrice}</span> : null}
              </div>
            ) : null}
            {meta.length ? (
              <div className="flex min-h-6 flex-nowrap gap-1.5 overflow-hidden">
                {meta.slice(0, 3).map((item) => (
                  <span key={item.label} className={`min-w-0 flex-1 truncate rounded-md px-2 py-0.5 text-[10px] font-bold leading-4 ${metaToneClass(item.tone)}`}>
                    {item.label}
                  </span>
                ))}
              </div>
            ) : null}
            {actions.length ? (
              <div className="pointer-events-auto relative z-20 grid grid-cols-2 gap-2">
                {actions.slice(0, 2).map((action) => <ActionItem key={`${action.label}-${action.href ?? "disabled"}`} action={action} />)}
              </div>
            ) : href ? (
              <div className="flex justify-end">
                <span className="text-slate-500 transition group-hover:text-sky-400"><ArrowRight className="h-4 w-4" /></span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );

  const classes = `group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1F33] text-left shadow-[0_12px_45px_rgba(0,0,0,.24)] transition duration-300 hover:-translate-y-1 hover:border-sky-300/45 hover:shadow-[0_24px_62px_rgba(59,130,246,.18)] ${className}`;

  if (onClick) return <button type="button" onClick={onClick} className={classes}>{content}</button>;
  return <article className={classes}>{content}</article>;
}
