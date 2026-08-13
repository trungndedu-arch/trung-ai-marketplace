import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, Sparkles } from "lucide-react";
import { AiToolsShell } from "@/components/ai-tools/AiToolsShell";
import { PromptCopyButton } from "@/components/free-prompts/PromptCopyButton";
import { getPromptBySlug } from "@/lib/free-prompts";

type FreePromptDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: FreePromptDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    return {
      title: "Không tìm thấy Prompt | Trung AI Media",
    };
  }

  return {
    title: prompt.title,
    description: prompt.description,
    alternates: { canonical: `/free-prompts/${prompt.slug}` },
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      type: "website",
      images: prompt.image ? [{ url: prompt.image, alt: prompt.title }] : undefined,
    },
  };
}

export default async function FreePromptDetailPage({ params }: FreePromptDetailPageProps) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) notFound();

  const images = prompt.images ?? (prompt.image ? [prompt.image] : []);
  const Icon = prompt.icon;

  return (
    <AiToolsShell>
      <main className="mx-auto max-w-[1200px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-sky-300">Trang chủ</Link>
          <span>/</span>
          <Link href="/free-prompts" className="hover:text-sky-300">Prompt AI Miễn Phí</Link>
          <span>/</span>
          <span className="font-semibold text-slate-200">{prompt.title}</span>
        </nav>

        <section className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0B1728]">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-[100px]" />
          <div className="relative grid gap-0 lg:grid-cols-[minmax(300px,420px)_minmax(0,1fr)]">
            <div className={`relative mx-auto aspect-[9/16] max-h-[680px] w-full max-w-[420px] overflow-hidden bg-gradient-to-br ${prompt.gradient}`}>
              {prompt.image ? (
                <Image
                  src={prompt.image}
                  alt={prompt.title}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="object-cover object-center"
                  priority
                />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.16)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.16)_1px,transparent_1px)] [background-size:28px_28px]" />
                  <div className="absolute left-1/2 top-1/2 grid h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[34px] border border-white/20 bg-black/20 backdrop-blur-md">
                    <Icon className="h-14 w-14 text-white" />
                  </div>
                </>
              )}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B1728] to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-sky-200/25 bg-[#07111F]/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-sky-100 backdrop-blur-md">Prompt</span>
            </div>

            <div className="flex min-w-0 flex-col p-6 sm:p-10">
              <Link href="/free-prompts" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Quay lại Prompt AI Miễn Phí
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-sky-300/25 bg-sky-500/10 px-3 py-1.5 text-xs font-black text-sky-200">{prompt.category}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-200">{prompt.model}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-slate-200">{prompt.count}</span>
              </div>

              <h1 className="mt-5 text-3xl font-extrabold tracking-[-.04em] text-white sm:text-4xl">{prompt.title}</h1>
              {prompt.description ? <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">{prompt.description}</p> : null}

              <div className="mt-7 flex items-center gap-2 text-sm text-slate-300">
                <Sparkles className="h-4 w-4 text-sky-400" />
                Dùng ngay với <b className="text-slate-100">{prompt.model}</b>
              </div>

              <div className="mt-auto pt-8">
                <PromptCopyButton prompt={prompt.prompt} />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-[24px] border border-white/[0.08] bg-[#0F1F33] p-5 sm:p-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-white">
                <span className="grid h-9 w-9 place-items-center rounded-xl border border-sky-300/20 bg-sky-500/10 text-sky-300">
                  <Sparkles className="h-4.5 w-4.5" />
                </span>
                Nội dung Prompt
              </h2>
              <PromptCopyButton prompt={prompt.prompt} className="min-h-10 px-4 text-xs" />
            </div>
            <pre className="max-w-full whitespace-pre-wrap break-words rounded-2xl border border-white/[0.07] bg-black/25 p-4 font-sans text-sm leading-7 text-slate-200 sm:p-5 sm:text-base">{prompt.prompt}</pre>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[24px] border border-white/[0.08] bg-[#0F1F33] p-5">
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-white">
                <ImageIcon className="h-4 w-4 text-sky-300" />
                Thông tin nhanh
              </h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Danh mục</dt>
                  <dd className="mt-1 font-bold text-white">{prompt.category}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Model AI</dt>
                  <dd className="mt-1 font-bold text-white">{prompt.model}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Số ảnh mẫu</dt>
                  <dd className="mt-1 font-bold text-white">{prompt.count}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </section>

        {images.length > 1 ? (
          <section className="mt-8 rounded-[24px] border border-white/[0.08] bg-[#0F1F33] p-5 sm:p-7">
            <h2 className="text-xl font-extrabold tracking-tight text-white">Ảnh ví dụ</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div key={image} className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#07111F]">
                  <Image src={image} alt={`${prompt.title} - ảnh ${index + 1}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-center" />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </AiToolsShell>
  );
}
