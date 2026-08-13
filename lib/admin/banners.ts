import { BANNER_ASSETS_BUCKET, isBannerId, isCanonicalBannerAssetPath } from "@/lib/banner-assets";
import { HOME_HERO_POSITION } from "@/lib/admin/banner-validation";
import { requireAdminAccess } from "@/lib/auth/admin";
import type { PublicationStatus } from "@/lib/catalog/types";
import { createClient } from "@/lib/supabase/server";

export type BannerRuntimeState = "draft" | "hidden" | "scheduled" | "active" | "expired";

export type AdminBanner = {
  id: string;
  position: typeof HOME_HERO_POSITION;
  desktopImagePath: string;
  desktopImageUrl: string;
  mobileImagePath: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaUrl: string;
  status: PublicationStatus;
  runtimeState: BannerRuntimeState;
  startAt: string | null;
  endAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

type BannerRow = {
  id: string;
  position: string;
  desktop_image_path: string | null;
  mobile_image_path: string | null;
  title: string | null;
  subtitle: string | null;
  cta_label: string | null;
  cta_url: string | null;
  status: PublicationStatus;
  start_at: string | null;
  end_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const bannerSelect = "id, position, desktop_image_path, mobile_image_path, title, subtitle, cta_label, cta_url, status, start_at, end_at, sort_order, created_at, updated_at";

export function getBannerRuntimeState(
  banner: Pick<AdminBanner, "status" | "startAt" | "endAt">,
  now = new Date(),
): BannerRuntimeState {
  if (banner.status === "draft") return "draft";
  if (banner.status === "hidden") return "hidden";

  const currentTime = now.getTime();
  const startTime = banner.startAt ? Date.parse(banner.startAt) : null;
  const endTime = banner.endAt ? Date.parse(banner.endAt) : null;
  if (startTime !== null && startTime > currentTime) return "scheduled";
  if (endTime !== null && endTime <= currentTime) return "expired";
  return "active";
}

function normalizeBanner(row: BannerRow, getPublicUrl: (path: string) => string): AdminBanner {
  const desktopImagePath = row.desktop_image_path ?? "";
  const mobileImagePath = row.mobile_image_path ?? "";
  const banner: AdminBanner = {
    id: row.id,
    position: HOME_HERO_POSITION,
    desktopImagePath,
    desktopImageUrl: isCanonicalBannerAssetPath(desktopImagePath, row.id, "desktop") ? getPublicUrl(desktopImagePath) : "",
    mobileImagePath,
    mobileImageUrl: isCanonicalBannerAssetPath(mobileImagePath, row.id, "mobile") ? getPublicUrl(mobileImagePath) : "",
    title: row.title ?? "",
    subtitle: row.subtitle ?? "",
    ctaLabel: row.cta_label ?? "",
    ctaUrl: row.cta_url ?? "",
    status: row.status,
    runtimeState: "draft",
    startAt: row.start_at,
    endAt: row.end_at,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  banner.runtimeState = getBannerRuntimeState(banner);
  return banner;
}

export async function getAdminBanners() {
  await requireAdminAccess("/admin/banners");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select(bannerSelect)
    .eq("position", HOME_HERO_POSITION)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    console.error("[admin/banners] Unable to load banners:", error);
    return { banners: [] as AdminBanner[], error: "Không thể tải danh sách banner lúc này." };
  }

  const storage = supabase.storage.from(BANNER_ASSETS_BUCKET);
  const getPublicUrl = (path: string) => storage.getPublicUrl(path).data.publicUrl;
  return { banners: ((data ?? []) as BannerRow[]).map((row) => normalizeBanner(row, getPublicUrl)), error: null };
}

export async function getAdminBannerById(id: string) {
  await requireAdminAccess(`/admin/banners/${id}/edit`);
  if (!isBannerId(id)) return { banner: null, error: null };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select(bannerSelect)
    .eq("id", id)
    .eq("position", HOME_HERO_POSITION)
    .maybeSingle();

  if (error) {
    console.error("[admin/banners] Unable to load banner:", error);
    return { banner: null, error: "Không thể tải thông tin banner lúc này." };
  }

  if (!data) return { banner: null, error: null };
  const storage = supabase.storage.from(BANNER_ASSETS_BUCKET);
  return {
    banner: normalizeBanner(data as BannerRow, (path) => storage.getPublicUrl(path).data.publicUrl),
    error: null,
  };
}
