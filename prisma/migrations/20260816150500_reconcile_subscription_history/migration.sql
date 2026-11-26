-- The subscriptions table was introduced manually before its Prisma migration
-- was recorded. Keep that deployed schema while making fresh replays complete.
CREATE TABLE "subscriptions" (
  "id" UUID NOT NULL,
  "user_id" UUID NOT NULL,
  "polar_subscription_id" TEXT NOT NULL,
  "polar_customer_id" TEXT NOT NULL,
  "polar_product_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "current_period_start" TIMESTAMP(3),
  "current_period_end" TIMESTAMP(3),
  "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "subscriptions_polar_subscription_id_key"
  ON "subscriptions"("polar_subscription_id");

CREATE INDEX "subscriptions_user_id_idx" ON "subscriptions"("user_id");
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
