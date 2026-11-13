// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { getYouTubeThumbnailUrl, getYouTubeWatchUrl, isYouTubeVideoId } from "./youtube.ts";

export const FREE_AI_LEARNING_SECTION_ID = "hoc-ai-mien-phi";
export const FREE_AI_LEARNING_MAX_VIDEOS = 6;
export const FREE_AI_LEARNING_SETTING_KEYS = [
  "free_ai_learning.section_enabled",
  "free_ai_learning.youtube_channel_url",
  "free_ai_learning.channel_button_enabled",
] as const;

export type FreeAiLearningSettings = {
  sectionEnabled: boolean;
  youtubeChannelUrl: string;
  channelButtonEnabled: boolean;
};

export type FreeAiLearningVideo = {
  id: string;
  videoId: string;
  videoUrl: string;
  title: string;
  thumbnailUrl: string;
  displayOrder: number;
};

export type PublicFreeAiLearning = {
  isAvailable: boolean;
  settings: FreeAiLearningSettings;
  videos: FreeAiLearningVideo[];
};

export type PublicVideoRow = {
  id: string;
  youtube_video_id: string;
  video_url: string;
  title: string;
  display_order: number;
};

export const defaultFreeAiLearningSettings: FreeAiLearningSettings = {
  sectionEnabled: false,
  youtubeChannelUrl: "",
  channelButtonEnabled: false,
};

export function isValidYouTubeChannelUrl(value: string) {
  const input = value.trim();
  if (!input || input.length > 2_048) return false;
  try {
    const url = new URL(input);
    const allowedHosts = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
    const segments = url.pathname.split("/").filter(Boolean);
    const isHandle = segments.length === 1 && segments[0].startsWith("@") && segments[0].length > 1;
    const isNamedChannel = segments.length === 2
      && ["channel", "c", "user"].includes(segments[0])
      && Boolean(segments[1]);
    return url.protocol === "https:"
      && allowedHosts.has(url.hostname.toLowerCase())
      && !url.username
      && !url.password
      && !url.port
      && (isHandle || isNamedChannel);
  } catch {
    return false;
  }
}

export function parseFreeAiLearningSettings(rows: Array<{ key: string; value: unknown }>): FreeAiLearningSettings {
  const values = new Map(rows.map((row) => [row.key, row.value]));
  const channelUrlValue = values.get("free_ai_learning.youtube_channel_url");
  const youtubeChannelUrl = typeof channelUrlValue === "string" && isValidYouTubeChannelUrl(channelUrlValue) ? channelUrlValue : "";
  return {
    sectionEnabled: values.get("free_ai_learning.section_enabled") === true,
    youtubeChannelUrl,
    channelButtonEnabled: values.get("free_ai_learning.channel_button_enabled") === true && Boolean(youtubeChannelUrl),
  };
}

export function normalizePublicFreeAiLearningVideos(rows: PublicVideoRow[]) {
  const seen = new Set<string>();
  return rows.flatMap((row): FreeAiLearningVideo[] => {
    if (!isYouTubeVideoId(row.youtube_video_id) || seen.has(row.youtube_video_id) || !row.title.trim()) return [];
    seen.add(row.youtube_video_id);
    return [{
      id: row.id,
      videoId: row.youtube_video_id,
      videoUrl: getYouTubeWatchUrl(row.youtube_video_id),
      title: row.title.trim(),
      thumbnailUrl: getYouTubeThumbnailUrl(row.youtube_video_id),
      displayOrder: row.display_order,
    }];
  }).slice(0, FREE_AI_LEARNING_MAX_VIDEOS);
}

export function isFreeAiLearningSchemaMissing(error: { code?: string; message?: string } | null | undefined) {
  if (!error) return false;
  const message = error.message?.toLowerCase() ?? "";
  return error.code === "42P01" || error.code === "PGRST205" || message.includes("free_ai_learning_videos") && message.includes("schema cache");
}
