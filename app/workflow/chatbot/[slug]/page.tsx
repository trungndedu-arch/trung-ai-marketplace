import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Bot, CheckCircle2, ShieldCheck } from "lucide-react";
import { getChatbotBySlug } from "@/lib/chatbots";

function formatPrice(price: number) {
  return price === 0 ? "Sắp ra mắt" : new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export default async function ChatbotDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chatbot = getChatbotBySlug(slug);
  if (!chatbot) notFound();

  const Icon = chatbot.icon === "shield" ? ShieldCheck : Bot;

  return (
    <main className="mx-auto max-w-[1200px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-400">
        <Link href="/" className="hover:text-sky-300">Trang chủ</Link>
        <span>/</span>
        <Link href="/workflow" className="hover:text-sky-300">Chatbot & AI App</Link>
        <span>/</span>
        <span className="font-semibold text-slate-200">{chatbot.name}</span>
      </nav>

      <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B1728] p-6 sm:p-10">
        <div className={`absolute -right-24 -top-24 h-80 w-80 rounded-full bg-gradient-to-br ${chatbot.color} opacity-30 blur-[90px]`} />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_.9fr] lg:items-center">
          <div>
            <Link href="/workflow" className="inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Quay lại Chatbot & AI App
            </Link>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-sky-300/25 bg-sky-500/10 px-3 py-1.5 text-xs font-black text-sky-200">{chatbot.badge}</span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-200">{chatbot.category}</span>
            </div>

            <h1 className="mt-5 text-3xl font-extrabold tracking-[-.04em] text-white sm:text-4xl">{chatbot.name}</h1>
            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">{chatbot.fullDescription}</p>

            <div className="mt-7 flex items-end gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Trạng thái</p>
                <div className="mt-1 flex items-center gap-3">
                  <span className="text-3xl font-black text-white">{formatPrice(chatbot.price)}</span>
                </div>
              </div>
            </div>

            <button className="mt-8 inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500/70 to-sky-500/70 px-5 text-sm font-extrabold text-white shadow-[0_0_26px_rgba(59,130,246,.18)]">
              Sắp ra mắt <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${chatbot.color}`}>
            {chatbot.coverImage ? (
              <Image
                src={chatbot.coverImage}
                alt={chatbot.name}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <>
                <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:28px_28px]" />
                <div className="relative grid h-28 w-28 place-items-center rounded-[34px] border border-white/20 bg-black/20 backdrop-blur-md">
                  <Icon className="h-14 w-14 text-white" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Đang hoàn thiện tính năng", "Thông tin chi tiết sẽ cập nhật sau", "Phù hợp cho người làm nội dung"].map((item) => (
          <div key={item} className="flex gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-sm text-slate-300">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-sky-300" />
            {item}
          </div>
        ))}
      </section>
    </main>
  );
}
