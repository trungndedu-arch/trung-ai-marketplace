"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  BadgeCheck,
  Bot,
  Boxes,
  BrainCircuit,
  Camera,
  Check,
  ChevronDown,
  CreditCard,
  FileText,
  Flame,
  Gauge,
  GraduationCap,
  MessageSquareMore,
  Mic,
  MousePointer2,
  Play,
  QrCode,
  Rocket,
  Sparkles,
  Star,
  Trophy,
  Video,
  WandSparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const navItems = [
  ["hero", "Trang chủ"],
  ["problem", "Vấn đề"],
  ["audience", "Đối tượng"],
  ["examples", "Ví dụ"],
  ["curriculum", "Nội dung"],
  ["mentor", "Giảng viên"],
  ["faq", "FAQ"],
];

const tools = ["Video AI", "Prompt", "Thumbnail", "Review", "KOC", "Affiliate"];
const platforms = ["TikTok", "Facebook", "Instagram", "YouTube"];
const problems = [
  ["Mất hàng giờ để dựng 1 video", "Bạn học quy trình tạo video nhanh: ý tưởng → prompt → ảnh → video → đăng kênh."],
  ["Không biết bắt đầu từ đâu", "Lộ trình đi từ zero, không yêu cầu nền tảng kỹ thuật hay kinh nghiệm edit."],
  ["Prompt viết mãi không ra kết quả", "Có mẫu prompt, cách trích prompt và cách chỉnh prompt theo từng ngách."],
  ["Video không có hook", "Biết cách tạo mở đầu 3 giây, thumbnail và format ngắn dễ giữ chân người xem."],
  ["Không biết chọn ngách Affiliate", "Học cách chọn sản phẩm, biến insight thành nội dung và gắn affiliate hợp lý."],
  ["Công cụ AI quá nhiều", "Bạn chỉ dùng bộ công cụ cần thiết: Grok, Veo, Kling, ChatGPT và workflow phụ trợ."],
];
const beforeAfter = [
  ["0", "kênh AI", "Biết chọn format và dựng lịch nội dung ngắn hạn."],
  ["20+", "bài học", "Đi từ tư duy, công cụ đến case study affiliate thực chiến."],
  ["4", "nhóm công cụ", "Ảnh, video, prompt, tối ưu nội dung và bán hàng."],
  ["1", "quy trình", "Lặp lại được cho nhiều ngách: thời trang, sách, sản phẩm, sức khỏe."],
];
const comparisons = [
  ["Lộ trình", "Rời rạc, xem đâu học đó", "Theo chương, từ newbie đến video ra đơn"],
  ["Thực hành", "Nhiều lý thuyết, ít case", "Case thật: thời trang, ốp điện thoại, sách, nhạc cụ"],
  ["Affiliate", "Chỉ dạy tạo video", "Gắn với chọn ngách, sản phẩm và nội dung chuyển đổi"],
  ["Tài nguyên", "Tự tìm prompt/template", "Có prompt, workflow, thumbnail, character sheet"],
];
const audiences = [
  ["Người mới", "Muốn bắt đầu xây kênh bằng AI mà chưa biết dùng công cụ."],
  ["Affiliate Creator", "Muốn có video đều để bán sản phẩm không cần lộ mặt."],
  ["Chủ shop", "Muốn tự tạo video review, UGC, TVC ngắn cho sản phẩm."],
  ["Marketer", "Cần workflow nhanh để test nội dung TikTok, Reels, Shorts."],
  ["KOC/KOL AI", "Muốn xây nhân vật ảo, mẫu ảo, nội dung có tính nhận diện."],
  ["Freelancer", "Muốn thêm dịch vụ video AI, thumbnail AI, prompt AI cho khách."],
];
const examples = ["Fashion AI", "Talking Review", "Product UGC", "3D English", "Infographic", "Faceless Story"];
const lessons = [
  ["Chapter 01", "Gỡ bỏ rào cản - Hiểu đúng & làm quen với Video AI", [
    "Sự Thật Về Video AI: Cách Nó Giúp Bạn Kiếm Tiền Như Thế Nào?",
    "Tìm Hiểu Các Dạng Kênh AI Đang Cực Hot Hiện Nay",
    "Trọn Bộ Đồ Nghề: 4 Nhóm Công Cụ AI Cần Thiết Nhất Để Bắt Đầu",
    "Cài Đặt Tư Duy: Cách Học & Dùng AI Đơn Giản, Không Cần Giỏi Công Nghệ",
  ]],
  ["Chapter 02", "Thực Chiến: Quy Trình Cầm Tay Chỉ Việc Làm Video AI Ra Đơn", [
    "Tổng Quan Grok và Veo3 Tạo Video Siêu Nhanh, Siêu Dễ & Hiệu Quả",
    "Cách Làm Nội Dung AI Ngách Thời Trang Trẻ Em Hút Triệu Mẹ Bỉm",
    "Hướng Dẫn Dựng Video Hoạt Hình 3D Ngách Dạy Tiếng Anh",
    "Hướng Dẫn Dựng Video Hoạt Hình 3D Ngách Sức Khỏe Dễ Lên Xu Hướng",
    "Đừng Ngại Việc Đi Xin Prompt: Tuyệt Chiêu Trích Xuất Prompt Từ Bất Kỳ Bức Ảnh AI Nào",
    "Tự Làm Ảnh Bìa Thumbnail Bằng AI Cho TikTok Youtube Cực Bắt Mắt",
    "Xây Kênh Bán Sách Không Lộ Mặt",
    "Tự Tạo Mẫu Ảo (KOC AI) Riêng Cho Thương Hiệu Của Bạn",
    "Quy Trình Làm Affiliate Đồ Thể Thao Nam",
    "Làm Infographic Đẹp Mắt",
    "Làm Video AI Bán Thời Trang Trung Niên",
    "Làm Video AI Bán Nhạc Cụ",
    "Phép Màu AI: 1 Click Khôi Phục & Làm Nét Video Cũ",
    "Video AI Bán Ốp Điện Thoại",
    "Case Study Video Thời Trang Nữ",
    "Toàn Bộ Quy Trình Affiliate Thời Trang Nam",
  ]],
] as const;
const benefits = ["Prompt", "Chatbot", "Workflow", "Template", "Group", "Lifetime Update"];
const faqs = [
  ["Người mới hoàn toàn có học được không?", "Có. Khóa học được thiết kế cho người mới, ưu tiên thao tác rõ ràng và quy trình lặp lại được."],
  ["Tôi có cần lộ mặt không?", "Không. Bạn sẽ học nhiều format faceless như review sản phẩm, nhân vật AI, infographic và story video."],
  ["Có học Affiliate không?", "Có. Khóa học gắn Video AI với chọn ngách, chọn sản phẩm, tạo nội dung và tối ưu chuyển đổi."],
  ["Tôi có cần máy tính mạnh không?", "Không bắt buộc. Đa số công cụ dùng trên web, bạn chỉ cần internet ổn định."],
  ["Sau khi thanh toán nhận khóa học thế nào?", "Bạn bấm Tôi đã chuyển khoản, quét Zalo và gửi thông tin chuyển khoản để được kích hoạt."],
];

