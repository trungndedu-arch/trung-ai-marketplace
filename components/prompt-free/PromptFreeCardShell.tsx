import type { ReactNode } from "react";

type PromptFreeCardShellProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
};

// Shared presentation shell for every card that follows the Prompt Free design system.
export function PromptFreeCardShell({ children, onClick, className = "" }: PromptFreeCardShellProps) {
  const styles = `prompt-card group mb-5 w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0F1F33] text-left shadow-[0_12px_45px_rgba(0,0,0,.24)] ${className}`;

  if (onClick) return <button type="button" onClick={onClick} className={styles}>{children}</button>;

  return <article className={styles}>{children}</article>;
}

export function PromptFreeBadge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-sky-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-sky-300">{children}</span>;
}
