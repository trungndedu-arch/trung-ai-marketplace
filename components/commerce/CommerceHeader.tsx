import Link from "next/link";
import { HeaderAccountNav } from "@/components/auth/AccountNav";
import type { AuthUserSummary } from "@/lib/auth/session";

export function CommerceHeader({ user }: { user: AuthUserSummary }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#07111F]/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] max-w-[1280px] items-center gap-3 px-4 py-2 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 shadow-glow">
            <img src="/images/brand/trung-ai-logo.png" alt="Trung AI Media" className="h-7 w-7 object-contain" />
          </span>
          <span className="hidden text-base font-extrabold text-white sm:inline">Trung AI <span className="text-sky-400">Media</span></span>
        </Link>
        <div className="flex-1" />
        <HeaderAccountNav user={user} />
      </div>
    </header>
  );
}
