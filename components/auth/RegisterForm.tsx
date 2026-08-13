"use client";

import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { signUp, type AuthActionState } from "@/lib/auth/actions";

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
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
      {pending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(signUp, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const clientError = useMemo(() => {
    if (!password && !confirmPassword) {
      return "";
    }

    if (password && password.length < 8) {
      return "Mật khẩu cần có tối thiểu 8 ký tự.";
    }

    if (confirmPassword && password !== confirmPassword) {
      return "Hai mật khẩu chưa trùng nhau.";
    }

    return "";
  }, [password, confirmPassword]);

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

      <label className="block">
        <span className="text-sm font-semibold text-slate-100">Mật khẩu</span>
        <span className="mt-2 flex h-12 items-center rounded-[8px] border border-sky-400/20 bg-slate-900/80 pr-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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

      <label className="block">
        <span className="text-sm font-semibold text-slate-100">Xác nhận mật khẩu</span>
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-[8px] border border-sky-400/20 bg-slate-900/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30"
          placeholder="Nhập lại mật khẩu"
        />
      </label>

      {clientError ? <p className="text-sm leading-6 text-amber-200">{clientError}</p> : null}

      <SubmitButton />

      <p className="text-center text-sm text-slate-300">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-semibold text-sky-300 transition hover:text-sky-200">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
