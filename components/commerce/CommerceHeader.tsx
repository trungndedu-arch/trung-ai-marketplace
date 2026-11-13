import { MarketplaceHeader } from "@/components/navigation/MarketplaceHeader";
import type { AuthUserSummary } from "@/lib/auth/session";
import { getPublicFreeAiLearning } from "@/lib/free-ai-learning";

export async function CommerceHeader({ user }: { user: AuthUserSummary }) {
  const freeAiLearning = await getPublicFreeAiLearning();
  return <MarketplaceHeader user={user} freeAiLearningAvailable={freeAiLearning.isAvailable} />;
}
