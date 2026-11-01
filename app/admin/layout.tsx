import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AdminDesktopNavigation, AdminMobileNavigation } from "@/components/admin/AdminNavigation";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { getAdminRoleLabel, requireAdminAccess } from "@/lib/auth/admin";

export const metadata: Metadata = {
  title: "Trung AI Admin",
  description: "Khu vực quản trị Trung AI Marketplace.",
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await requireAdminAccess();

  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      <div className="grid min-h-screen lg:grid-cols-[250px_minmax(0,1fr)]">
        <AdminDesktopNavigation role={admin.highestRole} />
        <div className="min-w-0">
          <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#08111E]/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-h-12 items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-white">Trung AI Admin</p>
                <p className="truncate text-xs text-slate-500">{admin.email} · {getAdminRoleLabel(admin.highestRole)}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <AdminMobileNavigation role={admin.highestRole} />
                <Link href="/" className="hidden min-h-11 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-bold text-slate-300 transition hover:border-sky-300/30 hover:text-white sm:inline-flex">Website<ExternalLink className="h-4 w-4" /></Link>
                <SignOutButton />
              </div>
            </div>
          </header>
          <main className="px-4 py-7 sm:px-6 lg:px-8 lg:py-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
