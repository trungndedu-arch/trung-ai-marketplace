import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboardUi";
import {
  adminDashboardRanges,
  getAdminDashboardData,
  type AdminDashboardRange,
} from "@/lib/admin/dashboard";

export const metadata: Metadata = { title: "Dashboard quản trị" };

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parseRange(value: string | string[] | undefined): AdminDashboardRange {
  const selected = firstValue(value);
  return adminDashboardRanges.some((range) => range.value === selected)
    ? selected as AdminDashboardRange
    : "30d";
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const range = parseRange((await searchParams).range);
  const dashboard = await getAdminDashboardData(range);

  return <AdminDashboard dashboard={dashboard} />;
}
