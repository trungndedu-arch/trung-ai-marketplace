"use client";

import { AlertTriangle, CheckCircle2, Loader2, ShieldCheck, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  confirmOrderPaymentAction,
  type ConfirmOrderPaymentState,
} from "@/lib/admin/order-actions";

const initialState: ConfirmOrderPaymentState = { status: "idle", code: "", message: "" };

type ConfirmOrderPaymentProps = {
  orderId: string;
  orderCode: string;
  customer: string;
  total: string;
  paymentReference: string;
};

function ConfirmationDialog({
  open,
  onClose,
  orderCode,
  customer,
  total,
  paymentReference,
  errorMessage,
}: Omit<ConfirmOrderPaymentProps, "orderId"> & {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
}) {
  const { pending } = useFormStatus();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      cancelButtonRef.current?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="confirm-payment-title"
      aria-describedby="confirm-payment-warning"
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === dialogRef.current && !pending) onClose();
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-lg border border-amber-300/25 bg-[#08111E] p-0 text-left text-white shadow-2xl shadow-black/70 backdrop:bg-black/80 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
        <div><p className="text-xs font-black uppercase tracking-[0.16em] text-amber-300">Xác nhận tài chính</p><h2 id="confirm-payment-title" className="mt-2 text-xl font-extrabold text-white">Xác nhận đã nhận tiền?</h2></div>
        <button type="button" disabled={pending} onClick={onClose} aria-label="Đóng hộp thoại" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"><X className="h-4 w-4" /></button>
      </div>

      <div className="p-5 sm:p-6">
        <div id="confirm-payment-warning" className="flex gap-3 rounded-lg border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100"><AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" /><p>Chỉ xác nhận sau khi bạn đã kiểm tra và thực sự nhận được tiền trong tài khoản ngân hàng.</p></div>

        <dl className="mt-5 overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728]">
          <div className="grid gap-1 border-b border-white/[0.07] px-4 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Mã đơn</dt><dd className="break-all font-mono text-sm font-black text-white">{orderCode}</dd></div>
          <div className="grid gap-1 border-b border-white/[0.07] px-4 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Khách hàng</dt><dd className="break-words text-sm font-bold text-white">{customer}</dd></div>
          <div className="grid gap-1 border-b border-white/[0.07] px-4 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Số tiền</dt><dd className="text-lg font-black text-white">{total}</dd></div>
          <div className="grid gap-1 px-4 py-3 sm:grid-cols-[150px_1fr]"><dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">Nội dung</dt><dd className="break-all font-mono text-sm font-black text-sky-100">{paymentReference}</dd></div>
        </dl>

        {errorMessage ? <div role="alert" className="mt-5 rounded-lg border border-rose-300/20 bg-rose-400/10 px-4 py-3 text-sm font-semibold leading-6 text-rose-100">{errorMessage}</div> : null}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelButtonRef} type="button" disabled={pending} onClick={onClose} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-5 text-sm font-bold text-slate-300 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50">Hủy</button>
          <button type="submit" disabled={pending} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-extrabold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60">{pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}{pending ? "Đang xác nhận..." : "Xác nhận đã nhận tiền"}</button>
        </div>
      </div>
    </dialog>
  );
}

export function ConfirmOrderPayment(props: ConfirmOrderPaymentProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(confirmOrderPaymentAction, initialState);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  function closeDialog() {
    setOpen(false);
    window.requestAnimationFrame(() => triggerButtonRef.current?.focus());
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="orderId" value={props.orderId} />
      <button ref={triggerButtonRef} type="button" onClick={() => setOpen(true)} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 text-sm font-extrabold text-white shadow-lg shadow-emerald-950/30 transition hover:bg-emerald-400 sm:w-auto"><ShieldCheck className="h-4 w-4" />Xác nhận đã nhận tiền</button>
      <ConfirmationDialog {...props} open={open} onClose={closeDialog} errorMessage={state.message} />
    </form>
  );
}
