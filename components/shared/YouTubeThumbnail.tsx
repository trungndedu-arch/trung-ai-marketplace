"use client";

import { useState } from "react";
import { Youtube } from "lucide-react";

export function YouTubeThumbnail({ videoId, alt, className = "", imageClassName = "" }: { videoId: string; alt: string; className?: string; imageClassName?: string }) {
  const [quality, setQuality] = useState<"hq" | "mq" | "failed">("hq");
  const src = quality === "hq"
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;

  return <div className={className}>
    {quality === "failed" ? <div role="img" aria-label={alt} className="grid h-full w-full place-items-center bg-[#07111F] text-slate-500"><Youtube className="h-9 w-9" aria-hidden="true" /></div> : <img src={src} alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setQuality((current) => current === "hq" ? "mq" : "failed")} className={imageClassName} />}
  </div>;
}
