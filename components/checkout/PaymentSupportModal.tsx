"use client";

import Image from "next/image";
import { ExternalLink, Headphones, MessageCircle, ShieldAlert, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PaymentValueCopy } from "@/components/checkout/PaymentValueCopy";

const ZALO_PHONE = "0869823437";
const ZALO_URL = `https://zalo.me/${ZALO_PHONE}`;
const FANPAGE_URL = "https://www.facebook.com/trungaimedia/";

type PaymentSupportModalProps = {
  orderCode: string;
  formattedTotal: string;
  paymentReference: string;
  triggerLabel: string;
  prominent?: boolean;
};

export function PaymentSupportModal({
  orderCode,
  formattedTotal,
  paymentReference,
  triggerLabel,
  prominent = false,
}: PaymentSupportModalProps) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function closeDialog() {
    setOpen(false);
    window.requestAnimationFrame(() => triggerButtonRef.current?.focus());
  }

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        className={prominent
          ? "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 px-4 text-center text-sm font-extrabold leading-5 text-white shadow-glow transition hover:brightness-110"
          : "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-sky-300/25 bg-sky-500/10 px-4 text-center text-sm font-extrabold leading-5 text-sky-100 transition hover:border-sky-300/45 hover:bg-sky-500/20 sm:w-auto"}
      >
        <Headphones className="h-4 w-4 shrink-0" />
        {triggerLabel}
      </button>

      {open ? (
        <dialog
          ref={dialogRef}
          aria-labelledby="payment-support-title"
          aria-describedby="payment-support-description payment-support-warning"
          onCancel={(event) => {
            event.preventDefault();
            closeDialog();
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeDialog();
            }
          }}
          onMouseDown={(event) => {
            if (event.target === dialogRef.current) closeDialog();
          }}
          className="m-auto max-h-[calc(100dvh-1.5rem)] w-[calc(100%-1.5rem)] max-w-4xl overflow-y-auto rounded-2xl border border-sky-300/20 bg-[#08111E] p-0 text-left text-white shadow-2xl shadow-black/70 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
        >
          <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.08] bg-[#08111E]/95 p-5 backdrop-blur sm:p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-sky-300">Hỗ trợ thanh toán</p>
              <h2 id="payment-support-title" className="mt-2 text-xl font-extrabold leading-tight text-white sm:text-2xl">Đã chuyển khoản? Liên hệ để được hỗ trợ ngay</h2>
            </div>
            <button ref={closeButtonRef} type="button" onClick={closeDialog} aria-label="Đóng hộp thoại hỗ trợ" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-white/20 hover:text-white"><X className="h-4 w-4" /></button>
          </header>

          <div className="p-5 sm:p-6">
            <p id="payment-support-description" className="max-w-3xl text-sm leading-7 text-slate-300">Cảm ơn bạn đã thanh toán. Vui lòng liên hệ với Trung AI Media qua một trong hai kênh dưới đây để được kiểm tra đơn hàng và hỗ trợ sản phẩm nhanh nhất.</p>

            <dl className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0B1728]">
              <div className="grid gap-2 border-b border-white/[0.07] px-4 py-3 sm:grid-cols-[150px_1fr_auto] sm:items-center"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Mã đơn hàng</dt><dd className="break-all font-mono text-sm font-black text-white">{orderCode}</dd><PaymentValueCopy value={orderCode} /></div>
              <div className="grid gap-2 border-b border-white/[0.07] px-4 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Số tiền</dt><dd className="text-base font-black text-white">{formattedTotal}</dd></div>
              <div className="grid gap-2 px-4 py-3 sm:grid-cols-[150px_1fr_auto] sm:items-center"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Nội dung chuyển khoản</dt><dd className="break-all font-mono text-sm font-black text-sky-100">{paymentReference}</dd><PaymentValueCopy value={paymentReference} /></div>
            </dl>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,.95fr)]">
              <section aria-labelledby="zalo-support-title" className="min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><p className="text-xs font-black uppercase tracking-[0.14em] text-sky-300">Zalo</p><h3 id="zalo-support-title" className="mt-1 text-lg font-extrabold text-white">{ZALO_PHONE}</h3></div>
                  <PaymentValueCopy value={ZALO_PHONE} />
                </div>
                <div className="mx-auto mt-4 w-full max-w-[380px] overflow-hidden rounded-xl border border-white/10 bg-white">
                  <Image src="/images/zalo-trung-ai-media-qr.png" alt="Mã QR Zalo Trung AI Media" width={1260} height={1920} priority className="h-auto w-full object-contain" />
                </div>
                <p className="mt-3 text-center text-sm font-semibold text-slate-300">Quét QR hoặc liên hệ Zalo {ZALO_PHONE}</p>
                <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400">Mở Zalo<MessageCircle className="h-4 w-4" /></a>
              </section>

              <section aria-labelledby="fanpage-support-title" className="flex min-w-0 flex-col justify-between border-t border-white/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-300">Fanpage</p>
                  <h3 id="fanpage-support-title" className="mt-2 text-lg font-extrabold text-white">Trung AI Media</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">Gửi mã đơn hàng và nội dung chuyển khoản để đội ngũ hỗ trợ kiểm tra nhanh hơn.</p>
                  <a href={FANPAGE_URL} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-sky-300/25 bg-sky-500/10 px-4 text-sm font-extrabold text-sky-100 transition hover:border-sky-300/45 hover:bg-sky-500/20">Nhắn tin Fanpage<ExternalLink className="h-4 w-4" /></a>
                </div>

                <div id="payment-support-warning" className="mt-6 flex gap-3 rounded-xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100"><ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" /><p>Đơn hàng chỉ được xác nhận thanh toán sau khi Trung AI Media kiểm tra và thực tế nhận được tiền.</p></div>
              </section>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
