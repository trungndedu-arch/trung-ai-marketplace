import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { validateContactLinks } from "./contact-links-validation.ts";

function form(values: Record<string, string>) { const data = new FormData(); for (const [key, value] of Object.entries(values)) data.set(key, value); return data; }

test("rejects enabled links without approved platform URLs", () => {
  const validation = validateContactLinks(form({ facebookEnabled: "on", facebookUrl: "javascript:alert(1)", facebookLabel: "Facebook" }));
  assert.equal(validation.isValid, false);
  assert.ok(validation.fieldErrors.facebookUrl);
});
test("requires a usable Zalo link before enabling floating contact button", () => {
  const validation = validateContactLinks(form({ floatingZaloEnabled: "on" }));
  assert.equal(validation.isValid, false);
  assert.ok(validation.fieldErrors.floatingZaloEnabled);
});
test("accepts enabled configured platform links", () => {
  const validation = validateContactLinks(form({ facebookEnabled: "on", facebookUrl: "https://facebook.com/trungai", facebookLabel: "Facebook", zaloEnabled: "on", zaloUrl: "https://zalo.me/trungai", zaloLabel: "Nhắn Zalo", floatingZaloEnabled: "on" }));
  assert.equal(validation.isValid, true);
});
