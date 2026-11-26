-- Keep quota accounting after a user clears a conversation or deletes a trip.
-- The only foreign key is to profiles, so full account deletion still erases the
-- ledger while workspace deletion cannot restore spent credits.
CREATE TABLE "ai_credit_usage" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "profile_id" UUID NOT NULL,
  "trip_id" UUID,
  "message_id" UUID,
  "credits_cost" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ai_credit_usage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ai_credit_usage_profile_id_fkey"
    FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "ai_credit_usage_message_id_key"
  ON "ai_credit_usage"("message_id");

CREATE INDEX "ai_credit_usage_profile_id_created_at_idx"
  ON "ai_credit_usage"("profile_id", "created_at");

CREATE INDEX "ai_credit_usage_profile_id_trip_id_created_at_idx"
  ON "ai_credit_usage"("profile_id", "trip_id", "created_at");

-- Preserve all existing charged messages before new requests begin using the
-- ledger. This is safe to rerun because message_id is unique.
INSERT INTO "ai_credit_usage" (
  "profile_id", "trip_id", "message_id", "credits_cost", "created_at"
)
SELECT
  conversations."profile_id",
  conversations."trip_id",
  messages."id",
  messages."credits_cost",
  messages."created_at"
FROM "ai_messages" AS messages
INNER JOIN "ai_conversations" AS conversations
  ON conversations."id" = messages."conversation_id"
WHERE messages."role" = 'user'
  AND messages."credits_cost" > 0
ON CONFLICT ("message_id") DO NOTHING;
