import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, PlayCircle, Sparkles, Wrench, Workflow as WorkflowIcon } from "lucide-react";
import { ProductPurchaseActions } from "@/components/cart/ProductPurchaseActions";
import { ProductCard, ProductCardGrid } from "@/components/product/ProductCard";
import { getMarketplaceCardActions, getMarketplaceCompareAtPriceLabel, getMarketplacePriceLabel } from "@/lib/catalog/product-state";
import type { Workflow } from "@/lib/workflows";
import { getRelatedWorkflows, getWorkflowBySlug } from "@/lib/workflows";

type WorkflowPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function WorkflowPrimaryAction({ workflow, className }: { workflow: Workflow; className: string }) {
  if (workflow.state.canAccessFree && workflow.appUrl) {
    return <a href={workflow.appUrl} target="_blank" rel="noopener noreferrer" className={className}>{workflow.ctaLabel ?? "Sử dụng miễn phí"}<WorkflowIcon className="h-4 w-4" /></a>;
  }

  if (workflow.state.isPurchasable) {
    return <ProductPurchaseActions productId={workflow.databaseId} className="mt-8 max-w-xl" />;
  }

  const label = workflow.state.isComingSoon ? "Sắp ra mắt" : workflow.state.isPaused ? "Tạm dừng" : "Chưa thể truy cập";
  return <span aria-disabled="true" className={`${className} cursor-not-allowed opacity-65`}>{label}<Clock3 className="h-4 w-4" /></span>;
}

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
  const relatedWorkflows = await getRelatedWorkflows(workflow);
  const descriptionParagraphs = workflow.fullDescription.split(/\n\s*\n/).filter(Boolean);
  const priceLabel = getMarketplacePriceLabel(workflow.state);
  const compareAtPriceLabel = getMarketplaceCompareAtPriceLabel(workflow.state);
  const ctaTitle = workflow.ctaTitle ?? (workflow.state.canAccessFree ? "Bắt đầu với AI App này ngay" : workflow.state.isPurchasable ? "Sở hữu AI App để áp dụng ngay" : workflow.state.isComingSoon ? "AI App sắp ra mắt" : "AI App hiện chưa khả dụng");
  const ctaDescription = workflow.ctaDescription ?? "Làm theo từng bước để tiết kiệm thời gian thử nghiệm và tạo nội dung AI nhất quán hơn.";
  const primaryActionClass = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-5 text-sm font-extrabold text-white shadow-[0_0_26px_rgba(59,130,246,.26)] transition hover:-translate-y-0.5 hover:brightness-110";

  return (
    <main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
      <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-400"><Link href="/" className="hover:text-sky-300">Trang chủ</Link><span>/</span><Link href="/workflow?tab=ai-app" className="hover:text-sky-300">AI App</Link><span>/</span><span className="font-semibold text-slate-200">{workflow.name}</span></nav>
      <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B1728]">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-[100px]" />
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
          <div className="relative mx-auto aspect-[9/16] max-h-[640px] w-full max-w-[380px] overflow-hidden bg-[#07111F]"><img src={workflow.coverImage} alt={`Ảnh bìa ${workflow.name}`} className="absolute inset-0 h-full w-full object-contain" /></div>
          <div className="relative p-6 sm:p-10"><Link href="/workflow?tab=ai-app" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Quay lại AI App</Link><div className="mb-5 flex flex-wrap items-center gap-2"><span className={`rounded-full border px-3 py-1.5 text-xs font-black ${workflow.state.isFree ? "border-cyan-200/35 bg-cyan-400/20 text-cyan-100" : "border-sky-300/25 bg-sky-500/10 text-sky-200"}`}>{workflow.badge}</span>{workflow.state.hasActiveFlashSale ? <span className="rounded-full border border-rose-300/30 bg-rose-500/15 px-3 py-1.5 text-xs font-black text-rose-200">SALE</span> : null}<span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-200">{workflow.category}</span></div><h1 className="text-3xl font-extrabold tracking-[-.04em] text-white sm:text-4xl">{workflow.name}</h1><p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">{workflow.shortDescription}</p>{!workflow.hidePrice && priceLabel ? <div className="mt-7 flex items-end gap-3"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-slate-500">Giá AI App</p><div className="mt-1 flex items-center gap-3"><span className={`text-3xl font-black ${workflow.state.isFree ? "text-cyan-300" : "text-white"}`}>{priceLabel}</span>{compareAtPriceLabel ? <span className="text-sm font-semibold text-slate-500 line-through">{compareAtPriceLabel}</span> : null}</div>{workflow.license ? <p className="mt-2 text-xs font-semibold text-slate-300">{workflow.license}</p> : null}</div></div> : null}<WorkflowPrimaryAction workflow={workflow} className={`mt-8 ${primaryActionClass}`} /></div>
        </div>
      </section>

      <section className="mt-12 grid gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]"><div className="space-y-12"><div><h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl"><span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><Sparkles className="h-4.5 w-4.5" /></span>Mô tả Workflow</h2><div className="mt-5 space-y-4 text-sm leading-7 text-slate-300 sm:text-base">{descriptionParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div>{workflow.features?.length ? <div><h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl"><span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><Sparkles className="h-4.5 w-4.5" /></span>Tính năng</h2><ul className="mt-5 grid gap-3 sm:grid-cols-2">{workflow.features.map((feature) => <li key={feature} className="flex gap-3 rounded-2xl border border-white/[0.07] bg-[#0F1F33] p-4 text-sm leading-6 text-slate-200"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />{feature}</li>)}</ul></div> : null}<div id="workflow-steps" className="scroll-mt-24"><h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl"><span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><WorkflowIcon className="h-4.5 w-4.5" /></span>Cách sử dụng</h2><ol className="mt-5 space-y-3">{workflow.steps.map((step, index) => <li key={step} className="flex gap-4 rounded-2xl border border-white/[0.07] bg-[#0F1F33] p-4 text-sm leading-6 text-slate-200"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-500/15 text-xs font-black text-sky-200">{index + 1}</span>{step}</li>)}</ol></div><div><h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white sm:text-2xl"><span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><PlayCircle className="h-4.5 w-4.5" /></span>Video demo</h2>{workflow.demoVideoUrl ? <video controls preload="metadata" className="mt-5 aspect-video w-full rounded-2xl border border-white/[0.08] bg-black"><source src={workflow.demoVideoUrl} /></video> : <div className="mt-5 grid aspect-video place-items-center rounded-2xl border border-dashed border-sky-300/20 bg-[#0F1F33]/70 p-6 text-center"><div><PlayCircle className="mx-auto h-10 w-10 text-sky-300" /><p className="mt-3 text-sm font-bold text-white">Video demo đang được cập nhật</p><p className="mt-1 text-sm text-slate-400">Bạn vẫn có thể xem đầy đủ quy trình và áp dụng ngay bên dưới.</p></div></div>}</div></div><aside className="space-y-6"><div><h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white"><span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><Wrench className="h-4.5 w-4.5" /></span>Công cụ sử dụng</h2><ul className="mt-5 space-y-2">{workflow.tools.map((tool) => <li key={tool} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0F1F33] px-4 py-3 text-sm font-semibold text-slate-200"><CheckCircle2 className="h-4 w-4 text-cyan-300" />{tool}</li>)}</ul></div>{workflow.suitableFor?.length ? <div><h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white"><span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300"><CheckCircle2 className="h-4.5 w-4.5" /></span>Phù hợp với</h2><ul className="mt-5 space-y-2">{workflow.suitableFor.map((item) => <li key={item} className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0F1F33] px-4 py-3 text-sm font-semibold text-slate-200"><CheckCircle2 className="h-4 w-4 text-cyan-300" />{item}</li>)}</ul></div> : null}<div className="rounded-2xl border border-white/[0.08] bg-[#0F1F33] p-5"><h2 className="flex items-center gap-2 text-lg font-extrabold text-white"><Clock3 className="h-4 w-4 text-sky-300" />Thông tin nhanh</h2><dl className="mt-5 space-y-4 text-sm"><div><dt className="text-slate-500">Danh mục</dt><dd className="mt-1 font-bold text-white">{workflow.category}</dd></div><div><dt className="text-slate-500">Hình thức</dt><dd className="mt-1 font-bold text-white">{workflow.isFree ? "Sử dụng miễn phí" : "Workflow trả phí"}</dd></div><div><dt className="text-slate-500">Tags</dt><dd className="mt-2 flex flex-wrap gap-2">{workflow.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-300">{tag}</span>)}</dd></div></dl></div></aside></section>

      <section className="relative mt-14 overflow-hidden rounded-[28px] border border-sky-300/20 bg-gradient-to-br from-[#0F1F33] via-[#0B1728] to-sky-950/45 p-7 sm:p-10"><div className="absolute -right-14 -top-14 h-48 w-48 rounded-full bg-sky-400/15 blur-[70px]" /><div className="relative max-w-2xl"><p className="text-xs font-black uppercase tracking-[.2em] text-sky-300">Sẵn sàng áp dụng?</p><h2 className="mt-3 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{ctaTitle}</h2><p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{ctaDescription}</p><WorkflowPrimaryAction workflow={workflow} className={`mt-6 ${primaryActionClass}`} /></div></section>
      {relatedWorkflows.length ? <section className="mt-14"><h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">Workflow liên quan</h2><ProductCardGrid className="mt-5">{relatedWorkflows.map((relatedWorkflow) => { const detailHref = relatedWorkflow.detailUrl ?? `/workflow/${relatedWorkflow.slug}`; return <ProductCard key={relatedWorkflow.id} title={relatedWorkflow.name} description={relatedWorkflow.shortDescription} image={relatedWorkflow.coverImage} imageAlt={`Ảnh bìa ${relatedWorkflow.name}`} category={relatedWorkflow.category} badge={relatedWorkflow.badge} status={relatedWorkflow.state.hasActiveFlashSale ? "SALE" : undefined} price={!relatedWorkflow.hidePrice ? getMarketplacePriceLabel(relatedWorkflow.state) : undefined} originalPrice={!relatedWorkflow.hidePrice ? getMarketplaceCompareAtPriceLabel(relatedWorkflow.state) : undefined} href={detailHref} meta={!relatedWorkflow.appUrl ? relatedWorkflow.tools.slice(0, 3).map((tool) => ({ label: tool })) : undefined} actions={getMarketplaceCardActions(relatedWorkflow.state, detailHref, relatedWorkflow.appUrl, relatedWorkflow.databaseId)} demoVideo={relatedWorkflow.demoVideo} />; })}</ProductCardGrid></section> : null}
    </main>
  );
}
