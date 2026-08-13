"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type PromptCopyButtonProps = {
  prompt: string;
  className?: string;
};

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed");
  } finally {
    document.body.removeChild(textarea);
  }
}

export function PromptCopyButton({ prompt, className = "" }: PromptCopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const handleCopy = async () => {
    try {
      await copyText(prompt);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2600);
    }
  };

  const copied = status === "copied";
  const failed = status === "failed";

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-extrabold text-white shadow-[0_0_26px_rgba(59,130,246,.24)] transition hover:-translate-y-0.5 hover:brightness-110 ${failed ? "bg-rose-600" : copied ? "bg-cyan-600" : "bg-gradient-to-r from-blue-500 to-sky-500"} ${className}`}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {failed ? "Không thể sao chép" : copied ? "Đã sao chép!" : "Sao chép Prompt"}
    </button>
  );
}
