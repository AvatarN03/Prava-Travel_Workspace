-- Keep AI credit usage history private to its owning profile while allowing
-- the privileged server-side Prisma role to continue accounting for usage.
ALTER TABLE "ai_credit_usage" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI credit usage owner read policy" ON "ai_credit_usage";

CREATE POLICY "AI credit usage owner read policy"
ON "ai_credit_usage" FOR SELECT
USING (auth.uid() = profile_id);