function useScrollUI() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("hero");
  const [mouse, setMouse] = useState({ x: 50, y: 20 });
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      const current = navItems.findLast(([id]) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top < 180 : false;
      });
      if (current) setActive(current[0]);
    };
    const onMouse = (event: MouseEvent) => setMouse({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);
  return { progress, active, mouse };
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Header({ active }: { active: string }) {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#090909]/72 backdrop-blur-2xl">
    <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-4 sm:px-6">
      <Link href="/" className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-orange-400 via-red-500 to-violet-600 shadow-[0_0_32px_rgba(249,115,22,.45)]"><Sparkles className="h-5 w-5 text-white" /></span>
        <span className="text-sm font-black tracking-[.18em] text-white">TRUNG AI STUDIO</span>
      </Link>
      <nav className="mx-auto hidden items-center gap-1 lg:flex">
        {navItems.map(([id, label]) => <button key={id} onClick={() => scrollToId(id)} className={`rounded-full px-3 py-2 text-xs font-bold transition ${active === id ? "bg-white text-black" : "text-zinc-400 hover:bg-white/10 hover:text-white"}`}>{label}</button>)}
      </nav>
      <div className="ml-auto hidden items-center gap-3 sm:flex">
        <div className="text-right text-xs leading-4"><p className="font-black text-white">149.000đ</p><p className="text-zinc-500 line-through">899.000</p></div>
        <button onClick={() => scrollToId("payment")} className="rounded-full bg-white px-4 py-2.5 text-xs font-black text-black transition hover:-translate-y-0.5 hover:bg-orange-100">Đăng ký ngay</button>
      </div>
    </div>
  </header>;
}

function AiIllustration({ compact = false }: { compact?: boolean }) {
  return <div className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111] shadow-[0_40px_140px_rgba(0,0,0,.5)] ${compact ? "h-72" : "min-h-[520px]"}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(249,115,22,.45),transparent_22%),radial-gradient(circle_at_82%_15%,rgba(168,85,247,.42),transparent_26%),radial-gradient(circle_at_50%_90%,rgba(239,68,68,.25),transparent_25%)]" />
    <div className="absolute inset-0 opacity-[.16] [background-image:linear-gradient(rgba(255,255,255,.24)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.24)_1px,transparent_1px)] [background-size:42px_42px]" />
    <div className="absolute left-[9%] top-[12%] w-[52%] rounded-3xl border border-white/15 bg-white/10 p-4 backdrop-blur-2xl transition duration-500 hover:-translate-y-2 hover:rotate-1">
      <div className="flex items-center justify-between"><span className="text-xs font-black text-white">Video Render</span><Play className="h-5 w-5 text-orange-200" /></div>
      <div className="mt-4 aspect-video rounded-2xl bg-gradient-to-br from-orange-300 via-red-500 to-violet-700" />
      <div className="mt-4 h-2 rounded-full bg-white/15"><span className="block h-full w-3/4 rounded-full bg-gradient-to-r from-orange-300 to-violet-300" /></div>
    </div>
    <div className="absolute right-[7%] top-[18%] w-[34%] rounded-3xl border border-white/15 bg-black/35 p-4 backdrop-blur-2xl transition duration-500 hover:-translate-y-2 hover:-rotate-1">
      <div className="mb-3 flex items-center gap-2 text-xs font-black text-white"><BrainCircuit className="h-4 w-4 text-violet-200" /> AI Nodes</div>
      {[1, 2, 3].map((item) => <div key={item} className="mb-2 flex items-center gap-2"><span className="h-8 w-8 rounded-full bg-white/15" /><span className="h-2 flex-1 rounded-full bg-white/10" /></div>)}
    </div>
    <div className="absolute bottom-[12%] left-[13%] right-[10%] rounded-3xl border border-white/15 bg-black/45 p-4 backdrop-blur-2xl">
      <div className="mb-3 flex items-center justify-between text-xs font-black text-white"><span>Timeline</span><span className="text-orange-200">00:18 / 00:30</span></div>
      <div className="grid grid-cols-6 gap-2">{Array.from({ length: 12 }).map((_, index) => <span key={index} className={`h-12 rounded-xl ${index % 3 === 0 ? "bg-orange-300/60" : index % 3 === 1 ? "bg-violet-300/55" : "bg-white/15"}`} />)}</div>
    </div>
    <div className="absolute bottom-[30%] right-[18%] grid h-24 w-24 place-items-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-xl"><Camera className="h-9 w-9 text-white" /></div>
    <div className="absolute left-[22%] top-[50%] grid h-20 w-20 place-items-center rounded-full border border-white/15 bg-black/35 backdrop-blur-xl"><Mic className="h-8 w-8 text-orange-100" /></div>
  </div>;
}

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return <div className="mx-auto mb-10 max-w-3xl text-center">
    <p className="text-xs font-black uppercase tracking-[.28em] text-orange-300">{eyebrow}</p>
    <h2 className="mt-3 text-3xl font-black tracking-[-.04em] text-white sm:text-5xl">{title}</h2>
    {desc && <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{desc}</p>}
  </div>;
}

function GlowCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.035] shadow-[0_24px_80px_rgba(0,0,0,.24)] transition duration-500 hover:-translate-y-2 hover:border-orange-300/35 hover:bg-white/[0.06] ${className}`}>
    <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gradient-to-br from-orange-500/20 to-violet-500/20 blur-3xl transition group-hover:scale-150" />
    <div className="relative">{children}</div>
  </div>;
}

function PaymentModal({ close }: { close: () => void }) {
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-4 backdrop-blur-xl">
    <div className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#111] p-5 shadow-[0_40px_140px_rgba(168,85,247,.35)] sm:p-7">
      <button onClick={close} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white"><X className="h-5 w-5" /></button>
      <p className="text-xs font-black uppercase tracking-[.25em] text-orange-300">Kết nối Zalo</p>
      <h3 className="mt-2 text-2xl font-black text-white">Quét Zalo để xác nhận khóa học</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-400">Sau khi chuyển khoản, hãy gửi ảnh biên lai hoặc nội dung chuyển khoản để được kích hoạt quyền học.</p>
      <div className="mt-5 rounded-[1.4rem] bg-white p-3"><Image src="/images/video-ai-course-zalo-qr.png" alt="QR Zalo Trung AI Studio" width={900} height={1200} className="w-full rounded-2xl" /></div>
      <button onClick={close} className="mt-5 w-full rounded-2xl bg-white py-3 text-sm font-black text-black">Đóng</button>
    </div>
  </div>;
}

export default function VideoAICoursePage() {
  const { progress, active, mouse } = useScrollUI();
  const [openChapter, setOpenChapter] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Khóa Học Video AI - Xây Kênh & Làm Affiliate Từ Số 0",
    description: "Khóa học Video AI thực chiến cho người mới xây kênh TikTok, YouTube Shorts, Facebook Reels và làm Affiliate không cần lộ mặt.",
    provider: { "@type": "Organization", name: "Trung AI Studio" },
    offers: { "@type": "Offer", price: "149000", priceCurrency: "VND", availability: "https://schema.org/InStock" },
  }), []);

  return <div className="min-h-screen bg-[#090909] text-zinc-200 selection:bg-orange-300 selection:text-black">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div className="fixed left-0 top-0 z-[60] h-1 bg-gradient-to-r from-orange-400 via-red-500 to-violet-500" style={{ width: `${progress}%` }} />
    <div className="pointer-events-none fixed inset-0 z-0" style={{ background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(249,115,22,.18), transparent 26%), radial-gradient(circle at 80% 20%, rgba(168,85,247,.12), transparent 28%)` }} />
    <div className="pointer-events-none fixed inset-0 z-0 opacity-[.05] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:64px_64px]" />
    <Header active={active} />
    {paymentOpen && <PaymentModal close={() => setPaymentOpen(false)} />}

    <main className="relative z-10">
      <section id="hero" className="mx-auto grid min-h-screen max-w-[1440px] items-center gap-10 px-4 pb-16 pt-28 sm:px-6 lg:grid-cols-[.95fr_1.05fr]">
        <div className="animate-[fadeUp_.8s_ease_both]">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300/20 bg-orange-300/10 px-4 py-2 text-xs font-black uppercase tracking-[.24em] text-orange-200"><Flame className="h-4 w-4" /> Video AI thực chiến</div>
          <h1 className="mt-6 max-w-3xl text-5xl font-black uppercase leading-[.92] tracking-[-.07em] text-white sm:text-7xl xl:text-8xl">Xây kênh & làm affiliate từ số 0 bằng Video AI</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">Tạo video AI, prompt, thumbnail, review, KOC ảo và hệ thống nội dung TikTok / Facebook / YouTube Shorts mà không cần lộ mặt.</p>
          <div className="mt-7 flex flex-wrap gap-2">{tools.map((tool) => <span key={tool} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-zinc-200"><Check className="mr-1 inline h-3.5 w-3.5 text-orange-200" />{tool}</span>)}</div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[.16em] text-zinc-500">{platforms.map((item) => <span key={item} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">{item}</span>)}</div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button onClick={() => scrollToId("payment")} className="rounded-2xl bg-white px-7 py-4 text-sm font-black text-black shadow-[0_18px_80px_rgba(255,255,255,.15)] transition hover:-translate-y-1 hover:bg-orange-100">Đăng ký ngay</button>
            <button onClick={() => scrollToId("curriculum")} className="rounded-2xl border border-white/10 bg-white/[0.04] px-7 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/[0.08]">Xem nội dung học</button>
            <div className="sm:ml-4"><p className="text-3xl font-black text-white">149.000đ</p><p className="text-sm font-bold text-zinc-500 line-through">899.000</p></div>
          </div>
        </div>
        <div className="animate-[fadeUp_1s_.1s_ease_both]"><AiIllustration /></div>
      </section>

      <section id="problem" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle eyebrow="Điểm nghẽn" title="Video vẫn là điểm nghẽn lớn nhất" desc="Không phải bạn thiếu ý tưởng. Bạn thiếu một hệ thống đủ nhanh, đủ đẹp và đủ dễ nhân bản." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{problems.map(([title, desc], index) => <GlowCard key={title} className="p-6"><div className="mb-8 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-orange-400/25 to-violet-500/20"><Zap className="h-7 w-7 text-orange-200" /></div><h3 className="text-xl font-black text-white">{title}</h3><p className="mt-3 text-sm leading-7 text-zinc-400">{desc}</p><div className="mt-6 h-2 rounded-full bg-white/10"><span className="block h-full rounded-full bg-gradient-to-r from-orange-300 to-violet-400" style={{ width: `${50 + index * 7}%` }} /></div></GlowCard>)}</div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle eyebrow="Trước và sau" title="Từ mơ hồ thành quy trình rõ ràng" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{beforeAfter.map(([num, label, desc]) => <GlowCard key={label} className="p-6 text-center"><p className="text-5xl font-black text-white">{num}</p><p className="mt-2 font-black text-orange-200">{label}</p><p className="mt-3 text-sm leading-6 text-zinc-500">{desc}</p></GlowCard>)}</div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle eyebrow="So sánh" title="Khóa khác VS Trung AI Studio" />
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035]">
            {comparisons.map(([row, other, trung]) => <div key={row} className="grid border-b border-white/10 last:border-b-0 md:grid-cols-[.7fr_1fr_1fr]"><div className="p-5 font-black text-white">{row}</div><div className="p-5 text-sm text-zinc-500">{other}</div><div className="bg-gradient-to-r from-orange-500/10 to-violet-500/10 p-5 text-sm font-bold text-zinc-100"><BadgeCheck className="mr-2 inline h-4 w-4 text-orange-200" />{trung}</div></div>)}
          </div>
        </div>
      </section>

      <section id="audience" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle eyebrow="Phù hợp" title="Khóa học này dành cho bạn nếu..." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{audiences.map(([title, desc], index) => <GlowCard key={title} className="p-4"><AiIllustration compact /><div className="p-3"><h3 className="text-xl font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{desc}</p></div></GlowCard>)}</div>
        </div>
      </section>

      <section id="examples" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle eyebrow="Ví dụ thực tế" title="Video Carousel dạng mockup điện thoại" desc="Các format được thiết kế để xem nhanh, hiểu nhanh và dễ nhân bản cho nhiều ngách." />
          <div className="flex snap-x gap-5 overflow-x-auto pb-6">{examples.map((item, index) => <div key={item} className="w-[290px] flex-none snap-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-3 shadow-2xl transition hover:-translate-y-2"><div className="rounded-[1.7rem] border border-white/10 bg-black p-2"><div className="relative aspect-[9/16] overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-orange-300 via-red-500 to-violet-800"><div className="absolute inset-0 grid place-items-center"><span className="grid h-16 w-16 place-items-center rounded-full bg-white/20 backdrop-blur-xl"><Play className="h-8 w-8 text-white" /></span></div><div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/40 p-3 backdrop-blur-xl"><p className="text-sm font-black text-white">{item}</p><p className="mt-1 text-xs text-zinc-300">Mockup #{index + 1}</p></div></div></div></div>)}</div>
        </div>
      </section>

      <section id="curriculum" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <SectionTitle eyebrow="Nội dung" title="Toàn bộ chương trình học" desc="Accordion có progress để bạn nhìn ngay lộ trình học từ tư duy đến thực chiến." />
          <div className="space-y-4">{lessons.map(([chapter, title, items], chapterIndex) => <GlowCard key={chapter}><button onClick={() => setOpenChapter(openChapter === chapterIndex ? -1 : chapterIndex)} className="flex w-full items-center gap-4 p-5 text-left"><span className="grid h-12 w-12 flex-none place-items-center rounded-2xl bg-orange-300 text-sm font-black text-black">{chapterIndex + 1}</span><span className="flex-1"><span className="block text-xs font-black uppercase tracking-[.22em] text-orange-200">{chapter}</span><span className="mt-1 block text-lg font-black text-white">{title}</span></span><ChevronDown className={`h-5 w-5 transition ${openChapter === chapterIndex ? "rotate-180" : ""}`} /></button>{openChapter === chapterIndex && <div className="px-5 pb-5"><div className="mb-5 h-2 rounded-full bg-white/10"><span className="block h-full rounded-full bg-gradient-to-r from-orange-300 to-violet-400" style={{ width: chapterIndex === 0 ? "20%" : "100%" }} /></div><div className="grid gap-3">{items.map((item, index) => <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-black/25 p-4"><span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-white/10 text-xs font-black text-orange-200">{chapterIndex === 0 ? index + 1 : index + 5}</span><p className="text-sm font-bold leading-6 text-zinc-200">{item}</p></div>)}</div></div>}</GlowCard>)}</div>
        </div>
      </section>

      <section id="mentor" className="px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] items-center gap-6 lg:grid-cols-[.9fr_1.1fr]">
          <GlowCard className="p-4"><AiIllustration compact /></GlowCard>
          <div><p className="text-xs font-black uppercase tracking-[.28em] text-orange-300">Giảng viên</p><h2 className="mt-3 text-4xl font-black tracking-[-.04em] text-white">Trung AI Studio</h2><p className="mt-4 text-base leading-8 text-zinc-400">Hướng dẫn theo phong cách thực chiến: ít lý thuyết, nhiều workflow, tập trung vào kết quả có thể đăng kênh và triển khai affiliate.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{["Prompt", "Video", "Affiliate"].map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 font-black text-white">{item}</div>)}</div></div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1440px]">
          <SectionTitle eyebrow="Kết quả học viên" title="Mockup video, chỉ số và nội dung có thể nhân bản" />
          <div className="grid gap-4 md:grid-cols-3">{["Kênh faceless", "Video review", "Affiliate content"].map((item, index) => <GlowCard key={item} className="p-5"><AiIllustration compact /><p className="mt-4 text-xl font-black text-white">{item}</p><p className="mt-2 text-sm text-zinc-500">Carousel mockup kết quả #{index + 1}</p></GlowCard>)}</div>
        </div>
      </section>

      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <SectionTitle eyebrow="Tại sao học ngay" title="Video AI đang là lợi thế tốc độ" />
          <div className="grid gap-4 md:grid-cols-3">{[["Nhanh", Gauge], ["Đúng xu hướng", Rocket], ["Có tài nguyên", Trophy]].map(([label, Icon]) => <GlowCard key={label as string} className="p-7"><Icon className="h-9 w-9 text-orange-200" /><h3 className="mt-6 text-2xl font-black text-white">{label as string}</h3><p className="mt-3 text-sm leading-7 text-zinc-500">Học một lần, dùng lại workflow cho nhiều kênh và nhiều sản phẩm.</p></GlowCard>)}</div>
        </div>
      </section>

      <section id="payment" className="px-4 py-24 sm:px-6">
        <div className="mx-auto grid max-w-[1200px] gap-5 lg:grid-cols-[.95fr_1.05fr]">
          <GlowCard className="p-7"><p className="text-xs font-black uppercase tracking-[.25em] text-orange-300">Quyền lợi</p><h2 className="mt-3 text-4xl font-black text-white">Nhận trọn bộ tài nguyên học và triển khai</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{benefits.map((item) => <div key={item} className="rounded-2xl border border-white/10 bg-black/25 p-4 font-black text-white"><Check className="mr-2 inline h-4 w-4 text-orange-200" />{item}</div>)}</div></GlowCard>
          <GlowCard className="p-5"><div className="flex items-center gap-3"><QrCode className="h-6 w-6 text-orange-200" /><h3 className="text-2xl font-black text-white">Thanh toán</h3></div><div className="mt-5 grid gap-5 md:grid-cols-[.92fr_1.08fr]"><div className="rounded-[1.4rem] bg-white p-3"><Image src="/images/video-ai-course-payment-qr.png" alt="QR thanh toán khóa học Video AI" width={900} height={1200} className="w-full rounded-2xl" /></div><div className="space-y-3">{[["Giá hôm nay", "149.000đ"], ["Giá cũ", "899.000"], ["STK", "0865103062"], ["Ngân hàng", "NH Quốc Tế VIB"], ["Chủ TK", "NGUYỄN ĐỨC TRUNG"], ["Nội dung CK", "HOC VIDEO AI"]].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-black/25 p-3"><p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</p><p className={`mt-1 font-black ${label === "Giá cũ" ? "text-zinc-500 line-through" : "text-white"}`}>{value}</p></div>)}<button onClick={() => setPaymentOpen(true)} className="w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-black transition hover:-translate-y-1 hover:bg-orange-100"><CreditCard className="mr-2 inline h-4 w-4" />Tôi đã chuyển khoản</button></div></div></GlowCard>
        </div>
      </section>

      <section id="faq" className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <SectionTitle eyebrow="FAQ" title="Câu hỏi thường gặp" />
          <div className="space-y-3">{faqs.map(([question, answer], index) => <GlowCard key={question}><button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left"><span className="font-black text-white">{question}</span><ChevronDown className={`h-5 w-5 transition ${openFaq === index ? "rotate-180" : ""}`} /></button>{openFaq === index && <p className="px-5 pb-5 text-sm leading-7 text-zinc-400">{answer}</p>}</GlowCard>)}</div>
        </div>
      </section>

      <section className="px-4 pb-32 pt-10 sm:px-6">
        <div className="mx-auto max-w-[1200px] rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,.3),transparent_35%),linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02))] p-8 text-center shadow-[0_40px_160px_rgba(249,115,22,.18)] sm:p-14">
          <p className="text-xs font-black uppercase tracking-[.28em] text-orange-200">Bắt đầu hôm nay</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-[-.05em] text-white sm:text-6xl">Xây kênh Video AI đầu tiên của bạn với chi phí chỉ 149.000đ</h2>
          <button onClick={() => scrollToId("payment")} className="mt-8 rounded-[1.5rem] bg-white px-10 py-5 text-base font-black text-black shadow-[0_20px_90px_rgba(255,255,255,.2)] transition hover:-translate-y-1 hover:bg-orange-100">Đăng ký ngay</button>
        </div>
      </section>
    </main>

    <button onClick={() => scrollToId("hero")} className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/10 text-white backdrop-blur-xl transition hover:bg-white/20"><ArrowUp className="h-5 w-5" /></button>
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-white/10 bg-[#111]/85 p-3 shadow-2xl backdrop-blur-2xl sm:hidden"><button onClick={() => scrollToId("payment")} className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-sm font-black text-black"><span>Đăng ký 149.000đ</span><span className="text-zinc-500 line-through">899.000</span></button></div>
    <style jsx global>{`
      html { scroll-behavior: smooth; }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(28px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; animation: none !important; transition: none !important; } }
    `}</style>
  </div>;
}
