import { getPublicSiteSettings } from "@/lib/catalog/public-content";
import { createPublicCatalogClient } from "@/lib/supabase/public";
import {
  defaultFreeAiLearningSettings,
  FREE_AI_LEARNING_MAX_VIDEOS,
  FREE_AI_LEARNING_SETTING_KEYS,
  isFreeAiLearningSchemaMissing,
  normalizePublicFreeAiLearningVideos,
  parseFreeAiLearningSettings,
  type PublicFreeAiLearning,
  type PublicVideoRow,
} from "@/lib/free-ai-learning-core";

export * from "@/lib/free-ai-learning-core";

export async function getPublicFreeAiLearning(): Promise<PublicFreeAiLearning> {
  const settingRows = await getPublicSiteSettings([...FREE_AI_LEARNING_SETTING_KEYS]);
  const settings = parseFreeAiLearningSettings(settingRows);
  if (!settings.sectionEnabled) return { isAvailable: false, settings, videos: [] };

  const supabase = createPublicCatalogClient();
  const { data, error } = await supabase
    .from("free_ai_learning_videos")
    .select("id,youtube_video_id,video_url,title,display_order")
    .eq("is_visible", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(FREE_AI_LEARNING_MAX_VIDEOS);

  if (error) {
    if (!isFreeAiLearningSchemaMissing(error)) console.error("[free-ai-learning] Unable to load public videos:", error.message);
    return { isAvailable: false, settings, videos: [] };
  }

  const videos = normalizePublicFreeAiLearningVideos((data ?? []) as PublicVideoRow[]);
  return { isAvailable: videos.length > 0, settings, videos };
}

export function getEmptyPublicFreeAiLearning(): PublicFreeAiLearning {
  return { isAvailable: false, settings: defaultFreeAiLearningSettings, videos: [] };
}
