"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageIcon, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadProductCover, type ProductCoverUploadState } from "@/lib/admin/product-media-actions";

const MAX_COVER_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const initialState: ProductCoverUploadState = { status: "idle", message: "" };

function UploadButton({ hasCover, canSubmit }: { hasCover: boolean; canSubmit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || !canSubmit} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
      {pending ? "Đang tải lên..." : hasCover ? "Thay ảnh bìa" : "Tải ảnh bìa lên"}
    </button>
  );
}

export function ProductCoverUpload({ productId, title, currentCover }: { productId: string; title: string; currentCover: { url: string; alt: string } | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(uploadProductCover, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileLabel, setFileLabel] = useState("");
  const [clientError, setClientError] = useState("");
  const [ratioWarning, setRatioWarning] = useState("");
  const [showActionMessage, setShowActionMessage] = useState(true);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  useEffect(() => {
    if (state.status !== "success") return;
    setPreviewUrl(null);
    setFileLabel("");
    setClientError("");
    setRatioWarning("");
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }, [router, state.coverUrl, state.status]);

  useEffect(() => {
    setShowActionMessage(true);
  }, [state]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setClientError("");
    setRatioWarning("");
    setShowActionMessage(false);

    if (!file) {
      setPreviewUrl(null);
      setFileLabel("");
      return;
    }

    setFileLabel(`${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    let validationError = "";
    if (!ALLOWED_MIME_TYPES.has(file.type)) validationError = "Chỉ hỗ trợ ảnh JPG, JPEG, PNG hoặc WEBP.";
    else if (file.size === 0) validationError = "File ảnh đang trống.";
    else if (file.size > MAX_COVER_SIZE) validationError = "Ảnh bìa không được vượt quá 5 MB.";

    if (validationError) {
      setClientError(validationError);
      setPreviewUrl(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
  }

  function handlePreviewLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    if (!previewUrl) return;
    const image = event.currentTarget;
    const ratio = image.naturalWidth / image.naturalHeight;
    const targetRatio = 9 / 16;
    setRatioWarning(Math.abs(ratio - targetRatio) / targetRatio > 0.08
      ? "Ảnh nên có tỷ lệ 9:16 để hiển thị đẹp nhất."
      : "");
  }

  const displayUrl = previewUrl || state.coverUrl || currentCover?.url || "";
  const hasCover = Boolean(state.coverUrl || currentCover);

  return (
    <section className="mb-5 rounded-lg border border-white/[0.08] bg-[#0B1728] p-5 sm:p-6">
      <h2 className="text-base font-extrabold text-white">Ảnh bìa sản phẩm</h2>
      <p className="mt-2 text-sm text-slate-500">Ảnh dọc 9:16, tối đa 5 MB. Hỗ trợ JPG, PNG và WEBP.</p>

      <form action={formAction} className="mt-5 grid gap-5 sm:grid-cols-[180px_minmax(0,1fr)]">
        <input type="hidden" name="productId" value={productId} />
        <div className="relative aspect-[9/16] w-full max-w-[180px] overflow-hidden rounded-lg border border-white/10 bg-[#07111F]">
          {displayUrl ? <img src={displayUrl} alt={previewUrl ? `Xem trước ${title}` : currentCover?.alt || title} onLoad={handlePreviewLoad} className="h-full w-full object-cover object-center" /> : <div className="grid h-full place-items-center text-center text-slate-600"><div><ImageIcon className="mx-auto h-7 w-7" /><span className="mt-2 block text-xs font-semibold">Chưa có ảnh bìa</span></div></div>}
          {previewUrl ? <span className="absolute bottom-2 left-2 rounded-md bg-black/65 px-2 py-1 text-[10px] font-bold text-white">Ảnh xem trước</span> : null}
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-200" htmlFor={`cover-${productId}`}>Chọn ảnh mới</label>
            <input ref={inputRef} id={`cover-${productId}`} name="cover" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="mt-2 block w-full cursor-pointer rounded-lg border border-white/10 bg-[#07111F] text-sm text-slate-400 file:mr-3 file:min-h-11 file:border-0 file:bg-sky-500/15 file:px-4 file:text-sm file:font-bold file:text-sky-200 hover:file:bg-sky-500/25" />
            <p className="mt-2 break-all text-xs text-slate-500">{fileLabel || "Chưa chọn ảnh."}</p>
            {clientError ? <p role="alert" className="mt-3 text-sm font-semibold text-rose-300">{clientError}</p> : null}
            {!clientError && ratioWarning ? <p className="mt-3 text-sm font-semibold text-amber-300">{ratioWarning}</p> : null}
            {showActionMessage && state.message ? <p role="status" className={`mt-3 text-sm font-semibold ${state.status === "success" ? "text-emerald-300" : "text-rose-300"}`}>{state.message}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <UploadButton hasCover={hasCover} canSubmit={Boolean(previewUrl) && !clientError} />
            <span className="text-xs text-slate-500">Ảnh cũ chỉ được dọn sau khi ảnh mới cập nhật thành công.</span>
          </div>
        </div>
      </form>
    </section>
  );
}
