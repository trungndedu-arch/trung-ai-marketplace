import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's built-in TypeScript runner requires the explicit extension.
import { moveHomepagePosition, normalizeHomepagePositions, parseHomepagePosition, type HomepagePositionProduct } from "./homepage-product-position.ts";

function product(id: string, type: HomepagePositionProduct["productType"], position: number | null, featured = true, publicationStatus: HomepagePositionProduct["publicationStatus"] = "published"): HomepagePositionProduct {
  return { id, productType: type, displayOrder: position ?? 0, isFeatured: featured, publicationStatus, createdAt: `2026-01-01T00:00:0${id.charCodeAt(0) - 65}.000Z` };
}

function positions(items: ReturnType<typeof normalizeHomepagePositions> | ReturnType<typeof moveHomepagePosition>) {
  return items.map((item) => `${item.section}:${item.id}:${item.position}`);
}

test("moves a homepage product from position 4 to 2 and shifts the middle products", () => {
  const items = [product("A", "ai_app", 1), product("B", "ai_app", 2), product("C", "ai_app", 3), product("D", "ai_app", 4)];
  assert.deepEqual(positions(moveHomepagePosition(items, "D", 2)), ["chatbot_ai_app:A:1", "chatbot_ai_app:D:2", "chatbot_ai_app:B:3", "chatbot_ai_app:C:4"]);
});

test("moves a homepage product from position 2 to 4 and advances the middle products", () => {
  const items = [product("A", "ai_app", 1), product("B", "ai_app", 2), product("C", "ai_app", 3), product("D", "ai_app", 4)];
  assert.deepEqual(positions(moveHomepagePosition(items, "B", 4)), ["chatbot_ai_app:A:1", "chatbot_ai_app:C:2", "chatbot_ai_app:D:3", "chatbot_ai_app:B:4"]);
});

test("normalizes duplicate and non-contiguous legacy positions with a stable tie-break", () => {
  const items = [product("C", "ai_app", 8), product("B", "chatbot", 2), product("A", "ai_app", 2), product("D", "ai_tool", 99)];
  assert.deepEqual(positions(normalizeHomepagePositions(items)), ["chatbot_ai_app:A:1", "chatbot_ai_app:B:2", "chatbot_ai_app:C:3", "ai_tool:D:1"]);
});

test("does not allocate positions to drafts or products not selected for the homepage", () => {
  const items = [product("A", "ai_app", 1), product("B", "ai_app", 2, false), product("C", "ai_app", 3, true, "draft"), product("D", "ai_app", 4)];
  assert.deepEqual(positions(normalizeHomepagePositions(items)), ["chatbot_ai_app:A:1", "chatbot_ai_app:D:2"]);
});

test("clamps a requested position beyond the section length to the end", () => {
  const items = [product("A", "course", 1), product("B", "course", 2), product("C", "course", 3)];
  assert.deepEqual(positions(moveHomepagePosition(items, "A", 99)), ["course:B:1", "course:C:2", "course:A:3"]);
});

test("rejects zero, negative, decimal, and non-numeric homepage positions", () => {
  ["0", "-1", "1.5", "abc"].forEach((value) => assert.ok(parseHomepagePosition(value).error));
  assert.deepEqual(parseHomepagePosition("4"), { value: 4, error: "" });
});
