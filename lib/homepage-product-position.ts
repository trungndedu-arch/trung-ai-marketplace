import type { ProductType, PublicationStatus } from "@/lib/catalog/types";

export type HomepageProductSection = "chatbot_ai_app" | "ai_tool" | "course";

export type HomepagePositionProduct = {
  id: string;
  productType: ProductType;
  publicationStatus: PublicationStatus;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
};

export function parseHomepagePosition(value: string) {
  if (!value) return { value: null, error: "" };
  if (!/^[1-9]\d*$/.test(value)) return { value: null, error: "Vị trí trang chủ phải là số nguyên từ 1 trở lên." };
  const position = Number(value);
  if (!Number.isSafeInteger(position) || position > 999_999) return { value: null, error: "Vị trí trang chủ vượt quá giới hạn cho phép." };
  return { value: position, error: "" };
}

export function getHomepageProductSection(productType: ProductType): HomepageProductSection {
  if (productType === "chatbot" || productType === "ai_app") return "chatbot_ai_app";
  return productType;
}

export function isHomepagePositionEligible(product: Pick<HomepagePositionProduct, "publicationStatus" | "isFeatured">) {
  return product.publicationStatus === "published" && product.isFeatured;
}

function compareStablePosition(left: HomepagePositionProduct, right: HomepagePositionProduct) {
  const leftPosition = left.displayOrder;
  const rightPosition = right.displayOrder;
  return leftPosition - rightPosition
    || left.createdAt.localeCompare(right.createdAt)
    || left.id.localeCompare(right.id);
}

/**
 * Produces the one-based, gap-free position sequence used by a single homepage
 * section. The database RPC applies the same rule in one transaction.
 */
export function normalizeHomepagePositions(products: HomepagePositionProduct[]) {
  const bySection = new Map<HomepageProductSection, HomepagePositionProduct[]>();

  products.filter(isHomepagePositionEligible).forEach((product) => {
    const section = getHomepageProductSection(product.productType);
    bySection.set(section, [...(bySection.get(section) ?? []), product]);
  });

  return Array.from(bySection.entries()).flatMap(([section, sectionProducts]) => (
    [...sectionProducts]
      .sort(compareStablePosition)
      .map((product, index) => ({ id: product.id, section, position: index + 1 }))
  ));
}

export function moveHomepagePosition(products: HomepagePositionProduct[], productId: string, requestedPosition: number) {
  const target = products.find((product) => product.id === productId);
  if (!target || !isHomepagePositionEligible(target) || !Number.isSafeInteger(requestedPosition) || requestedPosition < 1) {
    return normalizeHomepagePositions(products);
  }

  const section = getHomepageProductSection(target.productType);
  const ordered = products
    .filter((product) => product.id !== productId && isHomepagePositionEligible(product) && getHomepageProductSection(product.productType) === section)
    .sort(compareStablePosition);
  const position = Math.min(requestedPosition, ordered.length + 1);
  ordered.splice(position - 1, 0, target);

  const unchanged = normalizeHomepagePositions(products.filter((product) => product.id !== productId && getHomepageProductSection(product.productType) !== section));
  return [
    ...unchanged,
    ...ordered.map((product, index) => ({ id: product.id, section, position: index + 1 })),
  ];
}
