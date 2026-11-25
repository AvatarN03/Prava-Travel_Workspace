type DeletionStage = "storage" | "workspace" | "auth";

type DeletionResult =
  | { success: true }
  | { success: false; stage: DeletionStage };

/** Run in order so that an authenticated user can retry an incomplete deletion. */
export async function deleteAccountData(steps: {
  storage: () => Promise<void>;
  workspace: () => Promise<void>;
  auth: () => Promise<void>;
}): Promise<DeletionResult> {
  for (const stage of ["storage", "workspace", "auth"] as const) {
    try {
      await steps[stage]();
    } catch (error) {
      console.error(`Account deletion failed at ${stage}:`, error);
      return { success: false, stage };
    }
  }
  return { success: true };
}
