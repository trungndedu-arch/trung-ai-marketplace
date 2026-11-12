// TEST WORK
import { HomePageClient } from "@/components/home/HomePageClient";
import { getFeaturedAiTools } from "@/lib/ai-tools";
import { getFeaturedChatbots } from "@/lib/chatbots";
import { getFeaturedWorkflows } from "@/lib/workflows";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { getPublicSiteSettings } from "@/lib/catalog/public-content";
import { HOMEPAGE_CONTACT_SETTING_KEYS, parseHomepageContactLinks } from "@/lib/homepage-contact-links";

// Marketplace home page and featured AI tools.

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [chatbots, apps, aiTools, user, contactSettings] = await Promise.all([
    getFeaturedChatbots(),
    getFeaturedWorkflows(),
    getFeaturedAiTools(),
    getCurrentUserSummary(),
    getPublicSiteSettings([...HOMEPAGE_CONTACT_SETTING_KEYS]),
  ]);

  return (
    <HomePageClient
      chatbots={chatbots}
      apps={apps}
      aiTools={aiTools}
      user={user}
      contactLinks={parseHomepageContactLinks(contactSettings)}
    />
  );
}
