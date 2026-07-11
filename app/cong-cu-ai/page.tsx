import { Boxes } from "lucide-react";
import { AiToolsCatalog } from "@/components/ai-tools/AiToolsCatalog";
import { getActiveAiTools } from "@/lib/ai-tools";

// Public AI tools catalog.

export default function AiToolsPage() {
  const tools = getActiveAiTools();

  return <main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12"><section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0B1728] px-6 py-10 sm:px-10 lg:px-12"><div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-sky-600/20 blur-[90px]" /><div className="absolute -bottom-32 left-[18%] h-72 w-72 rounded-full bg-blue-600/15 blur-[90px]" /><div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-sky-300"><Boxes className="h-3.5 w-3.5" /> Chọn lọc cho Affiliate</span><h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-.04em] text-white sm:text-5xl">Công Cụ AI <span className="gradient-text">Nên Dùng</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Khám phá các công cụ AI hữu ích dành cho sáng tạo nội dung, video, hình ảnh, marketing và tự động hóa công việc.</p></div></section><AiToolsCatalog tools={tools} /><footer className="mt-14 border-t border-white/[0.06] py-8 text-sm leading-6 text-slate-400">Một số liên kết trên trang là liên kết tiếp thị liên kết. Mình có thể nhận được hoa hồng khi bạn đăng ký qua các liên kết này mà không làm tăng chi phí của bạn.</footer></main>;
}
