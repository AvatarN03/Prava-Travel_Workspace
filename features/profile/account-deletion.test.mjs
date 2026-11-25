import assert from "node:assert/strict";
import test from "node:test";

import { deleteAccountData } from "./account-deletion.ts";

test("deletes storage and workspace before removing authentication", async () => {
  const calls = [];
  const result = await deleteAccountData({
    storage: async () => { calls.push("storage"); },
    workspace: async () => { calls.push("workspace"); },
    auth: async () => { calls.push("auth"); },
  });

  assert.deepEqual(calls, ["storage", "workspace", "auth"]);
  assert.deepEqual(result, { success: true });
});

for (const failingStage of ["storage", "workspace", "auth"]) {
  test(`reports failure at ${failingStage} and stops subsequent deletion`, async () => {
    const calls = [];
    const steps = Object.fromEntries(
      ["storage", "workspace", "auth"].map((stage) => [stage, async () => {
        calls.push(stage);
        if (stage === failingStage) throw new Error("simulated failure");
      }])
    );

    const originalError = console.error;
    console.error = () => {};
    try {
      const result = await deleteAccountData(steps);
      assert.deepEqual(result, { success: false, stage: failingStage });
      assert.deepEqual(calls, ["storage", "workspace", "auth"].slice(0, calls.length));
      assert.equal(calls.at(-1), failingStage);
    } finally {
      console.error = originalError;
    }
  });
}
