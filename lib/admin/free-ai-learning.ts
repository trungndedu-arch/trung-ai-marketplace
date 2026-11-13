import { requireAdminRole } from "@/lib/auth/admin";
import { FREE_AI_LEARNING_SETTING_KEYS, isFreeAiLearningSchemaMissing, parseFreeAiLearningSettings, type FreeAiLearningSettings } from "@/lib/free-ai-learning";
import { createClient } from "@/lib/supabase/server";
import { getYouTubeThumbnailUrl, isYouTubeVideoId } from "@/lib/youtube";

export type AdminFreeAiLearningVideo = {
  id: string;
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  displayOrder: number;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
};

type VideoRow = {
  id: string;
  youtube_video_id: string;
  video_url: string;
  title: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

const videoSelect = "id,youtube_video_id,video_url,title,display_order,is_visible,created_at,updated_at";

function normalizeVideo(row: VideoRow): AdminFreeAiLearningVideo | null {
  if (!isYouTubeVideoId(row.youtube_video_id)) return null;
  return {
    id: row.id,
    videoId: row.youtube_video_id,
    videoUrl: row.video_url,
    title: row.title,
    thumbnailUrl: getYouTubeThumbnailUrl(row.youtube_video_id),
    displayOrder: row.display_order,
    isVisible: row.is_visible,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function loadSettings(): Promise<FreeAiLearningSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key,value").in("key", [...FREE_AI_LEARNING_SETTING_KEYS]);
  return parseFreeAiLearningSettings((data ?? []) as Array<{ key: string; value: unknown }>);
}

export async function getAdminFreeAiLearning() {
  await requireAdminRole("/admin/free-ai-learning");
  const supabase = await createClient();
  const [settings, videosResult] = await Promise.all([
    loadSettings(),
    supabase.from("free_ai_learning_videos").select(videoSelect).order("display_order").order("created_at").order("id"),
  ]);
  if (videosResult.error) {
    return {
      settings,
      videos: [] as AdminFreeAiLearningVideo[],
      schemaReady: false,
      error: isFreeAiLearningSchemaMissing(videosResult.error)
        ? "Migration Học AI Miễn Phí chưa được áp dụng."
        : "Không thể tải danh sách video lúc này.",
    };
  }
  const videos = ((videosResult.data ?? []) as VideoRow[]).flatMap((row) => {
    const video = normalizeVideo(row);
    return video ? [video] : [];
  });
  return { settings, videos, schemaReady: true, error: null };
}

export async function getAdminFreeAiLearningVideoById(id: string) {
  await requireAdminRole(`/admin/free-ai-learning/${id}/edit`);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return { video: null, error: null };
  const supabase = await createClient();
  const { data, error } = await supabase.from("free_ai_learning_videos").select(videoSelect).eq("id", id).maybeSingle();
  if (error) return { video: null, error: isFreeAiLearningSchemaMissing(error) ? "Migration Học AI Miễn Phí chưa được áp dụng." : "Không thể tải video lúc này." };
  if (!data) return { video: null, error: null };
  return { video: normalizeVideo(data as VideoRow), error: null };
}
