// TEST WORK
import { HomePageClient } from "@/components/home/HomePageClient";
import { getFeaturedAiTools } from "@/lib/ai-tools";
import { getFeaturedChatbots } from "@/lib/chatbots";
import { getFeaturedCourses } from "@/lib/courses";
import { getFeaturedWorkflows } from "@/lib/workflows";
import { getCurrentUserSummary } from "@/lib/auth/session";

// Marketplace home page and featured AI tools.

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [chatbots, apps, courses, aiTools, user] = await Promise.all([
    getFeaturedChatbots(),
    getFeaturedWorkflows(),
    getFeaturedCourses(),
    getFeaturedAiTools(),
    getCurrentUserSummary(),
  ]);

  return (
    <HomePageClient
      chatbots={chatbots}
      apps={apps}
      courses={courses}
      aiTools={aiTools}
      user={user}
    />
  );
}
