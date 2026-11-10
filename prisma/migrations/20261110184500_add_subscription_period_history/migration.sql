-- Preserve each billing interval emitted by Polar so historical usage can show
-- the actual tier that applied to that interval.
CREATE TABLE IF NOT EXISTS "subscription_periods" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "subscription_id" UUID NOT NULL,
  "period_start" TIMESTAMPTZ NOT NULL,
  "period_end" TIMESTAMPTZ,
  "status" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "subscription_periods_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "subscription_periods_subscription_id_fkey"
    FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "subscription_periods_subscription_id_period_start_key"
  ON "subscription_periods"("subscription_id", "period_start");

CREATE INDEX IF NOT EXISTS "subscription_periods_subscription_id_period_start_idx"
  ON "subscription_periods"("subscription_id", "period_start");
