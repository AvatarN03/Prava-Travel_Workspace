-- Prevent a user-owned expense or link row from being attached to another
-- user's trip through direct Supabase/PostgREST access.
BEGIN;

ALTER TABLE "expenses" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Expenses select policy" ON "expenses";
DROP POLICY IF EXISTS "Expenses insert policy" ON "expenses";
DROP POLICY IF EXISTS "Expenses update policy" ON "expenses";
DROP POLICY IF EXISTS "Expenses delete policy" ON "expenses";

CREATE POLICY "Expenses select policy" ON "expenses" FOR SELECT
USING (
  auth.uid() = profile_id
  AND (
    expenses.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

CREATE POLICY "Expenses insert policy" ON "expenses" FOR INSERT
WITH CHECK (
  auth.uid() = profile_id
  AND (
    expenses.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

CREATE POLICY "Expenses update policy" ON "expenses" FOR UPDATE
USING (
  auth.uid() = profile_id
  AND (
    expenses.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()
    )
  )
)
WITH CHECK (
  auth.uid() = profile_id
  AND (
    expenses.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

CREATE POLICY "Expenses delete policy" ON "expenses" FOR DELETE
USING (
  auth.uid() = profile_id
  AND (
    expenses.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = expenses.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

ALTER TABLE "links" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Links select policy" ON "links";
DROP POLICY IF EXISTS "Links insert policy" ON "links";
DROP POLICY IF EXISTS "Links update policy" ON "links";
DROP POLICY IF EXISTS "Links delete policy" ON "links";

CREATE POLICY "Links select policy" ON "links" FOR SELECT
USING (
  auth.uid() = profile_id
  AND (
    links.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

CREATE POLICY "Links insert policy" ON "links" FOR INSERT
WITH CHECK (
  auth.uid() = profile_id
  AND (
    links.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

CREATE POLICY "Links update policy" ON "links" FOR UPDATE
USING (
  auth.uid() = profile_id
  AND (
    links.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()
    )
  )
)
WITH CHECK (
  auth.uid() = profile_id
  AND (
    links.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

CREATE POLICY "Links delete policy" ON "links" FOR DELETE
USING (
  auth.uid() = profile_id
  AND (
    links.trip_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = links.trip_id AND trips.profile_id = auth.uid()
    )
  )
);

COMMIT;
