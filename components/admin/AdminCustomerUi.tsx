import { UserRound } from "lucide-react";
import type { AdminCustomer, ProfileStatus } from "@/lib/admin/customers";
import type { AppRole } from "@/lib/auth/admin";

const roleLabels: Record<AppRole, string> = {
  customer: "Khách hàng",
  editor: "Editor",
  admin: "Admin",
};

const roleStyles: Record<AppRole, string> = {
  customer: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  editor: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  admin: "border-amber-300/20 bg-amber-400/10 text-amber-200",
};

const statusLabels: Record<ProfileStatus, string> = {
  active: "Hoạt động",
  suspended: "Tạm ngưng",
  deleted: "Đã xóa",
};

const statusStyles: Record<ProfileStatus, string> = {
  active: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
  suspended: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  deleted: "border-slate-300/15 bg-slate-400/10 text-slate-300",
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Ho_Chi_Minh",
});

function customerInitial(customer: AdminCustomer) {
  const source = customer.fullName || customer.email;
  return source.trim().charAt(0).toUpperCase() || "?";
}

export function CustomerAvatar({ customer, className = "h-11 w-11" }: { customer: AdminCustomer; className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center overflow-hidden rounded-lg border border-white/10 bg-[#07111F] font-black text-sky-200 ${className}`}>
      {customer.avatarUrl ? <img src={customer.avatarUrl} alt={customer.fullName || customer.email} className="h-full w-full object-cover" /> : customerInitial(customer) || <UserRound className="h-5 w-5" />}
    </span>
  );
}

export function CustomerRoleChips({ roles }: { roles: AppRole[] }) {
  return <span className="flex flex-wrap gap-1.5">{roles.map((role) => <span key={role} className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${roleStyles[role]}`}>{roleLabels[role]}</span>)}</span>;
}

export function CustomerStatusChip({ status }: { status: ProfileStatus }) {
  return <span className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-bold ${statusStyles[status]}`}>{statusLabels[status]}</span>;
}

export function formatCustomerDate(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? dateFormatter.format(date) : "—";
}
