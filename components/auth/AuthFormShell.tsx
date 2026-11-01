import Link from "next/link";
import type { ReactNode } from "react";

type AuthFormShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthFormShell({ title, description, children, footer }: AuthFormShellProps) {
  return (
    <main className="hero-grid min-h-screen bg-[var(--color-bg)] px-4 py-10 text-[#202020] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-3 self-center" aria-label="Về trang chủ">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F0B26E] bg-[#FFEDD5] shadow-[0_8px_24px_rgba(198,93,27,.16)]">
            <span className="text-xl font-black text-[#C65D1B]">T</span>
          </span>
          <span className="text-lg font-extrabold tracking-[0.18em] text-[#202020]">TRUNG AI</span>
        </Link>

        <section className="rounded-[8px] border border-[#F1E6D7] bg-white/95 p-6 shadow-2xl shadow-[#5E3616]/10 backdrop-blur sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-bold text-[#202020] sm:text-3xl">{title}</h1>
            <p className="mt-3 text-sm leading-6 text-[#786D63]">{description}</p>
          </div>

          {children}

          {footer ? <div className="mt-6 border-t border-[#F1E6D7] pt-5 text-center text-sm">{footer}</div> : null}
        </section>
      </div>
    </main>
  );
}
