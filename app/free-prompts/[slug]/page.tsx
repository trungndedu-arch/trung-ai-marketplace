import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FreePromptDetail } from "@/components/free-prompts/FreePromptDetail";
import { getPublicFreePromptBySlug } from "@/lib/free-prompts-repository";

type FreePromptDetailPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: FreePromptDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = await getPublicFreePromptBySlug(slug);
  if (!prompt) return { title: "Không tìm thấy Prompt | Trung AI Media" };
  return { title: prompt.seoTitle ?? prompt.title, description: prompt.seoDescription ?? prompt.description, alternates: { canonical: `/free-prompts/${prompt.slug}` }, openGraph: { title: prompt.title, description: prompt.description, type: "website", images: prompt.image ? [{ url: prompt.image, alt: prompt.title }] : undefined } };
}

export default async function FreePromptDetailPage({ params }: FreePromptDetailPageProps) {
  const { slug } = await params;
  const prompt = await getPublicFreePromptBySlug(slug);
  if (!prompt) notFound();
  return <FreePromptDetail prompt={prompt} />;
}
