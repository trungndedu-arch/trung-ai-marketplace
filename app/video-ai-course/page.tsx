"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bot,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  CloudRain,
  Clock,
  Crosshair,
  DollarSign,
  FileText,
  GaugeCircle,
  GraduationCap,
  Image as ImageIcon,
  Infinity,
  Laptop,
  Link2,
  Megaphone,
  Mic2,
  Play,
  PlayCircle,
  RadioTower,
  Rocket,
  Scissors,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  User,
  Video,
  WandSparkles,
  X,
} from "lucide-react";

const menuItems = [
  { label: "Vấn đề", target: "van-de" },
  { label: "Dành cho ai", target: "doi-tuong" },
  { label: "Nội dung khóa", target: "noi-dung-khoa-hoc" },
  { label: "Giảng viên", target: "nguoi-huong-dan" },
  { label: "FAQ", target: "faq" },
];

const featureItems = [
  { label: "Sản xuất video AI", icon: Clapperboard, color: "text-red-400", border: "border-red-500/55", glow: "shadow-[0_0_28px_rgba(239,68,68,.32)]" },
  { label: "Kịch bản chuyển đổi", icon: FileText, color: "text-orange-300", border: "border-orange-400/55", glow: "shadow-[0_0_28px_rgba(251,146,60,.28)]" },
  { label: "MC AI & giọng nói", icon: Mic2, color: "text-yellow-300", border: "border-yellow-300/55", glow: "shadow-[0_0_28px_rgba(253,224,71,.22)]" },
  { label: "Xây kênh & affiliate", icon: TrendingUp, color: "text-lime-300", border: "border-lime-400/55", glow: "shadow-[0_0_28px_rgba(163,230,53,.22)]" },
];

const socialItems = [
  { label: "f", color: "from-blue-500 to-blue-700" },
  { label: "▶", color: "from-red-500 to-red-700" },
  { label: "♪", color: "from-cyan-400 via-zinc-950 to-pink-500" },
  { label: "◎", color: "from-purple-500 via-pink-500 to-orange-400" },
];

const problemCards = [
  {
    title: "Chi phí sản xuất quá cao",
    desc: "Muốn có video đẹp phải thuê quay, thuê dựng hoặc đầu tư rất nhiều thiết bị ngay từ đầu.",
    icon: Camera,
    tone: "red",
    border: "from-red-500/95 via-red-500/30 to-red-500/10",
    iconClass: "border-red-400/60 text-red-400 shadow-[0_0_32px_rgba(239,68,68,.42)]",
    accent: "from-red-500 to-red-300",
    dots: "bg-red-400",
  },
  {
    title: "Ngại xuất hiện trước camera",
    desc: "Có nhiều ý tưởng nhưng không tự tin ghi hình nên kế hoạch làm nội dung cứ bị trì hoãn.",
    icon: User,
    tone: "orange",
    border: "from-orange-400/90 via-orange-400/30 to-orange-400/10",
    iconClass: "border-orange-400/60 text-orange-300 shadow-[0_0_32px_rgba(251,146,60,.38)]",
    accent: "from-orange-400 to-orange-200",
    dots: "bg-orange-300",
  },
  {
    title: "Không đủ thời gian",
    desc: "Vừa làm công việc chính vừa xây kênh nên rất khó duy trì việc ra video đều đặn.",
    icon: Clock,
    tone: "yellow",
    border: "from-yellow-300/95 via-yellow-300/30 to-yellow-300/10",
    iconClass: "border-yellow-300/60 text-yellow-300 shadow-[0_0_32px_rgba(250,204,21,.38)]",
    accent: "from-yellow-300 to-amber-200",
    dots: "bg-yellow-300",
  },
  {
    title: "Lo phát sinh nhiều chi phí",
    desc: "Sợ phải mua quá nhiều công cụ AI mỗi tháng mà vẫn chưa tạo ra được kết quả.",
    icon: DollarSign,
    tone: "green",
    border: "from-emerald-400/90 via-emerald-400/30 to-emerald-400/10",
    iconClass: "border-emerald-400/60 text-emerald-300 shadow-[0_0_32px_rgba(52,211,153,.35)]",
    accent: "from-emerald-400 to-lime-200",
    dots: "bg-emerald-300",
  },
  {
    title: "Lo video thiếu dấu ấn riêng",
    desc: "Muốn dùng AI nhưng vẫn muốn giữ phong cách và thương hiệu cá nhân thay vì tạo ra những video giống nhau.",
    icon: WandSparkles,
    tone: "orange",
    border: "from-orange-400/90 via-orange-400/30 to-orange-400/10",
    iconClass: "border-orange-400/60 text-orange-300 shadow-[0_0_32px_rgba(251,146,60,.38)]",
    accent: "from-orange-400 to-orange-200",
    dots: "bg-orange-300",
  },
  {
    title: "Không biết bắt đầu từ đâu",
    desc: "Quá nhiều công cụ và xu hướng mới khiến người mới dễ bị rối và mất phương hướng.",
    icon: TrendingUp,
    tone: "yellow",
    border: "from-yellow-300/95 via-yellow-300/30 to-yellow-300/10",
    iconClass: "border-yellow-300/60 text-yellow-300 shadow-[0_0_32px_rgba(250,204,21,.38)]",
    accent: "from-yellow-300 to-amber-200",
    dots: "bg-yellow-300",
  },
];

