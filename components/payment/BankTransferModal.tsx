"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, X } from "lucide-react";
import { formatPaymentPrice, getTransferContent, paymentConfig, type PaymentProduct } from "@/data/payment";

export function BankTransferModal({ product, onClose }: { product: PaymentProduct; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const amount = formatPaymentPrice(product.price);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const transferRows = [
    ["Số tài khoản", paymentConfig.accountNumber],
    ["Ngân hàng", paymentConfig.bankName],
    ["Chủ tài khoản", paymentConfig.accountHolder],
    ["Nội dung chuyển khoản", getTransferContent(product)],
    ["Số tiền cần chuyển", amount],
  ];

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/78 px-4 py-6 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="payment-title" onMouseDown={onClose}>
      <div className="relative max-h-full w-full max-w-4xl overflow-y-auto rounded-[1.65rem] border border-sky-300/30 bg-[#0B1728] shadow-[0_0_90px_rgba(59,130,246,.24)]" onMouseDown={(event) => event.stopPropagation()}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,.22),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(59,130,246,.24),transparent_28%),linear-gradient(135deg,rgba(11,23,40,.96),rgba(7,17,31,.98)_48%,rgba(15,31,51,.92))]" />
        <button ref={closeButtonRef} type="button" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-sky-300/45 hover:text-white" aria-label="Đóng popup thanh toán"><X className="h-5 w-5" /></button>
        <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[.95fr_1.05fr] lg:p-8">
          <div className="rounded-[1.35rem] border border-white/12 bg-white/[0.04] p-4"><img src={paymentConfig.qrImage} alt="QR chuyển khoản" className="h-auto w-full rounded-2xl bg-white object-contain" /></div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Thanh toán QR</p>
            <h2 id="payment-title" className="mt-3 text-3xl font-black tracking-[-.035em] text-white sm:text-4xl">Hoàn tất chuyển khoản</h2>
            <p className="mt-3 text-sm leading-7 text-slate-200">Quét mã QR hoặc chuyển khoản theo thông tin bên dưới, sau đó gửi xác nhận qua Zalo.</p>
            <div className="mt-4 rounded-xl border border-sky-300/15 bg-sky-500/[0.06] px-4 py-3"><p className="text-xs font-bold text-slate-300">Sản phẩm</p><p className="mt-1 font-black text-white">{product.name}</p>{product.originalPrice ? <p className="mt-1 text-xs text-slate-400">Giá gốc <span className="line-through">{formatPaymentPrice(product.originalPrice)}</span></p> : null}</div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/35">{transferRows.map(([label, value]) => <div key={label} className="grid gap-1 border-b border-white/10 px-4 py-3 last:border-b-0 sm:grid-cols-[170px_1fr] sm:gap-4"><span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</span><span className="font-black text-white">{value}</span></div>)}</div>
            <a href={paymentConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-sky-300/35 bg-sky-500/10 px-6 py-3 text-sm font-black text-sky-100 transition hover:-translate-y-0.5 hover:bg-sky-500/20">{paymentConfig.zaloLabel}<ExternalLink className="h-4 w-4" /></a>
            <a href={paymentConfig.zaloUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-blue-500 px-6 py-4 text-sm font-black text-white shadow-[0_16px_48px_rgba(37,99,235,.36)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_62px_rgba(59,130,246,.5)]">Tôi đã chuyển khoản – Gửi xác nhận qua Zalo</a>
          </div>
        </div>
      </div>
    </div>
  );
}
