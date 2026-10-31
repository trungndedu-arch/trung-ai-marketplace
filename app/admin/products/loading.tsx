export default function AdminProductsLoading() {
  return (
    <div className="mx-auto w-full max-w-[1500px] animate-pulse" aria-label="Đang tải danh sách sản phẩm">
      <div className="flex items-end justify-between gap-4"><div><div className="h-3 w-24 rounded bg-white/[0.06]" /><div className="mt-3 h-9 w-64 rounded bg-white/[0.08]" /><div className="mt-3 h-4 w-96 max-w-full rounded bg-white/[0.05]" /></div><div className="h-11 w-40 rounded-xl bg-sky-500/10" /></div>
      <div className="mt-7 h-10 w-full rounded-xl bg-white/[0.04]" />
      <div className="mt-4 grid gap-3 rounded-xl border border-white/[0.06] p-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-11 rounded-lg bg-white/[0.04]" />)}</div>
      <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.06]">{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex items-center gap-4 border-b border-white/[0.05] p-4 last:border-0"><div className="h-20 w-12 rounded-lg bg-white/[0.05]" /><div className="flex-1"><div className="h-4 w-1/3 rounded bg-white/[0.06]" /><div className="mt-3 h-3 w-1/4 rounded bg-white/[0.04]" /></div></div>)}</div>
    </div>
  );
}
