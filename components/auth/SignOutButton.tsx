import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <button
        type="submit"
        className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] border border-sky-400/25 bg-sky-400/10 px-5 text-sm font-bold text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-400/15 focus:outline-none focus:ring-2 focus:ring-sky-300"
      >
        <LogOut className="h-4 w-4" />
        Đăng xuất
      </button>
    </form>
  );
}
