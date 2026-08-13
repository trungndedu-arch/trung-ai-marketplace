import { notFound } from "next/navigation";
import { VideoAiCourseClient } from "@/components/video-ai-course/VideoAiCourseClient";
import { getCurrentUserSummary } from "@/lib/auth/session";
import { getCourseBySlug } from "@/lib/courses";

export const dynamic = "force-dynamic";

export default async function VideoAICoursePage() {
  const [course, user] = await Promise.all([
    getCourseBySlug("video-ai-course"),
    getCurrentUserSummary(),
  ]);

  if (!course) notFound();

  return <VideoAiCourseClient user={user} />;
}
