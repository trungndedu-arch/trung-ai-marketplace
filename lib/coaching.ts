// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { contactLinkIsVisible, type HomepageContactLinks } from "./homepage-contact-links.ts";

/**
 * Coaching currently opens the contact modal. Keep the future landing-page
 * address here for when a dedicated page is introduced.
 */
export const coachingLanding = {
  enabled: true,
  href: "/coaching-ai-1-1",
  label: "Coaching AI 1:1",
} as const;

export function getCoachingContactLinks(settings: HomepageContactLinks) {
  return [
    contactLinkIsVisible(settings.facebook, "facebook") ? { key: "facebook" as const, ...settings.facebook } : null,
    contactLinkIsVisible(settings.zalo, "zalo") ? { key: "zalo" as const, ...settings.zalo } : null,
  ].filter((link): link is NonNullable<typeof link> => Boolean(link));
}
