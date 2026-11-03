export type FreePromptListItem = {
  title: string;
  slug: string;
  model: string;
  category: string;
  status: "draft" | "published" | "hidden";
  deleted_at: string | null;
};

export type FreePromptListFilters = {
  query?: string;
  model?: string;
  category?: string;
  status?: FreePromptListItem["status"];
};

export function filterFreePrompts<T extends FreePromptListItem>(items: T[], filters: FreePromptListFilters) {
  const query = filters.query?.trim().toLocaleLowerCase("vi") ?? "";
  return items.filter((item) => {
    if (query && !`${item.title} ${item.slug}`.toLocaleLowerCase("vi").includes(query)) return false;
    if (filters.model && item.model !== filters.model) return false;
    if (filters.category && item.category !== filters.category) return false;
    return !filters.status || item.status === filters.status;
  });
}
