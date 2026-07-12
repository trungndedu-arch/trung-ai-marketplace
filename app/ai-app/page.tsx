import { redirect } from "next/navigation";

export default function AiAppRedirectPage() {
  redirect("/workflow?tab=ai-app");
}
