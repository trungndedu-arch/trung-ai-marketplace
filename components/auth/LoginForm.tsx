"use client";

import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, type AuthActionState } from "@/lib/auth/actions";

type LoginFormProps = {
  nextPath: string;
  message?: string;
};

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
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
      {pending ? "Đang đăng nhập..." : "Đăng nhập"}
    </button>
  );
}

export function LoginForm({ nextPath, message }: LoginFormProps) {
  const [state, formAction] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const alertMessage = state.message || message;
  const alertStatus = state.status === "error" ? "error" : message ? "success" : state.status;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="next" value={nextPath} />

      {alertMessage ? (
        <p
          className={`rounded-[8px] border px-4 py-3 text-sm leading-6 ${
            alertStatus === "error"
              ? "border-red-400/30 bg-red-500/10 text-red-100"
              : "border-sky-400/30 bg-sky-400/10 text-sky-100"
          }`}
        >
          {alertMessage}
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

      <label className="block">
        <span className="text-sm font-semibold text-slate-100">Mật khẩu</span>
        <span className="mt-2 flex h-12 items-center rounded-[8px] border border-sky-400/20 bg-slate-900/80 pr-2 transition-within:border-sky-300">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            minLength={8}
            className="h-full min-w-0 flex-1 rounded-[8px] bg-transparent px-4 text-sm text-white outline-none placeholder:text-slate-500"
            placeholder="Tối thiểu 8 ký tự"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-slate-300 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link href="/forgot-password" className="font-semibold text-sky-300 transition hover:text-sky-200">
          Quên mật khẩu?
        </Link>
        <Link href="/register" className="font-semibold text-slate-300 transition hover:text-white">
          Đăng ký tài khoản
        </Link>
      </div>

      <SubmitButton />
    </form>
  );
}
