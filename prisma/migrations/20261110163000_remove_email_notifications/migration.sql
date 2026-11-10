-- The application has no notification delivery system, so this persisted preference is unused.
ALTER TABLE "profiles" DROP COLUMN IF EXISTS "email_notifications";