function Header() {
  const scrollToSection = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-red-500/15 bg-[#09090b]/95 shadow-[0_10px_45px_rgba(239,68,68,.13)] backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-[1360px] items-center gap-3 px-3 sm:h-[68px] sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-300 shadow-[0_0_32px_rgba(249,115,22,.45)]">
            <Sparkles className="h-5 w-5 text-white" />
          </span>
          <span className="text-base font-black tracking-tight text-white sm:text-lg">Trung AI <span className="text-orange-400">Media</span></span>
        </Link>

        <nav className="mx-auto hidden items-center gap-9 lg:flex">
          {menuItems.map((item) => (
            <button key={item.target} type="button" onClick={() => scrollToSection(item.target)} className="text-sm font-semibold text-zinc-400 transition hover:text-white">
              {item.label}
            </button>
          ))}
        </nav>

        <nav className="mx-auto hidden items-center gap-4 md:flex lg:hidden">
          {menuItems.slice(0, 3).map((item) => (
            <button key={item.target} type="button" onClick={() => scrollToSection(item.target)} className="text-xs font-semibold text-zinc-400 transition hover:text-white">
              {item.label}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden text-right leading-tight sm:block">
            <p className="text-xs font-bold text-zinc-500 line-through">899.000đ</p>
            <p className="text-sm font-black text-white">149.000đ</p>
          </div>
          <button type="button" onClick={() => scrollToSection("dang-ky-thanh-toan")} className="rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-500 px-3 py-2.5 text-[11px] font-black text-white shadow-[0_0_30px_rgba(239,68,68,.42)] transition hover:-translate-y-0.5 hover:shadow-[0_0_45px_rgba(249,115,22,.55)] sm:px-6 sm:text-xs">
            Đăng ký ngay
          </button>
        </div>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto border-t border-white/5 px-3 pb-3 md:hidden">
        {menuItems.map((item) => (
          <button
            key={item.target}
            type="button"
            onClick={() => scrollToSection(item.target)}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-bold text-zinc-300 transition hover:border-orange-300/40 hover:text-white"
          >
            {item.label}
          </button>
        ))}
      </div>
      <style jsx global>{`
        #van-de,
        #doi-tuong,
        #noi-dung-khoa-hoc,
        #nguoi-huong-dan,
        #faq,
        #dang-ky-thanh-toan {
          scroll-margin-top: 124px;
        }
        @media (min-width: 768px) {
          #van-de,
          #doi-tuong,
          #noi-dung-khoa-hoc,
          #nguoi-huong-dan,
          #faq,
          #dang-ky-thanh-toan {
            scroll-margin-top: 88px;
          }
        }
      `}</style>
    </header>
  );
}
function VideoPanel({ className = "", wide = false, label = "AI Render" }: { className?: string; wide?: boolean; label?: string }) {
  return (
    <div className={`absolute overflow-hidden rounded-[1.35rem] border border-orange-400/35 bg-black/45 p-2 shadow-[0_0_36px_rgba(249,115,22,.28)] backdrop-blur-md ${className}`}>
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-300 via-red-700 to-zinc-950 ${wide ? "aspect-video" : "aspect-[9/16]"}`}>
        <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.55),transparent_18%),radial-gradient(circle_at_70%_30%,rgba(255,255,255,.26),transparent_18%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 grid place-items-center">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md">
            <Play className="ml-0.5 h-6 w-6 fill-white" />
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-white">{label}</p>
          <div className="h-1.5 rounded-full bg-white/20">
            <span className="block h-full w-2/3 rounded-full bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelinePanel() {
  return (
    <div className="absolute bottom-[15%] right-[2%] hidden w-[245px] rotate-2 rounded-[1.3rem] border border-red-400/30 bg-black/55 p-3 shadow-[0_0_45px_rgba(239,68,68,.32)] backdrop-blur-md md:block xl:right-[4%]">
      <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-zinc-300">
        <span>Timeline edit</span>
        <WandSparkles className="h-4 w-4 text-orange-300" />
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 15 }).map((_, index) => (
          <span key={index} className={`h-7 rounded-md ${index % 3 === 0 ? "bg-red-500/80" : index % 3 === 1 ? "bg-orange-400/80" : "bg-white/14"}`} />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <RadioTower className="h-4 w-4 text-red-300" />
        <span className="h-2 flex-1 rounded-full bg-gradient-to-r from-red-500 via-orange-300 to-transparent" />
      </div>
    </div>
  );
}

function HeroGraphic() {
  return (
    <div className="relative min-h-[360px] sm:min-h-[500px] lg:min-h-[610px]">
      <div className="absolute left-[7%] top-[8%] h-[500px] w-[500px] rounded-full bg-red-600/20 blur-[90px]" />
      <div className="absolute right-[2%] top-[18%] h-[360px] w-[360px] rounded-full bg-orange-500/16 blur-[80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,rgba(255,80,0,.16),transparent_34%)]" />

      <VideoPanel label="TikTok AI" className="left-[3%] top-[10%] z-10 hidden w-[132px] -rotate-6 sm:block sm:w-[156px] lg:left-[1%] xl:left-[6%]" />
      <VideoPanel label="YouTube Preview" wide className="right-[3%] top-[12%] z-10 hidden w-[210px] rotate-6 sm:block sm:w-[260px] xl:right-[5%]" />
      <TimelinePanel />

      <div className="absolute left-1/2 top-[52%] z-20 h-[350px] w-[280px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-b-[3rem] sm:h-[480px] sm:w-[360px] lg:h-[520px] lg:w-[400px]">
        <div className="absolute bottom-2 left-1/2 h-[250px] w-[250px] -translate-x-1/2 rounded-full bg-gradient-to-t from-red-600/45 to-transparent blur-3xl sm:h-[380px] sm:w-[320px]" />
        <div className="absolute left-1/2 top-[18%] h-[220px] w-[220px] -translate-x-1/2 rounded-full border border-orange-300/18 bg-gradient-to-b from-orange-500/10 to-red-700/10 shadow-[0_0_70px_rgba(249,115,22,.25)] sm:h-[290px] sm:w-[290px]" />
        <div className="absolute left-1/2 top-[15%] h-[230px] w-[230px] -translate-x-1/2 rounded-full bg-black/55 blur-2xl sm:h-[310px] sm:w-[310px]" />
        <Image
          src="/images/video-ai-course-hero-portrait-hair-fixed-v2.png"
          alt="Giảng viên Trung AI Media"
          fill
          priority
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 400px"
          className="object-contain object-bottom mix-blend-normal drop-shadow-[0_0_42px_rgba(249,115,22,.46)]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      <div className="absolute bottom-[19%] left-[13%] z-30 hidden rounded-[1.2rem] border border-orange-400/30 bg-black/55 p-3 shadow-[0_0_35px_rgba(249,115,22,.28)] backdrop-blur-md sm:block">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-red-600 to-orange-400">
            <Bot className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-200">AI Render</p>
            <p className="text-xs font-bold text-white">Prompt → Video</p>
          </div>
        </div>
      </div>

      <div className="absolute right-[9%] top-[48%] z-30 hidden w-[150px] rounded-[1.2rem] border border-red-400/30 bg-black/55 p-3 shadow-[0_0_35px_rgba(239,68,68,.3)] backdrop-blur-md sm:block">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-200">
          <BarChart3 className="h-4 w-4 text-orange-300" />
          Analytics
        </div>
        <div className="mt-3 flex h-14 items-end gap-1.5">
          {[36, 58, 42, 78, 66, 92].map((height, index) => (
            <span key={index} className="w-full rounded-t-md bg-gradient-to-t from-red-600 to-orange-300" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProblemCard({ item }: { item: (typeof problemCards)[number] }) {
  const Icon = item.icon;

  return (
    <div className={`group relative rounded-[1.35rem] bg-gradient-to-br ${item.border} p-px transition duration-500 hover:-translate-y-2 hover:shadow-[0_28px_75px_rgba(0,0,0,.45)]`}>
      <div className="relative min-h-[190px] overflow-hidden rounded-[1.32rem] bg-[#0b0b0d]/95 px-5 py-5 backdrop-blur-xl sm:px-6 sm:py-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(255,255,255,.08),transparent_20%),linear-gradient(135deg,rgba(255,255,255,.055),transparent_42%)] opacity-80" />
        <div className="absolute -bottom-20 -right-20 h-44 w-44 rounded-full bg-current opacity-[.08] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-px w-24 bg-gradient-to-r from-current to-transparent opacity-70 transition-all duration-500 group-hover:w-40" />
        <div className="absolute right-5 top-5 flex gap-1.5">
          {[1, 2, 3].map((dot) => (
            <span key={dot} className={`h-1.5 w-1.5 rounded-full ${item.dots} opacity-90`} />
          ))}
        </div>

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className={`relative grid h-[68px] w-[68px] flex-none place-items-center rounded-full border bg-black/35 ${item.iconClass} transition duration-500 group-hover:scale-105`}>
            <span className="absolute h-[86px] w-[86px] rounded-full border border-current opacity-20" />
            <Icon className="relative h-8 w-8" />
          </div>

          <div className="pt-1">
            <h3 className="max-w-[260px] text-lg font-black leading-snug text-white sm:text-xl">{item.title}</h3>
            <span className={`mt-3 block h-1 w-9 rounded-full bg-gradient-to-r ${item.accent} shadow-[0_0_18px_currentColor] transition-all duration-500 group-hover:w-14`} />
            <p className="mt-5 text-sm leading-7 text-zinc-400">{item.desc}</p>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[1.32rem] opacity-0 ring-1 ring-white/20 transition duration-500 group-hover:opacity-100" />
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section id="van-de" className="relative px-3 pb-12 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-red-950/15 to-transparent" />
      <div className="absolute left-[7%] top-16 h-64 w-64 rounded-full bg-red-600/16 blur-[90px]" />
      <div className="absolute right-[6%] top-20 h-72 w-72 rounded-full bg-orange-500/14 blur-[95px]" />

      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-white/[0.07] bg-[#080809] px-4 py-8 shadow-[0_38px_120px_rgba(0,0,0,.55)] sm:px-8 sm:py-12 lg:px-16 lg:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(249,115,22,.2),transparent_20%),radial-gradient(circle_at_10%_85%,rgba(34,197,94,.08),transparent_22%),linear-gradient(135deg,rgba(127,29,29,.18),transparent_38%)]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,.12),transparent_1.5px)] [background-size:24px_24px] opacity-45" />

        <div className="relative max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• NHỮNG RÀO CẢN PHỔ BIẾN</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-[-.035em] text-white sm:text-5xl">
            Rào Cản Lớn Khi Xây Kênh Kiếm Tiền
            <br />
            Chính Là Video
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
            Rất nhiều người muốn xây kênh, bán hàng hoặc làm Affiliate bằng Video AI nhưng luôn bị mắc kẹt ở những rào cản dưới đây.
          </p>
        </div>

        <div className="relative mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {problemCards.map((item) => (
            <ProblemCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

const beforeItems = [
  { icon: CloudRain, text: "Mất nhiều giờ nghĩ ý tưởng, viết kịch bản nhưng vẫn không biết bắt đầu từ đâu" },
  { icon: FileText, text: "Ngại lên hình nên video review, video bán hàng chỉ nằm trên ý tưởng" },
  { icon: User, text: "Tốn thời gian quay đi quay lại, chỉnh sửa nhiều lần mà kết quả vẫn chưa chuyên nghiệp" },
  { icon: Clock, text: "Cảm giác càng làm càng rối vì thiếu một quy trình rõ ràng để bám theo" },
];

const afterItems = [
  "Biết dùng AI để tạo kịch bản, hình ảnh, giọng nói và video hoàn chỉnh theo quy trình",
  "Tạo được video review, video quảng cáo, video bán hàng mà không cần lộ mặt",
  "Có thể xây kênh nội dung ngắn đều đặn để gắn Affiliate và bán sản phẩm",
];

const miniBenefits = [
  { title: "NHANH HƠN", desc: "Tiết kiệm thời gian", icon: GaugeCircle },
  { title: "HIỆU QUẢ HƠN", desc: "Nội dung có quy trình", icon: Target },
  { title: "TÁI SỬ DỤNG", desc: "Một workflow dùng nhiều lần", icon: Infinity },
];

const comparisonRows = [
  ["Quy trình làm video", "Học rời rạc từng công cụ", "Có workflow từ ý tưởng đến video hoàn chỉnh"],
  ["Prompt & kịch bản", "Tự mò từng câu lệnh", "Có công thức prompt và kịch bản chuyển đổi"],
  ["Video không lộ mặt", "Ít hướng dẫn cụ thể", "Có quy trình làm KOC AI, MC AI, giọng nói AI"],
  ["Ứng dụng kiếm tiền", "Chỉ học công cụ", "Gắn với xây kênh, bán hàng và Affiliate"],
  ["Người mới bắt đầu", "Dễ bị rối vì quá nhiều tool", "Học theo từng bước, dễ làm theo"],
];

const courseHighlights = [
  "Công thức Hook – Pain – Solution – CTA",
  "Quy trình tạo video AI từ A-Z",
  "Tạo ảnh, thumbnail, video, giọng nói bằng AI",
  "Không cần lộ mặt vẫn làm được nội dung bán hàng",
  "Có hướng dẫn xây kênh và làm Affiliate",
  "Giá chỉ 149.000đ, phù hợp cho người mới",
];

const audienceCards = [
  {
    title: "MARKETER",
    before: "Mất quá nhiều thời gian để sản xuất video quảng cáo.",
    after: "Tạo video quảng cáo AI nhanh hơn với quy trình có sẵn.",
    icon: Megaphone,
    image: "/images/video-ai-course/audience-marketer.jpg",
  },
  {
    title: "AFFILIATE",
    before: "Có link Affiliate nhưng không biết làm video để bán.",
    after: "Biết tạo video review, video ngắn và xây kênh bán hàng.",
    icon: Link2,
    image: "/images/video-ai-course/audience-affiliate.jpg",
  },
  {
    title: "CONTENT CREATOR",
    before: "Không duy trì được lịch đăng video.",
    after: "Có quy trình sản xuất nội dung đều đặn bằng AI.",
    icon: Video,
    image: "/images/video-ai-course/audience-creator.jpg",
  },
  {
    title: "CHỦ SHOP / DOANH NGHIỆP",
    before: "Thuê ngoài quá tốn chi phí.",
    after: "Tự tạo video giới thiệu sản phẩm ngay trong cửa hàng.",
    icon: ShoppingBag,
    image: "/images/video-ai-course/audience-shop.jpg",
  },
  {
    title: "FREELANCER",
    before: "Muốn nhận thêm dịch vụ nhưng chưa biết AI.",
    after: "Có thể cung cấp dịch vụ tạo video AI cho khách hàng.",
    icon: Laptop,
    image: "/images/video-ai-course/audience-freelancer.jpg",
  },
  {
    title: "NGƯỜI MỚI",
    before: "Chưa từng dựng video hoặc dùng AI.",
    after: "Có thể tạo video đầu tiên chỉ sau vài bài học.",
    icon: GraduationCap,
    image: "/images/video-ai-course/audience-beginner.jpg",
  },
];

const videoUseCases = [
  {
    tab: "Affiliate Marketer",
    label: "Affiliate Marketer",
    title: "Tạo video review sản phẩm mà không cần lộ mặt",
    before: "Có sản phẩm affiliate muốn review nhưng ngại quay mặt, ý tưởng cứ nằm mãi trên giấy.",
    steps: [
      "Chọn sản phẩm + viết kịch bản review theo công thức Hook – Pain – Solution – CTA",
      "Tạo KOC AI / MC AI đọc kịch bản thay bạn",
      "Xuất video hoàn chỉnh, sẵn sàng gắn link affiliate",
    ],
    result: "Từ ý tưởng → có video ngay trong buổi học",
    note: "Video review sản phẩm, không cần lộ mặt, có thể dùng để đăng TikTok, Reels, Shorts.",
  },
  {
    tab: "Chủ shop / Doanh nghiệp",
    label: "Chủ shop / Doanh nghiệp",
    title: "Tự tạo video quảng cáo sản phẩm cho shop",
    before: "Có sản phẩm nhưng chưa có video bán hàng đẹp, thuê ngoài thì tốn kém và mất thời gian.",
    steps: [
      "Chọn sản phẩm cần quảng cáo và viết angle bán hàng bằng AI",
      "Tạo ảnh, video, giọng đọc và caption bằng công cụ AI",
      "Xuất video quảng cáo ngắn để chạy Facebook, TikTok hoặc đăng fanpage",
    ],
    result: "Từ sản phẩm → có video quảng cáo chuyên nghiệp",
    note: "Phù hợp cho mỹ phẩm, thời trang, đồ gia dụng, khóa học, dịch vụ và sản phẩm số.",
  },
  {
    tab: "Content Creator",
    label: "Content Creator",
    title: "Duy trì lịch đăng video đều đặn bằng AI",
    before: "Có ý tưởng nhưng không đủ thời gian quay, dựng, viết caption và làm thumbnail mỗi ngày.",
    steps: [
      "Lập kế hoạch nội dung ngắn bằng ChatGPT",
      "Tạo video AI theo template có sẵn",
      "Tái sử dụng nội dung cho TikTok, YouTube Shorts, Reels",
    ],
    result: "Từ một ý tưởng → nhiều video cho nhiều nền tảng",
    note: "Giúp bạn duy trì nhịp đăng đều mà không bị cạn ý tưởng.",
  },
];

const courseParts = [
  {
    tab: "Gỡ bỏ rào cản",
    title: "Phần 1: Gỡ bỏ rào cản - Hiểu đúng & làm trúng với Video AI",
    desc: "Giúp người mới hiểu đúng về Video AI, biết công cụ cần dùng và có tư duy học AI đơn giản, dễ áp dụng.",
    lessons: [
      "Sự Thật Về Video AI: Cách Nó Giúp Bạn Kiếm Tiền Như Thế Nào?",
      "Tìm Hiểu Các Dạng Kênh AI Đang Cực Hot Hiện Nay",
      "Trọn Bộ Đồ Nghề: 4 Nhóm Công Cụ AI Cần Thiết Nhất Để Bắt Đầu",
      "Cài Đặt Tư Duy: Cách Học & Dùng AI Đơn Giản, Không Cần Giỏi Công Nghệ",
    ],
    start: 1,
  },
  {
    tab: "Thực chiến ra đơn",
    title: "Phần 2: Thực chiến - Quy trình cầm tay chỉ việc làm Video AI ra đơn",
    desc: "Từng bước tạo video AI cho các ngách thực tế: thời trang, affiliate, hoạt hình, thumbnail, KOC AI, infographic và nhiều case study.",
    lessons: [
      "Tổng Quan Grok và Veo3 Tạo Video Siêu Nhanh, Siêu Dễ & Hiệu Quả",
      "Cách Làm Nội Dung AI Ngách Thời Trang Trẻ Em Hút Triệu Mẹ Bỉm",
      "Hướng Dẫn Dựng Video Hoạt Hình 3D Ngách Dạy Tiếng Anh",
      "Hướng Dẫn Dựng Video Hoạt Hình 3D Ngách Sức Khỏe Dễ Lên Xu Hướng",
      "Đừng Ngại Việc Đi Xin Prompt: Tuyệt Chiêu Trích Xuất Prompt Từ Bất Kỳ Bức Ảnh AI Nào",
      "Tự Làm Ảnh Bìa Thumbnail Bằng AI Cho TikTok, Youtube Cực Bắt Mắt",
      "Xây Kênh Bán Sách Không Lộ Mặt - Chủ Đề Đạo Lý, Phong Thủy, Đạo Phật",
      "Tự Tạo Mẫu Ảo KOC AI Riêng Cho Thương Hiệu Của Bạn",
      "Quy Trình Làm Affiliate Đồ Thể Thao Nam Bằng Video AI Cực Dễ",
      "Cách Làm Ảnh Infographic Đẹp Mắt Môi Giới Bất Động Sản Cần Biết",
      "Hướng Dẫn Làm Video AI Bán Thời Trang Trung Niên Dễ Dàng",
      "Cách Tạo Nhạc Bản Quyền Nhanh Chóng Để Ghép Vào Video",
      "Phép Màu AI: 1 Click Khôi Phục Và Làm Nét Mọi Bức Ảnh Kém Chất Lượng",
      "Hướng Dẫn Làm Video AI Bán Ốp Điện Thoại \"Vạn Người Mê\"",
      "Case Study: Cách Làm Video Thời Trang Nữ Đi Bộ Đổi Trang Phục Triệu View",
      "Toàn Tập Quy Trình Làm Affiliate Thời Trang Nam Bằng Video AI",
    ],
    start: 5,
  },
];

type SampleVideo = {
  title: string;
  desc: string;
  platform: string;
  gradient: string;
  video?: string;
};

const sampleVideos: SampleVideo[] = [
  {
    title: "Thời Trang AI Triệu View",
    desc: "Video người mẫu AI thay đổi trang phục, phù hợp bán quần áo và Affiliate thời trang.",
    platform: "TikTok",
    gradient: "from-pink-500 via-red-600 to-zinc-950",
    video: "/videos/thoi-trang-ai-trieu-view.mp4",
  },
  {
    title: "Review Sản Phẩm AI",
    desc: "MC AI review sản phẩm mà không cần quay mặt thật.",
    platform: "Reels",
    gradient: "from-orange-300 via-red-600 to-zinc-950",
    video: "/videos/review-san-pham-ai.mp4",
  },
  {
    title: "TVC Quảng Cáo AI",
    desc: "Video quảng cáo sản phẩm ngắn, dùng cho Facebook, TikTok và landing page.",
    platform: "YouTube",
    gradient: "from-cyan-300 via-blue-700 to-zinc-950",
    video: "/videos/tvc-quang-cao-ai.mp4",
  },
  {
    title: "Video Không Lộ Mặt",
    desc: "Nội dung dạng kể chuyện, triết lý, sách, phong thủy, đạo lý cổ nhân.",
    platform: "Shorts",
    gradient: "from-amber-300 via-orange-700 to-zinc-950",
    video: "/videos/video-khong-lo-mat.mp4",
  },
  {
    title: "Hoạt Hình 3D AI",
    desc: "Video hoạt hình giáo dục, mẹ bầu, sức khỏe, tiếng Anh hoặc nội dung trẻ em.",
    platform: "TikTok",
    gradient: "from-violet-300 via-fuchsia-700 to-zinc-950",
    video: "/videos/hoat-hinh-3d-ai-youtube.mp4",
  },
  {
    title: "Thời Trang AI Nữ Nhảy Trend Tiktok",
    desc: "Video thời trang AI nữ nhảy trend TikTok, phù hợp làm nội dung ngắn thu hút người xem.",
    platform: "Reels",
    gradient: "from-lime-200 via-emerald-700 to-zinc-950",
    video: "/videos/thoi-trang-ai-nu-nhay-trend-tiktok.mp4",
  },
];

function BeforeCard() {
  return (
    <div className="group relative overflow-hidden rounded-[1.55rem] border border-slate-300/20 bg-gradient-to-br from-slate-950/95 via-[#0b1118]/96 to-[#060708]/98 p-5 shadow-[0_0_42px_rgba(148,163,184,.13)] transition duration-500 hover:-translate-y-1 hover:border-slate-200/35 sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(148,163,184,.22),transparent_26%),linear-gradient(135deg,rgba(255,255,255,.05),transparent_42%)]" />
      <div className="absolute bottom-0 left-0 h-32 w-full bg-[radial-gradient(circle_at_20%_100%,rgba(56,189,248,.12),transparent_34%)]" />
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full border border-slate-300/10 opacity-60" />
      <div className="absolute right-0 top-0 h-px w-28 rotate-[-18deg] bg-slate-200/30" />
      <div className="absolute right-8 top-10 h-px w-16 rotate-[32deg] bg-slate-200/18" />
      <div className="absolute bottom-6 right-8 h-20 w-20 rounded-full border border-slate-300/12 bg-black/25" />

      <div className="relative flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-slate-300/25 bg-slate-500/10 shadow-[0_0_26px_rgba(148,163,184,.18)]">
          <CloudRain className="h-8 w-8 text-slate-300" />
        </span>
        <div className="rounded-r-[1.4rem] bg-gradient-to-r from-slate-400/20 to-transparent px-5 py-3">
          <h3 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Trước</h3>
        </div>
      </div>

      <div className="relative mt-7 space-y-5">
        {beforeItems.map(({ icon: Icon, text }) => (
          <div key={text} className="flex gap-4">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-full border border-slate-300/15 bg-black/25 text-slate-300">
              <Icon className="h-5 w-5" />
            </span>
            <p className="pt-1 text-sm leading-7 text-slate-300 sm:text-base">{text}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-7 flex items-end gap-3 opacity-65">
        <div className="h-14 w-20 rotate-[-7deg] rounded-lg border border-slate-300/15 bg-slate-300/7" />
        <div className="h-11 w-24 rotate-[5deg] rounded-lg border border-slate-300/12 bg-slate-300/5" />
        <div className="ml-auto text-xs font-bold uppercase tracking-widest text-slate-500">Draft / Sketch</div>
      </div>
    </div>
  );
}

function AfterCard() {
  return (
    <div className="group relative overflow-hidden rounded-[1.55rem] border border-orange-300/45 bg-gradient-to-br from-red-950/95 via-[#180504]/98 to-[#080404] p-5 shadow-[0_0_58px_rgba(239,68,68,.28)] transition duration-500 hover:-translate-y-1 hover:border-orange-200/70 hover:shadow-[0_0_78px_rgba(249,115,22,.34)] sm:p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(249,115,22,.34),transparent_25%),radial-gradient(circle_at_60%_90%,rgba(239,68,68,.2),transparent_32%),linear-gradient(135deg,rgba(255,255,255,.06),transparent_44%)]" />
      <div className="absolute right-5 top-5 h-24 w-32 rounded-2xl border border-orange-300/30 bg-black/35 p-2 shadow-[0_0_30px_rgba(249,115,22,.25)]">
        <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-red-700 to-orange-500/80">
          <Play className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 fill-white text-white" />
          <span className="absolute bottom-2 left-2 right-2 h-1 rounded-full bg-white/25"><span className="block h-full w-2/3 rounded-full bg-white" /></span>
        </div>
      </div>
      <div className="absolute bottom-6 right-5 hidden w-40 rounded-xl border border-orange-300/25 bg-black/35 p-3 sm:block">
        <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-200">
          <Mic2 className="h-4 w-4" />
          Voice AI
        </div>
        <div className="flex h-10 items-center gap-1">
          {[34, 62, 48, 78, 42, 88, 52, 70].map((height, index) => (
            <span key={index} className="w-full rounded-full bg-gradient-to-t from-red-500 to-orange-300" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-20 right-10 hidden h-28 w-40 items-end gap-2 sm:flex">
        {[28, 46, 64, 82].map((height, index) => (
          <span key={index} className="w-8 rounded-t-lg bg-gradient-to-t from-red-600 to-yellow-300 shadow-[0_0_18px_rgba(249,115,22,.35)]" style={{ height: `${height}%` }} />
        ))}
        <TrendingUp className="mb-20 -ml-16 h-16 w-16 text-orange-200 drop-shadow-[0_0_16px_rgba(249,115,22,.75)]" />
      </div>

      <div className="relative flex items-center gap-4">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-orange-300/50 bg-red-500/20 shadow-[0_0_32px_rgba(249,115,22,.38)]">
          <Rocket className="h-8 w-8 text-orange-200" />
        </span>
        <div className="rounded-r-[1.4rem] bg-gradient-to-r from-red-600/70 via-orange-500/45 to-transparent px-6 py-3">
          <h3 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Sau</h3>
        </div>
      </div>

      <div className="relative mt-8 max-w-[78%] space-y-5">
        {afterItems.map((text) => (
          <div key={text} className="flex gap-4">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full border border-orange-300/55 bg-orange-500/12 text-orange-200 shadow-[0_0_22px_rgba(249,115,22,.28)]">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <p className="text-sm font-medium leading-7 text-orange-50/90 sm:text-base">{text}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-8 grid gap-2 sm:grid-cols-3">
        {miniBenefits.map(({ title, desc, icon: Icon }) => (
          <div key={title} className="rounded-2xl border border-orange-300/25 bg-black/28 px-3 py-3 shadow-[0_0_22px_rgba(249,115,22,.12)]">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-orange-300" />
              <p className="text-[11px] font-black text-orange-100">{title}</p>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function BeforeAfterSection() {
  return (
    <section id="truoc-sau" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/15 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_8%,rgba(239,68,68,.28),transparent_25%),radial-gradient(circle_at_50%_52%,rgba(249,115,22,.22),transparent_22%),linear-gradient(135deg,rgba(47,5,8,.9),rgba(4,4,5,.98)_46%,rgba(28,8,3,.86))]" />
        <div className="absolute inset-0 opacity-[.14] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-x-8 top-[45%] h-px bg-gradient-to-r from-transparent via-orange-300/70 to-transparent shadow-[0_0_30px_rgba(249,115,22,.7)]" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-red-500/18 blur-[80px]" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sky-500/8 blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_16%,rgba(255,255,255,.15),transparent_1.3px)] [background-size:24px_24px] opacity-50" />

        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• CHUYỂN ĐỔI</p>
          <h2 className="mt-3 text-4xl font-black leading-tight tracking-[-.045em] text-white sm:text-6xl">
            Trước <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">và sau</span> khi học
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">Cùng một mục tiêu — nhưng cách làm và kết quả hoàn toàn khác.</p>
        </div>

        <div className="relative mt-8 grid items-stretch gap-6 lg:grid-cols-[1fr_74px_1fr]">
          <div className="animate-[beforeSlide_.85s_ease_both]">
            <BeforeCard />
          </div>

          <div className="relative flex items-center justify-center py-1">
            <div className="absolute hidden h-[86%] w-px bg-gradient-to-b from-transparent via-orange-300/70 to-transparent lg:block" />
            <div className="relative z-10 grid h-20 w-20 animate-[pulseGlow_2.4s_ease-in-out_infinite] place-items-center rounded-full border border-orange-300/70 bg-[#2b0c04] text-4xl font-black text-white shadow-[0_0_45px_rgba(249,115,22,.65)]">
              »
            </div>
          </div>

          <div className="animate-[afterSlide_.85s_.08s_ease_both]">
            <AfterCard />
          </div>
        </div>

        <div className="relative mx-auto mt-6 max-w-2xl overflow-hidden rounded-2xl border border-orange-300/25 bg-black/45 px-5 py-3 text-center shadow-[0_0_34px_rgba(249,115,22,.22)]">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-red-500/30 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-orange-500/25 to-transparent" />
          <p className="relative text-xs font-black uppercase tracking-[0.18em] text-white sm:text-sm">
            Cùng một mục tiêu — <span className="bg-gradient-to-r from-orange-300 via-red-400 to-yellow-200 bg-clip-text text-transparent">KẾT QUẢ KHÁC BIỆT</span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes beforeSlide {
          from { opacity: 0; transform: translateX(-26px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes afterSlide {
          from { opacity: 0; transform: translateX(26px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 36px rgba(249,115,22,.55); }
          50% { transform: scale(1.08); box-shadow: 0 0 66px rgba(249,115,22,.85); }
        }
      `}</style>
    </section>
  );
}

function ComparisonTable() {
  return (
    <div className="animate-[compareLeft_.85s_ease_both] overflow-hidden rounded-[1.55rem] border border-white/15 bg-[#0a0b10]/72 shadow-[0_0_42px_rgba(148,163,184,.12)] backdrop-blur-xl">
      <div className="hidden lg:block">
        <div className="grid grid-cols-[.78fr_1fr_1.12fr] border-b border-white/12 bg-white/[0.045]">
          {[
            ["TIÊU CHÍ", Crosshair],
            ["KHÓA HỌC THÔNG THƯỜNG", X],
            ["TRUNG AI STUDIO", ShieldCheck],
          ].map(([label, Icon]) => (
            <div key={label as string} className="flex items-center gap-3 border-r border-white/10 px-5 py-5 last:border-r-0">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-red-400/25 bg-black/35">
                <Icon className="h-5 w-5 text-red-300" />
              </span>
              <span className="text-sm font-black uppercase tracking-wide text-white">{label as string}</span>
            </div>
          ))}
        </div>

        {comparisonRows.map(([criteria, normal, trung]) => (
          <div key={criteria} className="grid grid-cols-[.78fr_1fr_1.12fr] border-b border-white/10 last:border-b-0">
            <div className="border-r border-white/10 px-5 py-5 text-sm font-black text-white">{criteria}</div>
            <div className="flex gap-3 border-r border-white/10 px-5 py-5 text-sm leading-6 text-zinc-400">
              <X className="mt-0.5 h-5 w-5 flex-none text-zinc-500" />
              <span>{normal}</span>
            </div>
            <div className="flex gap-3 bg-gradient-to-r from-orange-500/8 to-transparent px-5 py-5 text-sm font-semibold leading-6 text-orange-50">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-orange-300 drop-shadow-[0_0_10px_rgba(249,115,22,.75)]" />
              <span>{trung}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 p-4 lg:hidden">
        {comparisonRows.map(([criteria, normal, trung]) => (
          <div key={criteria} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="mb-3 text-sm font-black text-white">{criteria}</p>
            <div className="space-y-3">
              <div className="flex gap-3 rounded-xl bg-white/[0.035] p-3 text-sm text-zinc-400">
                <X className="mt-0.5 h-5 w-5 flex-none text-zinc-500" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Khóa học thông thường</p>
                  <p className="mt-1">{normal}</p>
                </div>
              </div>
              <div className="flex gap-3 rounded-xl border border-orange-300/20 bg-orange-500/10 p-3 text-sm text-orange-50">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-orange-300" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-300">Trung AI Media</p>
                  <p className="mt-1">{trung}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedCourseCard() {
  return (
    <div className="animate-[compareRight_.85s_.08s_ease_both] rounded-[1.65rem] bg-gradient-to-br from-red-500 via-orange-400 to-red-700 p-px shadow-[0_0_62px_rgba(239,68,68,.48)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_90px_rgba(249,115,22,.62)]">
      <div className="relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-red-950/96 via-[#220604]/98 to-[#070202] p-5 sm:p-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,.45),transparent_24%),radial-gradient(circle_at_22%_95%,rgba(239,68,68,.22),transparent_28%)]" />
        <div className="absolute right-5 top-4 text-orange-200/80">
          <div className="relative grid h-20 w-20 place-items-center rounded-full border border-orange-300/25 bg-black/24 shadow-[0_0_34px_rgba(249,115,22,.28)]">
            <Trophy className="h-10 w-10 text-orange-200" />
          </div>
        </div>
        <div className="relative flex items-center gap-3 border-b border-orange-300/25 pb-5">
          <Sparkles className="h-7 w-7 text-orange-200 drop-shadow-[0_0_12px_rgba(249,115,22,.8)]" />
          <h3 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">Khóa này</h3>
        </div>

        <div className="relative mt-5 divide-y divide-orange-300/18">
          {courseHighlights.map((item) => (
            <div key={item} className="flex items-start gap-4 py-4">
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full border border-emerald-300/40 bg-emerald-500/16 text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,.36)]">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <p className="text-sm font-bold leading-6 text-orange-50 sm:text-base">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CourseComparisonSection() {
  return (
    <section id="so-sanh" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/14 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_14%,rgba(249,115,22,.28),transparent_24%),radial-gradient(circle_at_62%_55%,rgba(239,68,68,.18),transparent_28%),linear-gradient(135deg,rgba(42,5,8,.92),rgba(4,4,6,.98)_42%,rgba(24,8,3,.9))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute -right-28 top-0 h-96 w-96 rounded-full bg-orange-500/20 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-px w-2/3 bg-gradient-to-r from-transparent via-red-400/60 to-orange-300/70 shadow-[0_0_28px_rgba(249,115,22,.65)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_65%,rgba(255,255,255,.12),transparent_1.4px)] [background-size:24px_24px] opacity-45" />

        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• VÌ SAO KHÁC BIỆT</p>
          <h2 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-5xl">
            Khác gì so với
            <br />
            một khóa học Video AI thông thường?
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-400 sm:text-base">
            Không chỉ giới thiệu công cụ — khóa học này tập trung vào quy trình thực chiến, sản phẩm hoàn chỉnh và khả năng ứng dụng ngay.
          </p>
        </div>

        <div className="relative mt-9 grid items-start gap-6 xl:grid-cols-[1.15fr_.85fr]">
          <ComparisonTable />
          <FeaturedCourseCard />
        </div>
      </div>

      <style jsx global>{`
        @keyframes compareLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes compareRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

function AudienceHeroIllustration() {
  return (
    <div className="relative min-h-[310px] animate-[audienceRight_.9s_ease_both] lg:min-h-[360px]">
      <div className="absolute right-[8%] top-[6%] h-72 w-72 rounded-full border border-red-400/20 shadow-[0_0_65px_rgba(239,68,68,.18)]" />
      <div className="absolute right-[14%] top-[14%] h-52 w-52 rounded-full border border-orange-300/25" />
      <div className="absolute right-[5%] top-[20%] h-64 w-64 rounded-full bg-red-600/18 blur-[70px]" />

      <div className="absolute right-[34%] top-[8%] hidden w-[250px] -rotate-3 rounded-2xl border border-red-400/35 bg-black/55 p-3 shadow-[0_0_34px_rgba(239,68,68,.24)] backdrop-blur-md sm:block">
        <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-orange-200">
          <span>AI Video Editor</span>
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="aspect-video rounded-xl bg-gradient-to-br from-red-600 via-orange-500 to-zinc-950">
          <Play className="mx-auto h-full w-12 fill-white text-white" />
        </div>
        <div className="mt-2 grid grid-cols-6 gap-1">
          {Array.from({ length: 12 }).map((_, index) => (
            <span key={index} className={`h-5 rounded ${index % 2 ? "bg-orange-300/70" : "bg-red-500/70"}`} />
          ))}
        </div>
      </div>

      <div className="absolute right-[8%] top-[18%] z-20 w-[270px] rounded-[2rem] border border-orange-300/30 bg-gradient-to-br from-zinc-950 via-[#190705] to-black p-5 shadow-[0_0_60px_rgba(249,115,22,.28)] sm:w-[320px]">
        <div className="mx-auto h-20 w-20 rounded-full border border-orange-300/35 bg-gradient-to-br from-orange-300/35 to-red-500/25 shadow-[0_0_30px_rgba(249,115,22,.25)]" />
        <div className="mx-auto mt-3 h-28 w-24 rounded-t-[2rem] bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-[inset_0_0_22px_rgba(255,255,255,.06)]" />
        <div className="absolute bottom-8 left-1/2 h-24 w-[230px] -translate-x-1/2 rounded-2xl border border-violet-300/20 bg-black/70 p-3 shadow-[0_0_28px_rgba(168,85,247,.18)]">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-yellow-300" />
            <span className="h-2 w-2 rounded-full bg-emerald-300" />
            <span className="ml-auto text-[10px] font-black text-violet-200">AI</span>
          </div>
          <div className="h-12 rounded-lg bg-gradient-to-r from-violet-700 via-red-600 to-orange-400" />
        </div>
      </div>

      <div className="absolute right-4 top-8 grid gap-3">
        {[Play, BarChart3, Bot, UsersIconFallback].map((Icon, index) => (
          <span key={index} className="grid h-12 w-12 place-items-center rounded-full border border-orange-300/25 bg-black/45 text-orange-200 shadow-[0_0_22px_rgba(249,115,22,.22)] backdrop-blur-md">
            <Icon className="h-5 w-5" />
          </span>
        ))}
      </div>

      <div className="absolute bottom-8 right-[2%] hidden rounded-2xl border border-orange-300/25 bg-black/45 p-4 shadow-[0_0_32px_rgba(249,115,22,.24)] backdrop-blur-md md:block">
        <div className="flex h-20 items-end gap-2">
          {[32, 48, 66, 86].map((height, index) => (
            <span key={index} className="w-8 rounded-t-lg bg-gradient-to-t from-red-600 to-orange-300" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersIconFallback({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AudienceCardBackground({ item }: { item: (typeof audienceCards)[number] }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.035]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_38%,rgba(249,115,22,.18),transparent_24%)]" />
    </div>
  );
}

function AudienceCard({ item, index }: { item: (typeof audienceCards)[number]; index: number }) {
  return (
    <figure className="group relative aspect-[5/3] overflow-hidden rounded-[1.35rem] border border-red-400/40 bg-black shadow-[0_0_34px_rgba(239,68,68,.18)] transition duration-500 hover:-translate-y-2 hover:border-orange-300/70 hover:shadow-[0_0_68px_rgba(249,115,22,.34)]">
      <img src={item.image} alt={`Section 5 card ${index + 1}: ${item.title}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
      <div className="pointer-events-none absolute inset-0 rounded-[1.35rem] ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-orange-200/80 to-transparent opacity-0 shadow-[0_0_18px_rgba(249,115,22,.85)] transition duration-500 group-hover:opacity-100" />
    </figure>
  );
}

function AudienceSection() {
  return (
    <section id="doi-tuong" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/14 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_10%,rgba(168,85,247,.18),transparent_22%),radial-gradient(circle_at_82%_28%,rgba(249,115,22,.22),transparent_24%),linear-gradient(135deg,rgba(42,5,8,.9),rgba(4,4,6,.98)_42%,rgba(24,8,3,.88))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-orange-500/18 blur-[90px]" />
        <div className="absolute left-0 top-1/3 h-px w-full bg-gradient-to-r from-transparent via-red-400/30 to-transparent shadow-[0_0_26px_rgba(239,68,68,.45)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_20%,rgba(255,255,255,.12),transparent_1.4px)] [background-size:24px_24px] opacity-45" />

        <div className="relative grid gap-6 lg:grid-cols-[.95fr_1.05fr] lg:items-start">
          <div className="pt-3">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• KHÓA HỌC NÀY DÀNH CHO AI</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.02] tracking-[-.055em] text-white sm:text-6xl">
              Bạn sẽ phù hợp
              <br />
              nếu bạn <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">là...</span>
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Dù bạn là người mới hay đã có kinh nghiệm, khóa học đều có lộ trình phù hợp để giúp bạn tạo video AI phục vụ công việc và kiếm tiền.
            </p>
          </div>

          <AudienceHeroIllustration />
        </div>

        <div className="relative mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {audienceCards.map((item, index) => (
            <div key={item.title} className="animate-[audienceCard_.75s_ease_both]" style={{ animationDelay: `${index * 80}ms` }}>
              <AudienceCard item={item} index={index} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes audienceRight {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes audienceCard {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function VerticalVideoMockup() {
  const tools = [
    { label: "AutoCut", icon: Scissors },
    { label: "Ảnh đại diện AI", icon: User },
    { label: "Ảnh → Video", icon: ImageIcon },
    { label: "Xóa nền", icon: WandSparkles },
    { label: "Text to Video", icon: FileText },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[340px] animate-[useCaseFloatIn_.9s_ease_both] lg:max-w-[360px]">
      <div className="absolute -inset-8 rounded-full bg-red-600/22 blur-[70px]" />
      <div className="absolute -right-10 top-10 h-48 w-48 rounded-full bg-orange-400/18 blur-[65px]" />

      <div className="group relative overflow-hidden rounded-[1.7rem] border border-orange-300/35 bg-black p-3 shadow-[0_0_55px_rgba(239,68,68,.28)] transition duration-500 hover:-translate-y-2 hover:shadow-[0_0_86px_rgba(249,115,22,.38)]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-[#050505] via-[#160909] to-[#650b05]">
          <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.42)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(249,115,22,.22),transparent_25%),radial-gradient(circle_at_50%_100%,rgba(239,68,68,.32),transparent_35%)]" />

          <div className="absolute left-1/2 top-16 z-20 w-[86%] -translate-x-1/2 animate-[toolFloat_3.8s_ease-in-out_infinite] rounded-2xl border border-white/20 bg-white/92 p-4 text-zinc-900 shadow-[0_24px_60px_rgba(0,0,0,.35)]">
            <p className="mb-3 text-xs font-black">Công cụ AI</p>
            <div className="grid grid-cols-3 gap-2">
              {tools.slice(0, 3).map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-xl bg-zinc-100 p-2 text-center">
                  <Icon className="mx-auto h-4 w-4 text-zinc-700" />
                  <p className="mt-1 text-[8px] font-bold leading-tight">{label}</p>
                </div>
              ))}
            </div>
            <p className="mb-2 mt-3 text-xs font-black">Chỉnh sửa video</p>
            <div className="grid grid-cols-2 gap-2">
              {tools.slice(3).map(({ label, icon: Icon }) => (
                <div key={label} className="rounded-xl bg-zinc-100 p-2 text-center">
                  <Icon className="mx-auto h-4 w-4 text-zinc-700" />
                  <p className="mt-1 text-[8px] font-bold leading-tight">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 z-10 h-[48%] w-[58%] -translate-x-1/2">
            <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-full border border-orange-200/35 bg-gradient-to-br from-orange-100 via-stone-200 to-stone-500 shadow-[0_0_32px_rgba(249,115,22,.28)]" />
            <div className="absolute bottom-0 left-1/2 h-[76%] w-[72%] -translate-x-1/2 rounded-t-[2rem] border border-white/12 bg-gradient-to-b from-zinc-900 to-black" />
            <div className="absolute bottom-0 left-1/2 h-[58%] w-[50%] -translate-x-1/2 bg-gradient-to-b from-white/90 to-zinc-300" />
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-30 rounded-2xl border border-orange-300/25 bg-black/55 p-3 backdrop-blur-md">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-200">AI Video Preview</span>
              <Play className="h-4 w-4 fill-white text-white" />
            </div>
            <div className="h-1.5 rounded-full bg-white/18">
              <span className="block h-full w-[68%] rounded-full bg-gradient-to-r from-red-500 to-orange-300" />
            </div>
          </div>

          <button className="absolute left-1/2 top-1/2 z-30 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/45 text-white shadow-[0_0_30px_rgba(249,115,22,.3)] backdrop-blur-md">
            <Play className="ml-1 h-7 w-7 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoUseCaseSection({ activeCase, setActiveCase }: { activeCase: number; setActiveCase: (index: number) => void }) {
  const current = videoUseCases[activeCase];

  return (
    <section id="vi-du-thuc-te" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_10%,rgba(249,115,22,.22),transparent_24%),radial-gradient(circle_at_20%_18%,rgba(168,85,247,.2),transparent_28%),linear-gradient(125deg,rgba(88,19,82,.74),rgba(25,8,35,.88)_38%,rgba(56,12,7,.78)_72%,rgba(96,35,9,.72))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0,transparent_46%,rgba(255,255,255,.13)_47%,transparent_48%,transparent_100%)] [background-size:80px_80px]" />
        <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-orange-500/18 blur-[90px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-[95px]" />

        <div className="relative grid gap-9 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="animate-[useCaseFade_.75s_ease_both]">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• VÍ DỤ THỰC TẾ</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-5xl">
              AI Video làm được gì
              <br />
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">cho công việc của bạn?</span>
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
              Chọn vai trò của bạn để xem một tình huống thực tế — từ ý tưởng, prompt đến video AI hoàn chỉnh.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {videoUseCases.map((item, index) => (
                <button
                  key={item.tab}
                  type="button"
                  onClick={() => setActiveCase(index)}
                  className={`rounded-full border px-4 py-2 text-xs font-black transition duration-300 ${
                    activeCase === index
                      ? "border-orange-300/40 bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-[0_0_24px_rgba(249,115,22,.35)]"
                      : "border-white/10 bg-black/25 text-zinc-400 hover:border-orange-300/25 hover:text-white"
                  }`}
                >
                  🎯 {item.tab}
                </button>
              ))}
            </div>

            <div className="mt-7">
              <span className="inline-flex rounded-full border border-red-400/20 bg-red-500/12 px-3 py-1 text-[11px] font-black text-red-200">{current.label}</span>
              <h3 className="mt-5 max-w-2xl text-2xl font-black leading-tight text-white sm:text-3xl">{current.title}</h3>
              <p className="mt-4 text-sm leading-7 text-zinc-300">
                <span className="font-black text-white">Trước: </span>
                {current.before}
              </p>

              <div className="mt-6 space-y-4">
                {current.steps.map((step, index) => (
                  <div key={step} className="flex animate-[useCaseStep_.45s_ease_both] gap-4" style={{ animationDelay: `${index * 90}ms` }}>
                    <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-xs font-black text-white shadow-[0_0_18px_rgba(249,115,22,.35)]">{index + 1}</span>
                    <p className="pt-0.5 text-sm leading-6 text-zinc-300">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 max-w-xl rounded-2xl border border-emerald-300/24 bg-emerald-500/8 p-4 shadow-[0_0_28px_rgba(16,185,129,.12)]">
                <p className="flex items-center gap-3 text-sm font-black text-emerald-300">
                  <ZapIcon />
                  {current.result}
                </p>
                <p className="mt-2 pl-8 text-xs leading-6 text-zinc-400">{current.note}</p>
              </div>

              <div className="mt-7">
                <a href="#register" className="inline-flex rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(239,68,68,.35)] transition hover:-translate-y-1 hover:shadow-[0_0_46px_rgba(249,115,22,.46)]">
                  Đăng ký ngay
                </a>
                <p className="mt-3 text-xs font-semibold text-zinc-400">Thanh toán QR - nhận khóa học qua Zalo</p>
              </div>
            </div>
          </div>

          <VerticalVideoMockup />
        </div>
      </div>

      <style jsx global>{`
        @keyframes useCaseFade {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes useCaseFloatIn {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toolFloat {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -8px); }
        }
        @keyframes useCaseStep {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h7l-1 8l9-12h-7l1-8z" />
    </svg>
  );
}

function LessonCard({ title, number, index }: { title: string; number: number; index: number }) {
  return (
    <div className="group animate-[lessonIn_.55s_ease_both] rounded-2xl border border-white/10 bg-black/28 p-4 shadow-[0_0_28px_rgba(0,0,0,.2)] transition duration-500 hover:-translate-y-1 hover:border-orange-300/36 hover:bg-white/[0.045] hover:shadow-[0_0_34px_rgba(249,115,22,.16)]" style={{ animationDelay: `${index * 45}ms` }}>
      <div className="flex gap-4">
        <span className="grid h-9 w-9 flex-none place-items-center rounded-full border border-orange-300/18 bg-white/[0.04] text-xs font-black text-orange-200">
          {number}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-zinc-500">Bài {number}</p>
          <h4 className="mt-1 text-sm font-black leading-6 text-white">{title}</h4>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Video bài học thực chiến, dễ theo dõi và có thể áp dụng ngay.</p>
        </div>
        <PlayCircle className="ml-auto mt-1 h-5 w-5 flex-none text-orange-300 opacity-60 transition group-hover:opacity-100" />
      </div>
    </div>
  );
}

function CurriculumSection({ activePart, setActivePart }: { activePart: number; setActivePart: (index: number) => void }) {
  const current = courseParts[activePart];

  return (
    <section id="noi-dung-khoa-hoc" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,.22),transparent_24%),radial-gradient(circle_at_18%_8%,rgba(168,85,247,.22),transparent_28%),linear-gradient(125deg,rgba(88,19,82,.68),rgba(25,8,35,.84)_38%,rgba(48,11,7,.82)_74%,rgba(95,38,10,.7))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0,transparent_46%,rgba(255,255,255,.12)_47%,transparent_48%,transparent_100%)] [background-size:80px_80px]" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-orange-500/18 blur-[90px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-[95px]" />

        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• NỘI DUNG KHÓA HỌC</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-5xl">
            <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">20 bài học</span> • 2 phần • Thực chiến
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 sm:text-base">
            Từ tư duy nền tảng đến quy trình tạo video AI hoàn chỉnh, học tới đâu áp dụng tới đó.
          </p>
        </div>

        <div className="relative mt-8 flex flex-wrap gap-3">
          {courseParts.map((part, index) => (
            <button
              key={part.tab}
              type="button"
              onClick={() => setActivePart(index)}
              className={`rounded-full border px-4 py-2 text-xs font-black transition duration-300 ${
                activePart === index
                  ? "border-orange-300/40 bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-[0_0_24px_rgba(249,115,22,.35)]"
                  : "border-white/10 bg-black/25 text-zinc-400 hover:border-orange-300/25 hover:text-white"
              }`}
            >
              {index + 1}. {part.tab}
            </button>
          ))}
        </div>

        <div className="relative mt-8">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-white">{current.title}</h3>
              <p className="mt-2 max-w-4xl text-sm leading-7 text-zinc-400">{current.desc}</p>
            </div>
            <span className="text-sm font-bold text-zinc-500">{current.lessons.length} bài</span>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {current.lessons.map((lesson, index) => (
              <LessonCard key={lesson} title={lesson} number={current.start + index} index={index} />
            ))}
          </div>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[1.45rem] border border-orange-300/16 bg-black/35 p-5 shadow-[0_0_38px_rgba(249,115,22,.14)] sm:p-6">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_260px] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">KẾT QUẢ SAU KHÓA HỌC</span>
              <h3 className="mt-4 text-xl font-black leading-snug text-white sm:text-2xl">Bạn có thể tự tạo video AI hoàn chỉnh cho kênh của mình</h3>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                Không chỉ học lý thuyết. Sau khóa học, bạn có quy trình thực chiến để tạo nội dung, xây kênh và gắn Affiliate vào sản phẩm phù hợp.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-right">
              <p className="text-xs font-bold text-zinc-500">Chuyển từ</p>
              <p className="mt-1 text-sm font-black text-zinc-300">Người mới bắt đầu</p>
              <p className="my-3 text-2xl text-orange-300">↓</p>
              <p className="text-sm font-black text-orange-300">Người sản xuất Video AI</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes lessonIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const mentorStats = [
  ["100+", "Prompt & workflow đã thử nghiệm"],
  ["20", "Bài học thực chiến"],
  ["4+", "Nhóm công cụ AI được hướng dẫn"],
  ["30 ngày", "Checklist xây kênh cho người mới"],
];

const mentorBoxes = [
  "Tập trung vào thực hành, không nói lý thuyết lan man.",
  "Hướng dẫn theo quy trình từng bước để người mới dễ làm.",
  "Ưu tiên công cụ dễ dùng, phù hợp người không giỏi kỹ thuật.",
  "Mục tiêu cuối là tạo được video, xây kênh và gắn Affiliate.",
];

function MentorSection() {
  return (
    <section id="nguoi-huong-dan" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] shadow-[0_42px_130px_rgba(0,0,0,.62)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_12%,rgba(249,115,22,.23),transparent_24%),radial-gradient(circle_at_18%_10%,rgba(168,85,247,.2),transparent_28%),linear-gradient(125deg,rgba(78,16,68,.64),rgba(24,8,32,.86)_38%,rgba(45,11,7,.82)_74%,rgba(94,37,9,.7))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0,transparent_46%,rgba(255,255,255,.12)_47%,transparent_48%,transparent_100%)] [background-size:80px_80px]" />
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-red-950/25 to-transparent" />
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-red-500/16 blur-[90px]" />

        <div className="relative grid gap-0 lg:grid-cols-[.82fr_1.18fr]">
          <div className="animate-[mentorLeft_.85s_ease_both] p-5 sm:p-7 lg:p-0">
            <div className="relative min-h-[520px] overflow-hidden rounded-[1.45rem] border border-orange-300/20 bg-gradient-to-br from-[#10070b] via-[#1b0a12] to-[#050505] shadow-[0_0_55px_rgba(239,68,68,.18)] lg:h-full lg:rounded-r-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(249,115,22,.24),transparent_28%),radial-gradient(circle_at_50%_64%,rgba(220,38,38,.22),transparent_36%)]" />
              <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full border border-orange-300/18 bg-gradient-to-b from-orange-500/10 to-transparent shadow-[0_0_80px_rgba(249,115,22,.22)]" />
              <div className="absolute bottom-0 left-1/2 h-72 w-[92%] -translate-x-1/2 rounded-t-full bg-gradient-to-t from-red-600/24 to-transparent blur-2xl" />
              <Image
                src="/images/video-ai-course-mentor-section-cutout-hair-soft.png"
                alt="Trung AI"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-contain object-bottom -translate-y-8 scale-[1.12] drop-shadow-[0_0_36px_rgba(249,115,22,.32)] sm:-translate-y-10 lg:-translate-y-12 lg:scale-[1.18]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full border border-emerald-300/20 bg-black/70 px-4 py-2 text-xs font-black text-white backdrop-blur-md">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
                Đang xây dựng hệ sinh thái AI thực chiến
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-black/72 p-5 backdrop-blur-md">
                <h3 className="text-xl font-black text-white">Trung AI</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-300">Người làm MMO thực chiến • AI Content • Affiliate</p>
              </div>
            </div>
          </div>

          <div className="animate-[mentorRight_.85s_.06s_ease_both] px-5 pb-8 pt-2 sm:px-8 sm:pb-10 lg:px-10 lg:py-12">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• NGƯỜI CHIA SẺ THỰC CHIẾN</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-5xl">
              Học Video AI cùng người <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">đang làm thực tế</span> mỗi ngày
            </h2>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
              Tôi không dạy theo kiểu lý thuyết phức tạp. Những gì trong khóa học này được xây từ quá trình tự làm nội dung, xây kênh, thử công cụ AI, làm Affiliate và tối ưu quy trình để người mới có thể làm theo.
            </p>

            <h3 className="mt-8 text-2xl font-black leading-snug text-white">Từ người tự mày mò công cụ AI đến hệ thống hóa thành quy trình dễ làm theo</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Tôi bắt đầu từ việc tự thử các công cụ AI để làm ảnh, video, prompt, chatbot và nội dung bán hàng. Sau nhiều lần làm sai, sửa lại và tối ưu, tôi gom lại thành một quy trình đơn giản hơn để người mới có thể bắt đầu nhanh hơn, không bị rối vì quá nhiều công cụ.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {mentorStats.map(([value, label], index) => (
                <div key={label} className="animate-[mentorStat_.55s_ease_both] rounded-2xl border border-orange-300/18 bg-black/26 p-4 shadow-[0_0_24px_rgba(249,115,22,.08)] transition hover:-translate-y-1 hover:border-orange-300/38" style={{ animationDelay: `${index * 70}ms` }}>
                  <p className="bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200 bg-clip-text text-2xl font-black text-transparent">{value}</p>
                  <p className="mt-2 text-xs leading-5 text-zinc-400">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {mentorBoxes.map((box) => (
                <div key={box} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-orange-300/26 hover:bg-white/[0.055]">
                  <span className="mt-1 h-3 w-3 flex-none rounded-full bg-gradient-to-r from-red-500 to-orange-300 shadow-[0_0_16px_rgba(249,115,22,.45)]" />
                  <p className="text-sm leading-6 text-zinc-300">{box}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-orange-300/20 bg-gradient-to-r from-red-950/55 via-black/30 to-orange-950/35 p-5 shadow-[0_0_34px_rgba(249,115,22,.14)]">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-300">ĐÂY LÀ KHÓA HỌC THỰC CHIẾN CHO NGƯỜI MỚI</p>
              <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-center">
                <p className="flex-1 text-sm leading-7 text-zinc-300">
                  Nếu bạn đang muốn bắt đầu với Video AI nhưng chưa biết đi từ đâu, khóa học này sẽ giúp bạn có một lộ trình rõ ràng hơn: học công cụ, làm video, xây kênh và ứng dụng vào bán hàng/Affiliate.
                </p>
                <a href="#register" className="inline-flex flex-none rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-6 py-3 text-sm font-black text-white shadow-[0_0_28px_rgba(239,68,68,.35)] transition hover:-translate-y-1 hover:shadow-[0_0_46px_rgba(249,115,22,.46)]">
                  Giữ suất học ưu đãi
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes mentorLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes mentorRight {
          from { opacity: 0; transform: translateX(24px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes mentorStat {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function SampleVideoCard({ item, index }: { item: SampleVideo; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    if (!item.video) return;
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      video.volume = 1;
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <article className="group relative w-[230px] flex-none animate-[videoCardIn_.65s_ease_both] overflow-hidden rounded-[1.55rem] border border-white/12 bg-black shadow-[0_28px_80px_rgba(0,0,0,.45)] transition duration-500 hover:-translate-y-2 hover:border-orange-300/55 hover:shadow-[0_0_64px_rgba(249,115,22,.28)] sm:w-[250px]" style={{ animationDelay: `${index * 80}ms` }}>
      <div className={`relative aspect-[9/16] overflow-hidden bg-gradient-to-br ${item.gradient}`}>
        {item.video ? (
          <video
            ref={videoRef}
            src={item.video}
            className="absolute inset-0 h-full w-full object-cover"
            loop
            playsInline
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        ) : null}
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.42)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.42)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,.35),transparent_20%),radial-gradient(circle_at_50%_88%,rgba(0,0,0,.55),transparent_35%)]" />
        <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/80 via-black/30 to-transparent p-4">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full border border-white/25 bg-white/12" />
            <div>
              <h3 className="text-sm font-black leading-tight text-white">{item.title}</h3>
              <p className="text-[10px] font-bold text-white/72">Trung AI Media</p>
            </div>
          </div>
        </div>

        <button type="button" onClick={togglePlayback} aria-label={`Phát video ${item.title}`} className={`absolute left-1/2 top-[48%] z-20 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/42 text-white shadow-[0_0_34px_rgba(249,115,22,.25)] backdrop-blur-md transition duration-500 group-hover:scale-110 group-hover:shadow-[0_0_52px_rgba(249,115,22,.55)] ${isPlaying ? "bg-black/26 opacity-75 hover:opacity-100" : "opacity-100"}`}>
          {!isPlaying ? <span className="absolute h-full w-full animate-[playPulse_2s_ease-in-out_infinite] rounded-full border border-white/20" /> : null}
          {isPlaying ? (
            <span className="flex items-center gap-1.5">
              <span className="h-7 w-2.5 rounded-sm bg-white" />
              <span className="h-7 w-2.5 rounded-sm bg-white" />
            </span>
          ) : (
            <Play className="ml-1 h-8 w-8 fill-white" />
          )}
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black via-black/72 to-transparent p-4 pt-24">
          <p className="line-clamp-3 text-xs leading-5 text-zinc-200">{item.desc}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">{item.platform}</span>
            <span className="rounded-md bg-white px-2 py-1 text-[10px] font-black text-black">▶</span>
          </div>
        </div>

        <div className="absolute bottom-24 left-4 right-4 z-0 h-1.5 rounded-full bg-white/18">
          <span className="block h-full w-[62%] rounded-full bg-gradient-to-r from-red-500 to-orange-300" />
        </div>
        <div className="absolute right-4 top-20 z-10 flex flex-col gap-2">
          {["♥", "↗", "💬"].map((icon) => (
            <span key={icon} className="grid h-8 w-8 place-items-center rounded-full bg-black/35 text-xs text-white backdrop-blur-md">{icon}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function VideoResultsSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scroll = (direction: "left" | "right") => {
    carouselRef.current?.scrollBy({ left: direction === "right" ? 320 : -320, behavior: "smooth" });
  };

  return (
    <section id="ket-qua-thuc-te" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,.22),transparent_24%),radial-gradient(circle_at_20%_10%,rgba(168,85,247,.22),transparent_28%),linear-gradient(125deg,rgba(88,19,82,.72),rgba(25,8,35,.86)_38%,rgba(48,11,7,.82)_74%,rgba(95,38,10,.7))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_26%,rgba(255,255,255,.12),transparent_1.4px)] [background-size:24px_24px] opacity-40" />
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-red-400/55 to-transparent shadow-[0_0_34px_rgba(239,68,68,.65)]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-[95px]" />
        <div className="absolute -right-24 top-6 h-80 w-80 rounded-full bg-orange-500/18 blur-[90px]" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• KẾT QUẢ THỰC TẾ</p>
            <h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-5xl">
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">Video AI thực chiến</span>
              <br />
              từ những quy trình trong khóa học
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 sm:text-base">
              Xem các dạng video mẫu có thể tạo sau khi học: review sản phẩm, thời trang AI, quảng cáo sản phẩm, video không lộ mặt và nội dung bán hàng ngắn.
            </p>
          </div>

          <div className="flex gap-3">
            <button onClick={() => scroll("left")} aria-label="Cuộn trái" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/35 text-white transition hover:border-orange-300/45 hover:bg-orange-500/15">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll("right")} aria-label="Cuộn phải" className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/35 text-white transition hover:border-orange-300/45 hover:bg-orange-500/15">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={carouselRef} className="relative mt-9 flex snap-x gap-5 overflow-x-auto scroll-smooth pb-6 [scrollbar-color:#f97316_rgba(255,255,255,.12)] [scrollbar-width:thin]">
          {sampleVideos.map((item, index) => (
            <SampleVideoCard key={item.title} item={item} index={index} />
          ))}
        </div>

        <div className="relative mt-2 flex flex-col gap-4 rounded-2xl border border-orange-300/16 bg-black/32 p-5 shadow-[0_0_28px_rgba(249,115,22,.1)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-7 text-zinc-300">Bạn không cần bắt đầu từ con số 0 — khóa học sẽ đưa bạn từ ý tưởng đến video hoàn chỉnh.</p>
          <button onClick={() => document.getElementById("noi-dung-khoa-hoc")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex flex-none rounded-full border border-orange-300/25 bg-orange-500/12 px-5 py-3 text-sm font-black text-orange-200 transition hover:-translate-y-1 hover:bg-orange-500/20">
            Xem nội dung khóa học
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes videoCardIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes playPulse {
          0%, 100% { transform: scale(1); opacity: .45; }
          50% { transform: scale(1.28); opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function WhyNowSection() {
  const scrollToCurriculum = () => document.getElementById("noi-dung-khoa-hoc")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="vi-sao-hoc-ngay" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(249,115,22,.2),transparent_24%),radial-gradient(circle_at_18%_10%,rgba(168,85,247,.22),transparent_28%),linear-gradient(125deg,rgba(88,19,82,.72),rgba(25,8,35,.86)_38%,rgba(48,11,7,.82)_74%,rgba(95,38,10,.7))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0,transparent_46%,rgba(255,255,255,.12)_47%,transparent_48%,transparent_100%)] [background-size:80px_80px]" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-orange-500/18 blur-[90px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-[95px]" />

        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• VÌ SAO NÊN HỌC NGAY</p>
          <h2 className="mt-4 max-w-5xl text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-5xl">
            Video AI <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">đang thay đổi rất nhanh</span>
            <br />
            bạn đang ở đâu?
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-zinc-300 sm:text-base">
            Không phải câu chuyện của tương lai — AI đang thay đổi cách làm nội dung, bán hàng và xây kênh ngay lúc này.
          </p>
        </div>

        <div className="relative mt-9 animate-[whyRise_.75s_ease_both] overflow-hidden rounded-2xl border border-white/10 bg-black/42 shadow-[0_0_34px_rgba(0,0,0,.25)]">
          <div className="grid lg:grid-cols-2">
            <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-zinc-300">Chưa dùng Video AI</h3>
              <div className="mt-5 space-y-4">
                {[
                  "Mỗi video vẫn phải tự quay, tự dựng hoặc thuê ngoài",
                  "Phụ thuộc vào đội sản xuất hoặc ngân sách quảng cáo",
                  "Không có quy trình lặp lại, mỗi video lại bắt đầu từ đầu",
                ].map((item) => (
                  <p key={item} className="flex gap-3 text-sm leading-6 text-zinc-400">
                    <X className="mt-0.5 h-5 w-5 flex-none text-zinc-600" />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 via-orange-500/8 to-transparent p-6">
              <h3 className="text-sm font-black uppercase tracking-[0.16em] text-orange-200">Đã dùng Video AI</h3>
              <div className="mt-5 space-y-4">
                {[
                  "Tạo video nhanh hơn với quy trình có sẵn",
                  "Tự chủ nội dung, không phụ thuộc hoàn toàn vào người khác",
                  "Một workflow có thể tái sử dụng cho nhiều video và nhiều nền tảng",
                ].map((item) => (
                  <p key={item} className="flex gap-3 text-sm font-semibold leading-6 text-orange-50/90">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-orange-300 drop-shadow-[0_0_10px_rgba(249,115,22,.7)]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid overflow-hidden rounded-2xl border border-white/10 bg-black/30 sm:grid-cols-2">
          <div className="border-b border-white/10 p-6 sm:border-b-0 sm:border-r">
            <p className="text-3xl font-black text-red-400">78%</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">Người làm nội dung đang thử dùng AI trong quy trình sáng tạo</p>
          </div>
          <div className="p-6">
            <p className="bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200 bg-clip-text text-2xl font-black text-transparent">Từ vài ngày → còn vài giờ</p>
            <p className="mt-2 text-sm leading-6 text-zinc-300">Thời gian tạo một video ngắn có thể rút gọn mạnh khi biết dùng đúng workflow</p>
          </div>
        </div>

        <div className="group relative mt-6 overflow-hidden rounded-2xl border border-orange-300/24 bg-gradient-to-r from-red-950/44 via-black/32 to-orange-950/38 p-6 shadow-[0_0_34px_rgba(249,115,22,.14)] transition duration-500 hover:border-orange-300/45 hover:shadow-[0_0_54px_rgba(249,115,22,.22)]">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-orange-500/14 to-transparent" />
          <div className="relative flex flex-col gap-5 lg:flex-row">
            <span className="grid h-12 w-12 flex-none place-items-center rounded-2xl border border-yellow-300/25 bg-yellow-300/10 text-yellow-300 shadow-[0_0_24px_rgba(250,204,21,.2)]">
              <ZapIcon />
            </span>
            <div className="flex-1">
              <h3 className="text-xl font-black text-white">Lợi thế thuộc về người bắt đầu sớm</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                Khi công cụ AI ngày càng phổ biến, khác biệt không còn nằm ở việc bạn biết tên bao nhiêu công cụ, mà nằm ở việc bạn có quy trình tạo nội dung đều đặn, biết biến ý tưởng thành video và biết gắn video vào bán hàng hoặc Affiliate.
              </p>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {["Hiểu công cụ sớm hơn", "Làm quen workflow trước người khác", "Có thêm thời gian thử nghiệm, sai và tối ưu"].map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-zinc-300">
                    <span className="mr-2 text-orange-300">•</span>{item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button onClick={scrollToCurriculum} className="relative mt-5 text-sm font-black text-zinc-400 transition hover:text-orange-300">
          Xem lộ trình học ngay ↓
        </button>
      </div>

      <style jsx global>{`
        @keyframes whyRise {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function RegistrationSection() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [formError, setFormError] = useState("");

  const handlePaymentRequest = () => {
    const hasEmptyField = !customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.email.trim();

    if (hasEmptyField) {
      setFormError("Vui lòng nhập đầy đủ họ tên, số điện thoại và email trước khi thanh toán.");
      return;
    }

    setFormError("");
    setIsPaymentOpen(true);
  };

  const comboItems = [
    {
      title: "Khóa học chính — Video AI Thực Chiến",
      desc: "20 bài học thực chiến từ nền tảng đến quy trình tạo video AI",
      value: "899.000đ",
      icon: PlayCircle,
    },
    {
      title: "Bộ Prompt AI làm video",
      desc: "Prompt viết kịch bản, tạo ảnh, tạo video, thumbnail và caption",
      value: "299.000đ",
      icon: WandSparkles,
    },
    {
      title: "Checklist xây kênh 30 ngày",
      desc: "Lộ trình từng bước để người mới bắt đầu xây kênh nội dung ngắn",
      value: "199.000đ",
      icon: Target,
    },
    {
      title: "Template workflow sản xuất video AI",
      desc: "Quy trình từ ý tưởng → kịch bản → ảnh → video → đăng bài",
      value: "Tặng kèm",
      icon: GaugeCircle,
    },
    {
      title: "Nhóm hỗ trợ học viên",
      desc: "Cập nhật công cụ, prompt mới và giải đáp trong quá trình học",
      value: "Tặng kèm",
      icon: UsersIconFallback,
    },
    {
      title: "Cập nhật khóa học",
      desc: "Nhận các bài học mới khi khóa học được bổ sung",
      value: "Trọn đời",
      icon: Infinity,
    },
  ];

  return (
    <section id="dang-ky-thanh-toan" className="relative px-3 pb-12 pt-0 sm:px-6 sm:pb-20 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_84%_12%,rgba(249,115,22,.24),transparent_24%),radial-gradient(circle_at_20%_4%,rgba(168,85,247,.24),transparent_30%),linear-gradient(125deg,rgba(91,18,82,.74),rgba(25,8,35,.88)_38%,rgba(48,11,7,.82)_74%,rgba(102,39,10,.72))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0,transparent_46%,rgba(255,255,255,.12)_47%,transparent_48%,transparent_100%)] [background-size:82px_82px]" />
        <div className="absolute -right-20 top-16 h-96 w-96 rounded-full bg-orange-500/18 blur-[105px]" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/14 blur-[95px]" />

        <div className="relative">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• ĐĂNG KÝ & THANH TOÁN</p>
          <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-5xl">
            Bắt đầu học <span className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-200 bg-clip-text text-transparent">ngay hôm nay</span>
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base">
            Thanh toán chuyển khoản QR, gửi xác nhận qua Zalo và nhận tài nguyên học tập.
          </p>
        </div>

        <div className="relative mt-9 grid gap-6 lg:grid-cols-[1.15fr_.85fr] lg:items-start">
          <div className="animate-[registerLeft_.8s_ease_both] overflow-hidden rounded-[1.55rem] border border-white/12 bg-black/34 p-5 shadow-[0_0_42px_rgba(0,0,0,.28)] backdrop-blur-xl sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
              <h3 className="text-xl font-black text-white">Bạn nhận được trong combo:</h3>
              <span className="rounded-full border border-orange-300/18 bg-orange-400/10 px-3 py-1 text-xs font-bold text-orange-200">Ưu đãi 149.000đ</span>
            </div>

            <div className="divide-y divide-white/10">
              {comboItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div className="flex gap-4">
                      <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-red-400/24 bg-red-500/10 text-orange-200 shadow-[0_0_22px_rgba(239,68,68,.12)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h4 className="text-sm font-black text-white sm:text-base">{item.title}</h4>
                        <p className="mt-1 text-sm leading-6 text-zinc-400">{item.desc}</p>
                      </div>
                    </div>
                    <p className="pl-[60px] text-sm font-black text-orange-100 sm:pl-0 sm:text-right">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 flex flex-wrap items-end justify-between gap-4 border-t border-white/12 pt-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">Tổng giá trị nhận được</p>
                <p className="mt-1 text-sm text-zinc-400">Khóa học + prompt + checklist + workflow + hỗ trợ</p>
              </div>
              <p className="text-3xl font-black text-white">1.397.000đ</p>
            </div>
          </div>

          <div className="animate-[registerRight_.8s_.08s_ease_both] rounded-[1.65rem] bg-gradient-to-br from-red-400 via-orange-300 to-yellow-200 p-[2px] shadow-[0_0_72px_rgba(249,115,22,.42)]">
            <div className="relative overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-[#080207] via-[#16060b] to-[#2a0704] p-5 sm:p-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,rgba(249,115,22,.26),transparent_25%),radial-gradient(circle_at_8%_90%,rgba(239,68,68,.18),transparent_28%)]" />
              <div className="absolute inset-0 bg-black/58" />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-orange-200 drop-shadow-[0_0_12px_rgba(249,115,22,.35)]">• ĐĂNG KÝ HỌC NGAY</p>
                  <span className="rounded-full bg-gradient-to-r from-red-500 to-orange-400 px-3 py-1 text-[11px] font-black text-white shadow-[0_0_24px_rgba(249,115,22,.38)]">GIẢM 83%</span>
                </div>

                <div className="mt-7">
                  <p className="text-sm font-bold text-zinc-300 line-through">899.000đ</p>
                  <p className="mt-1 text-5xl font-black tracking-[-.04em] text-yellow-200 drop-shadow-[0_0_28px_rgba(250,204,21,.48)]">149.000đ</p>
                  <p className="mt-2 inline-flex rounded-full border border-yellow-200/45 bg-yellow-300/12 px-3 py-1 text-xs font-bold text-yellow-100">
                    Tiết kiệm 750.000đ
                  </p>
                </div>

                <form className="mt-6 space-y-3">
                  {[
                    ["name", "Họ và tên"],
                    ["phone", "Số điện thoại"],
                    ["email", "Email"],
                  ].map(([field, placeholder]) => (
                    <input
                      key={field}
                      className="w-full rounded-xl border border-orange-200/35 bg-white px-4 py-3 text-sm font-semibold text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-yellow-200 focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,255,255,.22)]"
                      placeholder={placeholder}
                      value={customerInfo[field as keyof typeof customerInfo]}
                      onChange={(event) => {
                        setCustomerInfo((current) => ({ ...current, [field]: event.target.value }));
                        if (formError) setFormError("");
                      }}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={handlePaymentRequest}
                    className="mt-2 w-full rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 px-5 py-4 text-sm font-black text-white shadow-[0_16px_48px_rgba(239,68,68,.36)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_62px_rgba(249,115,22,.5)]"
                  >
                    Đăng ký & nhận hướng dẫn thanh toán
                  </button>
                  {formError ? (
                    <p className="rounded-xl border border-red-200/40 bg-red-950/55 px-4 py-3 text-sm font-bold leading-6 text-red-50">
                      {formError}
                    </p>
                  ) : null}
                </form>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["Chuyển khoản QR", "Xác nhận qua Zalo", "Nhận tài nguyên thủ công", "Học trọn đời"].map((badge) => (
                    <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-white/14 bg-black/38 px-3 py-1.5 text-[11px] font-semibold text-zinc-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-orange-200/35 bg-black/36 p-4 text-sm leading-6 text-zinc-100 shadow-[inset_0_0_0_1px_rgba(255,255,255,.035)]">
                  <p className="font-black text-white">Không cần chờ kích hoạt tự động.</p>
                  <p className="mt-1 text-zinc-200">Sau khi chuyển khoản, bạn gửi xác nhận qua Zalo để được cấp quyền truy cập khóa học và tài nguyên.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPaymentOpen && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/78 px-4 py-8 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="relative w-full max-w-4xl animate-[modalIn_.22s_ease_both] overflow-hidden rounded-[1.65rem] border border-orange-300/30 bg-[#09070a] shadow-[0_0_90px_rgba(249,115,22,.24)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(168,85,247,.22),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(249,115,22,.24),transparent_28%),linear-gradient(135deg,rgba(35,8,32,.96),rgba(7,5,7,.98)_48%,rgba(36,10,4,.92))]" />
            <button
              type="button"
              onClick={() => setIsPaymentOpen(false)}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:border-orange-300/45 hover:text-white"
              aria-label="Đóng popup thanh toán"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[.95fr_1.05fr] lg:p-8">
              <div className="rounded-[1.35rem] border border-white/12 bg-white/[0.04] p-4">
                <Image
                  src="/images/video-ai-course-payment-qr.png"
                  alt="QR chuyển khoản khóa học Video AI"
                  width={640}
                  height={860}
                  className="h-auto w-full rounded-2xl bg-white object-contain"
                />
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-red-400">Thanh toán QR</p>
                <h3 className="mt-3 text-3xl font-black tracking-[-.035em] text-white sm:text-4xl">Hoàn tất chuyển khoản</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">
                  Quét mã QR hoặc chuyển khoản theo thông tin bên dưới, sau đó bấm nút gửi xác nhận qua Zalo.
                </p>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
                  {[
                    ["Số tài khoản", "0865103062"],
                    ["Ngân hàng", "NH Quốc Tế VIB"],
                    ["Chủ tài khoản", "NGUYỄN ĐỨC TRUNG"],
                    ["Nội dung chuyển khoản", "HOC VIDEO AI"],
                    ["Số tiền", "149.000đ"],
                  ].map(([label, value]) => (
                    <div key={label} className="grid gap-1 border-b border-white/10 px-4 py-3 last:border-b-0 sm:grid-cols-[170px_1fr] sm:gap-4">
                      <span className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">{label}</span>
                      <span className="font-black text-white">{value}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="[THÊM_LINK_ZALO]"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 px-6 py-4 text-sm font-black text-white shadow-[0_16px_48px_rgba(239,68,68,.36)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_62px_rgba(249,115,22,.5)]"
                >
                  Tôi đã chuyển khoản - Gửi xác nhận qua Zalo
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes registerLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes registerRight {
          from { opacity: 0; transform: translateX(28px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(.96) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const faqs = [
    {
      question: "Người mới chưa biết dựng video có học được không?",
      answer: "Có. Khóa học được thiết kế cho người mới, đi từ tư duy nền tảng, công cụ cần dùng đến quy trình thực hành từng bước.",
    },
    {
      question: "Tôi có cần lộ mặt khi làm Video AI không?",
      answer: "Không bắt buộc. Khóa học có hướng dẫn các cách làm video không lộ mặt như MC AI, KOC AI, giọng nói AI, video review sản phẩm và video nội dung ngắn.",
    },
    {
      question: "Học xong có phải trả thêm phí công cụ AI không?",
      answer: "Một số công cụ AI có bản miễn phí và bản trả phí. Trong khóa học, tôi sẽ ưu tiên hướng dẫn cách bắt đầu đơn giản, dễ thử trước, sau đó bạn mới quyết định công cụ nào phù hợp để nâng cấp.",
    },
    {
      question: "Thanh toán xong bao lâu thì nhận khóa học?",
      answer: "Sau khi chuyển khoản, bạn bấm nút xác nhận qua Zalo và gửi thông tin thanh toán. Tôi sẽ kiểm tra và cấp tài nguyên học tập thủ công trong thời gian sớm nhất.",
    },
    {
      question: "Khóa học có cập nhật thêm bài mới không?",
      answer: "Có. Khi có công cụ, prompt hoặc workflow mới phù hợp, khóa học sẽ được cập nhật thêm để học viên tiếp tục sử dụng.",
    },
    {
      question: "Tôi có thể dùng kiến thức này để làm Affiliate không?",
      answer: "Có. Một phần quan trọng của khóa học là hướng dẫn cách dùng Video AI để xây kênh nội dung ngắn, review sản phẩm và gắn Affiliate.",
    },
    {
      question: "Có nhóm hỗ trợ học viên không?",
      answer: "Có. Học viên sẽ được hướng dẫn tham gia nhóm hỗ trợ để cập nhật tài nguyên, prompt, workflow và hỏi đáp trong quá trình học.",
    },
  ];

  return (
    <section id="faq" className="relative px-3 pb-14 pt-0 sm:px-6 sm:pb-24 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(249,115,22,.2),transparent_24%),radial-gradient(circle_at_18%_8%,rgba(168,85,247,.25),transparent_30%),linear-gradient(125deg,rgba(91,18,82,.76),rgba(25,8,35,.88)_38%,rgba(45,12,8,.84)_72%,rgba(99,39,10,.7))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0,transparent_46%,rgba(255,255,255,.12)_47%,transparent_48%,transparent_100%)] [background-size:82px_82px]" />
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-orange-500/16 blur-[105px]" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/12 blur-[95px]" />

        <div className="relative animate-[faqIn_.75s_ease_both]">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-red-400 sm:text-xs">• CÂU HỎI THƯỜNG GẶP</p>
          <h2 className="mt-4 text-4xl font-black tracking-[-.045em] text-white sm:text-5xl">FAQ</h2>

          <div className="mt-10 overflow-hidden rounded-[1.35rem] border border-white/10 bg-black/24 backdrop-blur-xl">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={faq.question} className="border-b border-white/10 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                    className="group flex w-full items-center justify-between gap-5 px-4 py-5 text-left transition hover:bg-white/[0.035] sm:px-6"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-black leading-6 text-white transition group-hover:text-orange-200 sm:text-base">
                      {faq.question}
                    </span>
                    <span className={`grid h-8 w-8 flex-none place-items-center rounded-full border border-white/10 bg-white/[0.035] text-zinc-400 transition duration-300 group-hover:border-orange-300/35 group-hover:text-orange-300 ${isOpen ? "rotate-180 border-orange-300/45 text-orange-300" : ""}`}>
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-4xl px-4 pb-6 text-sm leading-7 text-zinc-300 sm:px-6">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes faqIn {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function FinalCTASection() {
  const scrollToRegistration = () => document.getElementById("dang-ky-thanh-toan")?.scrollIntoView({ behavior: "smooth" });
  const benefits = ["20 bài học", "Học trọn đời", "Prompt & workflow", "Cập nhật miễn phí", "Hỗ trợ qua nhóm/Zalo"];

  return (
    <section id="cta-cuoi-trang" className="relative px-3 pb-14 pt-0 sm:px-6 sm:pb-24 lg:px-8">
      <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/16 bg-[#070707] px-4 py-8 shadow-[0_42px_130px_rgba(0,0,0,.62)] sm:px-8 sm:py-12 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(249,115,22,.22),transparent_24%),radial-gradient(circle_at_18%_12%,rgba(168,85,247,.24),transparent_30%),linear-gradient(125deg,rgba(91,18,82,.76),rgba(25,8,35,.88)_38%,rgba(48,11,7,.84)_72%,rgba(100,38,9,.72))]" />
        <div className="absolute inset-0 opacity-[.13] [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:38px_38px]" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,transparent_0,transparent_46%,rgba(255,255,255,.12)_47%,transparent_48%,transparent_100%)] [background-size:82px_82px]" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[520px] -translate-x-1/2 rounded-full bg-red-600/18 blur-[80px]" />
        <div className="absolute right-10 top-20 h-80 w-80 rounded-full bg-orange-500/16 blur-[95px]" />

        <div className="relative mx-auto max-w-3xl animate-[finalCtaIn_.75s_ease_both] rounded-[1.65rem] bg-gradient-to-br from-red-400 via-orange-300 to-yellow-200 p-[2px] shadow-[0_0_72px_rgba(249,115,22,.42)]">
          <div className="relative overflow-hidden rounded-[1.55rem] bg-gradient-to-br from-[#080207] via-[#16060b] to-[#2a0704] px-4 py-8 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)] sm:px-10 sm:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(239,68,68,.16),transparent_30%),radial-gradient(circle_at_90%_15%,rgba(249,115,22,.22),transparent_24%)]" />
            <div className="absolute inset-0 bg-black/58" />
            <div className="absolute -bottom-20 left-1/2 h-44 w-80 -translate-x-1/2 rounded-full bg-red-500/20 blur-[55px]" />

            <div className="relative">
              <span className="inline-flex rounded-full border border-yellow-200/35 bg-yellow-300/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-yellow-100 shadow-[0_0_24px_rgba(249,115,22,.18)]">
                GIẢM 83%
              </span>

              <h2 className="mx-auto mt-6 max-w-2xl text-3xl font-black leading-tight tracking-[-.045em] text-white sm:text-4xl lg:text-5xl">
                Bắt đầu hành trình làm chủ <span className="bg-gradient-to-r from-red-400 via-orange-300 to-yellow-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(249,115,22,.42)]">Video AI</span>
                <br />
                ngay hôm nay
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-200">
                Đừng để việc làm video tiếp tục là rào cản. Hãy bắt đầu từ một quy trình đơn giản, dễ làm theo và có thể ứng dụng ngay cho xây kênh, bán hàng hoặc Affiliate.
              </p>

              <div className="mt-8">
                <div className="flex items-end justify-center gap-4">
                  <span className="pb-2 text-sm font-bold text-zinc-300 line-through">899.000đ</span>
                  <span className="text-5xl font-black tracking-[-.045em] text-yellow-200 drop-shadow-[0_0_28px_rgba(250,204,21,.48)]">
                    149.000đ
                  </span>
                </div>
                <p className="mt-3 text-sm font-black text-yellow-100">Tiết kiệm 750.000đ</p>
              </div>

              <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-3">
                {benefits.map((benefit) => (
                  <span key={benefit} className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-100 sm:text-sm">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    {benefit}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={scrollToRegistration}
                className="mt-8 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 px-8 py-4 text-sm font-black text-white shadow-[0_18px_52px_rgba(239,68,68,.38)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(249,115,22,.5)]"
              >
                Đăng ký khóa học ngay →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes finalCtaIn {
          from { opacity: 0; transform: translateY(24px) scale(.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </section>
  );
}

export default function VideoAICoursePage() {
  const [activeCase, setActiveCase] = useState(0);
  const [activePart, setActivePart] = useState(0);

  return (
    <main className="min-h-screen scroll-smooth overflow-hidden bg-[#070707] text-white">
      <Header />
      <div className="h-[112px] md:h-[68px]" aria-hidden="true" />

      <section className="relative px-3 py-4 sm:px-6 sm:py-7 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-red-700/18 to-transparent" />
        <div className="absolute left-0 top-1/4 h-[520px] w-[220px] bg-red-700/16 blur-[90px]" />
        <div className="absolute right-0 top-1/3 h-[520px] w-[220px] bg-orange-500/14 blur-[90px]" />

        <div className="relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.65rem] border border-red-500/20 bg-[#070707] shadow-[0_0_0_1px_rgba(255,255,255,.04),0_45px_130px_rgba(0,0,0,.65)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(239,68,68,.32),transparent_30%),radial-gradient(circle_at_28%_40%,rgba(249,115,22,.18),transparent_32%),linear-gradient(135deg,rgba(48,7,12,.92),rgba(3,3,5,.98)_42%,rgba(25,5,5,.96))]" />
          <div className="absolute inset-0 opacity-[.18] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:34px_34px]" />
          <div className="absolute -bottom-32 left-[40%] h-[540px] w-[720px] -rotate-12 rounded-full border-[18px] border-red-500/18" />
          <div className="absolute -bottom-20 right-[12%] h-[390px] w-[640px] -rotate-12 rounded-full border-[2px] border-orange-400/35 blur-[1px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(255,255,255,.12),transparent_1.5px)] [background-size:22px_22px]" />

          <div className="relative grid min-h-0 items-center gap-6 px-4 py-8 sm:px-9 sm:py-10 lg:min-h-[650px] lg:grid-cols-[.48fr_.52fr] lg:gap-2 lg:px-14 lg:py-12">
            <div className="z-20 max-w-xl text-center lg:text-left">
              <p className="mb-3 text-base font-black uppercase tracking-[.38em] text-white/90 sm:text-2xl sm:tracking-[.5em]">Khóa học</p>
              <h1 className="text-[3.65rem] font-black uppercase leading-[.82] tracking-[-.08em] min-[380px]:text-[4.25rem] sm:text-[7rem] lg:text-[7.8rem] xl:text-[8.7rem]">
                <span className="bg-gradient-to-b from-red-500 via-orange-500 to-amber-300 bg-clip-text text-transparent drop-shadow-[0_0_28px_rgba(239,68,68,.48)]">Video AI</span>
              </h1>
              <div className="mx-auto mt-3 inline-flex skew-x-[-10deg] border-2 border-orange-400/90 px-7 py-1.5 shadow-[0_0_24px_rgba(249,115,22,.34)] lg:mx-0">
                <span className="skew-x-[10deg] text-lg font-black uppercase tracking-tight text-white min-[380px]:text-xl sm:text-3xl">Xây kênh & Kiếm Tiền Affiliate</span>
              </div>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-zinc-200 sm:text-base lg:mx-0">
                Không cần lộ mặt, không cần giỏi công nghệ, vẫn tự tạo video AI để xây kênh và làm Affiliate.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {featureItems.map(({ label, icon: Icon, color, border, glow }) => (
                  <div key={label} className="text-center">
                    <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full border bg-black/45 ${border} ${glow}`}>
                      <Icon className={`h-7 w-7 ${color}`} />
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-4 text-zinc-200">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-center gap-4 lg:justify-start">
                {socialItems.map(({ label, color }) => (
                  <span key={label} className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${color} text-xl font-black text-white shadow-[0_0_24px_rgba(255,255,255,.1)]`}>
                    {label}
                  </span>
                ))}
              </div>

              <div id="register" className="mx-auto mt-6 flex max-w-[390px] items-center gap-4 rounded-xl border border-orange-500/50 bg-black/58 p-3 shadow-[0_0_34px_rgba(249,115,22,.25)] backdrop-blur-md lg:mx-0">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-red-600 px-2 py-1 text-[10px] font-black uppercase text-white">Giảm 83%</span>
                    <span className="text-sm font-bold text-zinc-500 line-through">899.000đ</span>
                  </div>
                  <p className="mt-1 bg-gradient-to-r from-orange-300 to-red-500 bg-clip-text text-4xl font-black tracking-tight text-transparent">149.000đ</p>
                  <p className="text-xs font-semibold text-orange-200">Tiết kiệm 750.000đ</p>
                </div>
                <a href="#" className="rounded-lg bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 text-xs font-black uppercase text-white shadow-[0_0_24px_rgba(239,68,68,.44)] transition hover:-translate-y-0.5">
                  Đăng ký ngay →
                </a>
              </div>
            </div>

            <HeroGraphic />
          </div>
        </div>
      </section>
      <ProblemSection />
      <BeforeAfterSection />
      <CourseComparisonSection />
      <AudienceSection />
      <VideoUseCaseSection activeCase={activeCase} setActiveCase={setActiveCase} />
      <CurriculumSection activePart={activePart} setActivePart={setActivePart} />
      <MentorSection />
      <VideoResultsSection />
      <WhyNowSection />
      <RegistrationSection />
      <FAQSection />
      <FinalCTASection />
    </main>
  );
}
