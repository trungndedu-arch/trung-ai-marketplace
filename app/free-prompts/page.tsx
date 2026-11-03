import { FreePromptsClient } from "@/components/free-prompts/FreePromptsClient";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { getPublicFreePrompts } from "@/lib/free-prompts-repository";

export default async function FreePromptsPage() {
  const user = await getCurrentUserSummary();

  const prompts = await getPublicFreePrompts();
  return <FreePromptsClient user={user} prompts={prompts} />;
}
