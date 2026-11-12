import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clapperboard, MessageCircle, Sparkles, Wrench } from "lucide-react";
import { HomeContactLinks } from "@/components/home/HomeContactLinks";
import { HomeFloatingPromotion, type HomePromotion } from "@/components/home/HomeFloatingPromotion";
import { coachingLanding } from "@/lib/coaching";
import type { HomepageContactLinks } from "@/lib/homepage-contact-links";

// Set to true when the founder section is ready to be shown again.
export const SHOW_HOME_ABOUT_SECTION = false;

export function HomeHeroAbout({ contactLinks, promotion, onCoachingConsultation }: { contactLinks: HomepageContactLinks; promotion?: HomePromotion | null; onCoachingConsultation?: () => void }) {
  return <>
    <HomeFloatingPromotion promotion={promotion} />
    <section className="relative isolate overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#07111F] px-5 py-14 text-center shadow-[0_32px_100px_rgba(0,0,0,.32)] sm:px-8 sm:py-16 lg:px-12 lg:py-20">
      <div aria-hidden="true" className="absolute inset-0 -z-20 opacity-35 [background-image:linear-gradient(rgba(56,189,248,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,.08)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
      <div aria-hidden="true" className="absolute left-1/2 top-0 -z-10 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-sky-500/10 blur-[110px]" />
      <div className="mx-auto max-w-5xl">
        <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.2em] text-sky-200 sm:text-xs"><Sparkles className="h-3.5 w-3.5" />AI Video <span className="text-slate-600">•</span> Marketing <span className="text-slate-600">•</span> Bán hàng</p>
        <h1 className="mt-6 text-balance text-4xl font-black leading-[1.08] tracking-[-.045em] text-white sm:text-5xl lg:text-6xl">Ứng Dụng AI Vào <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">Marketing &amp; Bán Hàng</span></h1>
        <p className="mx-auto mt-5 max-w-3xl text-pretty text-sm leading-7 text-slate-300 sm:text-base lg:text-lg">Khám phá công cụ AI, học làm video bán hàng và ứng dụng AI để sáng tạo nội dung hiệu quả hơn.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/workflow?tab=ai-app" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-500 px-5 text-sm font-extrabold text-white shadow-[0_12px_34px_rgba(14,165,233,.28)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transform-none"><Clapperboard className="h-4 w-4" />Khám phá AI App<ArrowRight className="h-4 w-4" /></Link>
          {coachingLanding.enabled && onCoachingConsultation ? <button type="button" onClick={onCoachingConsultation} aria-haspopup="dialog" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-5 text-sm font-extrabold text-cyan-100 transition hover:-translate-y-0.5 hover:border-cyan-300/50 hover:bg-cyan-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 motion-reduce:transform-none"><MessageCircle className="h-4 w-4" />Tư vấn Coaching AI 1:1</button> : null}
          <Link href="/free-prompts" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 text-sm font-extrabold text-slate-200 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transform-none"><Sparkles className="h-4 w-4 text-sky-300" />Prompt miễn phí</Link>
        </div>
        <HomeContactLinks settings={contactLinks} align="center" />
      </div>
    </section>

    {SHOW_HOME_ABOUT_SECTION ? (
      <section aria-labelledby="about-nguyen-duc-trung" className="mt-8 grid overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[#0B1728] shadow-[0_24px_70px_rgba(0,0,0,.24)] lg:grid-cols-[45%_55%]">
      <div className="relative min-h-[420px] overflow-hidden border-b border-sky-300/15 bg-[radial-gradient(circle_at_50%_28%,rgba(56,189,248,.16),transparent_48%),linear-gradient(145deg,#07111F,#0B1728)] lg:min-h-[560px] lg:border-b-0 lg:border-r">
        <div aria-hidden="true" className="absolute inset-5 rounded-[1.5rem] border border-sky-300/15" />
        <Image src="/images/hero/person.png" alt="Nguyễn Đức Trung - Trung AI Media" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain object-bottom px-3 pt-7 sm:px-8" />
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
        <p className="text-xs font-black uppercase tracking-[.2em] text-sky-300">Người sáng lập Trung AI Media</p>
        <h2 id="about-nguyen-duc-trung" className="mt-3 text-3xl font-black tracking-[-.035em] text-white sm:text-4xl">Nguyễn Đức Trung</h2>
        <p className="mt-3 text-sm font-extrabold uppercase tracking-[.14em] text-cyan-200">AI Video • AI Marketing &amp; Automation</p>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Tôi chia sẻ kiến thức và hướng dẫn ứng dụng AI vào sáng tạo nội dung, làm video bán hàng và xây dựng các công cụ hỗ trợ marketing. Trung AI Media tập trung vào những giải pháp thực tế cho người kinh doanh, người làm affiliate và người muốn phát triển kênh video AI.</p>
        <div className="mt-7 flex flex-wrap items-center gap-3"><Link href="/cong-cu-ai" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-sky-300/30 bg-sky-500/10 px-5 text-sm font-extrabold text-sky-100 transition hover:border-sky-300/55 hover:bg-sky-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"><Wrench className="h-4 w-4" />Xem công cụ AI</Link></div>
        <HomeContactLinks settings={contactLinks} showSupport={false} showFloating={false} />
      </div>
      </section>
    ) : null}
  </>;
}
