import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, Globe2, PlayCircle, Sparkles, Tag, Users, Video, type LucideIcon } from "lucide-react";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";
import { getAiToolBySlug, getRelatedAiTools } from "@/lib/ai-tools";

// Public detail route for each active AI tool.

type ToolPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getAiToolBySlug(slug);
  if (!tool) return { title: "Không tìm thấy công cụ | Trung AI Media" };

  const title = tool.seoTitle || `${tool.name} – Công cụ AI nên dùng`;
  const description = tool.seoDescription || tool.shortDescription;
  return {
    title,
    description,
    alternates: { canonical: `/cong-cu-ai/${tool.slug}` },
    openGraph: { title, description, type: "website", images: [{ url: tool.coverImage, alt: tool.name }] },
  };
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl"><span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><Icon className="h-4.5 w-4.5" /></span>{title}</h2>;
}

function AffiliateButton({ href, label = "Truy cập công cụ" }: { href: string; label?: string }) {
  if (!href) return <span aria-disabled="true" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 text-sm font-extrabold text-slate-500">Sắp cập nhật</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer sponsored" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-5 text-sm font-extrabold text-white shadow-[0_0_26px_rgba(59,130,246,.26)] transition hover:-translate-y-0.5 hover:brightness-110">{label}<ExternalLink className="h-4 w-4" /></a>;
}

