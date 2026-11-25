import assert from "node:assert/strict";
import test from "node:test";

import { isStaleSubscriptionEvent } from "./webhook-order.ts";

test("subscription events respect revision then delivery time", () => {
  assert.equal(isStaleSubscriptionEvent(100, 200, null), false);
  assert.equal(isStaleSubscriptionEvent(99, 300, "100:200"), true);
  assert.equal(isStaleSubscriptionEvent(100, 199, "100:200"), true);
  assert.equal(isStaleSubscriptionEvent(100, 200, "100:200"), true);
  assert.equal(isStaleSubscriptionEvent(100, 201, "100:200"), false);
  assert.equal(isStaleSubscriptionEvent(101, 100, "100:200"), false);
  assert.throws(() => isStaleSubscriptionEvent(101, 100, "invalid:date"));
});
