"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function PaymentValueCopy({ value, label = "Sao chép" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <button type="button" onClick={copyValue} aria-label={`${label}: ${value}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-sky-300/25 bg-sky-500/10 px-3 text-xs font-extrabold text-sky-100 transition hover:border-sky-300/50 hover:bg-sky-500/20">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Đã sao chép" : label}</button>;
}
