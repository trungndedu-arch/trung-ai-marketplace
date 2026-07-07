"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Bell,
  Bot,
  Boxes,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlay,
  Clock3,
  Copy,
  CreditCard,
  GraduationCap,
  Heart,
  Home,
  Menu,
  MessageSquareMore,
  Play,
  QrCode,
  Sparkles,
  Store,
  Workflow,
  X,
  Zap,
} from "lucide-react";

const links = [
  { label: "Khám phá", icon: Home, href: "/" },
  { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts" },
  { label: "Chatbot", icon: Bot, href: "/#products" },
  { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course", active: true },
  { label: "Workflow", icon: Workflow, href: "/#products" },
  { label: "AI Apps", icon: Boxes, href: "/#products" },
];

const painPoints = [
  ["Tạo video quá lâu", "Không còn mò từng công cụ, bạn học quy trình đi từ ý tưởng đến video hoàn chỉnh."],
  ["Không biết bắt đầu", "Lộ trình cho người mới, không cần giỏi kỹ thuật hay từng làm nội dung."],
  ["Không biết dùng AI", "Biết chọn Grok, Veo 3, Kling, ChatGPT, Midjourney đúng việc."],
  ["Không biết Affiliate", "Hiểu cách chọn ngách, tạo nội dung, gắn sản phẩm và tối ưu chuyển đổi."],
  ["Không biết viết Prompt", "Có mẫu prompt, workflow và cách trích prompt từ ảnh/video có sẵn."],
];

const outcomes = ["Video AI", "Thumbnail", "Prompt", "Character Sheet", "Workflow", "Affiliate", "Landing Page", "Chatbot"];

const videoTypes = [
  ["One Shot Fashion", "Biến ảnh thời trang thành video ngắn có chuyển động mượt và thần thái cao cấp.", "from-fuchsia-500 via-violet-700 to-zinc-950"],
  ["Talking AI", "Tạo nhân vật AI biết nói cho review, giáo dục, bán hàng và nội dung faceless.", "from-cyan-400 via-blue-700 to-zinc-950"],
  ["3D Animation", "Dựng video hoạt hình 3D cho ngách tiếng Anh, sức khỏe và nội dung trẻ em.", "from-orange-300 via-rose-600 to-zinc-950"],
  ["Product Review", "Tạo video review sản phẩm bắt mắt cho affiliate và bán hàng online.", "from-emerald-300 via-teal-700 to-zinc-950"],
  ["Luxury UGC", "Video UGC cao cấp như quay studio thật, phù hợp mỹ phẩm, phụ kiện, thời trang.", "from-amber-200 via-pink-600 to-zinc-950"],
  ["AI Idol", "Xây nhân vật ảo đồng nhất để xuất hiện trong nhiều video và chiến dịch.", "from-violet-300 via-indigo-700 to-zinc-950"],
  ["Infographic", "Chuyển dữ liệu và insight thành video infographic rõ ràng, dễ xem, dễ viral.", "from-sky-300 via-violet-700 to-zinc-950"],
  ["Story Video", "Biến kịch bản ngắn thành câu chuyện video có nhịp, hook và ending rõ.", "from-lime-200 via-emerald-700 to-zinc-950"],
  ["Faceless Video", "Làm kênh không lộ mặt cho TikTok, Facebook Reels và YouTube Shorts.", "from-slate-200 via-slate-700 to-zinc-950"],
  ["Commercial Video", "Tạo video quảng cáo ngắn, rõ lợi ích, phù hợp chạy nội dung bán hàng.", "from-red-300 via-purple-700 to-zinc-950"],
  ["AI TVC", "Tạo concept TVC bằng AI với storyboard, cảnh quay, voice và nhạc nền.", "from-yellow-200 via-orange-700 to-zinc-950"],
  ["Veo / Kling Video", "Tận dụng Veo 3 và Kling để render cảnh đẹp, chuyển động điện ảnh.", "from-blue-300 via-fuchsia-700 to-zinc-950"],
  ["Viral TikTok", "Tối ưu hook 3 giây đầu, format ngắn và template dễ nhân bản.", "from-pink-300 via-red-600 to-zinc-950"],
];

const modules = [
  {
    title: "Module 1",
    subtitle: "Gỡ bỏ rào cản - Hiểu đúng & làm quen với Video AI",
    lessons: [
      "Sự Thật Về Video AI: Cách Nó Giúp Bạn Kiếm Tiền Như Thế Nào?",
      "Tìm Hiểu Các Dạng Kênh AI Đang Cực Hot Hiện Nay",
      "Trọn Bộ Đồ Nghề: 4 Nhóm Công Cụ AI Cần Thiết Nhất Để Bắt Đầu",
      "Cài Đặt Tư Duy: Cách Học & Dùng AI Đơn Giản, Không Cần Giỏi Công Nghệ",
    ],
  },
  {
    title: "Module 2",
    subtitle: "Thực Chiến: Quy Trình Cầm Tay Chỉ Việc Làm Video AI Ra Đơn",
    lessons: [
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
    ],
  },
];

const bonuses = ["Prompt", "Workflow", "Chatbot", "Template", "Character Sheet", "Thumbnail", "Infographic"];
const faqs = [
  ["Người mới hoàn toàn có học được không?", "Có. Khóa học được thiết kế theo kiểu cầm tay chỉ việc, ưu tiên quy trình đơn giản và có mẫu để làm theo."],
  ["Tôi có cần lộ mặt để xây kênh không?", "Không. Bạn sẽ học nhiều dạng nội dung faceless như video AI, review sản phẩm, nhân vật AI, infographic và story video."],
  ["Khóa học có phù hợp làm Affiliate không?", "Có. Nội dung tập trung vào xây kênh, chọn ngách, tạo video bán hàng và triển khai affiliate từ số 0."],
  ["Cần máy tính mạnh không?", "Không bắt buộc. Phần lớn công cụ chạy trên web, bạn chỉ cần thiết bị ổn định và kết nối internet."],
];

function Brand() {
  return <Link href="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-glow"><Sparkles className="h-5 w-5 text-white" /></span><span className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <b className="text-violet-400">Studio</b></span></Link>;
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  return <>
    {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#0c0b12]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center justify-between px-2"><Brand /><button aria-label="Đóng menu" onClick={close} className="text-zinc-400 lg:hidden"><X className="h-5 w-5" /></button></div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Khám phá</p>
      <nav className="space-y-1">{links.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-violet-500/15 text-violet-300" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`}><Icon className={`h-[18px] w-[18px] ${active ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />}</Link>)}</nav>
      <div className="my-6 h-px bg-white/[0.06]" />
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Cá nhân</p>
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-zinc-500" /> Yêu thích</button>
      <div className="mt-auto rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/[0.04] p-4"><div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-violet-500/20"><Store className="h-[18px] w-[18px] text-violet-300" /></div><p className="text-sm font-bold text-white">Trở thành creator</p><p className="mt-1 text-xs leading-5 text-zinc-500">Chia sẻ sản phẩm AI với cộng đồng.</p><button className="mt-3 flex items-center gap-1 text-xs font-bold text-violet-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button></div>
    </aside>
  </>;
}

function Header({ openMenu }: { openMenu: () => void }) {
  return <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-[#080711]/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
    <button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 lg:hidden"><Menu className="h-5 w-5" /></button>
    <span className="hidden md:block lg:hidden"><Brand /></span>
    <div className="flex-1" />
    <a href="#pricing" className="hidden rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-xs font-black uppercase tracking-[.18em] text-violet-200 transition hover:bg-violet-500/20 sm:block">Ưu đãi 149K</a>
    <button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-fuchsia-500" /></button>
  </header>;
}

function SectionTitle({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return <div className="mx-auto mb-9 max-w-3xl text-center">
    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-violet-300">{kicker}</p>
    <h2 className="mt-3 text-3xl font-black tracking-[-.04em] text-white sm:text-4xl lg:text-5xl">{title}</h2>
    {desc && <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{desc}</p>}
  </div>;
}

function Artwork({ label, variant = 0, large = false }: { label: string; variant?: number; large?: boolean }) {
  const gradients = [
    "from-violet-500 via-fuchsia-500 to-cyan-400",
    "from-cyan-300 via-blue-500 to-violet-700",
    "from-orange-300 via-pink-500 to-violet-800",
    "from-emerald-300 via-teal-500 to-violet-900",
  ];
  return <div className={`relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br ${gradients[variant % gradients.length]} shadow-[0_24px_80px_rgba(88,28,135,.35)] ${large ? "min-h-[380px] sm:min-h-[520px]" : "h-56"}`}>
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.65),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,.22),transparent_20%),linear-gradient(to_bottom,rgba(0,0,0,.04),rgba(0,0,0,.68))]" />
    <div className="absolute left-6 top-6 h-28 w-28 rounded-[2rem] border border-white/20 bg-white/15 blur-[1px]" />
    <div className="absolute right-6 top-10 h-20 w-40 rounded-3xl border border-white/20 bg-black/25 backdrop-blur-md" />
    <div className="absolute bottom-8 left-7 right-7 rounded-[1.35rem] border border-white/15 bg-black/35 p-4 shadow-2xl backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <span className="h-16 rounded-xl bg-white/20" />
        <span className="h-16 rounded-xl bg-white/10" />
        <span className="h-16 rounded-xl bg-white/20" />
      </div>
      <div className="mt-3 h-2 rounded-full bg-white/25" />
      <div className="mt-2 h-2 w-2/3 rounded-full bg-white/15" />
    </div>
    <div className="absolute inset-x-0 top-1/2 mx-auto grid h-24 w-24 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-white/15 text-center text-[10px] font-black uppercase tracking-widest text-white shadow-2xl backdrop-blur-xl">{label}</div>
  </div>;
}

function VideoCard({ name, desc, gradient, index }: { name: string; desc: string; gradient: string; index: number }) {
  return <article className="group overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-2 shadow-[0_20px_70px_rgba(0,0,0,.32)] transition duration-500 hover:-translate-y-2 hover:border-violet-300/40 hover:bg-white/[0.06]">
    <div className={`relative h-64 overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${gradient}`}>
      <Artwork label={`AI ${index + 1}`} variant={index} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md">
        <span className="text-xs font-bold text-white">Preview Render</span>
        <span className="h-2 w-20 overflow-hidden rounded-full bg-white/15"><span className="block h-full w-2/3 rounded-full bg-violet-300" /></span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="text-lg font-black text-white transition group-hover:text-violet-200">{name}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{desc}</p>
    </div>
  </article>;
}

function PaymentModal({ close }: { close: () => void }) {
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-black/75 p-4 backdrop-blur-md">
    <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-violet-300/20 bg-[#111019] p-5 shadow-[0_30px_120px_rgba(124,58,237,.35)] sm:p-7">
      <button onClick={close} aria-label="Đóng" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10"><X className="h-5 w-5" /></button>
      <div className="pr-10">
        <p className="text-[11px] font-black uppercase tracking-[.24em] text-violet-300">Kết nối sau thanh toán</p>
        <h3 className="mt-2 text-2xl font-black text-white">Quét Zalo để xác nhận khóa học</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-400">Sau khi chuyển khoản, bạn quét mã Zalo bên dưới và gửi ảnh biên lai/nội dung chuyển khoản để được kích hoạt quyền học.</p>
      </div>
      <div className="mt-5 rounded-[1.5rem] bg-white p-3">
        <Image src="/images/video-ai-course-zalo-qr.png" alt="QR Zalo Trung Video AI MKT" width={900} height={1200} className="w-full rounded-[1rem]" />
      </div>
      <button onClick={close} className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-violet-100">Đóng</button>
    </div>
  </div>;
}

export default function VideoAICoursePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openModule, setOpenModule] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);
  const [paymentOpen, setPaymentOpen] = useState(false);

  return <div className="min-h-screen bg-[#07060d] text-zinc-200">
    <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />
    {paymentOpen && <PaymentModal close={() => setPaymentOpen(false)} />}
    <div className="lg:pl-[252px]">
      <Header openMenu={() => setMenuOpen(true)} />
      <main className="overflow-hidden">
        <section className="relative px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-violet-700/25 blur-[140px]" />
          <div className="mx-auto grid max-w-[1500px] items-center gap-8 rounded-[2.3rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(24,19,39,.96),rgba(8,7,17,.96))] p-5 shadow-[0_30px_120px_rgba(0,0,0,.45)] sm:p-8 lg:grid-cols-[1.02fr_.98fr] lg:p-12">
            <div className="relative z-10">
              <span className="inline-flex rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-[10px] font-black uppercase tracking-[.22em] text-violet-200">HỌC LÀM VIDEO AI CÙNG TRUNG</span>
              <h1 className="mt-6 max-w-4xl text-4xl font-black uppercase leading-[.95] tracking-[-.06em] text-white sm:text-6xl xl:text-7xl">Xây kênh & làm Affiliate <span className="block bg-gradient-to-r from-violet-200 via-fuchsia-300 to-cyan-200 bg-clip-text text-transparent">từ số 0 bằng Video AI</span></h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">Học cách tạo ảnh AI, video AI, thumbnail AI, xây kênh TikTok, Youtube Shorts và kiếm tiền Affiliate mà không cần lộ mặt.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#pricing" className="rounded-2xl bg-white px-6 py-4 text-center text-sm font-black text-zinc-950 shadow-[0_18px_60px_rgba(255,255,255,.18)] transition hover:-translate-y-1 hover:bg-violet-100">Đăng ký ngay</a>
                <a href="#curriculum" className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-center text-sm font-black text-white backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/[0.08]">Xem chương trình học</a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-xl">
                {["TikTok", "Shorts", "Affiliate"].map((item) => <div key={item} className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 text-center"><p className="text-lg font-black text-white">{item}</p><p className="mt-1 text-[11px] text-zinc-500">Video AI</p></div>)}
              </div>
            </div>
            <div className="relative">
              <Artwork label="AI VIDEO STUDIO" variant={1} large />
              <div className="absolute -bottom-5 left-5 right-5 rounded-[1.6rem] border border-white/10 bg-black/45 p-4 backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-3">
                  <div><p className="text-xs font-black uppercase tracking-widest text-violet-200">Rendering</p><p className="mt-1 text-sm font-bold text-white">Veo 3 • Kling • Grok • Midjourney</p></div>
                  <CirclePlay className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <SectionTitle kicker="Nỗi đau" title="Bạn không thiếu ý tưởng — bạn thiếu quy trình đúng" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {painPoints.map(([title, desc], index) => <article key={title} className="group rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] p-3 transition hover:-translate-y-1 hover:bg-white/[0.06]">
                <Artwork label={`Problem ${index + 1}`} variant={index} />
                <div className="p-3"><h3 className="text-lg font-black text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-zinc-500">{desc}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px] rounded-[2rem] border border-violet-300/10 bg-gradient-to-br from-violet-500/10 to-transparent p-6 sm:p-10">
            <SectionTitle kicker="Sau khóa học" title="Bạn sẽ tự tạo được hệ sinh thái nội dung AI" desc="Từ prompt, hình ảnh, thumbnail, video, nhân vật đồng nhất đến workflow kiếm tiền affiliate." />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {outcomes.map((item, index) => <div key={item} className="group rounded-[1.5rem] border border-white/[0.08] bg-[#111019]/80 p-3 transition hover:-translate-y-1 hover:border-violet-300/30">
                <Artwork label={item} variant={index} />
                <div className="mt-4 flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-violet-400/15 text-violet-200"><Check className="h-4 w-4" /></span><p className="font-black text-white">{item}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <SectionTitle kicker="Video AI Formats" title="Các dạng Video AI sẽ học" desc="Không học lý thuyết lan man. Mỗi format đều hướng tới xây kênh, tạo nội dung đều và có thể bán hàng/affiliate." />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {videoTypes.map(([name, desc, gradient], index) => <VideoCard key={name} name={name} desc={desc} gradient={gradient} index={index} />)}
            </div>
          </div>
        </section>

        <section id="curriculum" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <SectionTitle kicker="Chương trình học" title="Lộ trình từ hiểu đúng đến thực chiến ra video" />
            <div className="relative space-y-5 before:absolute before:left-5 before:top-8 before:h-[calc(100%-4rem)] before:w-px before:bg-violet-300/20">
              {modules.map((module, moduleIndex) => <article key={module.title} className="relative rounded-[1.8rem] border border-white/[0.08] bg-white/[0.035] p-4 backdrop-blur-xl">
                <button onClick={() => setOpenModule(openModule === moduleIndex ? -1 : moduleIndex)} className="flex w-full items-center gap-4 text-left">
                  <span className="relative z-10 grid h-10 w-10 flex-none place-items-center rounded-full bg-violet-500 text-sm font-black text-white shadow-[0_0_28px_rgba(139,92,246,.65)]">{moduleIndex + 1}</span>
                  <span className="flex-1"><span className="block text-xl font-black text-white">{module.title}</span><span className="mt-1 block text-sm leading-6 text-zinc-400">{module.subtitle}</span></span>
                  <ChevronDown className={`h-5 w-5 text-zinc-400 transition ${openModule === moduleIndex ? "rotate-180" : ""}`} />
                </button>
                {openModule === moduleIndex && <div className="ml-14 mt-5 grid gap-3">
                  {module.lessons.map((lesson, index) => <div key={lesson} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4 transition hover:border-violet-300/30 hover:bg-violet-500/10">
                    <span className="grid h-8 w-8 flex-none place-items-center rounded-xl bg-white/[0.06] text-xs font-black text-violet-200">{moduleIndex === 0 ? index + 1 : index + 5}</span>
                    <div><p className="text-xs font-black uppercase tracking-widest text-zinc-500">Bài {moduleIndex === 0 ? index + 1 : index + 5}</p><p className="mt-1 text-sm font-bold leading-6 text-zinc-100">{lesson}</p></div>
                  </div>)}
                </div>}
              </article>)}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1500px]">
            <SectionTitle kicker="Bonus" title="Bộ tài nguyên giúp bạn làm nhanh hơn" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {bonuses.map((bonus, index) => <div key={bonus} className="rounded-[1.5rem] border border-white/[0.08] bg-white/[0.035] p-3 transition hover:-translate-y-1 hover:bg-white/[0.06]"><Artwork label={bonus} variant={index} /><p className="mt-4 px-2 pb-2 text-lg font-black text-white">{bonus}</p></div>)}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[1180px] gap-6 lg:grid-cols-[.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent p-7">
              <p className="text-[11px] font-black uppercase tracking-[.24em] text-violet-200">Ưu đãi mở bán</p>
              <h2 className="mt-3 text-4xl font-black tracking-[-.05em] text-white sm:text-5xl">Học Video AI chỉ với</h2>
              <div className="mt-6 flex items-end gap-4"><span className="text-2xl font-black text-zinc-500 line-through">899.000</span><span className="text-6xl font-black tracking-[-.06em] text-white">149.000</span></div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {["02 ngày", "18 giờ", "45 phút"].map((time) => <div key={time} className="rounded-2xl border border-white/10 bg-black/25 p-4 text-center"><Clock3 className="mx-auto mb-2 h-5 w-5 text-violet-200" /><p className="text-sm font-black text-white">{time}</p></div>)}
              </div>
              <a href="#payment" className="mt-7 block rounded-2xl bg-white px-6 py-4 text-center text-sm font-black text-zinc-950 transition hover:-translate-y-1 hover:bg-violet-100">Đăng ký ngay</a>
            </div>
            <div id="payment" className="rounded-[2rem] border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7">
              <div className="flex items-center gap-3"><QrCode className="h-6 w-6 text-violet-200" /><h3 className="text-2xl font-black text-white">Thanh toán khóa học</h3></div>
              <div className="mt-5 grid gap-5 md:grid-cols-[.95fr_1.05fr]">
                <div className="rounded-[1.5rem] bg-white p-3"><Image src="/images/video-ai-course-payment-qr.png" alt="QR thanh toán khóa học Video AI" width={900} height={1200} className="w-full rounded-[1rem]" /></div>
                <div className="space-y-3">
                  {[
                    ["STK", "0865103062"],
                    ["Ngân hàng", "NH Quốc Tế VIB"],
                    ["Chủ tài khoản", "NGUYỄN ĐỨC TRUNG"],
                    ["Nội dung CK", "HOC VIDEO AI"],
                  ].map(([label, value]) => <div key={label} className="rounded-2xl border border-white/[0.08] bg-black/20 p-4"><p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</p><p className="mt-1 flex items-center justify-between gap-3 text-base font-black text-white">{value}<Copy className="h-4 w-4 text-zinc-500" /></p></div>)}
                  <button onClick={() => setPaymentOpen(true)} className="w-full rounded-2xl bg-violet-500 px-5 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-violet-400"><CreditCard className="mr-2 inline h-4 w-4" />Tôi đã chuyển khoản</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionTitle kicker="FAQ" title="Câu hỏi thường gặp" />
            <div className="space-y-3">
              {faqs.map(([question, answer], index) => <div key={question} className="rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                <button onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 p-5 text-left"><span className="font-black text-white">{question}</span><ChevronDown className={`h-5 w-5 text-zinc-400 transition ${openFaq === index ? "rotate-180" : ""}`} /></button>
                {openFaq === index && <p className="px-5 pb-5 text-sm leading-7 text-zinc-400">{answer}</p>}
              </div>)}
            </div>
          </div>
        </section>

        <footer className="px-4 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1500px] flex-col gap-4 rounded-[1.5rem] border border-white/[0.08] bg-white/[0.03] p-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© Trung AI Studio — Khóa học Video AI thực chiến.</p>
            <a href="#pricing" className="font-black text-violet-300">Nhận ưu đãi 149K <ChevronRight className="inline h-4 w-4" /></a>
          </div>
        </footer>
      </main>
    </div>
  </div>;
}
