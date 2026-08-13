import { revalidatePath } from "next/cache";

export function revalidateBannerRoutes(id?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/banners");
  revalidatePath("/admin/banners/new");
  if (id) revalidatePath(`/admin/banners/${id}/edit`);
  revalidatePath("/");
}
