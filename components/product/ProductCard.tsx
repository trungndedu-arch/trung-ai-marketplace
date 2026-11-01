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
  if (tone === "blue") return "bg-[#FFEDD5] text-[#C65D1B]";
  if (tone === "cyan") return "bg-[#FFF3E5] text-[#C65D1B]";
  return "bg-[#FFF8F0] text-[#786D63]";
}

function actionClass(variant: ProductCardAction["variant"] = "secondary", disabled = false) {
  if (disabled) return "border border-[#F1E6D7] bg-[#FFF8F0] text-[#A99B8E]";
  if (variant === "primary") return "bg-gradient-to-r from-[#E76F21] to-[#C65D1B] text-white shadow-[0_10px_20px_rgba(198,93,27,.2)] hover:brightness-110";
  if (variant === "muted") return "border border-[#F1E6D7] bg-white text-[#786D63] hover:bg-[#FFEDD5] hover:text-[#C65D1B]";
  return "border border-[#E76F21]/35 bg-[#FFEDD5] text-[#C65D1B] hover:border-[#E76F21] hover:bg-[#FFE1BE]";
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
    <div className="pointer-events-none relative z-10 aspect-[9/16] w-full shrink-0 overflow-hidden rounded-t-2xl bg-[#FFF3E5]">
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
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFEDD5] via-[#F5C38E] to-[#E76F21]/45" />
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#202020]/70 to-transparent" />
          <div className="absolute left-3 top-3 flex max-w-[calc(100%-4rem)] flex-wrap gap-2">
            {imageBadges.map((item, index) => (
              <span key={item} className={`max-w-full truncate rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${index === 0 ? "border-[#FFE1BE] bg-[#C65D1B]/90 text-white" : "border-white/30 bg-black/35 text-white"}`}>
                {item}
              </span>
            ))}
          </div>
          {showFavorite ? (
            <button
              type="button"
              aria-label="Thêm vào yêu thích"
              className="pointer-events-auto absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-black/35 text-white/80 backdrop-blur-md transition hover:text-[#FFE1BE]"
            >
              <Heart className="h-4 w-4" />
            </button>
          ) : null}
          {canPlayDemo ? (
            <button
              type="button"
              aria-label={`Phát video demo ${title}`}
              onClick={playDemo}
              className="pointer-events-auto absolute left-1/2 top-1/2 z-20 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/55 text-white shadow-[0_10px_32px_rgba(0,0,0,.45)] backdrop-blur-sm transition hover:scale-105 hover:border-[#FFE1BE] hover:bg-[#C65D1B]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E76F21] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF3E5] sm:h-16 sm:w-16"
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
      {href && !onClick ? <Link href={href} aria-label={`Xem chi tiết ${title}`} className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E76F21]" /> : null}
      <ProductCardMedia title={title} image={image} imageAlt={imageAlt} imageBadges={imageBadges} showFavorite={showFavorite} demoVideo={demoVideo} />

      <div className="pointer-events-none relative z-10 flex min-h-0 flex-1 flex-col p-3.5 sm:p-4">
        {category ? <span className="block min-h-4 truncate text-[10px] font-bold uppercase tracking-[0.14em] text-[#C65D1B]">{category}</span> : null}
        <div className="mt-1.5 shrink-0">
          <h3 className="line-clamp-2 min-h-11 text-[15px] font-extrabold leading-[1.45] text-[#202020] transition group-hover:text-[#C65D1B]">{title}</h3>
          {description ? <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-5 text-[#786D63]">{description}</p> : <div className="mt-1.5 min-h-10" />}
        </div>

        {hasFooter ? (
          <div className="mt-auto shrink-0 space-y-2.5 pt-2.5">
            {hasPrice ? (
              <div className={`relative min-h-[58px] min-w-0 rounded-xl border px-3 pb-2.5 transition duration-300 ${hasDiscount ? "border-[#F0B26E] bg-gradient-to-br from-[#FFF3E5] via-white to-[#FFEDD5] pt-4 shadow-[inset_0_1px_0_rgba(255,255,255,.9),0_8px_18px_rgba(198,93,27,.08)] group-hover:border-[#E76F21]" : "border-[#F1E6D7] bg-[#FFFDF9] pt-2.5 group-hover:border-[#F0B26E]"}`}>
                {hasDiscount ? (
                  <span className="absolute -top-2.5 left-3 inline-flex h-5 items-center gap-1 rounded-full border border-[#FFE1BE] bg-gradient-to-r from-[#E76F21] to-[#C65D1B] px-2 text-[9px] font-black uppercase tracking-[0.13em] text-white shadow-[0_6px_14px_rgba(198,93,27,.22)]">
                    <Zap aria-hidden="true" className="h-2.5 w-2.5 fill-current" />
                    Giá ưu đãi
                  </span>
                ) : null}
                <div className={`${hasDiscount ? "grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-x-2 gap-y-1" : "flex min-h-8 min-w-0 flex-wrap items-center gap-x-2 gap-y-1"}`}>
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                    {price ? <span className="whitespace-nowrap text-2xl font-black leading-none tracking-[-0.035em] text-[#C65D1B]">{price}</span> : null}
                    {originalPrice ? <span className="whitespace-nowrap text-[11px] font-bold text-[#A99B8E] line-through decoration-[#A99B8E] decoration-[1.5px]">{originalPrice}</span> : null}
                  </div>
                  {hasDiscount ? <span className="mb-px whitespace-nowrap rounded-full border border-[#FFE1BE] bg-[#FFEDD5] px-2 py-1 text-[10px] font-black leading-none text-[#C65D1B]">-{normalizedDiscount}%</span> : null}
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
                <span className="text-[#A99B8E] transition group-hover:text-[#C65D1B]"><ArrowRight className="h-4 w-4" /></span>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );

  const classes = `group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E3D2C0] bg-white text-left shadow-[0_12px_28px_rgba(94,54,22,.12)] transition duration-300 hover:-translate-y-1.5 hover:border-[#E76F21]/75 hover:shadow-[0_24px_52px_rgba(198,93,27,.18)] ${className}`;

  if (onClick) return <button type="button" onClick={onClick} className={classes}>{content}</button>;
  return <article className={classes}>{content}</article>;
}
