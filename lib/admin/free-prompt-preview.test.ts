import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { canPreviewFreePrompt, freePromptPreviewRobots } from "./free-prompt-preview.ts";

test("draft and published prompts can be previewed but soft-deleted prompts cannot", () => {
  assert.equal(canPreviewFreePrompt({ status: "draft", deleted_at: null }), true);
  assert.equal(canPreviewFreePrompt({ status: "published", deleted_at: null }), true);
  assert.equal(canPreviewFreePrompt({ status: "hidden", deleted_at: "2026-11-03" }), false);
});

test("preview metadata is noindex", () => {
  assert.equal(freePromptPreviewRobots?.index, false);
  assert.equal(freePromptPreviewRobots?.follow, false);
  assert.equal(freePromptPreviewRobots?.googleBot?.index, false);
});
