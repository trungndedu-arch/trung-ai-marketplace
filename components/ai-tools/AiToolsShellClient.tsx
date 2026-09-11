"use client";

import { MarketplaceHeader } from "@/components/navigation/MarketplaceHeader";
import type { AuthUserSummary } from "@/lib/auth/session";

export function AiToolsShellClient({ children, user }: { children: React.ReactNode; activeModule?: "tools" | "workflows"; user: AuthUserSummary }) {
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <MarketplaceHeader user={user} />
      {children}
    </div>
  );
}
