"use client";

import { useEffect, useRef } from "react";
import { Headphones, MessageCircle, X } from "lucide-react";
import { getCoachingContactLinks } from "@/lib/coaching";
import type { HomepageContactLinks } from "@/lib/homepage-contact-links";

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current"><path d="M13.7 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.6 1.6-1.6h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.3H7.7V13h2.8v8h3.2Z" /></svg>;
}

export function CoachingConsultationModal({ open, onClose, settings }: { open: boolean; onClose: () => void; settings: HomepageContactLinks }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const links = getCoachingContactLinks(settings);

  useEffect(() => {
    if (!open) return;

    previouslyFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;

      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])") ?? []);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previouslyFocusedRef.current?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center p-4 sm:p-6" role="presentation">
      <button type="button" aria-label="Đóng tư vấn Coaching AI 1:1" onClick={onClose} className="absolute inset-0 bg-[#020814]/80 backdrop-blur-sm" />
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="coaching-consultation-title" className="relative w-full max-w-md rounded-3xl border border-sky-300/20 bg-[#0B1728] p-6 shadow-[0_28px_90px_rgba(0,0,0,.55)] sm:p-8">
        <button ref={closeButtonRef} type="button" aria-label="Đóng" onClick={onClose} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-slate-300 transition hover:border-sky-300/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">
          <X className="h-5 w-5" />
        </button>
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-300/25 bg-sky-500/10 text-sky-200"><Headphones className="h-5 w-5" /></div>
        <h2 id="coaching-consultation-title" className="mt-5 pr-10 text-2xl font-black tracking-tight text-white">Tư vấn Coaching AI 1:1</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">Chọn kênh liên hệ phù hợp để trao đổi trực tiếp về nhu cầu ứng dụng AI của bạn.</p>
        {links.length ? <div className="mt-6 grid gap-3">{links.map((link) => <a key={link.key} href={link.url} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-extrabold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${link.key === "facebook" ? "border-blue-400/40 bg-blue-500/15 text-blue-100 hover:border-blue-300 hover:bg-blue-500/25" : "border-sky-400/40 bg-sky-500/15 text-sky-100 hover:border-sky-300 hover:bg-sky-500/25"}`}>{link.key === "facebook" ? <FacebookIcon /> : <MessageCircle className="h-5 w-5" />}{link.label}</a>)}</div> : <p className="mt-6 rounded-2xl border border-dashed border-white/15 bg-white/[0.025] p-4 text-sm leading-6 text-slate-400">Kênh tư vấn đang được cập nhật. Vui lòng quay lại sau.</p>}
      </section>
    </div>
  );
}
