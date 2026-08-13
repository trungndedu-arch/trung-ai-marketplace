import { FreePromptsClient } from "@/components/free-prompts/FreePromptsClient";
import { getCurrentUserSummary } from "@/lib/auth/session";

export default async function FreePromptsPage() {
  const user = await getCurrentUserSummary();

  return <FreePromptsClient user={user} />;
}
