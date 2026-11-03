import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FreePromptDetail } from "@/components/free-prompts/FreePromptDetail";
import { canPreviewFreePrompt, freePromptPreviewRobots } from "@/lib/admin/free-prompt-preview";
import { requireAdminAccess } from "@/lib/auth/admin";
import { mapManagedFreePrompt, type FreePromptDatabaseRow } from "@/lib/free-prompts-repository";
import { createClient } from "@/lib/supabase/server";

type PreviewPageProps = { params: Promise<{ id: string }> };
const previewSelect = "id,slug,title,short_description,prompt_content,cover_image_url,model,category,tags,usage_instructions,seo_title,seo_description,presentation_metadata,status,display_order,deleted_at,created_at";

export const metadata: Metadata = {
  title: "Xem trước Prompt | Trung AI Media",
  robots: freePromptPreviewRobots,
};

export default async function FreePromptPreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;
  await requireAdminAccess(`/admin/free-prompts/${id}/preview`);
  const supabase = await createClient();
  const { data } = await supabase.from("free_prompts").select(previewSelect).eq("id", id).maybeSingle();
  const prompt = data as FreePromptDatabaseRow | null;
  if (!prompt || !canPreviewFreePrompt(prompt)) notFound();
  return <FreePromptDetail prompt={mapManagedFreePrompt(prompt)} preview />;
}
