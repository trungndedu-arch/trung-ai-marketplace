import { workflows, type Workflow } from "@/data/workflows";

export type { Workflow } from "@/data/workflows";

function sortWorkflows(items: Workflow[]) {
  return [...items].sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name, "vi"));
}

export function getActiveWorkflows() {
  return sortWorkflows(workflows.filter((workflow) => workflow.isActive));
}

export function getFeaturedWorkflows() {
  return getActiveWorkflows().filter((workflow) => workflow.isFeatured);
}

export function getWorkflowBySlug(slug: string) {
  return getActiveWorkflows().find((workflow) => workflow.slug === slug);
}

export function getRelatedWorkflows(workflow: Workflow, limit = 4) {
  return getActiveWorkflows()
    .filter((item) => item.id !== workflow.id && item.category === workflow.category)
    .slice(0, limit);
}
