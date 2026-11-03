import { ContactLinksForm } from "@/components/admin/ContactLinksForm";
import { getAdminHomepageContactLinks } from "@/lib/admin/contact-links";

export const metadata = { title: "Kênh liên hệ | Trung AI Admin" };

export default async function AdminContactLinksPage() {
  const result = await getAdminHomepageContactLinks();
  return <div className="mx-auto w-full max-w-[1100px]"><div><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Website settings</p><h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Kênh liên hệ</h1><p className="mt-2 text-sm text-slate-400">Quản lý Facebook, Zalo và YouTube hiển thị trên trang chủ.</p></div>{result.error || !result.settings ? <section className="mt-6 rounded-lg border border-amber-300/20 bg-amber-400/10 p-5 text-sm text-amber-100">{result.error ?? "Cài đặt kênh liên hệ chưa sẵn sàng."}</section> : <div className="mt-6"><ContactLinksForm settings={result.settings} /></div>}</div>;
}
