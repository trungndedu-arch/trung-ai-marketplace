"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ExternalLink, Heart, Play, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import type { CatalogDemoVideo } from "@/lib/catalog/types";
import { isYouTubeVideoId } from "@/lib/youtube";

export type ProductCardAction = {
  label: string;
  href?: string;
  external?: boolean;
  variant?: "primary" | "secondary" | "muted";
  disabled?: boolean;
  kind?: "add-to-cart" | "buy-now";
  productId?: string;
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
  discountPercent?: number;
  href?: string;
  onClick?: () => void;
  actions?: ProductCardAction[];
  showFavorite?: boolean;
  demoVideo?: CatalogDemoVideo | null;
  className?: string;
};

export function ProductCardGrid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`grid auto-rows-fr items-stretch gap-4 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 min-[1600px]:grid-cols-5 xl:gap-5 ${className}`}>
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
  const router = useRouter();
  const { addProduct } = useCart();
  const [feedback, setFeedback] = useState("");
  const isCartAction = action.kind === "add-to-cart" || action.kind === "buy-now";
  const displayLabel = feedback || action.label;
  const content = (
    <>
      {displayLabel}
      {isCartAction ? <ShoppingCart className="h-3.5 w-3.5" /> : action.external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
    </>
  );
  const classes = `inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl px-3 text-[11px] font-black transition ${actionClass(action.variant, action.disabled)}`;

  function handleCartAction(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!action.productId) return;

    const result = addProduct(action.productId);
    if (result === "full") {
      setFeedback("Giỏ hàng đã đầy");
      return;
    }
    if (result === "invalid") {
      setFeedback("Không thể thêm");
      return;
    }
    if (action.kind === "buy-now") {
      router.push("/checkout");
      return;
    }
    setFeedback(result === "duplicate" ? "Đã có trong giỏ" : "Đã thêm");
  }

  if (isCartAction) return <button type="button" onClick={handleCartAction} disabled={action.disabled || !action.productId} className={classes} aria-live="polite">{content}</button>;
  if (!action.href || action.disabled) return <span aria-disabled="true" className={classes}>{content}</span>;
  if (action.external) return <a href={action.href} target="_blank" rel="noopener noreferrer sponsored" className={classes}>{content}</a>;
  return <Link href={action.href} className={classes}>{content}</Link>;
}

