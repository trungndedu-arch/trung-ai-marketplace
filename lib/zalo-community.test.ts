import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires an explicit extension.
import { zaloCommunity } from "./zalo-community.ts";

test("uses the supplied HTTPS Zalo community invitation without rewriting it", () => {
  const parsed = new URL(zaloCommunity.url);

  assert.equal(zaloCommunity.url, "https://zalo.me/g/u5owdtukfy0tpuc7odi2");
  assert.equal(parsed.protocol, "https:");
  assert.equal(parsed.hostname, "zalo.me");
  assert.equal(parsed.pathname, "/g/u5owdtukfy0tpuc7odi2");
});
