// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { orderedPrompts } from "./free-prompts.ts";

export type LegacyFreePromptImportRow = {
  slug: string;
  title: string;
  short_description: string;
  prompt_content: string;
  cover_image_url: string | null;
  model: string;
  category: string;
  tags: string[];
  usage_instructions: null;
  seo_title: null;
  seo_description: null;
  status: "published";
  display_order: number;
  presentation_metadata: {
    legacy_id: number;
    count: string;
    images: string[];
    gradient: string;
    height: string;
  };
};

// This is a read-only representation of the 25 source prompts. It is used to
// generate a reviewable import payload; it never writes to Supabase itself.
export const legacyFreePromptImportRows: LegacyFreePromptImportRow[] = orderedPrompts.map((prompt, index) => ({
  slug: prompt.slug,
  title: prompt.title,
  short_description: prompt.description ?? "",
  prompt_content: prompt.prompt,
  cover_image_url: prompt.image ?? null,
  model: prompt.model,
  category: prompt.category,
  tags: [],
  usage_instructions: null,
  seo_title: null,
  seo_description: null,
  status: "published",
  display_order: index + 1,
  presentation_metadata: {
    legacy_id: prompt.id,
    count: prompt.count,
    images: prompt.images ?? (prompt.image ? [prompt.image] : []),
    gradient: prompt.gradient,
    height: prompt.height,
  },
}));

export const legacyFreePromptSlugs = legacyFreePromptImportRows.map((row) => row.slug);
