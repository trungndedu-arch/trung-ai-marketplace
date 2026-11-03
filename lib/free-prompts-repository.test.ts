import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { orderedPrompts } from "./free-prompts.ts";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { mergeLegacyFreePrompts } from "./free-prompts-repository.ts";
test("legacy catalog preserves every unique prompt slug", () => { assert.equal(orderedPrompts.length,25); assert.equal(new Set(orderedPrompts.map((item)=>item.slug)).size,25); });
test("a database override suppresses the matching legacy Prompt without duplicate cards", () => {
  const legacy = orderedPrompts[0];
  const managed = { ...legacy, id: 1, databaseId: "managed-id", status: "published" as const };
  const visible = mergeLegacyFreePrompts([managed], [legacy.slug]);
  assert.equal(visible.filter((item) => item.slug === legacy.slug).length, 1);
  assert.equal((visible.find((item) => item.slug === legacy.slug) as { databaseId?: string } | undefined)?.databaseId, "managed-id");
});
test("draft, hidden and soft-deleted override slugs remain absent from public legacy fallback", () => {
  const suppressedSlug = orderedPrompts[0].slug;
  const visible = mergeLegacyFreePrompts([], [suppressedSlug]);
  assert.equal(visible.some((item) => item.slug === suppressedSlug), false);
  assert.equal(visible.length, 24);
});
