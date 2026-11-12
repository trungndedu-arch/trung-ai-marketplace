import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { getAppCatalogTab, getAppMediaTypes } from "./app-media-type.ts";

test("classifies products with explicit video language as Tạo Video AI", () => {
  assert.deepEqual(getAppMediaTypes({
    title: "Tool Review Chăn Ga – Tạo Video Quảng Cáo Bằng AI",
    shortDescription: "Biến ảnh chăn ga thành video review quảng cáo.",
    category: "AI App",
  }), ["video"]);
});

test("classifies products with explicit image language as Tạo Ảnh AI", () => {
  assert.deepEqual(getAppMediaTypes({
    title: "Photo App - Thay Đồ Hàng Loạt Cho Mẫu",
    shortDescription: "Tạo ảnh thời trang từ ảnh có sẵn.",
    category: "Thời Trang AI",
    tags: ["Lookbook"],
  }), ["image"]);
});

test("leaves products without a clear media signal in Tất Cả only", () => {
  assert.deepEqual(getAppMediaTypes({
    title: "Trợ lý nội dung AI",
    shortDescription: "Hỗ trợ trả lời câu hỏi cho người bán hàng.",
    category: "AI App",
  }), []);
});

test("does not treat a video-script assistant as a video-generation app", () => {
  assert.deepEqual(getAppMediaTypes({
    title: "Content App – AI Tự Động Viết Kịch Bản Video Bán Hàng",
    shortDescription: "Tự động tạo kịch bản video review và bán hàng.",
    category: "AI App",
  }), []);
});

test("includes an app that explicitly creates both images and videos in both tabs", () => {
  assert.deepEqual(getAppMediaTypes({
    title: "App quảng cáo sản phẩm",
    shortDescription: "Tạo hình ảnh từng cảnh rồi tạo video quảng cáo hoàn chỉnh.",
    category: "AI App",
  }), ["image", "video"]);
});

test("accepts new image/video tab queries and safely falls back for legacy queries", () => {
  assert.equal(getAppCatalogTab("image"), "image");
  assert.equal(getAppCatalogTab("video"), "video");
  assert.equal(getAppCatalogTab("ai-app"), "all");
  assert.equal(getAppCatalogTab("chatbot"), "all");
  assert.equal(getAppCatalogTab(undefined), "all");
});
