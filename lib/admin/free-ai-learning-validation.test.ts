import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { freeAiLearningDatabaseErrorMessage, isValidFreeAiLearningUpdatedAtToken, validateFreeAiLearningSettings, validateFreeAiLearningVideo } from "./free-ai-learning-validation.ts";

test("normalizes a supported YouTube URL into a canonical video record", () => {
  const formData = new FormData();
  formData.set("videoUrl", "https://youtu.be/dQw4w9WgXcQ?t=10");
  formData.set("title", "Hướng dẫn AI thực hành");
  formData.set("displayOrder", "2");
  formData.set("isVisible", "on");
  const result = validateFreeAiLearningVideo(formData);
  assert.equal(result.isValid, true);
  assert.equal(result.values.youtube_video_id, "dQw4w9WgXcQ");
  assert.equal(result.values.video_url, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  assert.equal(result.values.is_visible, true);
});

test("rejects invalid video URLs, missing titles and invalid order", () => {
  const formData = new FormData();
  formData.set("videoUrl", "https://example.com/watch?v=dQw4w9WgXcQ");
  formData.set("displayOrder", "-1");
  const result = validateFreeAiLearningVideo(formData);
  assert.equal(result.isValid, false);
  assert.ok(result.fieldErrors.videoUrl);
  assert.ok(result.fieldErrors.title);
  assert.ok(result.fieldErrors.displayOrder);
});

test("channel button cannot be enabled without a valid YouTube channel", () => {
  const formData = new FormData();
  formData.set("sectionEnabled", "on");
  formData.set("channelButtonEnabled", "on");
  const result = validateFreeAiLearningSettings(formData);
  assert.equal(result.isValid, false);
  assert.ok(result.fieldErrors.youtubeChannelUrl);
});

test("returns specific messages for duplicate, permission and missing-schema errors", () => {
  assert.match(freeAiLearningDatabaseErrorMessage({ code: "23505" }, "create"), /đã có/);
  assert.match(freeAiLearningDatabaseErrorMessage({ code: "42501" }, "update"), /Admin/);
  assert.match(freeAiLearningDatabaseErrorMessage({ code: "PGRST205" }, "delete"), /chưa được khởi tạo/);
});

test("accepts a database timestamp concurrency token and rejects malformed tokens", () => {
  assert.equal(isValidFreeAiLearningUpdatedAtToken("2026-11-13T08:00:00.123456+00:00"), true);
  assert.equal(isValidFreeAiLearningUpdatedAtToken(""), false);
  assert.equal(isValidFreeAiLearningUpdatedAtToken("not-a-timestamp"), false);
});
