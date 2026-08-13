import {
  Bot,
  Clock3,
  GraduationCap,
  PackageCheck,
  PackageOpen,
  Sparkles,
  WandSparkles,
  Wrench,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/admin/dashboard";

const metricDefinitions = [
  { key: "total", label: "Tổng sản phẩm", icon: PackageOpen, tone: "text-white" },
  { key: "chatbot", label: "Chatbot", icon: Bot, tone: "text-cyan-300" },
  { key: "aiApp", label: "AI App", icon: WandSparkles, tone: "text-violet-300" },
  { key: "aiTool", label: "AI Tool", icon: Wrench, tone: "text-blue-300" },
  { key: "course", label: "Khóa học", icon: GraduationCap, tone: "text-amber-300" },
  { key: "onSale", label: "Đang bán", icon: PackageCheck, tone: "text-emerald-300" },
  { key: "comingSoon", label: "Sắp ra mắt", icon: Clock3, tone: "text-orange-300" },
  { key: "free", label: "Miễn phí", icon: Sparkles, tone: "text-sky-300" },
] as const;

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Dashboard</p>
          <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Tổng quan</h1>
        </div>
        <span className="rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-2 text-xs font-bold text-emerald-200">Dữ liệu trực tiếp</span>
      </div>

      <section aria-label="Số liệu sản phẩm" className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricDefinitions.map((metric) => {
          const Icon = metric.icon;
          return (
            <article key={metric.key} className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 shadow-lg shadow-black/10">
              <div className="flex items-center justify-between gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] ${metric.tone}`}><Icon className="h-5 w-5" /></span>
                <strong className="text-3xl font-black tabular-nums text-white">{stats[metric.key]}</strong>
              </div>
              <h2 className="mt-5 text-sm font-bold text-slate-300">{metric.label}</h2>
            </article>
          );
        })}
      </section>
    </div>
  );
}
