export type AppMediaType = "image" | "video";
export type AppCatalogTab = "all" | AppMediaType;

export type AppMediaClassificationInput = {
  title: string;
  shortDescription: string;
  category: string;
  tags?: string[];
};

const videoGenerationTerms = ["tao video", "lam video", "render video", "video tu anh"];
const imageGenerationTerms = ["tao anh", "tao hinh anh", "photo app", "thay do trang phuc", "lam net anh", "khoi phuc anh"];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");
}

/**
 * Classifies only clearly described media apps. The catalog schema has no media
 * type column, so products without an explicit image/video signal stay in All.
 */
export function getAppMediaTypes(input: AppMediaClassificationInput): AppMediaType[] {
  const text = normalize([input.title, input.shortDescription, input.category, ...(input.tags ?? [])].join(" "));
  const types: AppMediaType[] = [];

  if (imageGenerationTerms.some((term) => text.includes(term))) types.push("image");
  if (videoGenerationTerms.some((term) => text.includes(term))) types.push("video");

  return types;
}

export function getAppCatalogTab(value: string | null | undefined): AppCatalogTab {
  return value === "image" || value === "video" ? value : "all";
}
