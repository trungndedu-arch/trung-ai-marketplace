import { Image as ImageIcon } from "lucide-react";
// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { createPublicCatalogClient } from "./supabase/public.ts";
// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { orderedPrompts, type PromptItem } from "./free-prompts.ts";

export type ManagedFreePrompt = PromptItem & {
  databaseId?: string;
  status?: "draft" | "published" | "hidden";
  deletedAt?: string | null;
  instructions?: string;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string[];
};

export type FreePromptDatabaseRow = { id:string; slug:string; title:string; short_description:string; prompt_content:string; cover_image_url:string|null; model:string; category:string; tags:string[]; usage_instructions:string|null; seo_title:string|null; seo_description:string|null; presentation_metadata:{ count?:string; images?:string[]; gradient?:string; height?:string }|null; status:"draft"|"published"|"hidden"; display_order:number; deleted_at:string|null; created_at:string };
const select = "id,slug,title,short_description,prompt_content,cover_image_url,model,category,tags,usage_instructions,seo_title,seo_description,presentation_metadata,status,display_order,deleted_at,created_at";
const isMissingTable = (error: { code?: string; message?: string } | null) => error?.code === "42P01" || error?.code === "PGRST205";
export function mapManagedFreePrompt(row: FreePromptDatabaseRow): ManagedFreePrompt { const metadata=row.presentation_metadata??{};return { id: row.display_order, databaseId: row.id, slug: row.slug, title: row.title, model: row.model, count: metadata.count ?? "Prompt", category: row.category, gradient: metadata.gradient ?? "from-sky-500 via-blue-800 to-zinc-950", icon: ImageIcon, height: metadata.height ?? "h-[30rem]", prompt: row.prompt_content, image: row.cover_image_url ?? undefined, images: metadata.images, description: row.short_description, tags: row.tags, instructions: row.usage_instructions ?? undefined, seoTitle: row.seo_title ?? undefined, seoDescription: row.seo_description ?? undefined, status: row.status, deletedAt: row.deleted_at }; }
export function mergeLegacyFreePrompts(rows: ManagedFreePrompt[], overriddenSlugs: readonly string[] = []) { const blocked = new Set(overriddenSlugs);const bySlug = new Map(rows.map((item) => [item.slug, item]));return [...rows, ...orderedPrompts.filter((item) => !bySlug.has(item.slug) && !blocked.has(item.slug))].sort((a,b) => (b.id ?? 0) - (a.id ?? 0)); }
export async function getPublicFreePrompts(): Promise<ManagedFreePrompt[]> { const s = createPublicCatalogClient(); const [{ data, error }, overrides] = await Promise.all([s.from("free_prompts").select(select).eq("status","published").is("deleted_at",null).order("display_order",{ascending:true}),s.rpc("free_prompt_legacy_overrides")]);if (error) { if (isMissingTable(error)) return orderedPrompts; throw new Error("Unable to load managed free prompts"); }if (overrides.error) throw new Error("Unable to load legacy Prompt visibility overrides");return mergeLegacyFreePrompts((data as FreePromptDatabaseRow[]).map(mapManagedFreePrompt),(overrides.data??[]).map((row:{slug:string})=>row.slug)); }
export async function getPublicFreePromptBySlug(slug:string) { return (await getPublicFreePrompts()).find((item)=>item.slug===slug); }
