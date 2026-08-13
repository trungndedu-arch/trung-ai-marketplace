"use client";

import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { replaceBannerImage, type BannerImageUploadState } from "@/lib/admin/banner-media-actions";
import type { BannerImageVariant } from "@/lib/banner-assets";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const initialState: BannerImageUploadState = { status: "idle", message: "" };

function UploadButton({ hasImage, canSubmit }: { hasImage: boolean; canSubmit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || !canSubmit} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      {pending ? "Đang tải lên..." : hasImage ? "Thay ảnh" : "Tải ảnh lên"}
    </button>
  );
}

export function BannerImageUpload({
  bannerId,
  variant,
  currentImageUrl,
}: {
  bannerId: string;
  variant: BannerImageVariant;
  currentImageUrl: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(replaceBannerImage, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState("");
  const [clientError, setClientError] = useState("");
  const [showActionMessage, setShowActionMessage] = useState(true);
  const isDesktop = variant === "desktop";
  const hasImage = Boolean(currentImageUrl);
  const displayedImage = previewUrl || currentImageUrl;

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (state.status !== "success") return;
    setPreviewUrl(null);
    setFileLabel("");
    setClientError("");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }, [router, state.imageUrl, state.status]);

  useEffect(() => setShowActionMessage(true), [state]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setClientError("");
    setShowActionMessage(false);
    if (!file) {
      setPreviewUrl(null);
      setFileLabel("");
      return;
    }

    setFileLabel(`${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    let error = "";
    if (!ALLOWED_MIME_TYPES.has(file.type)) error = "Chỉ hỗ trợ ảnh JPG, JPEG, PNG hoặc WEBP.";
    else if (file.size === 0) error = "File ảnh đang trống.";
    else if (file.size > MAX_IMAGE_SIZE) error = "Ảnh banner không được vượt quá 5 MB.";

    if (error) {
      setClientError(error);
      setPreviewUrl(null);
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <section className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-xs font-black uppercase tracking-[0.14em] text-sky-300">Ảnh {isDesktop ? "desktop" : "mobile"}</p><h2 className="mt-2 text-base font-extrabold text-white">{isDesktop ? "Ảnh chính màn hình lớn" : "Ảnh tối ưu màn hình nhỏ"}</h2></div>
        {!isDesktop ? <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-bold text-slate-400">Tùy chọn</span> : null}
      </div>

      <div className={`mt-5 grid place-items-center overflow-hidden rounded-lg border border-white/[0.08] bg-[#07111F] ${isDesktop ? "aspect-[16/7]" : "mx-auto aspect-[9/16] w-full max-w-[280px]"}`}>
        {displayedImage ? <img src={displayedImage} alt={`Ảnh ${variant} banner`} className="h-full w-full object-contain" /> : <div className="text-center text-slate-600"><ImageIcon className="mx-auto h-9 w-9" /><p className="mt-2 text-sm font-semibold">Chưa có ảnh</p></div>}
      </div>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="bannerId" value={bannerId} />
        <input type="hidden" name="variant" value={variant} />
        <label className="block"><span className="text-sm font-bold text-slate-200">Chọn file ảnh</span><input ref={inputRef} name="image" type="file" required accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="mt-2 block w-full rounded-lg border border-white/10 bg-[#07111F] px-3 py-2.5 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-sky-500/15 file:px-3 file:py-2 file:font-bold file:text-sky-200" /></label>
        {fileLabel ? <p className="text-xs text-slate-500">{fileLabel}</p> : null}
        {clientError ? <p role="alert" className="text-sm font-semibold text-rose-300">{clientError}</p> : null}
        {showActionMessage && state.message ? <p role="status" className={`text-sm font-semibold ${state.status === "success" ? "text-emerald-300" : "text-rose-300"}`}>{state.message}</p> : null}
        <div className="flex flex-wrap items-center gap-3"><UploadButton hasImage={hasImage} canSubmit={Boolean(previewUrl) && !clientError} /><span className="text-xs text-slate-500">Ảnh cũ chỉ được dọn sau khi đường dẫn mới đã lưu thành công.</span></div>
      </form>
    </section>
  );
}
