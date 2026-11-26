-- credits_cost was introduced manually with the AI quota feature but was
-- absent from the original ai_messages migration. Add it before later history.
ALTER TABLE "ai_messages"
  ADD COLUMN "credits_cost" INTEGER NOT NULL DEFAULT 1;
