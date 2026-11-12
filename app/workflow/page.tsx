import { Clapperboard, Image as ImageIcon } from "lucide-react";
import { ChatbotAiAppCatalog } from "@/components/chatbots/ChatbotAiAppCatalog";
import { getActiveChatbots } from "@/lib/chatbots";
import { getActiveWorkflows } from "@/lib/workflows";
import { getAppCatalogTab } from "@/lib/catalog/app-media-type";

export const dynamic = "force-dynamic";

export default async function WorkflowsPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const [chatbots, apps] = await Promise.all([getActiveChatbots(), getActiveWorkflows()]);
  const { tab } = await searchParams;
  const initialTab = getAppCatalogTab(tab);

  return <main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12"><section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0B1728] px-6 py-10 sm:px-10 lg:px-12"><div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-sky-600/20 blur-[90px]" /><div className="absolute -bottom-32 left-[18%] h-72 w-72 rounded-full bg-blue-600/15 blur-[90px]" /><div className="relative max-w-3xl"><span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-sky-300"><ImageIcon className="h-3.5 w-3.5" /> App Tạo Ảnh & Video AI</span><h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-[-.04em] text-white sm:text-5xl">App Tạo Ảnh &amp; <span className="gradient-text">Video AI</span></h1><p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">Khám phá các App AI thực chiến hỗ trợ tạo ảnh, tạo video và sản xuất nội dung bán hàng hiệu quả hơn.</p><div className="mt-5 flex items-center gap-2 text-xs font-bold text-sky-200"><Clapperboard className="h-4 w-4" /> Chọn tab bên dưới để xem App theo công dụng.</div></div></section><ChatbotAiAppCatalog chatbots={chatbots} apps={apps} initialTab={initialTab} /><footer className="mt-14 border-t border-white/[0.06] py-8 text-sm leading-6 text-slate-400">Mỗi App được chọn lọc để bạn có thể áp dụng nhanh cho việc tạo ảnh, tạo video và nội dung của mình.</footer></main>;
}
