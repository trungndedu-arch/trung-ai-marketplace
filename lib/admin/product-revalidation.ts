import { revalidatePath } from "next/cache";
import type { ProductType } from "@/lib/catalog/types";

type PublicProductRoute = {
  productType: ProductType;
  slug: string;
  detailUrl: string | null;
};

function addInternalPath(paths: Set<string>, path: string | null) {
  if (path?.startsWith("/") && !path.startsWith("//")) paths.add(path);
}

export function revalidateAdminProductRoutes(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath(`/admin/products/${id}/edit`);
}

export function revalidatePublicProductRoutes(...products: PublicProductRoute[]) {
  const paths = new Set<string>(["/"]);

  products.forEach(({ productType, slug, detailUrl }) => {
    addInternalPath(paths, detailUrl);

    if (productType === "chatbot" || productType === "ai_app") {
      paths.add("/workflow");
      paths.add(`/workflow/${slug}`);
      paths.add(`/workflow/chatbot/${slug}`);
    } else if (productType === "ai_tool") {
      paths.add("/cong-cu-ai");
      paths.add(`/cong-cu-ai/${slug}`);
    } else {
      paths.add("/video-ai-course");
    }
  });

  paths.forEach((path) => revalidatePath(path));
}
