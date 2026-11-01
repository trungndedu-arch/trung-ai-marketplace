"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  Boxes,
  ImageIcon,
  LayoutDashboard,
  ListTree,
  PackageSearch,
  ReceiptText,
  Settings,
  Users,
} from "lucide-react";
import type { AdminRole } from "@/lib/auth/admin";

const navigationItems = [
  { label: "Tổng quan", href: "/admin", icon: LayoutDashboard, enabled: true, adminOnly: true },
  { label: "Sản phẩm", href: "/admin/products", icon: PackageSearch, enabled: true, adminOnly: false },
  { label: "Danh mục", href: "/admin/categories", icon: ListTree, enabled: true, adminOnly: false },
  { label: "Banner", href: "/admin/banners", icon: ImageIcon, enabled: true, adminOnly: false },
  { label: "Flash Sale", href: "/admin/flash-sales", icon: BadgePercent, enabled: true, adminOnly: false },
  { label: "Khách hàng", href: "/admin/customers", icon: Users, enabled: true, adminOnly: true },
  { label: "Đơn hàng", href: "/admin/orders", icon: ReceiptText, enabled: true, adminOnly: true },
  { label: "Cài đặt", href: "/admin/settings", icon: Settings, enabled: true, adminOnly: true },
] as const;

function NavigationLinks({ role }: { role: AdminRole }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Điều hướng quản trị" className="space-y-1.5">
      {navigationItems.map((item) => {
        if (item.adminOnly && role !== "admin") return null;

        const Icon = item.icon;
        const isActive = "href" in item && (item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href));
        const classes = `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-bold transition ${
          isActive
            ? "border border-[#F0B26E] bg-[#FFEDD5] text-[#C65D1B]"
            : item.enabled
              ? "border border-transparent text-[#786D63] hover:border-[#F1E6D7] hover:bg-[#FFEDD5] hover:text-[#C65D1B]"
            : "cursor-not-allowed border border-transparent text-[#A99B8E]"
        }`;

        if (item.enabled && "href" in item) {
          return <Link key={item.label} href={item.href} className={classes}><Icon className="h-4.5 w-4.5" />{item.label}</Link>;
        }

        return <span key={item.label} aria-disabled="true" title="Sắp triển khai" className={classes}><Icon className="h-4.5 w-4.5" />{item.label}</span>;
      })}
    </nav>
  );
}

export function AdminDesktopNavigation({ role }: { role: AdminRole }) {
  return (
    <aside className="hidden min-h-screen border-r border-[#F1E6D7] bg-white px-4 py-6 lg:flex lg:flex-col">
      <Link href={role === "admin" ? "/admin" : "/admin/products"} className="flex items-center gap-3 px-2" aria-label="Trung AI Admin">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-[#F0B26E] bg-[#FFEDD5] text-lg font-black text-[#C65D1B]">T</span>
        <span><b className="block text-sm text-[#202020]">Trung AI Admin</b><small className="text-xs text-[#786D63]">Marketplace Console</small></span>
      </Link>
      <div className="mt-8"><NavigationLinks role={role} /></div>
      <div className="mt-auto flex items-center gap-2 border-t border-[#F1E6D7] px-2 pt-5 text-xs font-semibold text-[#786D63]"><Boxes className="h-4 w-4" />Admin Foundation</div>
    </aside>
  );
}

export function AdminMobileNavigation({ role }: { role: AdminRole }) {
  return (
    <details className="relative lg:hidden">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-[#F1E6D7] bg-white px-3 text-sm font-bold text-[#786D63]">
        <LayoutDashboard className="h-4 w-4" />Menu
      </summary>
      <div className="absolute right-0 top-12 z-50 w-64 rounded-lg border border-[#F1E6D7] bg-white p-3 shadow-2xl shadow-[#5E3616]/15">
        <NavigationLinks role={role} />
      </div>
    </details>
  );
}
