import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bot, Heart, ShieldCheck, Star } from "lucide-react";
import type { Chatbot } from "@/lib/chatbots";

function formatPrice(price: number) {
  return price === 0 ? "Sắp ra mắt" : new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export function ChatbotCard({ chatbot }: { chatbot: Chatbot }) {
  const Icon = chatbot.icon === "shield" ? ShieldCheck : Bot;
  const imageFrameClass = chatbot.coverAspect === "portrait" ? "h-[22rem] sm:h-[24rem] xl:h-[22rem]" : "aspect-[4/2.75]";

  return (
    <article className="card-hover group overflow-hidden rounded-2xl border border-white/[0.07] bg-panel">
      <div className={`relative overflow-hidden bg-gradient-to-br ${chatbot.color} ${imageFrameClass}`}>
        {chatbot.coverImage ? (
          <Image
            src={chatbot.coverImage}
            alt={chatbot.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-contain transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_30%_20%,white_0,transparent_35%)]" />
            <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-white/20 bg-black/20 backdrop-blur-md transition duration-300 group-hover:scale-110 group-hover:rotate-3">
              <Icon className="h-9 w-9 text-white" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-black/35 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white backdrop-blur-md">
          {chatbot.badge}
        </span>
        <button
          aria-label="Thêm vào yêu thích"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-black/35 text-white/70 backdrop-blur-md hover:text-sky-300"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400">{chatbot.category}</span>
          <span className="flex items-center gap-1 text-[11px] text-slate-400">
            <Star className="h-3 w-3 fill-cyan-400 text-cyan-400" /> {chatbot.rating} · {chatbot.sales}
          </span>
        </div>
        <h3 className="truncate text-[15px] font-extrabold text-white">{chatbot.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">{chatbot.shortDescription}</p>
        <div className="mt-4 flex items-end gap-2 border-t border-white/[0.06] pt-4">
          <span className="text-sm font-black text-white">{formatPrice(chatbot.price)}</span>
          {chatbot.originalPrice ? (
            <span className="text-[11px] text-slate-500 line-through">{formatPrice(chatbot.originalPrice)}</span>
          ) : null}
          <Link
            href={`/workflow/chatbot/${chatbot.slug}`}
            className="ml-auto text-slate-500 transition group-hover:text-sky-400"
            aria-label={`Xem chi tiết ${chatbot.name}`}
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
