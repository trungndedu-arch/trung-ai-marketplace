export type ContactPlatform = "facebook" | "zalo" | "youtube";

export type HomepageContactLinks = {
  facebook: { url: string; enabled: boolean; label: string };
  zalo: { url: string; enabled: boolean; label: string };
  youtube: { url: string; enabled: boolean; label: string };
  supportCta: string;
  floatingZaloEnabled: boolean;
};

export const HOMEPAGE_CONTACT_SETTING_KEYS = [
  "homepage_contact.facebook_url", "homepage_contact.facebook_enabled", "homepage_contact.facebook_label",
  "homepage_contact.zalo_url", "homepage_contact.zalo_enabled", "homepage_contact.zalo_label",
  "homepage_contact.youtube_url", "homepage_contact.youtube_enabled", "homepage_contact.youtube_label",
  "homepage_contact.support_cta", "homepage_contact.floating_zalo_enabled",
] as const;

const defaults: HomepageContactLinks = {
  facebook: { url: "", enabled: false, label: "Facebook" },
  zalo: { url: "", enabled: false, label: "Nhắn Zalo" },
  youtube: { url: "", enabled: false, label: "YouTube" },
  supportCta: "Cần tư vấn chọn công cụ AI hoặc khóa học phù hợp? Nhắn tin qua Zalo hoặc Facebook để được hỗ trợ nhanh chóng!",
  floatingZaloEnabled: false,
};

const allowedHosts: Record<ContactPlatform, readonly string[]> = {
  facebook: ["facebook.com", "fb.com"],
  zalo: ["zalo.me", "zaloapp.com"],
  youtube: ["youtube.com", "youtu.be"],
};

function text(value: unknown, fallback = "") { return typeof value === "string" ? value.trim() : fallback; }
function bool(value: unknown) { return value === true; }

export function isValidContactUrl(platform: ContactPlatform, value: string) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    const hostname = url.hostname.toLowerCase();
    return allowedHosts[platform].some((host) => hostname === host || hostname.endsWith(`.${host}`));
  } catch { return false; }
}

export function contactLinkIsVisible(link: { url: string; enabled: boolean }, platform: ContactPlatform) {
  return link.enabled && isValidContactUrl(platform, link.url);
}

export function parseHomepageContactLinks(rows: Array<{ key: string; value: unknown }>): HomepageContactLinks {
  const values = new Map(rows.map((row) => [row.key, row.value]));
  return {
    facebook: { url: text(values.get("homepage_contact.facebook_url")), enabled: bool(values.get("homepage_contact.facebook_enabled")), label: text(values.get("homepage_contact.facebook_label"), defaults.facebook.label) || defaults.facebook.label },
    zalo: { url: text(values.get("homepage_contact.zalo_url")), enabled: bool(values.get("homepage_contact.zalo_enabled")), label: text(values.get("homepage_contact.zalo_label"), defaults.zalo.label) || defaults.zalo.label },
    youtube: { url: text(values.get("homepage_contact.youtube_url")), enabled: bool(values.get("homepage_contact.youtube_enabled")), label: text(values.get("homepage_contact.youtube_label"), defaults.youtube.label) || defaults.youtube.label },
    supportCta: text(values.get("homepage_contact.support_cta"), defaults.supportCta),
    floatingZaloEnabled: bool(values.get("homepage_contact.floating_zalo_enabled")),
  };
}

export const defaultHomepageContactLinks = defaults;
