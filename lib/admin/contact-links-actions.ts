"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/auth/admin";
import { validateContactLinks, type ContactLinksMutationState } from "@/lib/admin/contact-links-validation";
import { createClient } from "@/lib/supabase/server";

export async function updateHomepageContactLinks(_: ContactLinksMutationState, formData: FormData): Promise<ContactLinksMutationState> {
  const admin = await requireAdminAccess("/admin/contact-links");
  const validation = validateContactLinks(formData);
  if (!validation.isValid) return { status: "error", message: "Kiểm tra lại các trường được đánh dấu.", fieldErrors: validation.fieldErrors };
  const { facebook, zalo, youtube, supportCta, floatingZaloEnabled } = validation.values;
  const links: Array<["facebook" | "zalo" | "youtube", { url: string; enabled: boolean; label: string }]> = [
    ["facebook", facebook], ["zalo", zalo], ["youtube", youtube],
  ];
  const rows = links.flatMap(([platform, link]) => [
    { key: `homepage_contact.${platform}_url`, value: link.url, visibility: "public" as const, description: `URL ${platform} trên trang chủ`, updated_by: admin.userId },
    { key: `homepage_contact.${platform}_enabled`, value: link.enabled, visibility: "public" as const, description: `Bật ${platform} trên trang chủ`, updated_by: admin.userId },
    { key: `homepage_contact.${platform}_label`, value: link.label, visibility: "public" as const, description: `Nhãn ${platform} trên trang chủ`, updated_by: admin.userId },
  ]).concat([
    { key: "homepage_contact.support_cta", value: supportCta, visibility: "public" as const, description: "Dòng hỗ trợ kênh liên hệ", updated_by: admin.userId },
    { key: "homepage_contact.floating_zalo_enabled", value: floatingZaloEnabled, visibility: "public" as const, description: "Bật nút Zalo nổi", updated_by: admin.userId },
  ]);
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" }).select("key");
  if (error || (data ?? []).length !== rows.length) return { status: "error", message: "Không thể lưu cài đặt kênh liên hệ.", fieldErrors: {} };
  revalidatePath("/"); revalidatePath("/admin/contact-links");
  return { status: "success", message: "Đã lưu kênh liên hệ trên trang chủ.", fieldErrors: {} };
}
