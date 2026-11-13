import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { FREE_AI_LEARNING_MAX_VIDEOS, isFreeAiLearningSchemaMissing, isValidYouTubeChannelUrl, normalizePublicFreeAiLearningVideos, parseFreeAiLearningSettings } from "./free-ai-learning-core.ts";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { parseYouTubeVideoUrl } from "./youtube.ts";

const videoId = "dQw4w9WgXcQ";

test("accepts supported YouTube watch, short, live and youtu.be URLs", () => {
  assert.equal(parseYouTubeVideoUrl(`https://www.youtube.com/watch?v=${videoId}`), videoId);
  assert.equal(parseYouTubeVideoUrl(`https://youtu.be/${videoId}`), videoId);
  assert.equal(parseYouTubeVideoUrl(`https://youtube.com/shorts/${videoId}`), videoId);
  assert.equal(parseYouTubeVideoUrl(`https://www.youtube.com/live/${videoId}`), videoId);
});

test("rejects spoofed, unsafe and malformed YouTube URLs", () => {
  assert.equal(parseYouTubeVideoUrl(`https://youtube.com.example.com/watch?v=${videoId}`), null);
  assert.equal(parseYouTubeVideoUrl(`javascript:alert(1)`), null);
  assert.equal(parseYouTubeVideoUrl(`https://www.youtube.com/watch?v=too-short`), null);
});

test("validates YouTube channel URLs without accepting lookalike hosts", () => {
  assert.equal(isValidYouTubeChannelUrl("https://www.youtube.com/@trungaimedia"), true);
  assert.equal(isValidYouTubeChannelUrl("https://youtube.com/channel/UC123"), true);
  assert.equal(isValidYouTubeChannelUrl(`https://www.youtube.com/watch?v=${videoId}`), false);
  assert.equal(isValidYouTubeChannelUrl(`https://youtube.com/shorts/${videoId}`), false);
  assert.equal(isValidYouTubeChannelUrl("https://youtube.com.example.com/@fake"), false);
  assert.equal(isValidYouTubeChannelUrl("javascript:alert(1)"), false);
});

test("public video normalization removes duplicates and caps the homepage at six", () => {
  const rows = Array.from({ length: 8 }, (_, index) => ({
    id: String(index),
    youtube_video_id: index === 7 ? "dQw4w9WgXcQ" : `${String(index).padStart(11, "0")}`,
    video_url: "",
    title: `Video ${index}`,
    display_order: index,
  }));
  rows[6].youtube_video_id = "dQw4w9WgXcQ";
  const videos = normalizePublicFreeAiLearningVideos(rows);
  assert.equal(videos.length, FREE_AI_LEARNING_MAX_VIDEOS);
  assert.equal(new Set(videos.map((video) => video.videoId)).size, videos.length);
});

test("public video normalization preserves empty and single-video states", () => {
  assert.deepEqual(normalizePublicFreeAiLearningVideos([]), []);
  const videos = normalizePublicFreeAiLearningVideos([{
    id: "one",
    youtube_video_id: videoId,
    video_url: "https://youtu.be/dQw4w9WgXcQ",
    title: "  Một video hướng dẫn  ",
    display_order: 1,
  }]);
  assert.equal(videos.length, 1);
  assert.equal(videos[0].title, "Một video hướng dẫn");
  assert.equal(videos[0].videoUrl, `https://www.youtube.com/watch?v=${videoId}`);
});

test("section and channel button require explicit valid settings", () => {
  const settings = parseFreeAiLearningSettings([
    { key: "free_ai_learning.section_enabled", value: true },
    { key: "free_ai_learning.youtube_channel_url", value: "https://www.youtube.com/@trungaimedia" },
    { key: "free_ai_learning.channel_button_enabled", value: true },
  ]);
  assert.equal(settings.sectionEnabled, true);
  assert.equal(settings.channelButtonEnabled, true);
  assert.equal(parseFreeAiLearningSettings([]).sectionEnabled, false);
});

test("recognizes only expected missing-schema failures for compatibility fallback", () => {
  assert.equal(isFreeAiLearningSchemaMissing({ code: "42P01", message: "relation does not exist" }), true);
  assert.equal(isFreeAiLearningSchemaMissing({ code: "PGRST205", message: "schema cache" }), true);
  assert.equal(isFreeAiLearningSchemaMissing({ code: "XX000", message: "database unavailable" }), false);
});
