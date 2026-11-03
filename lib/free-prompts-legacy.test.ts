import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { legacyFreePromptImportRows, legacyFreePromptSlugs } from "./free-prompts-legacy.ts";

test("legacy import plan preserves all 25 unique slugs and prompt content", () => {
  assert.equal(legacyFreePromptImportRows.length, 25);
  assert.equal(new Set(legacyFreePromptSlugs).size, 25);
  assert.ok(legacyFreePromptImportRows.every((row, index) => row.display_order === index + 1 && row.prompt_content.length > 0));
  assert.ok(legacyFreePromptImportRows.every((row) => row.presentation_metadata.legacy_id > 0));
});
