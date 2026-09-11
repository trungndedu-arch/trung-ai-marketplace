import { MarketplaceHeader } from "@/components/navigation/MarketplaceHeader";
import type { AuthUserSummary } from "@/lib/auth/session";

export function CommerceHeader({ user }: { user: AuthUserSummary }) {
  return <MarketplaceHeader user={user} />;
}
