"use client";

import { Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {
  status: "idle",
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
      {pending ? "Đang gửi liên kết..." : "Gửi liên kết đặt lại"}
    </button>
  );
}

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.message ? (
        <p
          className={`rounded-[8px] border px-4 py-3 text-sm leading-6 ${
            state.status === "error"
              ? "border-red-400/30 bg-red-500/10 text-red-100"
              : "border-sky-400/30 bg-sky-400/10 text-sky-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <label className="block">
        <span className="text-sm font-semibold text-slate-100">Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-2 h-12 w-full rounded-[8px] border border-sky-400/20 bg-slate-900/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30"
          placeholder="email@example.com"
        />
      </label>

      <SubmitButton />

      <p className="text-center text-sm text-slate-300">
        Nhớ mật khẩu rồi?{" "}
        <Link href="/login" className="font-semibold text-sky-300 transition hover:text-sky-200">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
