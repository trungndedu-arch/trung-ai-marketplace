import { aiTools, type AiTool } from "@/data/ai-tools";

export type { AiTool } from "@/data/ai-tools";

function sortTools(tools: AiTool[]) {
  return [...tools].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "vi"));
}

export function getActiveAiTools() {
  return sortTools(aiTools.filter((tool) => tool.isActive));
}

export function getFeaturedAiTools() {
  return getActiveAiTools().filter((tool) => tool.isFeatured);
}

export function getAiToolBySlug(slug: string) {
  return getActiveAiTools().find((tool) => tool.slug === slug);
}

export function getRelatedAiTools(tool: AiTool, limit = 4) {
  return getActiveAiTools().filter((item) => item.id !== tool.id && item.category === tool.category).slice(0, limit);
}
