"use client";

import { Eye, EyeOff, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { updatePassword, type AuthActionState } from "@/lib/auth/actions";

type ResetPasswordFormProps = {
  canReset: boolean;
};

const initialState: AuthActionState = {
  status: "idle",
  message: "",
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[8px] bg-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
      {pending ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
    </button>
  );
}

export function ResetPasswordForm({ canReset }: ResetPasswordFormProps) {
  const [state, formAction] = useActionState(updatePassword, initialState);
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
      {!canReset ? (
        <div className="rounded-[8px] border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-sm leading-6 text-amber-100">
          Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ. Vui lòng gửi lại yêu cầu để nhận liên kết mới.
          <div className="mt-3">
            <Link href="/forgot-password" className="font-semibold text-sky-200 transition hover:text-white">
              Gửi lại liên kết
            </Link>
          </div>
        </div>
      ) : null}

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
        <span className="text-sm font-semibold text-slate-100">Mật khẩu mới</span>
        <span className="mt-2 flex h-12 items-center rounded-[8px] border border-sky-400/20 bg-slate-900/80 pr-2">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            disabled={!canReset}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-full min-w-0 flex-1 rounded-[8px] bg-transparent px-4 text-sm text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
            placeholder="Tối thiểu 8 ký tự"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            disabled={!canReset}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] text-slate-300 transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </span>
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-slate-100">Xác nhận mật khẩu mới</span>
        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          minLength={8}
          disabled={!canReset}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-[8px] border border-sky-400/20 bg-slate-900/80 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-400/30 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Nhập lại mật khẩu mới"
        />
      </label>

      {clientError ? <p className="text-sm leading-6 text-amber-200">{clientError}</p> : null}

      <SubmitButton disabled={!canReset} />
    </form>
  );
}
