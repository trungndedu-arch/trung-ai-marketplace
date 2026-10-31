import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, PackageSearch, Pencil, Plus, RotateCcw, Search } from "lucide-react";
import {
  AccessChip,
  formatAdminPrice,
  getProductTypeLabel,
  ProductCover,
  PublicationChip,
  SalesChip,
} from "@/components/admin/AdminProductUi";
import {
  ADMIN_PRODUCTS_PAGE_SIZE,
  getAdminCategories,
  getAdminProducts,
  type AdminProductFilters,
  type AdminProductSort,
} from "@/lib/admin/products";
import { getProductCatalogDestination } from "@/lib/admin/product-catalog";
import type { AccessType, ProductType, PublicationStatus, SalesStatus } from "@/lib/catalog/types";

export const metadata: Metadata = {
  title: "Quản lý sản phẩm",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const productTypes: ProductType[] = ["chatbot", "ai_app", "ai_tool", "course"];
const publicationStatuses: PublicationStatus[] = ["published", "draft", "hidden"];
const salesStatuses: SalesStatus[] = ["on_sale", "coming_soon", "paused"];
const accessTypes: AccessType[] = ["paid", "free"];
const homepageVisibilityOptions = ["featured", "not_featured"] as const;
const sortOptions: { value: AdminProductSort; label: string }[] = [
  { value: "display_order", label: "Thứ tự ưu tiên" },
  { value: "title", label: "Tên sản phẩm" },
  { value: "created_at", label: "Ngày tạo" },
  { value: "updated_at", label: "Ngày cập nhật" },
];
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function enumValue<T extends string>(value: string | undefined, allowed: readonly T[]): T | "all" {
  return value && allowed.includes(value as T) ? value as T : "all";
}

function HomepageStatus({ isFeatured }: { isFeatured: boolean }) {
  return <span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black ${isFeatured ? "border-sky-300/25 bg-sky-500/10 text-sky-200" : "border-white/10 bg-white/[0.025] text-slate-500"}`}>{isFeatured ? "Hiển thị trang chủ" : "Không hiển thị trang chủ"}</span>;
}

function parseFilters(params: Record<string, string | string[] | undefined>): AdminProductFilters {
  const sortValue = firstValue(params.sort);
  const pageValue = Number.parseInt(firstValue(params.page) ?? "1", 10);

  return {
    search: (firstValue(params.q) ?? "").trim().slice(0, 100),
    categoryId: UUID_PATTERN.test(firstValue(params.category) ?? "") ? firstValue(params.category)! : "all",
    productType: enumValue(firstValue(params.type), productTypes),
    publicationStatus: enumValue(firstValue(params.publication), publicationStatuses),
    salesStatus: enumValue(firstValue(params.sales), salesStatuses),
    accessType: enumValue(firstValue(params.access), accessTypes),
    homepageVisibility: enumValue(firstValue(params.home), homepageVisibilityOptions),
    sort: sortOptions.some((option) => option.value === sortValue) ? sortValue as AdminProductSort : "display_order",
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : 1,
  };
}

function buildProductsHref(filters: AdminProductFilters, page: number) {
  const params = new URLSearchParams();
  if (filters.search) params.set("q", filters.search);
  if (filters.categoryId !== "all") params.set("category", filters.categoryId);
  if (filters.productType !== "all") params.set("type", filters.productType);
  if (filters.publicationStatus !== "all") params.set("publication", filters.publicationStatus);
  if (filters.salesStatus !== "all") params.set("sales", filters.salesStatus);
  if (filters.accessType !== "all") params.set("access", filters.accessType);
  if (filters.homepageVisibility !== "all") params.set("home", filters.homepageVisibility);
  if (filters.sort !== "display_order") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/admin/products?${query}` : "/admin/products";
}

export default async function AdminProductsPage({ searchParams }: ProductsPageProps) {
  const filters = parseFilters(await searchParams);
  const [result, categoryResult] = await Promise.all([getAdminProducts(filters), getAdminCategories()]);

  if (!result.error && result.totalPages > 0 && result.page > result.totalPages) {
    redirect(buildProductsHref(filters, result.totalPages));
  }

  const hasFilters = Boolean(filters.search || filters.categoryId !== "all" || filters.productType !== "all" || filters.publicationStatus !== "all" || filters.salesStatus !== "all" || filters.accessType !== "all" || filters.homepageVisibility !== "all");
  const firstItem = result.total ? (result.page - 1) * ADMIN_PRODUCTS_PAGE_SIZE + 1 : 0;
  const lastItem = Math.min(result.page * ADMIN_PRODUCTS_PAGE_SIZE, result.total);

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-300">Catalog</p>
          <h1 className="mt-2 text-2xl font-extrabold text-white sm:text-3xl">Quản lý sản phẩm</h1>
          <p className="mt-2 text-sm text-slate-500">Tìm, lọc và cập nhật sản phẩm theo đúng khu vực hiển thị ngoài website.</p>
        </div>
        <div className="flex items-center gap-3"><span className="text-sm font-semibold text-slate-400">{result.total} kết quả</span><Link href="/admin/products/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Plus className="h-4 w-4" />Thêm sản phẩm</Link></div>
      </div>

      <div className="mt-7 flex flex-wrap gap-2">
        <Link href={buildProductsHref({ ...filters, publicationStatus: "all", salesStatus: "all" }, 1)} className={`rounded-full border px-3 py-2 text-xs font-bold ${filters.publicationStatus === "all" && filters.salesStatus === "all" ? "border-sky-300/30 bg-sky-500/15 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`}>Tất cả sản phẩm</Link>
        <Link href={buildProductsHref({ ...filters, publicationStatus: "draft", salesStatus: "all" }, 1)} className={`rounded-full border px-3 py-2 text-xs font-bold ${filters.publicationStatus === "draft" ? "border-amber-300/30 bg-amber-500/10 text-amber-100" : "border-white/10 text-slate-400 hover:text-white"}`}>Bản nháp</Link>
        <Link href={buildProductsHref({ ...filters, publicationStatus: "published", salesStatus: "all" }, 1)} className={`rounded-full border px-3 py-2 text-xs font-bold ${filters.publicationStatus === "published" && filters.salesStatus === "all" ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100" : "border-white/10 text-slate-400 hover:text-white"}`}>Đã xuất bản</Link>
        <Link href={buildProductsHref({ ...filters, publicationStatus: "all", salesStatus: "on_sale" }, 1)} className={`rounded-full border px-3 py-2 text-xs font-bold ${filters.salesStatus === "on_sale" ? "border-sky-300/30 bg-sky-500/10 text-sky-100" : "border-white/10 text-slate-400 hover:text-white"}`}>Đang bán</Link>
      </div>

      <form method="get" className="mt-4 grid gap-3 rounded-xl border border-white/[0.08] bg-[#0B1728] p-4 md:grid-cols-2 xl:grid-cols-[minmax(220px,1.4fr)_repeat(7,minmax(130px,1fr))_auto_auto]">
        <label className="relative block md:col-span-2 xl:col-span-1">
          <span className="sr-only">Tìm sản phẩm</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input name="q" defaultValue={filters.search} placeholder="Tên, slug hoặc legacy ID" className="h-11 w-full rounded-lg border border-white/10 bg-[#07111F] pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-sky-400/40" />
        </label>
        <select name="category" defaultValue={filters.categoryId} aria-label="Lọc theo danh mục" className="h-11 rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-slate-200 outline-none focus:border-sky-400/40">
          <option value="all">Tất cả danh mục chi tiết</option>
          {categoryResult.categories.map((category) => <option key={category.id} value={category.id}>{category.name} · {category.productType ? getProductCatalogDestination(category.productType).label : "Dùng chung"}</option>)}
        </select>
        <select name="type" defaultValue={filters.productType} aria-label="Lọc theo loại sản phẩm" className="h-11 rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-slate-200 outline-none focus:border-sky-400/40">
          <option value="all">Tất cả loại</option>
          {productTypes.map((value) => <option key={value} value={value}>{getProductTypeLabel(value)}</option>)}
        </select>
        <select name="publication" defaultValue={filters.publicationStatus} aria-label="Lọc theo trạng thái xuất bản" className="h-11 rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-slate-200 outline-none focus:border-sky-400/40">
          <option value="all">Tất cả xuất bản</option>
          <option value="published">Đã xuất bản</option><option value="draft">Bản nháp</option><option value="hidden">Đã ẩn</option>
        </select>
        <select name="sales" defaultValue={filters.salesStatus} aria-label="Lọc theo trạng thái bán" className="h-11 rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-slate-200 outline-none focus:border-sky-400/40">
          <option value="all">Tất cả bán hàng</option>
          <option value="on_sale">Đang bán</option><option value="coming_soon">Sắp ra mắt</option><option value="paused">Tạm dừng</option>
        </select>
        <select name="access" defaultValue={filters.accessType} aria-label="Lọc theo loại truy cập" className="h-11 rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-slate-200 outline-none focus:border-sky-400/40">
          <option value="all">Tất cả truy cập</option>
          <option value="paid">Trả phí</option><option value="free">Miễn phí</option>
        </select>
        <select name="home" defaultValue={filters.homepageVisibility} aria-label="Lọc theo hiển thị trang chủ" className="h-11 rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-slate-200 outline-none focus:border-sky-400/40">
          <option value="all">Tất cả trang chủ</option>
          <option value="featured">Hiển thị trang chủ</option><option value="not_featured">Không hiển thị trang chủ</option>
        </select>
        <select name="sort" defaultValue={filters.sort} aria-label="Sắp xếp sản phẩm" className="h-11 rounded-lg border border-white/10 bg-[#07111F] px-3 text-sm text-slate-200 outline-none focus:border-sky-400/40">
          {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 text-sm font-extrabold text-white transition hover:bg-sky-400"><Search className="h-4 w-4" />Lọc</button>
        <Link href="/admin/products" aria-label="Xóa bộ lọc" title="Xóa bộ lọc" className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white"><RotateCcw className="h-4 w-4" /></Link>
      </form>

      {result.error || categoryResult.error ? (
        <section className="mt-6 rounded-lg border border-rose-300/20 bg-rose-400/10 px-5 py-8 text-center"><p className="font-bold text-rose-100">{result.error || categoryResult.error}</p><p className="mt-2 text-sm text-rose-200/70">Vui lòng tải lại trang sau ít phút.</p></section>
      ) : result.products.length === 0 ? (
        <section className="mt-6 grid min-h-64 place-items-center rounded-lg border border-dashed border-white/10 bg-[#0B1728]/60 px-5 text-center"><div><PackageSearch className="mx-auto h-9 w-9 text-slate-600" /><h2 className="mt-4 font-extrabold text-white">{hasFilters ? "Không có sản phẩm phù hợp" : "Chưa có sản phẩm"}</h2><p className="mt-2 text-sm text-slate-500">{hasFilters ? "Hãy thay đổi từ khóa hoặc bộ lọc." : "Catalog hiện chưa có dữ liệu."}</p></div></section>
      ) : (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-lg border border-white/[0.08] bg-[#0B1728] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left">
                <thead className="border-b border-white/[0.08] bg-white/[0.025] text-[11px] font-black uppercase tracking-[0.12em] text-slate-500"><tr><th className="px-4 py-3">Sản phẩm</th><th className="px-4 py-3">Loại</th><th className="px-4 py-3">Giá</th><th className="px-4 py-3">Bán hàng</th><th className="px-4 py-3">Xuất bản</th><th className="px-4 py-3 text-center">Ưu tiên</th><th className="px-4 py-3 text-right">Xem</th></tr></thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {result.products.map((product) => (
                    <tr key={product.id} className="transition hover:bg-white/[0.025]">
                      <td className="px-4 py-3"><div className="flex min-w-0 items-center gap-3"><ProductCover image={product.coverImage} title={product.title} /><div className="min-w-0"><Link href={`/admin/products/${product.id}`} className="line-clamp-2 max-w-md text-sm font-extrabold text-white hover:text-sky-300">{product.title}</Link><p className="mt-1 max-w-md truncate text-xs text-slate-500">/{product.slug}</p><p className="mt-1 text-xs font-semibold text-sky-300">Danh mục chi tiết: {product.category?.name ?? "Chưa chọn"}</p><p className="mt-0.5 text-[10px] text-slate-600">Nhóm hiển thị: {getProductCatalogDestination(product.productType).label}</p><div className="mt-2"><HomepageStatus isFeatured={product.isFeatured} /></div></div></div></td>
                      <td className="px-4 py-3"><p className="text-sm font-bold text-slate-200">{getProductTypeLabel(product.productType)}</p><div className="mt-2"><AccessChip value={product.accessType} /></div></td>
                      <td className="px-4 py-3"><p className="whitespace-nowrap text-sm font-extrabold text-white">{formatAdminPrice(product.price, product.currency)}</p>{product.originalPrice !== null ? <p className="mt-1 whitespace-nowrap text-xs text-slate-500 line-through">{formatAdminPrice(product.originalPrice, product.currency)}</p> : null}</td>
                      <td className="px-4 py-3"><SalesChip value={product.salesStatus} /><p className="mt-2 text-xs text-slate-500">{product.sellable ? "Có thể bán" : "Không bán trực tiếp"}</p></td>
                      <td className="px-4 py-3"><PublicationChip value={product.publicationStatus} /></td>
                      <td className="px-4 py-3 text-center text-sm font-black tabular-nums text-slate-300">{product.displayOrder}</td>
                      <td className="px-4 py-3 text-right"><div className="flex justify-end gap-2"><Link href={`/admin/products/${product.id}`} aria-label={`Xem ${product.title}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:border-sky-300/30 hover:text-sky-200"><Eye className="h-4 w-4" /></Link><Link href={`/admin/products/${product.id}/edit`} aria-label={`Chỉnh sửa ${product.title}`} className="inline-grid h-9 w-9 place-items-center rounded-lg border border-sky-300/20 bg-sky-500/10 text-sky-200 transition hover:border-sky-300/40"><Pencil className="h-4 w-4" /></Link></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 space-y-3 md:hidden">
            {result.products.map((product) => (
              <article key={product.id} className="rounded-lg border border-white/[0.08] bg-[#0B1728] p-4">
                <div className="flex gap-3"><ProductCover image={product.coverImage} title={product.title} className="h-28 w-[63px]" /><div className="min-w-0 flex-1"><p className="text-xs font-bold text-sky-300">{getProductTypeLabel(product.productType)}</p><h2 className="mt-1 line-clamp-2 text-sm font-extrabold text-white">{product.title}</h2><p className="mt-1 truncate text-xs text-slate-500">/{product.slug}</p><p className="mt-3 text-sm font-black text-white">{formatAdminPrice(product.price, product.currency)}</p></div></div>
                <div className="mt-4 flex flex-wrap gap-2"><PublicationChip value={product.publicationStatus} /><SalesChip value={product.salesStatus} /><AccessChip value={product.accessType} /><HomepageStatus isFeatured={product.isFeatured} /></div>
                <p className="mt-3 text-xs font-semibold text-sky-300">Danh mục chi tiết: {product.category?.name ?? "Chưa chọn"} · Nhóm hiển thị: {getProductCatalogDestination(product.productType).label}</p>
                <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3"><span className="text-xs text-slate-500">Ưu tiên trang chủ: {product.displayOrder}</span><div className="flex gap-2"><Link href={`/admin/products/${product.id}`} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-bold text-slate-300">Xem</Link><Link href={`/admin/products/${product.id}/edit`} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-sky-300/20 bg-sky-500/10 px-3 text-xs font-bold text-sky-200">Chỉnh sửa<Pencil className="h-3.5 w-3.5" /></Link></div></div>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
            <p>Hiển thị {firstItem}–{lastItem} trong {result.total} sản phẩm</p>
            {result.totalPages > 1 ? <nav aria-label="Phân trang sản phẩm" className="flex items-center gap-2"><Link href={buildProductsHref(filters, Math.max(1, result.page - 1))} aria-disabled={result.page <= 1} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 font-bold ${result.page <= 1 ? "pointer-events-none border-white/5 text-slate-700" : "border-white/10 text-slate-300 hover:text-white"}`}><ArrowLeft className="h-4 w-4" />Trước</Link><span className="px-2 font-bold text-slate-300">{result.page}/{result.totalPages}</span><Link href={buildProductsHref(filters, Math.min(result.totalPages, result.page + 1))} aria-disabled={result.page >= result.totalPages} className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 font-bold ${result.page >= result.totalPages ? "pointer-events-none border-white/5 text-slate-700" : "border-white/10 text-slate-300 hover:text-white"}`}>Sau<ArrowRight className="h-4 w-4" /></Link></nav> : null}
          </div>
        </>
      )}
    </div>
  );
}
