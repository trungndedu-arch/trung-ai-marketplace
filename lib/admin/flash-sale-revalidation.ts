import { revalidatePath } from "next/cache";
import { revalidatePublicProductRoutes } from "@/lib/admin/product-revalidation";
import type { ProductType } from "@/lib/catalog/types";

type RevalidationProduct = {
  productType: ProductType;
  slug: string;
  detailUrl: string | null;
};

export function revalidateFlashSaleRoutes(id: string, product: RevalidationProduct) {
  revalidatePath("/admin");
  revalidatePath("/admin/flash-sales");
  revalidatePath("/admin/flash-sales/new");
  revalidatePath(`/admin/flash-sales/${id}/edit`);
  revalidatePublicProductRoutes(product);
}
