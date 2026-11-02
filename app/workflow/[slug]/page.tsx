import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkflowDetailContent } from "@/components/workflows/WorkflowDetailContent";
import { getWorkflowBySlug } from "@/lib/workflows";

type WorkflowPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: WorkflowPageProps): Promise<Metadata> {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);
  if (!workflow) return { title: "Không tìm thấy Workflow | Trung AI Media" };
  return {
    title: workflow.seoTitle,
    description: workflow.seoDescription,
    alternates: { canonical: `/workflow/${workflow.slug}` },
    openGraph: { title: workflow.seoTitle, description: workflow.seoDescription, type: "website", images: [{ url: workflow.coverImage, alt: workflow.name }] },
  };
}

export default async function WorkflowDetailPage({ params }: WorkflowPageProps) {
  const { slug } = await params;
  const workflow = await getWorkflowBySlug(slug);
  if (!workflow) notFound();

  return <WorkflowDetailContent workflow={workflow} />;
}
