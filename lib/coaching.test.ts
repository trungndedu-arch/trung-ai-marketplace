import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { coachingLanding, getCoachingContactLinks } from "./coaching.ts";

test("enables coaching contact entry points without navigating to the future landing page", () => {
  assert.equal(coachingLanding.enabled, true);
  assert.equal(coachingLanding.href, "/coaching-ai-1-1");
});

test("only offers configured Facebook and Zalo channels", () => {
  const links = getCoachingContactLinks({
    facebook: { enabled: true, url: "https://facebook.com/trungai", label: "Facebook" },
    zalo: { enabled: false, url: "https://zalo.me/trungai", label: "Nhắn Zalo" },
    youtube: { enabled: true, url: "https://youtube.com/@trungai", label: "YouTube" },
    supportCta: "",
    floatingZaloEnabled: false,
  });

  assert.deepEqual(links, [{ key: "facebook", enabled: true, url: "https://facebook.com/trungai", label: "Facebook" }]);
});

test("returns no coaching actions when neither contact channel is public", () => {
  const links = getCoachingContactLinks({
    facebook: { enabled: false, url: "", label: "Facebook" },
    zalo: { enabled: true, url: "https://example.com/not-zalo", label: "Nhắn Zalo" },
    youtube: { enabled: false, url: "", label: "YouTube" },
    supportCta: "",
    floatingZaloEnabled: false,
  });

  assert.deepEqual(links, []);
});
