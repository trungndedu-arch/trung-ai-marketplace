import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { filterFreePrompts } from "./free-prompt-list.ts";

const prompts = [
  { title: "Video quảng cáo", slug: "video-ad", model: "Veo", category: "Video", status: "published" as const, deleted_at: null },
  { title: "Ảnh sản phẩm", slug: "product-image", model: "Gemini", category: "Hình ảnh", status: "draft" as const, deleted_at: null },
  { title: "Bài viết", slug: "blog-post", model: "ChatGPT", category: "Nội dung", status: "hidden" as const, deleted_at: "2026-01-01" },
];

test("filters free prompts by title or slug, model, category and status", () => {
  assert.deepEqual(filterFreePrompts(prompts, { query: "product" }).map((item) => item.slug), ["product-image"]);
  assert.deepEqual(filterFreePrompts(prompts, { model: "Veo", status: "published" }).map((item) => item.slug), ["video-ad"]);
  assert.deepEqual(filterFreePrompts(prompts, { category: "Nội dung", status: "draft" }), []);
});
