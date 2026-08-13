import type { CatalogDemoVideo } from "@/lib/catalog/types";

const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);
const YOUTU_BE_HOSTS = new Set(["youtu.be", "www.youtu.be"]);

export function isYouTubeVideoId(value: string) {
  return YOUTUBE_VIDEO_ID_PATTERN.test(value);
}

export function parseYouTubeVideoUrl(value: string) {
  const input = value.trim();
  if (!input || input.length > 2048) return null;

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  if (url.protocol !== "https:" || url.username || url.password || url.port) return null;

  const hostname = url.hostname.toLowerCase();
  const pathSegments = url.pathname.split("/").filter(Boolean);
  let videoId: string | null = null;

  if (YOUTU_BE_HOSTS.has(hostname)) {
    if (pathSegments.length === 1) videoId = pathSegments[0];
  } else if (YOUTUBE_HOSTS.has(hostname)) {
    if (pathSegments.length === 1 && pathSegments[0] === "watch") {
      videoId = url.searchParams.get("v");
    } else if (pathSegments.length === 2 && (pathSegments[0] === "shorts" || pathSegments[0] === "embed")) {
      videoId = pathSegments[1];
    }
  }

  return videoId && isYouTubeVideoId(videoId) ? videoId : null;
}

export function normalizeYouTubeDemoVideo(provider: unknown, id: unknown): CatalogDemoVideo | null {
  return provider === "youtube" && typeof id === "string" && isYouTubeVideoId(id)
    ? { provider: "youtube", id }
    : null;
}

export function getYouTubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getYouTubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
