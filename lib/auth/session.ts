import { createClient } from "@/lib/supabase/server";

export type AuthUserSummary = {
  email: string;
} | null;

export async function getCurrentUserSummary(): Promise<AuthUserSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ? { email: user.email } : null;
}
