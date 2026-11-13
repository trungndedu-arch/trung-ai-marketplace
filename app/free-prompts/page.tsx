import { FreePromptsClient } from "@/components/free-prompts/FreePromptsClient";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { getPublicFreePrompts } from "@/lib/free-prompts-repository";
import { getPublicFreeAiLearning } from "@/lib/free-ai-learning";

export default async function FreePromptsPage() {
  const [user, prompts, freeAiLearning] = await Promise.all([getCurrentUserSummary(), getPublicFreePrompts(), getPublicFreeAiLearning()]);
  return <FreePromptsClient user={user} prompts={prompts} freeAiLearningAvailable={freeAiLearning.isAvailable} />;
}