export default async function AiToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = await getAiToolBySlug(slug);
  if (!tool) notFound();
  const relatedTools = await getRelatedAiTools(tool);
  const descriptionParagraphs = tool.fullDescription.split(/\n\s*\n/).filter(Boolean);
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.seoDescription || tool.shortDescription,
    applicationCategory: tool.category,
    operatingSystem: "Web",
    image: tool.coverImage,
    url: `/cong-cu-ai/${tool.slug}`,
  };

  return <main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }} />
    <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-400"><Link href="/" className="hover:text-sky-300">Trang chủ</Link><span>/</span><Link href="/cong-cu-ai" className="hover:text-sky-300">Công Cụ AI</Link><span>/</span><span className="font-semibold text-slate-200">{tool.name}</span></nav>

    <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B1728]"><div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-[100px]" /><div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(340px,.95fr)]"><div className="relative min-h-[340px] bg-[#07111F] p-6 sm:p-10"><img src={tool.coverImage} alt={`Ảnh bìa ${tool.name}`} className="absolute inset-0 h-full w-full object-contain" /><div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#07111F] to-transparent" /></div><div className="relative p-6 sm:p-10"><Link href="/cong-cu-ai" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Quay lại danh sách công cụ</Link><div className="mb-5 flex flex-wrap items-center gap-2"><span className="rounded-full border border-sky-300/25 bg-sky-500/10 px-3 py-1.5 text-xs font-black text-sky-200">{tool.badge}</span><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-200">{tool.category}</span><span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-200">{tool.toolType}</span></div><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl border border-sky-300/25 bg-sky-500/15 text-sky-200">{tool.logo ? <img src={tool.logo} alt={`Logo ${tool.name}`} className="h-full w-full object-contain p-1.5" /> : <Video className="h-6 w-6" />}</span><h1 className="text-3xl font-extrabold tracking-[-.04em] text-white sm:text-4xl">{tool.name}</h1></div><p className="mt-5 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">{tool.shortDescription}</p><div className="mt-8 flex flex-wrap gap-3"><AffiliateButton href={tool.state.canVisitAffiliate ? tool.affiliateUrl : ""} />{tool.tutorialUrl ? <a href={tool.tutorialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-sky-300/25 bg-sky-500/10 px-5 text-sm font-extrabold text-sky-200 transition hover:border-sky-300/50 hover:text-white"><PlayCircle className="h-4 w-4" /> Xem hướng dẫn</a> : null}</div></div></div></section>

    <section className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)]"><div className="space-y-12"><div><SectionTitle icon={Sparkles} title={`Giới thiệu về ${tool.name}`} /><div className="mt-5 space-y-4 text-sm leading-7 text-slate-300 sm:text-base">{descriptionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div><div><SectionTitle icon={CheckCircle2} title="Tính năng nổi bật" /><ul className="mt-5 grid gap-3 sm:grid-cols-2">{tool.features.map((feature) => <li key={feature} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-[#0F1F33] p-4 text-sm leading-6 text-slate-200"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />{feature}</li>)}</ul></div><div><SectionTitle icon={Sparkles} title="Có thể dùng để làm gì" /><div className="mt-5 flex flex-wrap gap-2">{tool.useCases.map((useCase) => <span key={useCase} className="rounded-xl border border-sky-300/15 bg-sky-500/[0.07] px-3 py-2 text-sm font-semibold text-sky-100">{useCase}</span>)}</div></div><div><SectionTitle icon={CheckCircle2} title="Ưu điểm" /><ul className="mt-5 grid gap-3 sm:grid-cols-2">{tool.benefits.map((benefit) => <li key={benefit} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-[#0F1F33] p-4 text-sm leading-6 text-slate-200"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{benefit}</li>)}</ul></div></div>
      <aside className="space-y-6"><div><SectionTitle icon={Users} title="Phù hợp với ai" /><ul className="mt-5 space-y-2">{tool.targetUsers.map((user) => <li key={user} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0F1F33] px-4 py-3 text-sm text-slate-200"><Users className="h-4 w-4 text-sky-300" />{user}</li>)}</ul></div><div className="rounded-2xl border border-white/[0.08] bg-[#0F1F33] p-5"><SectionTitle icon={Globe2} title="Thông tin công cụ" /><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-slate-500">Danh mục</dt><dd className="mt-1 font-bold text-white">{tool.category}</dd></div><div><dt className="text-slate-500">Loại công cụ</dt><dd className="mt-1 font-bold text-white">{tool.toolType}</dd></div>{tool.officialWebsite ? <div><dt className="text-slate-500">Website chính thức</dt><dd className="mt-1"><a href={tool.officialWebsite} target="_blank" rel="noopener noreferrer" className="font-bold text-sky-300 hover:text-white">Mở website <ExternalLink className="inline h-3.5 w-3.5" /></a></dd></div> : null}<div><dt className="flex items-center gap-2 text-slate-500"><Tag className="h-3.5 w-3.5" /> Tags</dt><dd className="mt-2 flex flex-wrap gap-2">{tool.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300">{tag}</span>)}</dd></div></dl></div></aside>
    </section>

    {tool.galleryImages.length || tool.demoVideoUrl ? <section className="mt-12"><SectionTitle icon={PlayCircle} title="Hình ảnh và video demo" />{tool.galleryImages.length ? <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{tool.galleryImages.map((image) => <div key={image} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1F33]"><img src={image} alt={`Hình ảnh ${tool.name}`} className="aspect-video w-full object-cover" /></div>)}</div> : null}{tool.demoVideoUrl ? <video controls preload="metadata" className="mt-5 w-full rounded-2xl border border-white/[0.08] bg-black"><source src={tool.demoVideoUrl} /></video> : null}</section> : null}

    {relatedTools.length ? <section className="mt-14"><SectionTitle icon={Sparkles} title="Công cụ liên quan" /><ProductCardGrid className="mt-5">{relatedTools.map((relatedTool) => <ProductCard key={relatedTool.id} title={relatedTool.name} description={relatedTool.shortDescription} image={relatedTool.coverImage} imageAlt={`Ảnh bìa ${relatedTool.name}`} category={relatedTool.category} badge={relatedTool.badge} status={relatedTool.toolType} href={`/cong-cu-ai/${relatedTool.slug}`} meta={relatedTool.tags.slice(0, 3).map((tag) => ({ label: tag, tone: "blue" }))} actions={[{ label: "Xem chi tiết", href: `/cong-cu-ai/${relatedTool.slug}` }, relatedTool.state.canVisitAffiliate ? { label: "Truy cập", href: relatedTool.affiliateUrl, external: true, variant: "primary" } : { label: "Sắp cập nhật", disabled: true, variant: "muted" }]} demoVideo={relatedTool.demoVideo} />)}</ProductCardGrid></section> : null}

    <section className="relative mt-14 overflow-hidden rounded-[28px] border border-sky-300/20 bg-gradient-to-br from-[#0F1F33] via-[#0B1728] to-sky-950/45 p-7 sm:p-10"><div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-sky-400/15 blur-[70px]" /><div className="relative max-w-2xl"><p className="text-xs font-black uppercase tracking-[.2em] text-sky-300">Sẵn sàng bắt đầu?</p><h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Trải nghiệm {tool.name}</h2><p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">Khám phá các tính năng của {tool.name} và bắt đầu tạo nội dung AI ngay hôm nay.</p><div className="mt-6"><AffiliateButton href={tool.state.canVisitAffiliate ? tool.affiliateUrl : ""} /></div></div></section>
    <footer className="mt-12 border-t border-white/[0.06] py-8 text-sm leading-6 text-slate-400">Một số liên kết trên trang là liên kết tiếp thị liên kết. Mình có thể nhận được hoa hồng khi bạn đăng ký qua các liên kết này mà không làm tăng chi phí của bạn.</footer>
  </main>;
}
