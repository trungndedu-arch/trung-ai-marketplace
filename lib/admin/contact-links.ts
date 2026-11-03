import { requireAdminAccess } from "@/lib/auth/admin";
import { HOMEPAGE_CONTACT_SETTING_KEYS, parseHomepageContactLinks, type HomepageContactLinks } from "@/lib/homepage-contact-links";
import { createClient } from "@/lib/supabase/server";

export async function getAdminHomepageContactLinks(): Promise<{ settings: HomepageContactLinks | null; error: string | null }> {
  await requireAdminAccess("/admin/contact-links");
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("key,value").in("key", HOMEPAGE_CONTACT_SETTING_KEYS);
  if (error) return { settings: null, error: "Không thể tải cài đặt kênh liên hệ. Kiểm tra cấu hình site_settings." };
  return { settings: parseHomepageContactLinks(data ?? []), error: null };
}
