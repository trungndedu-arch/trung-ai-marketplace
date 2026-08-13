import { AiToolsShellClient } from "@/components/ai-tools/AiToolsShellClient";
import { getCurrentUserSummary } from "@/lib/auth/session";

export async function AiToolsShell({ children, activeModule = "tools" }: { children: React.ReactNode; activeModule?: "tools" | "workflows" }) {
  const user = await getCurrentUserSummary();

  return (
    <AiToolsShellClient activeModule={activeModule} user={user}>
      {children}
    </AiToolsShellClient>
  );
}
