import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { contactLinkIsVisible, isValidContactUrl, parseHomepageContactLinks } from "./homepage-contact-links.ts";

test("only approved http(s) platform URLs are accepted", () => {
  assert.equal(isValidContactUrl("facebook", "https://www.facebook.com/trungai"), true);
  assert.equal(isValidContactUrl("zalo", "https://zalo.me/example"), true);
  assert.equal(isValidContactUrl("youtube", "https://youtu.be/example"), true);
  assert.equal(isValidContactUrl("facebook", "javascript:alert(1)"), false);
  assert.equal(isValidContactUrl("zalo", "https://evil.example/zalo.me"), false);
});
test("missing settings keep all public contact CTAs hidden", () => {
  const settings = parseHomepageContactLinks([]);
  assert.equal(contactLinkIsVisible(settings.facebook, "facebook"), false);
  assert.equal(contactLinkIsVisible(settings.zalo, "zalo"), false);
  assert.equal(contactLinkIsVisible(settings.youtube, "youtube"), false);
});
