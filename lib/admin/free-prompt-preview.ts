export type PreviewableFreePrompt = {
  status: "draft" | "published" | "hidden";
  deleted_at: string | null;
};

// A deleted Prompt must be restored before it can be previewed, even by an editor.
export function canPreviewFreePrompt(prompt: PreviewableFreePrompt) {
  return prompt.deleted_at === null;
}

export const freePromptPreviewRobots = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
