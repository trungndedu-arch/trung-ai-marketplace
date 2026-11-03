// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { isValidContactUrl, type ContactPlatform, type HomepageContactLinks } from "../homepage-contact-links.ts";

export type ContactLinksMutationState = { status: "idle" | "success" | "error"; message: string; fieldErrors: Record<string, string | undefined> };
export const initialContactLinksMutationState: ContactLinksMutationState = { status: "idle", message: "", fieldErrors: {} };
const value = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim();
const enabled = (formData: FormData, name: string) => formData.get(name) === "on";

export function validateContactLinks(formData: FormData) {
  const fieldErrors: ContactLinksMutationState["fieldErrors"] = {};
  const platforms: ContactPlatform[] = ["facebook", "zalo", "youtube"];
  const links = Object.fromEntries(platforms.map((platform) => {
    const url = value(formData, `${platform}Url`);
    const label = value(formData, `${platform}Label`);
    const isEnabled = enabled(formData, `${platform}Enabled`);
    if (isEnabled && !url) fieldErrors[`${platform}Url`] = "Cần nhập URL trước khi bật hiển thị.";
    else if (url && !isValidContactUrl(platform, url)) fieldErrors[`${platform}Url`] = `URL ${platform === "zalo" ? "Zalo" : platform} không hợp lệ.`;
    if (isEnabled && !label) fieldErrors[`${platform}Label`] = "Nhãn hiển thị là bắt buộc.";
    if (label.length > 40) fieldErrors[`${platform}Label`] = "Nhãn tối đa 40 ký tự.";
    return [platform, { url, label, enabled: isEnabled }];
  })) as Pick<HomepageContactLinks, "facebook" | "zalo" | "youtube">;
  const supportCta = value(formData, "supportCta");
  const floatingZaloEnabled = enabled(formData, "floatingZaloEnabled");
  if (supportCta.length > 300) fieldErrors.supportCta = "Dòng hỗ trợ tối đa 300 ký tự.";
  if (floatingZaloEnabled && (!links.zalo.enabled || !isValidContactUrl("zalo", links.zalo.url))) fieldErrors.floatingZaloEnabled = "Chỉ bật nút Zalo nổi khi Zalo đã bật và có URL hợp lệ.";
  return { isValid: Object.keys(fieldErrors).length === 0, fieldErrors, values: { ...links, supportCta, floatingZaloEnabled } };
}
