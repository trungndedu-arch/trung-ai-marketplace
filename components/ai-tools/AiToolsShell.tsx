import { AiToolsShellClient } from "@/components/ai-tools/AiToolsShellClient";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { getPublicFreeAiLearning } from "@/lib/free-ai-learning";

export async function AiToolsShell({ children, activeModule = "tools" }: { children: React.ReactNode; activeModule?: "tools" | "workflows" }) {
  const [user, freeAiLearning] = await Promise.all([getCurrentUserSummary(), getPublicFreeAiLearning()]);

  return (
    <AiToolsShellClient activeModule={activeModule} user={user} freeAiLearningAvailable={freeAiLearning.isAvailable}>
      {children}
    </AiToolsShellClient>
  );
}