function ProductCardMedia({
  title,
  image,
  imageAlt,
  imageBadges,
  showFavorite,
  demoVideo,
}: {
  title: string;
  image?: string;
  imageAlt?: string;
  imageBadges: string[];
  showFavorite: boolean;
  demoVideo?: CatalogDemoVideo | null;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const canPlayDemo = demoVideo?.provider === "youtube" && isYouTubeVideoId(demoVideo.id);

  function playDemo(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsPlaying(true);
  }

  return (
    <div className="pointer-events-none relative z-10 aspect-[9/16] w-full shrink-0 overflow-hidden rounded-t-2xl bg-[#07111F]">
      {isPlaying && canPlayDemo ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${demoVideo.id}?autoplay=1&playsinline=1&rel=0`}
          title={`Video demo ${title}`}
          className="pointer-events-auto absolute inset-0 h-full w-full border-0 bg-black"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <>
          {image ? (
            <Image
              src={image}
              alt={imageAlt ?? title}
              fill
              sizes="(min-width: 1600px) 20vw, (min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 480px) 50vw, 100vw"
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
          {canPlayDemo ? (
            <button
              type="button"
              aria-label={`Phát video demo ${title}`}
              onClick={playDemo}
              className="pointer-events-auto absolute left-1/2 top-1/2 z-20 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/55 text-white shadow-[0_10px_32px_rgba(0,0,0,.45)] backdrop-blur-sm transition hover:scale-105 hover:border-sky-200/70 hover:bg-sky-500/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F] sm:h-16 sm:w-16"
            >
              <Play className="ml-0.5 h-6 w-6 fill-current sm:h-7 sm:w-7" />
            </button>
          ) : null}
        </>
      )}
    </div>
  );
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
  discountPercent,
  href,
  onClick,
  actions = [],
  showFavorite = false,
  demoVideo,
  className = "",
}: ProductCardProps) {
  const visibleMeta = meta.filter((item) => item.label.trim()).slice(0, 3);
  const normalizedDiscount = typeof discountPercent === "number" && Number.isFinite(discountPercent)
    ? Math.round(discountPercent)
    : undefined;
  const hasDiscount = Boolean(price && originalPrice && normalizedDiscount && normalizedDiscount > 0);
  const hasPrice = Boolean(price || originalPrice);
  const hasFooter = hasPrice || visibleMeta.length > 0 || actions.length > 0 || href;
  const imageBadges = Array.from(new Set([badge, status].filter((item): item is string => Boolean(item)))).slice(0, 2);
  const content = (
    <>
      {href && !onClick ? <Link href={href} aria-label={`Xem chi tiết ${title}`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300" /> : null}
      <ProductCardMedia title={title} image={image} imageAlt={imageAlt} imageBadges={imageBadges} showFavorite={showFavorite} demoVideo={demoVideo} />

      <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col p-3.5 sm:p-4">
        {category ? <span className="block min-h-4 truncate text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400">{category}</span> : null}
        <div className="mt-1.5 shrink-0">
          <h3 className="line-clamp-2 min-h-11 text-[15px] font-extrabold leading-[1.45] text-white transition group-hover:text-sky-300">{title}</h3>
          {description ? <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-slate-400">{description}</p> : <div className="mt-1.5 min-h-10" />}
        </div>

        {hasFooter ? (
          <div className="mt-auto shrink-0 space-y-2.5 pt-2.5">
            {hasPrice ? (
              <div className={`relative min-h-[58px] min-w-0 rounded-xl border px-3 pb-2.5 transition duration-300 ${hasDiscount ? "border-amber-300/35 bg-gradient-to-br from-amber-400/[0.12] via-[#111B2D] to-rose-500/[0.09] pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,.05),0_0_22px_rgba(245,158,11,.09)] group-hover:border-amber-200/55 group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,.07),0_0_28px_rgba(251,146,60,.16)]" : "border-amber-300/20 bg-gradient-to-r from-amber-400/[0.07] via-white/[0.025] to-transparent pt-2.5 group-hover:border-amber-200/35"}`}>
                {hasDiscount ? (
                  <span className="absolute -top-2.5 left-3 inline-flex h-5 items-center gap-1 rounded-full border border-orange-200/25 bg-gradient-to-r from-orange-500 to-rose-500 px-2 text-[9px] font-black uppercase tracking-[0.13em] text-white shadow-[0_0_16px_rgba(244,63,94,.28)]">
                    <Zap aria-hidden="true" className="h-2.5 w-2.5 fill-current" />
                    Giá ưu đãi
                  </span>
                ) : null}
                <div className={`${hasDiscount ? "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-x-2 gap-y-1" : "flex min-h-8 min-w-0 flex-wrap items-center gap-x-2 gap-y-1"}`}>
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                    {price ? <span className="whitespace-nowrap bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-400 bg-clip-text text-2xl font-black leading-none tracking-[-0.035em] text-transparent drop-shadow-[0_0_12px_rgba(251,191,36,.2)]">{price}</span> : null}
                    {originalPrice ? <span className="whitespace-nowrap text-[11px] font-bold text-slate-300/75 line-through decoration-slate-400/80 decoration-[1.5px]">{originalPrice}</span> : null}
                  </div>
                  {hasDiscount ? <span className="mb-px whitespace-nowrap rounded-full border border-rose-200/30 bg-gradient-to-r from-rose-600 to-pink-500 px-2 py-1 text-[10px] font-black leading-none text-white shadow-[0_0_14px_rgba(244,63,94,.24)]">-{normalizedDiscount}%</span> : null}
                </div>
              </div>
            ) : null}
            {visibleMeta.length ? (
              <div className="flex min-h-6 flex-nowrap gap-1.5 overflow-hidden">
                {visibleMeta.map((item) => (
                  <span key={item.label} className={`min-w-0 flex-1 truncate rounded-md px-2 py-0.5 text-[10px] font-bold leading-4 ${metaToneClass(item.tone)}`}>
                    {item.label}
                  </span>
                ))}
              </div>
            ) : null}
            {actions.length ? (
              <div className="pointer-events-auto relative z-20 grid grid-cols-2 gap-2">
                {actions.slice(0, 2).map((action) => <ActionItem key={`${action.label}-${action.href ?? action.productId ?? "disabled"}`} action={action} />)}
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
