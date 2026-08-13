export const BANNER_ASSETS_BUCKET = "banner-assets";
export const MAX_BANNER_IMAGE_SIZE = 5 * 1024 * 1024;

export const BANNER_IMAGE_MIME_EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type BannerImageMime = keyof typeof BANNER_IMAGE_MIME_EXTENSIONS;
export type BannerImageVariant = "desktop" | "mobile";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const GENERATED_FILENAME_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/i;

export function isBannerId(value: string) {
  return UUID_PATTERN.test(value);
}

export function isBannerImageVariant(value: unknown): value is BannerImageVariant {
  return value === "desktop" || value === "mobile";
}

export function isBannerImageMime(value: string): value is BannerImageMime {
  return value in BANNER_IMAGE_MIME_EXTENSIONS;
}

export function isCanonicalBannerAssetPath(path: string, bannerId?: string, variant?: BannerImageVariant) {
  if (path !== path.toLowerCase()) return false;

  const segments = path.split("/");
  if (segments.length !== 4 || segments[0] !== "banners") return false;
  if (!isBannerId(segments[1]) || !isBannerImageVariant(segments[2]) || !GENERATED_FILENAME_PATTERN.test(segments[3])) return false;
  if (bannerId && segments[1].toLowerCase() !== bannerId.toLowerCase()) return false;
  return !variant || segments[2] === variant;
}
