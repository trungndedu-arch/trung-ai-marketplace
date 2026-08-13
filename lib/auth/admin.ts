import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "customer" | "editor" | "admin";
export type AdminRole = Extract<AppRole, "editor" | "admin">;

export type AdminAccessContext = {
  userId: string;
  email: string;
  roles: AppRole[];
  highestRole: AdminRole;
};

const rolePriority: AppRole[] = ["admin", "editor", "customer"];

function isAppRole(value: unknown): value is AppRole {
  return value === "customer" || value === "editor" || value === "admin";
}

export function getHighestRole(roles: readonly AppRole[]) {
  return rolePriority.find((role) => roles.includes(role)) ?? null;
}

export function getAdminRoleLabel(role: AdminRole) {
  return role === "admin" ? "Admin" : "Editor";
}

export const requireAdminAccess = cache(async (nextPath = "/admin"): Promise<AdminAccessContext> => {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  const { data: roleRows, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (roleError) {
    throw new Error(`Không thể xác minh quyền quản trị: ${roleError.message}`);
  }

  const roles = Array.from(new Set((roleRows ?? []).map((row) => row.role).filter(isAppRole)));
  const highestRole = getHighestRole(roles);

  if (highestRole !== "admin" && highestRole !== "editor") {
    redirect("/admin-access-denied");
  }

  return {
    userId: user.id,
    email: user.email ?? "Tài khoản quản trị",
    roles,
    highestRole,
  };
});

export const requireAdminRole = cache(async (nextPath = "/admin"): Promise<AdminAccessContext> => {
  const access = await requireAdminAccess(nextPath);

  if (!access.roles.includes("admin")) {
    redirect("/admin-access-denied");
  }

  return access;
});
